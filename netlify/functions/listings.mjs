import { searchListings, normalizeProperty } from '../../lib/reapi.js';

/**
 * GET /api/listings?city=Fort+Collins&state=CO&minPrice=300000&maxPrice=600000&minBeds=3
 *
 * Returns active MLS listings matching the search criteria.
 * All parameters are optional — omit any you don't need.
 *
 * Query params:
 *   city        - City name (e.g. "Fort Collins")
 *   state       - 2-letter state code (e.g. "CO")
 *   zip         - ZIP code (e.g. "80525")
 *   minPrice    - Minimum list price
 *   maxPrice    - Maximum list price
 *   minBeds     - Minimum bedrooms
 *   minBaths    - Minimum bathrooms
 *   limit       - Number of results (default 20, max 50)
 */
export default async (req) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { searchParams } = new URL(req.url);

    const params = {
      city:     searchParams.get('city') || undefined,
      state:    searchParams.get('state') || undefined,
      zip:      searchParams.get('zip') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      minBeds:  searchParams.get('minBeds')  ? Number(searchParams.get('minBeds'))  : undefined,
      minBaths: searchParams.get('minBaths') ? Number(searchParams.get('minBaths')) : undefined,
      limit:    searchParams.get('limit')    ? Math.min(Number(searchParams.get('limit')), 50) : 20,
    };

    const raw = await searchListings(params);
    const listings = raw.map(normalizeProperty);

    return new Response(
      JSON.stringify({ listings, count: listings.length }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Listings function error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const config = {
  path: '/api/listings',
};
