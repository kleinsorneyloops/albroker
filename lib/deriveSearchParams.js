/**
 * Al Broker — Derive Search Params from House Profile
 *
 * Maps the full Layer 1 house profile (core + extended) to
 * RealtyAPI search/byaddress parameters.
 *
 * Priority:
 *   1. Explicit confirmed fields (budget, bedrooms, location)
 *   2. Extended Layer 1 preferences (sqft, yearBuilt, lotSize, HOA, keywords)
 *   3. Inferred location clusters from behavioral signals
 *   4. Sensible fallback
 */

export function deriveSearchParams(houseProfile) {
  if (!houseProfile) return getFallbackParams();

  const {
    budget_min,
    budget_max,
    budget_confirmed,
    bedrooms_min,
    locations_explicit,
    must_haves,
    deal_breakers,
    inferred_summary,
  } = houseProfile;

  const ext = inferred_summary?.layer1_extended || {};

  // ── Location ──────────────────────────────────────────────────────────────
  let location = null;
  const explicit = Array.isArray(locations_explicit) ? locations_explicit : [];
  if (explicit.length > 0) {
    location = explicit.slice(0, 3).map(l => l.zip || l.name).filter(Boolean).join(';');
  } else {
    const clusters = inferred_summary?.locationClusters || [];
    if (clusters.length > 0) {
      location = clusters.slice(0, 3).map(c => c.zip || c.name).filter(Boolean).join(';');
    }
  }
  if (!location) location = 'Colorado';

  // ── Budget ────────────────────────────────────────────────────────────────
  const minPrice = budget_confirmed && budget_min ? budget_min : null;
  const maxPrice = budget_confirmed && budget_max ? budget_max
    : inferred_summary?.priceRange?.serious_max || null;

  // ── Bedrooms ──────────────────────────────────────────────────────────────
  const minBeds = bedrooms_min || 3;

  // ── Property types ────────────────────────────────────────────────────────
  const propertyTypes = inferred_summary?.propertyTypes || [];
  const homeType = propertyTypes.length > 0 ? propertyTypes.join(',') : null;

  // ── Amenities (ac, pool → dedicated amenities param) ──────────────────
  const AMENITY_MAP = {
    ac:   'Must have A/C',
    pool: 'Must have pool',
  };
  const amenities = (must_haves || [])
    .filter(m => AMENITY_MAP[m])
    .map(m => AMENITY_MAP[m]);

  // ── Keywords (must-haves + neighborhood character) ────────────────────────
  const KEYWORD_MAP = {
    fireplace: 'fireplace',
    garage:    'garage',
    yard:      'yard',
    office:    'office',
    patio:     'patio',
    basement:  'basement',
  };

  const NEIGHBORHOOD_KEYWORDS = {
    urban:    'urban',
    rural:    'rural',
    suburban: 'suburban',
  };

  const mustHaveKeywords = (must_haves || [])
    .filter(m => KEYWORD_MAP[m])
    .map(m => KEYWORD_MAP[m]);

  const neighborhoodKeywords = Array.isArray(ext.neighborhoodChar)
    ? ext.neighborhoodChar.filter(c => NEIGHBORHOOD_KEYWORDS[c]).map(c => NEIGHBORHOOD_KEYWORDS[c])
    : (ext.neighborhoodChar && NEIGHBORHOOD_KEYWORDS[ext.neighborhoodChar] ? [NEIGHBORHOOD_KEYWORDS[ext.neighborhoodChar]] : []);

  const allKeywords = [...mustHaveKeywords, ...neighborhoodKeywords];

  // ── Views ─────────────────────────────────────────────────────────────────
  const views = Array.isArray(ext.viewPref) && ext.viewPref.length > 0
    ? ext.viewPref.join(',')
    : null;

  // ── Sqft ──────────────────────────────────────────────────────────────────
  let sqft = null;
  if (ext.sqftMin || ext.sqftMax) {
    const parts = [];
    if (ext.sqftMin) parts.push(`min:${ext.sqftMin}`);
    if (ext.sqftMax) parts.push(`max:${ext.sqftMax}`);
    sqft = parts.join(', ');
  }

  // ── Year built ────────────────────────────────────────────────────────────
  const YEAR_BUILT_MAP = {
    modern:      { min: 2000 },
    established: { min: 1980, max: 2000 },
    historic:    { max: 1980 },
  };
  let yearBuilt = null;
  if (ext.yearBuiltPref && YEAR_BUILT_MAP[ext.yearBuiltPref]) {
    const yb = YEAR_BUILT_MAP[ext.yearBuiltPref];
    const parts = [];
    if (yb.min) parts.push(`min:${yb.min}`);
    if (yb.max) parts.push(`max:${yb.max}`);
    yearBuilt = parts.join(', ');
  }

  // ── Lot size ──────────────────────────────────────────────────────────────
  const LOT_MAP = {
    small:   { min: 2000,  max: 8000  },
    large:   { min: 10000, max: 43560 },
    acreage: { min: 43560 },
  };
  let lotSize = null;
  if (ext.lotPref && LOT_MAP[ext.lotPref]) {
    const lot = LOT_MAP[ext.lotPref];
    const parts = [];
    if (lot.min) parts.push(`min:${lot.min}`);
    if (lot.max) parts.push(`max:${lot.max}`);
    lotSize = parts.join(', ');
  }

  // ── HOA ───────────────────────────────────────────────────────────────────
  // hoaTolerance: 'none' → hasHOA: false, others → no filter
  let hasHOA = null;
  if (ext.hoaTolerance === 'none') hasHOA = false;

  // Also check deal-breakers for HOA signals
  if ((deal_breakers || []).includes('high-hoa') && hasHOA === null) hasHOA = false;
  if ((deal_breakers || []).includes('hoa-required')) hasHOA = true;

  // ── Build params ──────────────────────────────────────────────────────────
  const params = {
    location,
    status:  'For_Sale',
    minBeds,
    page:    1,
  };

  if (minPrice)            params.minPrice = minPrice;
  if (maxPrice)            params.maxPrice = maxPrice;
  if (homeType)            params.homeType = homeType;
  if (sqft)                params.sqft = sqft;
  if (yearBuilt)           params.yearBuilt = yearBuilt;
  if (lotSize)             params.lotSize = lotSize;
  if (hasHOA !== null)     params.hasHOA = hasHOA;
  if (allKeywords.length)  params.keywords = allKeywords.join(', ');
  if (amenities.length)    params.amenities = amenities.join(',');
  if (views)               params.views = views;

  return params;
}

