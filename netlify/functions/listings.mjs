import { searchListings, normalizeProperty } from '../../lib/reapi.js';

/**
 * GET /api/listings?location=Fort+Collins+CO&minPrice=300000&maxPrice=600000&minBeds=3
 *
 * Returns listings matching the search criteria.
 *
 * Query params:
 *   location    - City, ZIP, neighborhood, or address (required)
 *   status      - For_Sale | For_Rent | Sold (default: For_Sale)
 *   minPrice    - Minimum list price
 *   maxPrice    - Maximum list price
 *   minBeds     - Minimum bedrooms
 *   maxBeds     - Maximum bedrooms
 *   homeType    - e.g. Houses,Townhomes
 *   page        - Page number 1-5 (200 results per page)
 */
export default async (req) => {
  try {
    const { searchParams } = new URL(req.url);

    const location = searchParams.get('location');
    if (!location) {
      return new Response(
        JSON.stringify({ error: 'location parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const params = {
      location,
      listingStatus: searchParams.get('status') || 'For_Sale',
      minPrice:  searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice:  searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      minBeds:   searchParams.get('minBeds')  ? Number(searchParams.get('minBeds'))  : undefined,
      maxBeds:   searchParams.get('maxBeds')  ? Number(searchParams.get('maxBeds'))  : undefined,
      homeType:  searchParams.get('homeType') || undefined,
      page:      searchParams.get('page')     ? Number(searchParams.get('page'))     : 1,
    };

    const data = await searchListings(params);

    // Response shape from search/byaddress
    const raw = data?.results || data?.searchResults || data?.listResults || [];
    const listings = Array.isArray(raw) ? raw.map(normalizeProperty) : [];

    return new Response(
      JSON.stringify({ listings, count: listings.length, totalCount: data?.totalCount || null }),
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
