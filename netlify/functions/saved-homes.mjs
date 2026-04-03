import { neon } from '@neondatabase/serverless';

function getDb() {
  return neon(process.env.NETLIFY_DATABASE_URL);
}

export default async (req) => {
  const sql = getDb();
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── GET — fetch all saved listings for a user ──────────────────
  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT
          id,
          zpid,
          address,
          city,
          state,
          zip,
          price,
          bedrooms,
          bathrooms,
          sqft,
          home_type,
          year_built,
          img_src,
          listing_status,
          raw_listing,
          appeal_answers,
          source,
          saved_at
        FROM saved_listings
        WHERE user_id = ${userId}
        ORDER BY saved_at DESC
      `;

      // Shape into the format the existing saved/page.jsx expects
      const homes = rows.map((r) => ({
        id: String(r.id),
        property: {
          address: r.address,
          price: r.price,
          beds: r.bedrooms,
          baths: r.bathrooms,
          sqft: r.sqft,
          yearBuilt: r.year_built,
          propertyType: r.home_type,
          photo: r.img_src,
          // Pass through any extra fields from raw_listing for mentor/analysis
          ...(r.raw_listing || {}),
        },
        notes: r.appeal_answers?.notes || '',
        savedAt: r.saved_at,
      }));

      return new Response(JSON.stringify({ homes }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('saved-homes GET error:', err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // ── POST — save a listing ──────────────────────────────────────
  if (req.method === 'POST') {
    try {
      const { property, notes } = await req.json();

      // Check for duplicate by address (same logic as before)
      const existing = await sql`
        SELECT id FROM saved_listings
        WHERE user_id = ${userId}
        AND address = ${property.address || null}
        LIMIT 1
      `;

      if (existing.length > 0) {
        return new Response(
          JSON.stringify({ error: 'This home is already saved' }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Extract structured fields from the property object
      const zpid = property.id || property.zpid || null;
      const price = property.price || property.listPrice || null;
      const bedrooms = property.beds || property.bedrooms || null;
      const bathrooms = property.baths || property.bathrooms || null;
      const sqft = property.sqft || property.livingArea || null;
      const homeType = property.propertyType || property.homeType || null;
      const yearBuilt = property.yearBuilt || null;
      const zestimate = property.zestimate || null;
      const latitude = property.lat || property.latitude || null;
      const longitude = property.lng || property.longitude || null;
      const imgSrc = property.photo || property.imgSrc || null;
      const listingStatus = property.mlsStatus || property.listingStatus || null;
      const daysOnMarket = property.daysOnMarket || null;
      const city = property.city || null;
      const state = property.state || null;
      const zip = property.zip || property.zipcode || null;

      const appealAnswers = notes
        ? { notes, savedAt: new Date().toISOString() }
        : null;

      const inserted = await sql`
        INSERT INTO saved_listings (
          user_id, zpid, address, city, state, zip,
          price, bedrooms, bathrooms, sqft, home_type,
          year_built, zestimate, latitude, longitude,
          img_src, listing_status, days_on_market,
          raw_listing, appeal_answers, source, saved_at
        ) VALUES (
          ${userId},
          ${zpid},
          ${property.address || null},
          ${city}, ${state}, ${zip},
          ${price}, ${bedrooms}, ${bathrooms}, ${sqft}, ${homeType},
          ${yearBuilt}, ${zestimate}, ${latitude}, ${longitude},
          ${imgSrc}, ${listingStatus}, ${daysOnMarket},
          ${JSON.stringify(property)},
          ${appealAnswers ? JSON.stringify(appealAnswers) : null},
          'search',
          NOW()
        )
        RETURNING id, saved_at
      `;

      // Update house_profile price signals after every save
      await updateHouseProfileSignals(sql, userId);

      const saved = {
        id: String(inserted[0].id),
        property,
        notes: notes || '',
        savedAt: inserted[0].saved_at,
      };

      return new Response(JSON.stringify({ saved }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('saved-homes POST error:', err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // ── DELETE — remove a saved listing ───────────────────────────
  if (req.method === 'DELETE') {
    try {
      const { homeId } = await req.json();

      await sql`
        DELETE FROM saved_listings
        WHERE id = ${Number(homeId)}
        AND user_id = ${userId}
      `;

      // Re-aggregate house profile signals after removal
      await updateHouseProfileSignals(sql, userId);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('saved-homes DELETE error:', err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
};

// ── House Profile signal aggregation ──────────────────────────────
// Runs after every save or delete. Aggregates saved_listings into
// the house_profiles table so the House Profile stays current.
async function updateHouseProfileSignals(sql, userId) {
  try {
    const stats = await sql`
      SELECT
        MIN(price)                          AS price_min,
        MAX(price)                          AS price_max,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) AS price_median,
        COUNT(*)                            AS total_saves
      FROM saved_listings
      WHERE user_id = ${userId}
      AND price IS NOT NULL
    `;

    if (!stats.length || !stats[0].total_saves) return;

    const { price_min, price_max, price_median } = stats[0];

    await sql`
      INSERT INTO house_profiles (
        user_id,
        observed_price_min,
        observed_price_max,
        observed_price_median,
        profile_completeness,
        last_updated,
        created_at
      ) VALUES (
        ${userId},
        ${price_min},
        ${price_max},
        ${price_median ? Math.round(price_median) : null},
        10,
        NOW(),
        NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        observed_price_min    = EXCLUDED.observed_price_min,
        observed_price_max    = EXCLUDED.observed_price_max,
        observed_price_median = EXCLUDED.observed_price_median,
        last_updated          = NOW()
    `;
  } catch (err) {
    // Non-fatal — log but don't fail the main request
    console.error('House profile signal update error:', err);
  }
}

export const config = {
  path: '/api/saved-homes',
};
