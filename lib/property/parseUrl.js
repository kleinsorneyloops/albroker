/**
 * Extracts a property address from a Zillow, Realtor.com, Redfin, or similar URL.
 * Falls back to treating the input as a plain address string.
 */
export function parsePropertyUrl(input) {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const trimmed = input.trim();

  // Zillow URL pattern: /homedetails/<address>/<zpid>_zpid/
  const zillowMatch = trimmed.match(
    /zillow\.com\/homedetails\/([^/]+)\//i
  );
  if (zillowMatch) {
    return slugToAddress(zillowMatch[1]);
  }

  // Realtor.com URL pattern: /realestateandhomes-detail/<address>
  const realtorMatch = trimmed.match(
    /realtor\.com\/realestateandhomes-detail\/([^/?#]+)/i
  );
  if (realtorMatch) {
    return slugToAddress(realtorMatch[1]);
  }

  // Redfin URL pattern: /state/city/zip/address
  const redfinMatch = trimmed.match(
    /redfin\.com\/[A-Z]{2}\/[^/]+\/\d{5}\/([^/?#]+)/i
  );
  if (redfinMatch) {
    return slugToAddress(redfinMatch[1]);
  }

  // If it looks like a URL but we couldn't parse it, try extracting the path slug
  if (trimmed.startsWith('http')) {
    try {
      const url = new URL(trimmed);
      const segments = url.pathname.split('/').filter(Boolean);
      const last = segments[segments.length - 1];
      if (last) return slugToAddress(last);
    } catch {
      // not a valid URL
    }
  }

  // Plain address string
  return trimmed;
}

function slugToAddress(slug) {
  return slug
    .replace(/_zpid$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
