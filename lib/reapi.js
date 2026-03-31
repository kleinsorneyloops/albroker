/**
 * RealtyAPI (realestateapi.com) client
 * Wraps AutoComplete, MLS Search, and Property Detail endpoints.
 * Requires REAPI_API_KEY environment variable.
 */

const BASE_URL = 'https://api.realestateapi.com';

function getHeaders() {
  const apiKey = process.env.REAPI_API_KEY;
  if (!apiKey) {
    throw new Error('REAPI_API_KEY environment variable is not set');
  }
  return {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
  };
}

async function post(path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`RealtyAPI ${path} failed (${response.status}): ${text}`);
  }

  return response.json();
}

/**
 * AutoComplete — resolves a partial address into matched properties.
 * Returns an array of suggestions, each with a unique REAPI property id.
 * Use this as the user types — fire on each keystroke debounced.
 *
 * @param {string} input - Partial address string
 * @returns {Promise<Array>} - Array of address suggestions with property ids
 */
export async function autocompleteAddress(input) {
  if (!input || input.trim().length < 3) return [];

  const data = await post('/v2/AutoComplete', {
    search: input.trim(),
    search_types: ['address'],
  });

  return data?.data || [];
}

/**
 * MLS Search — search active listings by criteria.
 * Returns on-market properties matching the filters.
 *
 * @param {object} params - Search filters
 * @param {string} [params.city]
 * @param {string} [params.state]
 * @param {string} [params.zip]
 * @param {number} [params.minPrice]
 * @param {number} [params.maxPrice]
 * @param {number} [params.minBeds]
 * @param {number} [params.minBaths]
 * @param {number} [params.limit=20]
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
    limit = 20,
  } = params;

  const body = {
    count: limit,
    status: ['Active'],
  };

  if (zip) body.zip = zip;
  if (city) body.city = city;
  if (state) body.state = state;
  if (minPrice) body.list_price_min = minPrice;
  if (maxPrice) body.list_price_max = maxPrice;
  if (minBeds) body.beds_min = minBeds;
  if (minBaths) body.baths_min = minBaths;

  const data = await post('/v2/MlsSearch', body);

  return data?.data || [];
}

/**
 * Property Detail — full details for a specific property.
 * Pass either a RealtyAPI property id (from AutoComplete) or a full address.
 * Returns 200+ fields including beds, baths, sqft, style, school district,
 * comps, tax history, and MLS status if active.
 *
 * @param {object} params
 * @param {string} [params.id] - REAPI property id (preferred)
 * @param {string} [params.address] - Full address string (fallback)
 * @returns {Promise<object>} - Full property detail object
 */
export async function getPropertyDetail({ id, address } = {}) {
  if (!id && !address) {
    throw new Error('getPropertyDetail requires either an id or an address');
  }

  const body = id ? { id } : { address };

  const data = await post('/v2/PropertyDetail', body);

  return data?.data || null;
}

/**
 * Normalize a RealtyAPI property into a consistent shape
 * for use in the House Profile and listing cards.
 *
 * @param {object} raw - Raw property object from any REAPI endpoint
 * @returns {object} - Normalized property
 */
export function normalizeProperty(raw) {
  if (!raw) return null;

  return {
    id:           raw.id || raw.property_id || null,
    address:      raw.address?.delivery_line || raw.address?.full || raw.address || null,
    city:         raw.address?.city || null,
    state:        raw.address?.state || null,
    zip:          raw.address?.zip || raw.address?.postal_code || null,
    listPrice:    raw.list_price || raw.price || null,
    beds:         raw.bedrooms || raw.beds || null,
    baths:        raw.bathrooms || raw.baths_full || raw.baths || null,
    sqft:         raw.building_size?.size || raw.sqft || null,
    lotSize:      raw.lot_size?.size || raw.lot_sqft || null,
    yearBuilt:    raw.year_built || null,
    propertyType: raw.prop_type || raw.property_type || null,
    style:        raw.architectural_style || raw.style || null,
    garage:       raw.garage || null,
    pool:         raw.pool || null,
    stories:      raw.stories || null,
    schoolDistrict:    raw.school_district || null,
    elementarySchool:  raw.elementary_school || null,
    mlsStatus:    raw.mls?.status || raw.status || null,
    daysOnMarket: raw.mls?.days_on_market || raw.days_on_market || null,
    photos:       raw.photos || [],
    photo:        raw.photos?.[0]?.href || raw.primary_photo?.href || null,
    lastSoldDate:  raw.last_sold_date || null,
    lastSoldPrice: raw.last_sold_price || null,
    raw,
  };
}
