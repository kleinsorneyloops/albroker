/**
 * RealtyAPI.io (Zillow) client
 * Wraps AutoComplete, Search by Address, and MLS Search endpoints.
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
  const query = new URLSearchParams(params).toString();
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
 * Returns an array of suggestions with address metadata and zpid.
 *
 * @param {string} input - Partial address string
 * @returns {Promise<Array>} - Array of address suggestions
 */
export async function autocompleteAddress(input) {
  if (!input || input.trim().length < 3) return [];

  const data = await get('/autocomplete', {
    query: input.trim(),
  });

  return data?.results || [];
}

/**
 * Search by address — get full property detail for a specific address.
 *
 * @param {string} address - Full address string
 * @returns {Promise<object>} - Property data
 */
export async function searchByAddress(address) {
  const data = await get('/search/byaddress', { address });
  return data?.results || data || null;
}

/**
 * Search by zpid — get full property detail using a Zillow property ID.
 * The zpid comes from autocomplete results.
 *
 * @param {string|number} zpid - Zillow property ID
 * @returns {Promise<object>} - Property data
 */
export async function searchByZpid(zpid) {
  const data = await get('/search/byaddress', { zpid });
  return data?.results || data || null;
}

/**
 * MLS Search — search active listings by criteria.
 *
 * @param {object} params - Search filters
 * @param {string} [params.city]
 * @param {string} [params.state]
 * @param {string} [params.zip]
 * @param {number} [params.minPrice]
 * @param {number} [params.maxPrice]
 * @param {number} [params.minBeds]
 * @param {number} [params.minBaths]
 * @returns {Promise<Array>} - Array of listing objects
 */
export async function searchListings(params = {}) {
  const {
    city,
    state,
    zip,
    minPrice,
    maxPrice,
    minBeds,
    minBaths,
  } = params;

  const queryParams = {};
  if (zip) queryParams.zip = zip;
  if (city) queryParams.city = city;
  if (state) queryParams.state = state;
  if (minPrice) queryParams.minPrice = minPrice;
  if (maxPrice) queryParams.maxPrice = maxPrice;
  if (minBeds) queryParams.beds_min = minBeds;
  if (minBaths) queryParams.baths_min = minBaths;

  const data = await get('/search/bymls', queryParams);
  return data?.results || data || [];
}

/**
 * Normalize a RealtyAPI.io property into a consistent shape
 * for use in the House Profile and listing cards.
 *
 * @param {object} raw - Raw property object from any endpoint
 * @returns {object} - Normalized property
 */
export function normalizeProperty(raw) {
  if (!raw) return null;

  const meta = raw.metaData || {};

  return {
    id:           raw.zpid || meta.zpid || null,
    address:      raw.display || [meta.streetNumber, meta.streetName].filter(Boolean).join(' ') || null,
    city:         meta.city || null,
    state:        meta.state || null,
    zip:          meta.zipCode || null,
    lat:          meta.lat || null,
    lng:          meta.lng || null,
    listPrice:    raw.list_price || raw.price || null,
    beds:         raw.bedrooms || raw.beds || null,
    baths:        raw.bathrooms || raw.baths || null,
    sqft:         raw.sqft || null,
    yearBuilt:    raw.year_built || null,
    propertyType: raw.prop_type || raw.property_type || null,
    photo:        raw.imgSrc || raw.primary_photo?.href || null,
    mlsStatus:    raw.status || null,
    raw,
  };
}
