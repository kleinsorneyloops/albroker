/**
 * RealtyAPI.io (Zillow) client
 * Base URL: https://zillow.realtyapi.io
 * Auth header: x-realtyapi-key
 * Env var: REAPI_API_KEY
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

// ---------------------------------------------------------------------------
// AUTOCOMPLETE
// ---------------------------------------------------------------------------

/**
 * Autocomplete — resolves a partial address or city into suggestions.
 * Use debounced on each keystroke (min 3 chars).
 *
 * @param {string} input - Partial address or city string
 * @returns {Promise<Array>}
 */
export async function autocompleteAddress(input) {
  if (!input || input.trim().length < 3) return [];
  const data = await get('/autocomplete', { query: input.trim() });
  return data?.results || [];
}

// ---------------------------------------------------------------------------
// SEARCH LISTINGS
// ---------------------------------------------------------------------------

/**
 * Search listings by location using search/byaddress.
 * Powers the listings page — both profile-driven and manual search.
 *
 * @param {object} params
 * @param {string}  params.location       - City, ZIP, neighborhood, or address (required)
 * @param {string}  [params.listingStatus] - 'For_Sale' | 'For_Rent' | 'Sold' (default: For_Sale)
 * @param {number}  [params.minPrice]
 * @param {number}  [params.maxPrice]
 * @param {number}  [params.minBeds]
 * @param {number}  [params.maxBeds]
 * @param {string}  [params.homeType]     - e.g. 'Houses,Townhomes,Condos/Co-ops'
 * @param {string}  [params.keywords]     - e.g. 'fireplace, garage'
 * @param {number}  [params.page]         - 1–5 (200 results per page)
 * @returns {Promise<object>}             - Full RealtyAPI response
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
    keywords,
    page = 1,
  } = params;

  if (!location) throw new Error('searchListings requires a location');

  const apiParams = {
    location,
    listingStatus,
    page,
  };

  if (minPrice || maxPrice) {
    apiParams.listPriceRange = [minPrice ? `min:${minPrice}` : '', maxPrice ? `max:${maxPrice}` : '']
      .filter(Boolean).join(', ');
  }
  if (minBeds)  apiParams.bed_min  = minBeds;
  if (maxBeds)  apiParams.bed_max  = maxBeds;
  if (homeType) apiParams.homeType = homeType;
  if (keywords) apiParams.keywords = keywords;

  return get('/search/byaddress', apiParams);
}

// ---------------------------------------------------------------------------
// PROPERTY DETAIL BY ZPID
// ---------------------------------------------------------------------------

/**
 * Get full property detail by Zillow property ID (zpid).
 * More reliable than search/byurl for server-side fetches.
 * Returns resoFacts (fireplace, garage, A/C, etc.) not available in search results.
 *
 * @param {string|number} zpid - Zillow property ID
 * @returns {Promise<object>}
 */
export async function getPropertyByZpid(zpid) {
  if (!zpid) throw new Error('getPropertyByZpid requires a zpid');
  return get('/property', { zpid });
}

// ---------------------------------------------------------------------------
// SEARCH BY URL (Zillow import)
// ---------------------------------------------------------------------------

/**
 * Import a listing from a Zillow URL.
 * Note: This endpoint has known server-side reliability issues on RealtyAPI's end.
 * Prefer getPropertyByZpid if you can extract the zpid from the URL.
 *
 * @param {string} url - Full Zillow listing URL
 * @returns {Promise<object>}
 */
export async function searchByUrl(url) {
  if (!url) throw new Error('searchByUrl requires a url');
  return get('/search/byurl', { url });
}

// ---------------------------------------------------------------------------
// NORMALIZE PROPERTY
// ---------------------------------------------------------------------------

