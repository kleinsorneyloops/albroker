import { searchListings, searchByUrl, getPropertyByZpid, normalizeProperty } from '../../lib/reapi.js';

/**
 * GET /api/listings
 *
 * Three modes:
 *   ?zpid=13595929                          → full property detail by Zillow ID
 *   ?url=https://www.zillow.com/...         → full property detail by Zillow URL
 *   ?location=Fort+Collins+CO&...           → listing search by location
 *
 * Search query params (location mode only):
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
    const zpid     = searchParams.get('zpid');
    const url      = searchParams.get('url');
    const location = searchParams.get('location');

    // --- zpid detail path ---
    if (zpid) {
      const data = await getPropertyByZpid(zpid);
      return new Response(
        JSON.stringify({ property: data }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // --- Zillow URL import path ---
    if (url) {
      const data = await searchByUrl(url);
      return new Response(
        JSON.stringify({ property: data }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // --- Location search path ---
    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Provide location, zpid, or url parameter' }),
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
    const raw = data?.listings || data?.results || data?.searchResults || data?.listResults || [];
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