/**
 * Formats a dollar amount compactly — e.g. 750000 → "$750k"
 */
function fmtBudget(n) {
  if (!n) return null;
  if (n >= 1000000) {
    const m = n / 1000000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  return `$${(n / 1000).toFixed(0)}k`;
}

/**
 * Human-readable summary of what the search is doing.
 * Shown in the "Al found X listings" header.
 */
export function deriveSearchSummary(houseProfile) {
  if (!houseProfile) return null;
  const { budget_min, budget_max, budget_confirmed, bedrooms_min, inferred_summary } = houseProfile;
  const ext = inferred_summary?.layer1_extended || {};

  const clusters = inferred_summary?.locationClusters || [];
  const locationLabel = clusters.length > 0
    ? clusters.map(c => c.name).filter(Boolean).join(', ')
    : 'Colorado';

  const parts = [locationLabel];
  if (budget_confirmed && budget_min && budget_max) {
    parts.push(`${fmtBudget(budget_min)}–${fmtBudget(budget_max)}`);
  }
  if (bedrooms_min) parts.push(`${bedrooms_min}+ bed`);
  if (ext.neighborhoodChar) parts.push(ext.neighborhoodChar);

  const signals = inferred_summary?.amenitySignals || {};
  const topSignals = Object.entries(signals)
    .filter(([, count]) => count >= 3)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([key]) => key.replace(/_/g, ' '));
  if (topSignals.length > 0) parts.push(topSignals.join(', '));

  return parts.join(' · ');
}

/**
 * Returns just the location label for use in the page <h1>.
 */
export function deriveLocationLabel(houseProfile) {
  if (!houseProfile) return null;
  const clusters = houseProfile.inferred_summary?.locationClusters || [];
  return clusters.length > 0
    ? clusters.map(c => c.name).filter(Boolean).join(', ')
    : null;
}

function getFallbackParams() {
  return {
    location: 'Colorado',
    status:   'For_Sale',
    minBeds:  3,
    page:     1,
  };
}
