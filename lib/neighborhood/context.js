/**
 * Neighborhood Context — business logic separated from UI.
 * Builds a neighborhood analysis prompt and interprets property data
 * to provide context about the property's market position.
 */

/**
 * Generates a structured neighborhood context summary from property data.
 */
export function buildNeighborhoodContext(property) {
  if (!property) return null;

  const factors = [];

  if (property.yearBuilt) {
    const age = new Date().getFullYear() - property.yearBuilt;
    factors.push({
      label: 'Property Age',
      value: `${age} years (built ${property.yearBuilt})`,
      insight: age < 10 ? 'Newer construction' : age < 30 ? 'Established property' : 'Mature property',
    });
  }

  if (property.sqft) {
    factors.push({
      label: 'Living Area',
      value: `${property.sqft.toLocaleString()} sq ft`,
      insight: property.sqft > 2500 ? 'Above-average size' : property.sqft > 1500 ? 'Mid-range size' : 'Compact living space',
    });
  }

  if (property.price && property.sqft) {
    const pricePerSqft = Math.round(property.price / property.sqft);
    factors.push({
      label: 'Price per Sq Ft',
      value: `$${pricePerSqft.toLocaleString()}`,
      insight: pricePerSqft > 300 ? 'Premium market' : pricePerSqft > 150 ? 'Mid-range market' : 'Affordable market',
    });
  }

  if (property.lotSize) {
    const acres = (property.lotSize / 43560).toFixed(2);
    factors.push({
      label: 'Lot Size',
      value: `${property.lotSize.toLocaleString()} sq ft (${acres} acres)`,
      insight: property.lotSize > 20000 ? 'Large lot' : property.lotSize > 7000 ? 'Standard lot' : 'Compact lot',
    });
  }

  return {
    address: property.address,
    factors,
  };
}

/**
 * Builds an LLM prompt for market valuation mentorship.
 */
export function buildMentorPrompt(property, neighborhoodContext) {
  const priceStr = property.price
    ? `$${property.price.toLocaleString()}`
    : 'unknown';

  const contextLines = (neighborhoodContext?.factors || [])
    .map((f) => `- ${f.label}: ${f.value} (${f.insight})`)
    .join('\n');

  return `You are an experienced real estate investment mentor. A student is analyzing a property and needs your guidance on market valuation.

Property Details:
- Address: ${property.address}
- Listed/Estimated Price: ${priceStr}
- Bedrooms: ${property.beds ?? 'N/A'}
- Bathrooms: ${property.baths ?? 'N/A'}
- Square Footage: ${property.sqft ? property.sqft.toLocaleString() + ' sq ft' : 'N/A'}
- Year Built: ${property.yearBuilt ?? 'N/A'}
- Property Type: ${property.propertyType ?? 'N/A'}

Neighborhood Analysis:
${contextLines || 'No additional neighborhood data available.'}

Please provide:
1. A brief market valuation assessment (is this fairly priced, undervalued, or overvalued based on the available data?)
2. Key factors that influence this property's value
3. What a smart investor should look for next (comparable sales, inspections, market trends)
4. Any red flags or opportunities you notice

Keep the tone educational and mentoring — explain the "why" behind your analysis so the student learns real estate investing principles.`;
}
