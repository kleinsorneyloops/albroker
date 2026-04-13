/**
 * Al Broker — Derive Search Params from House Profile
 *
 * Takes the house_profiles row from Neon and returns
 * query params for /api/listings.
 *
 * Priority:
 *   1. Explicit confirmed fields (budget_min, budget_max, bedrooms_min)
 *   2. Inferred location clusters from inferred_summary JSONB
 *   3. Sensible Colorado fallback
 */

/**
 * @param {object} houseProfile - row from house_profiles table
 * @returns {object} params ready for /api/listings query string
 */
export function deriveSearchParams(houseProfile) {
  if (!houseProfile) return getFallbackParams();

  const {
    budget_min,
    budget_max,
    budget_confirmed,
    bedrooms_min,
    locations_explicit,
    inferred_summary,
  } = houseProfile;

  // ── Location ──────────────────────────────────────────────────────────────
  // Explicit locked locations take priority
  // Fall back to inferred clusters from saved listing behavior
  let location = null;

  const explicit = Array.isArray(locations_explicit) ? locations_explicit : [];
  if (explicit.length > 0) {
    location = explicit
      .slice(0, 3)
      .map(l => l.zip || `${l.name} ${l.state}`)
      .join(';');
  } else {
    const clusters = inferred_summary?.locationClusters || [];
    if (clusters.length > 0) {
      location = clusters
        .slice(0, 3)
        .map(c => c.zip || `${c.name} ${c.state}`)
        .join(';');
    }
  }

  if (!location) location = 'Colorado';

  // ── Budget ────────────────────────────────────────────────────────────────
  const minPrice = budget_confirmed && budget_min ? budget_min : null;
  const maxPrice = budget_confirmed && budget_max ? budget_max
    : inferred_summary?.priceRange?.serious_max || null;

  // ── Bedrooms ──────────────────────────────────────────────────────────────
  const minBeds = bedrooms_min || 3;

  const params = {
    location,
    homeType: 'Houses',
    status:   'For_Sale',
    minBeds,
    page:     1,
  };

  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;

  return params;
}

/**
 * Formats a dollar amount compactly — e.g. 750000 → "$750k", 1200000 → "$1.2M"
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

  const {
    budget_min,
    budget_max,
    budget_confirmed,
    bedrooms_min,
    inferred_summary,
  } = houseProfile;

  const clusters = inferred_summary?.locationClusters || [];
  const locationLabel = clusters.length > 0
    ? clusters.map(c => c.name).join(', ')
    : 'Colorado';

  const parts = [locationLabel];

  // Budget range
  if (budget_confirmed && budget_min && budget_max) {
    parts.push(`${fmtBudget(budget_min)}–${fmtBudget(budget_max)}`);
  }

  // Bedrooms
  if (bedrooms_min) {
    parts.push(`${bedrooms_min}+ bed`);
  }

  // Top amenity signals from behavioral data
  const signals = inferred_summary?.amenitySignals || {};
  const topSignals = Object.entries(signals)
    .filter(([, count]) => count >= 3)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([key]) => key.replace(/_/g, ' '));

  if (topSignals.length > 0) {
    parts.push(topSignals.join(', '));
  }

  return parts.join(' · ');
}

/**
 * Returns just the location label for use in the page <h1>.
 */
export function deriveLocationLabel(houseProfile) {
  if (!houseProfile) return null;
  const clusters = houseProfile.inferred_summary?.locationClusters || [];
  return clusters.length > 0
    ? clusters.map(c => c.name).join(', ')
    : null;
}

function getFallbackParams() {
  return {
    location: 'Colorado',
    homeType: 'Houses',
    status:   'For_Sale',
    minBeds:  3,
    page:     1,
  };
}
