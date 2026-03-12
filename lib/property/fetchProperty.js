const RAPIDAPI_HOST = 'realtor-search.p.rapidapi.com';

/**
 * Fetches property data from the RapidAPI Realtor Search endpoint.
 * Requires RAPIDAPI_KEY environment variable.
 */
export async function fetchPropertyData(address) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error('RAPIDAPI_KEY environment variable is not set');
  }

  const url = `https://${RAPIDAPI_HOST}/properties/search-address?address=${encodeURIComponent(address)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': RAPIDAPI_HOST,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`RapidAPI request failed (${response.status}): ${text}`);
  }

  return response.json();
}

/**
 * Normalizes raw API data into a consistent property object.
 */
export function normalizeProperty(apiData) {
  if (!apiData) return null;

  // The Realtor Search API may return results in different structures
  const property =
    apiData?.data?.home || apiData?.data || apiData?.home || apiData;

  const location = property?.location || {};
  const description = property?.description || {};
  const estimatedValue =
    property?.estimate?.estimate ||
    property?.price ||
    property?.list_price ||
    null;

  return {
    address: formatAddress(location?.address || property?.address),
    price: estimatedValue,
    beds: description?.beds ?? property?.beds ?? null,
    baths: description?.baths ?? property?.baths ?? null,
    sqft: description?.sqft ?? property?.sqft ?? null,
    lotSize: description?.lot_sqft ?? property?.lot_sqft ?? null,
    yearBuilt: description?.year_built ?? property?.year_built ?? null,
    propertyType: description?.type ?? property?.prop_type ?? null,
    stories: description?.stories ?? property?.stories ?? null,
    garage: description?.garage ?? property?.garage ?? null,
    photo: property?.primary_photo?.href || property?.photo?.href || null,
    lastSoldDate: property?.last_sold_date || null,
    lastSoldPrice: property?.last_sold_price || null,
    taxHistory: property?.tax_history || [],
    raw: property,
  };
}

function formatAddress(addr) {
  if (!addr) return 'Unknown address';
  if (typeof addr === 'string') return addr;
  const parts = [
    addr.line,
    addr.city,
    addr.state_code || addr.state,
    addr.postal_code,
  ].filter(Boolean);
  return parts.join(', ');
}