/**
 * Normalize a raw RealtyAPI search result or property detail into a
 * consistent shape for use throughout the app.
 *
 * Handles two input shapes:
 *   - Search result:  { raw: { property: { ... } }, resultType: 'property' }
 *   - Direct zpid:    { zpid, address, ... } (already unwrapped)
 *
 * Field path reference (from actual search/byaddress response, April 2026):
 *   zpid                → p.zpid
 *   address             → p.address.streetAddress
 *   city                → p.address.city
 *   state               → p.address.state
 *   zip                 → p.address.zipcode
 *   lat/lng             → p.location.latitude / longitude
 *   price               → p.price.value
 *   priceChange         → p.price.priceChange (negative = price cut)
 *   priceChangedDate    → p.price.changedDate (unix ms)
 *   beds                → p.bedrooms
 *   baths               → p.bathrooms
 *   sqft                → p.livingArea
 *   lotSize             → p.lotSizeWithUnit.lotSize (sqft)
 *   yearBuilt           → p.yearBuilt
 *   propertyType        → p.propertyType (singleFamily, townhome, condo)
 *   photo               → p.media.propertyPhotoLinks.mediumSizeLink
 *   allPhotos           → p.media.allPropertyPhotos.medium[]
 *   mlsStatus           → p.listing.listingStatus (forSale, forRent, sold)
 *   daysOnMarket        → p.daysOnZillow
 *   zestimate           → p.estimates.zestimate
 *   rentZestimate       → p.estimates.rentZestimate
 *   taxAssessedValue    → p.taxAssessment.taxAssessedValue
 *   hdpUrl              → p.hdpView.hdpUrl  (append to https://www.zillow.com for deep link)
 *   agentName           → p.propertyDisplayRules.agent.agentName
 *   brokerName          → p.propertyDisplayRules.mls.brokerName
 *   insights            → p.listCardRecommendation.flexFieldRecommendations[].displayString
 *                         e.g. ['New air conditioner', 'Price cut: $10,000 (4/7)', '15 days on Zillow']
 *
 * resoFacts (fireplace, garage, A/C, HOA etc.) are only available on
 * zpid detail responses, not search results.
 *   hasFireplace        → p.resoFacts.hasFireplace
 *   hasGarage           → p.resoFacts.hasGarage (or p.resoFacts.parkingFeatures)
 *   hasCooling          → p.resoFacts.hasCooling
 *   hasView             → p.resoFacts.hasView
 *   monthlyHoaFee       → p.resoFacts.hoaFee
 *
 * @param {object} item - Raw item from RealtyAPI response
 * @returns {object}    - Normalized listing object
 */
export function normalizeProperty(item) {
  // Handle both search result shape ({ raw: { property: {...} } })
  // and direct zpid shape (already unwrapped object)
  const p = item?.raw?.property || item;

  // Zillow deep link — hdpUrl is a relative path, prepend the base
  const hdpUrl = p.hdpView?.hdpUrl
    ? `https://www.zillow.com${p.hdpView.hdpUrl}`
    : null;

  // Insights from listCardRecommendation (search results only)
  // e.g. ['New air conditioner', 'Price cut: $10,000 (4/7)']
  const insights = p.listCardRecommendation?.flexFieldRecommendations
    ?.map(f => f.displayString)
    .filter(Boolean) || [];

  // resoFacts — only present on zpid detail responses
  const resoFacts = p.resoFacts || null;

  return {
    // Identity
    id:               p.zpid || null,
    zpid:             p.zpid || null,

    // Location
    address:          p.address?.streetAddress || null,
    city:             p.address?.city || null,
    state:            p.address?.state || null,
    zip:              p.address?.zipcode || null,
    lat:              p.location?.latitude || null,
    lng:              p.location?.longitude || null,

    // Price
    listPrice:        p.price?.value || null,
    priceChange:      p.price?.priceChange || null,       // negative = price cut
    priceChangedDate: p.price?.changedDate || null,       // unix ms
    pricePerSqft:     p.price?.pricePerSquareFoot || null,
    zestimate:        p.estimates?.zestimate || null,
    rentZestimate:    p.estimates?.rentZestimate || null,
    taxAssessedValue: p.taxAssessment?.taxAssessedValue || null,

    // Property details
    beds:             p.bedrooms || null,
    baths:            p.bathrooms || null,
    sqft:             p.livingArea || null,
    lotSize:          p.lotSizeWithUnit?.lotSize || null, // sqft
    yearBuilt:        p.yearBuilt || null,
    propertyType:     p.propertyType || null,             // singleFamily, townhome, condo

    // Listing status
    mlsStatus:        p.listing?.listingStatus || null,   // forSale, forRent, sold
    daysOnMarket:     p.daysOnZillow || null,
    isOpenHouse:      p.listing?.listingSubType?.isOpenHouse || false,
    openHouseTimes:   p.openHouseShowingList || [],

    // Media
    photo:            p.media?.propertyPhotoLinks?.mediumSizeLink || null,
    photoHiRes:       p.media?.propertyPhotoLinks?.highResolutionLink || null,
    allPhotos:        p.media?.allPropertyPhotos?.medium || [],
    allPhotosHiRes:   p.media?.allPropertyPhotos?.highResolution || [],

    // Agent / MLS
    agentName:        p.propertyDisplayRules?.agent?.agentName || null,
    brokerName:       p.propertyDisplayRules?.mls?.brokerName || null,
    mlsId:            p.propertyDisplayRules?.mls?.mlsIdOnMap || null,

    // Links
    zillowUrl:        hdpUrl,

    // Insights (search results) — human-readable signals
    // e.g. ['New air conditioner', 'Price cut: $10,000 (4/7)', '15 days on Zillow']
    insights,

    // resoFacts (zpid detail only) — amenity signals for House Profile scoring
    // hasFireplace, hasGarage, hasCooling, hasView, hoaFee etc.
    resoFacts,

    // Keep raw for any fields not explicitly mapped above
    raw: p,
  };
}
