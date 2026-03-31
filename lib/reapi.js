/**
 * RealtyAPI.io (Zillow) client
 * Requires REAPI_API_KEY environment variable.
 */

const BASE_URL = 'https://zillow.realtyapi.io';

function getHeaders() {
  const apiKey = process.env.REAPI_API_KEY;
  if (!apiKey) {
    throw new Error('REAPI_API_KEY environment variable is not set');
  }
  return {
    'x-realtyapi-key': apiKey,
  };
}

async function get(path, params = {}) {
  // Remove undefined/null params
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );
  const query = new URLSearchParams(cleaned).toString();
  const url = `${BASE_URL}${path}${query ? '?' + query : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`RealtyAPI ${path} failed (${response.status}): ${text}`);
  }

  return response.json();
}

/**
 * AutoComplete — resolves a partial address into matched properties.
 * Returns suggestions with address metadata and zpid.
 *
 * @param {string} input - Partial address string
 * @returns {Promise<Array>}
 */
export async function autocompleteAddress(input) {
  if (!input || input.trim().length < 3) return [];

  const data = await get('/autocomplete', {
    query: input.trim(),
  });

  return data?.results || [];
}

/**
 * Search listings by location — city, neighborhood, ZIP, or address.
 * Maps to Zillow's full search/filter endpoint.
 *
 * @param {object} params
 * @param {string} params.location - City, ZIP, neighborhood, or address (required)
 * @param {string} [params.listingStatus] - 'For_Sale' | 'For_Rent' | 'Sold' (default: For_Sale)
 * @param {number} [params.minPrice]
 * @param {number} [params.maxPrice]
 * @param {number} [params.minBeds]
 * @param {number} [params.maxBeds]
 * @param {string} [params.homeType] - e.g. 'Houses,Townhomes'
 * @param {string} [params.minSqft]
 * @param {string} [params.maxSqft]
 * @param {number} [params.page] - 1-5 (200 results per page)
 * @returns {Promise<object>} - { results, totalCount, ... }
 */
export async function searchListings(params = {}) {
  const {
    location,
    listingStatus = 'For_Sale',
    minPrice,
    maxPrice,
    minBeds,
    maxBeds,
    homeType,
    minSqft,
    maxSqft,
    page = 1,
  } = params;

  if (!location) throw new Error('searchListings requires a location');

  const queryParams = {
    location,
    listingStatus,
    page,
  };

  if (minPrice || maxPrice) {
    const parts = [];
    if (minPrice) parts.push(`min:${minPrice}`);
    if (maxPrice) parts.push(`max:${maxPrice}`);
    queryParams.listPriceRange = parts.join(', ');
  }

  if (minBeds) queryParams.bed_min = minBeds;
  if (maxBeds) queryParams.bed_max = maxBeds;
  if (homeType) queryParams.homeType = homeType;

  if (minSqft || maxSqft) {
    const parts = [];
    if (minSqft) parts.push(`min:${minSqft}`);
    if (maxSqft) parts.push(`max:${maxSqft}`);
    queryParams.sqft = parts.join(', ');
  }

  return get('/search/byaddress', queryParams);
}

/**
 * Search by Zillow URL — imports a saved Zillow listing.
 * Lets buyers paste a Zillow URL to pull full structured property data.
 *
 * @param {string} zillowUrl - Full Zillow listing URL
 * @returns {Promise<object>}
 */
export async function searchByUrl(zillowUrl) {
  if (!zillowUrl) throw new Error('searchByUrl requires a url');
  return get('/search/byurl', { url: zillowUrl });
}

/**
 * Get full property detail by Zillow property ID (zpid).
 * Returns the rich advanced property detail response including schools,
 * priceHistory, mortgageRates, similar homes, and all House Profile fields.
 *
 * @param {string|number} zpid - Zillow property ID
 * @returns {Promise<object>}
 */
export async function getPropertyByZpid(zpid) {
  if (!zpid) throw new Error('getPropertyByZpid requires a zpid');
  return get('/property', { zpid });
}

/**
 * Get full property detail by address or zpid.
 * The zpid comes from autocomplete results.
 *
 * @param {object} params
 * @param {string} [params.address] - Full address string
 * @param {string|number} [params.zpid] - Zillow property ID (preferred)
 * @returns {Promise<object>}
 */
export async function getPropertyDetail({ address, zpid } = {}) {
  if (!address && !zpid) {
    throw new Error('getPropertyDetail requires either an address or zpid');
  }

  const params = zpid
    ? { location: zpid, listingStatus: 'For_Sale' }
    : { location: address, listingStatus: 'For_Sale' };

  return get('/search/byaddress', params);
}

/**
 * Normalize a RealtyAPI.io property into a consistent shape
 * for use in the House Profile and listing cards.
 *
 * @param {object} raw - Raw property from search results
 * @returns {object}
 */
export function normalizeProperty(raw) {
  if (!raw) return null;

  return {
    id:           raw.zpid || null,
    address:      raw.address || raw.streetAddress || null,
    city:         raw.city || null,
    state:        raw.state || null,
    zip:          raw.zipcode || raw.zip || null,
    lat:          raw.latitude || raw.lat || null,
    lng:          raw.longitude || raw.lng || null,
    listPrice:    raw.price || raw.listPrice || null,
    beds:         raw.bedrooms || raw.beds || null,
    baths:        raw.bathrooms || raw.baths || null,
    sqft:         raw.livingArea || raw.sqft || null,
    lotSize:      raw.lotAreaValue || null,
    yearBuilt:    raw.yearBuilt || null,
    propertyType: raw.homeType || raw.propertyType || null,
    photo:        raw.imgSrc || raw.miniCardPhotos?.[0]?.url || null,
    mlsStatus:    raw.listingStatus || raw.homeStatus || null,
    daysOnMarket: raw.daysOnZillow || null,
    zestimate:    raw.zestimate || null,
    raw,
  };
}
