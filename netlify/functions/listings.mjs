import { searchListings, searchByUrl, normalizeProperty } from '../../lib/reapi.js';

export default async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const location = searchParams.get('location');

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
