/**
 * Neighborhood Context — business logic for homebuyer education.
 * Provides context about a property to help buyers understand what they're looking at.
 */

export function buildNeighborhoodContext(property) {
  if (!property) return null;

  const factors = [];

  if (property.yearBuilt) {
    const age = new Date().getFullYear() - property.yearBuilt;
    let insight;
    if (age < 5) insight = 'Very new — likely under builder warranty, minimal immediate repairs';
    else if (age < 15) insight = 'Relatively new — most major systems should be in good shape';
    else if (age < 30) insight = 'Established — ask about roof, HVAC, and water heater age';
    else insight = 'Mature — budget for potential updates to plumbing, electrical, or foundation';

    factors.push({ label: 'Property Age', value: `${age} years (built ${property.yearBuilt})`, insight });
  }

  if (property.sqft) {
    let insight;
    if (property.sqft > 2500) insight = 'Spacious — consider higher utility and maintenance costs';
    else if (property.sqft > 1500) insight = 'Mid-size — good balance of space and upkeep';
    else insight = 'Compact — lower maintenance, consider if it fits your lifestyle';

    factors.push({ label: 'Living Area', value: `${property.sqft.toLocaleString()} sq ft`, insight });
  }

  if (property.price && property.sqft) {
    const pricePerSqft = Math.round(property.price / property.sqft);
    let insight;
    if (pricePerSqft > 300) insight = 'Premium market — verify comparable sales support this';
    else if (pricePerSqft > 150) insight = 'Mid-range — typical for many suburban markets';
    else insight = 'Below average — could be a deal or reflect area conditions';

    factors.push({ label: 'Price per Sq Ft', value: `$${pricePerSqft.toLocaleString()}`, insight });
  }

  if (property.lotSize) {
    const acres = (property.lotSize / 43560).toFixed(2);
    let insight;
    if (property.lotSize > 20000) insight = 'Large lot — great for privacy, more yard maintenance';
    else if (property.lotSize > 7000) insight = 'Standard lot — typical suburban property';
    else insight = 'Compact lot — less maintenance, may feel closer to neighbors';

    factors.push({ label: 'Lot Size', value: `${property.lotSize.toLocaleString()} sq ft (${acres} acres)`, insight });
  }

  return { address: property.address, factors };
}

/**
 * Builds an LLM prompt for homebuyer education and guidance.
 */
export function buildMentorPrompt(property, neighborhoodContext, userProfile) {
  const priceStr = property.price ? `$${property.price.toLocaleString()}` : 'unknown';

  const contextLines = (neighborhoodContext?.factors || [])
    .map((f) => `- ${f.label}: ${f.value} (${f.insight})`)
    .join('\n');

  let profileSection = '';
  const profilePriorities = userProfile?.homePriorities || userProfile?.priorities || [];
  if (userProfile) {
    const parts = [];
    if (userProfile.journeyStage || userProfile.experience) {
      parts.push(`Journey stage: ${userProfile.journeyStage || userProfile.experience}`);
    }
    if (userProfile.buyerType) parts.push(`Buyer type: ${userProfile.buyerType}`);
    if (userProfile.buyingReason) parts.push(`Reason for buying: ${userProfile.buyingReason}`);
    if (userProfile.targetBudgetRange || userProfile.budget) {
      parts.push(`Budget target: ${userProfile.targetBudgetRange || userProfile.budget}`);
    }
    if (userProfile.targetMarket || userProfile.location) {
      parts.push(`Preferred area: ${userProfile.targetMarket || userProfile.location}`);
    }
    if (profilePriorities.length) parts.push(`Top priorities: ${profilePriorities.join(', ')}`);
    if (userProfile.biggestBlocker) parts.push(`Biggest blocker: ${userProfile.biggestBlocker}`);
    if (userProfile.wishKnewBeforeSearch || userProfile.concerns) {
      parts.push(`Main concern/context: ${userProfile.wishKnewBeforeSearch || userProfile.concerns}`);
    }
    if (userProfile.purchaseTimeframe || userProfile.timeline) {
      parts.push(`Timeline: ${userProfile.purchaseTimeframe || userProfile.timeline}`);
    }

    if (parts.length > 0) {
      profileSection = `\nBuyer Profile:\n${parts.map(p => `- ${p}`).join('\n')}\n`;
    }
  }

  return `You are a friendly, knowledgeable homebuying advisor helping a potential buyer evaluate a property. Your goal is to educate them so they feel confident and prepared when talking to their realtor.

Property Details:
- Address: ${property.address}
- Listed Price: ${priceStr}
- Bedrooms: ${property.beds ?? 'N/A'}
- Bathrooms: ${property.baths ?? 'N/A'}
- Square Footage: ${property.sqft ? property.sqft.toLocaleString() + ' sq ft' : 'N/A'}
- Year Built: ${property.yearBuilt ?? 'N/A'}
- Property Type: ${property.propertyType ?? 'N/A'}

Property Analysis:
${contextLines || 'No additional data available.'}
${profileSection}
Please provide a helpful, educational analysis covering:

1. **First Impressions** — What stands out about this property? Is the price reasonable for what you get?

2. **Things to Investigate** — What should the buyer research further? Think about schools, commute times, flood zones, HOA rules, or anything the data suggests.

3. **Questions for Your Realtor** — Give 3-5 specific questions the buyer should ask their realtor about this property.

4. **What to Look for During a Showing** — Practical tips for when they visit this home in person.

${profilePriorities.length ? `5. **Based on Your Priorities** — How well does this property align with their stated priorities (${profilePriorities.join(', ')})? What should they weigh?` : ''}

Keep the tone warm, educational, and encouraging. Explain the "why" so the buyer learns homebuying principles they can apply to every property they consider. Avoid jargon — if you use a real estate term, briefly explain it.`;
}
