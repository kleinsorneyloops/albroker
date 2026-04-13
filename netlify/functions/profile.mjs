import { neon } from '@neondatabase/serverless';

function getDb() {
  return neon(process.env.NETLIFY_DATABASE_URL);
}

export default async (req) => {
  const sql = getDb();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  // ── GET — read both profiles ─────────────────────────────────────────────
  if (req.method === 'GET') {
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Read personal profile and house profile in parallel
      const [personalRows, houseRows] = await Promise.all([
        sql`
          SELECT * FROM personal_profiles
          WHERE user_id = ${userId}
          LIMIT 1
        `,
        sql`
          SELECT
            user_id,
            budget_min,
            budget_max,
            budget_confirmed,
            bedrooms_min,
            locations_explicit,
            must_haves,
            deal_breakers,
            lifestyle,
            inferred_summary,
            profile_completeness,
            updated_at
          FROM house_profiles
          WHERE user_id = ${userId}
          LIMIT 1
        `,
      ]);

      return new Response(
        JSON.stringify({
          profile:       personalRows[0]  || null,
          houseProfile:  houseRows[0]     || null,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (err) {
      console.error('profile GET error:', err);
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // ── POST — save personal profile (existing behaviour, unchanged) ─────────
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { profile, userId: bodyUserId } = body;
      const uid = bodyUserId || userId;

      if (!uid) {
        return new Response(
          JSON.stringify({ error: 'userId required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Ensure user row exists
      await sql`
        INSERT INTO users (id, name, email, email_verified, created_at, updated_at)
        VALUES (
          ${uid},
          ${'Anonymous'},
          ${`anon_${uid}@albroker.local`},
          false,
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO NOTHING
      `;

      const completeness = computeCompleteness(profile || {});

      await sql`
        INSERT INTO personal_profiles (
          user_id,
          quiz_answers,
          life_stage,
          timeline,
          profile_completeness,
          last_updated,
          created_at,
          data
        ) VALUES (
          ${uid},
          ${JSON.stringify(profile || {})},
          ${profile?.journeyStage || null},
          ${profile?.purchaseTimeframe || null},
          ${completeness},
          NOW(),
          NOW(),
          ${JSON.stringify(profile || {})}
        )
        ON CONFLICT (user_id) DO UPDATE SET
          quiz_answers         = EXCLUDED.quiz_answers,
          life_stage           = EXCLUDED.life_stage,
          timeline             = EXCLUDED.timeline,
          profile_completeness = EXCLUDED.profile_completeness,
          last_updated         = NOW(),
          data                 = EXCLUDED.data
      `;

      return new Response(
        JSON.stringify({ success: true, userId: uid, completeness }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (err) {
      console.error('profile POST error:', err);
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // ── PATCH — update house profile fields ──────────────────────────────────
  if (req.method === 'PATCH') {
    try {
      const body = await req.json();
      const { userId: bodyUserId, houseProfile } = body;
      const uid = bodyUserId || userId;

      if (!uid || !houseProfile) {
        return new Response(
          JSON.stringify({ error: 'userId and houseProfile required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      await sql`
        INSERT INTO house_profiles (
          user_id,
          budget_min,
          budget_max,
          budget_confirmed,
          bedrooms_min,
          locations_explicit,
          must_haves,
          deal_breakers,
          lifestyle,
          inferred_summary,
          profile_completeness,
          created_at,
          updated_at
        ) VALUES (
          ${uid},
          ${houseProfile.budget_min        || null},
          ${houseProfile.budget_max        || null},
          ${houseProfile.budget_confirmed  || false},
          ${houseProfile.bedrooms_min      || null},
          ${JSON.stringify(houseProfile.locations_explicit || [])},
          ${JSON.stringify(houseProfile.must_haves         || [])},
          ${JSON.stringify(houseProfile.deal_breakers      || [])},
          ${JSON.stringify(houseProfile.lifestyle          || {})},
          ${JSON.stringify(houseProfile.inferred_summary   || {})},
          ${houseProfile.profile_completeness || 0},
          NOW(),
          NOW()
        )
        ON CONFLICT (user_id) DO UPDATE SET
          budget_min           = COALESCE(EXCLUDED.budget_min,        house_profiles.budget_min),
          budget_max           = COALESCE(EXCLUDED.budget_max,        house_profiles.budget_max),
          budget_confirmed     = COALESCE(EXCLUDED.budget_confirmed,  house_profiles.budget_confirmed),
          bedrooms_min         = COALESCE(EXCLUDED.bedrooms_min,      house_profiles.bedrooms_min),
          locations_explicit   = EXCLUDED.locations_explicit,
          must_haves           = EXCLUDED.must_haves,
          deal_breakers        = EXCLUDED.deal_breakers,
          lifestyle            = EXCLUDED.lifestyle,
          inferred_summary     = EXCLUDED.inferred_summary,
          profile_completeness = EXCLUDED.profile_completeness,
          updated_at           = NOW()
      `;

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (err) {
      console.error('profile PATCH error:', err);
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
};

function computeCompleteness(profile) {
  const fields = [
    'journeyStage', 'buyerType', 'buyingReason', 'purchaseTimeframe',
    'processConfidence', 'topicsUnderstood', 'topicsConfusing', 'monthlyCostUnderstanding',
    'financialFears', 'processFears', 'financialUncertaintyInfluence', 'biggestBlocker',
    'wishKnewBeforeSearch', 'homePriorities', 'decisionInfluence', 'researchMethod',
    'ageRange', 'householdSize', 'householdIncome', 'targetBudgetRange',
    'currentHousingSituation', 'employmentSituation', 'targetMarket',
  ];
  const filled = fields.filter(f => {
    const v = profile[f];
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== null && v !== '';
  });
  return Math.round((filled.length / fields.length) * 100);
}

export const config = {
  path: '/api/profile',
};
