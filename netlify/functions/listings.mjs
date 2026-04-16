import { searchListings, searchByUrl, getPropertyByZpid } from '../../lib/reapi.js';

/**
 * GET /api/listings
 *
 * Three modes:
 *   ?zpid=13595929                          → full property detail by Zillow ID
 *   ?url=https://www.zillow.com/...         → full property detail by Zillow URL
 *   ?location=Fort+Collins+CO&...           → listing search by location
 *
 * Search query params (location mode only):
 *   location    - City, ZIP, neighborhood, or address (required)
 *   status      - For_Sale | For_Rent | Sold (default: For_Sale)
 *   minPrice    - Minimum list price
 *   maxPrice    - Maximum list price
 *   minBeds     - Minimum bedrooms
 *   maxBeds     - Maximum bedrooms
 *   homeType    - e.g. Houses,Townhomes
 *   page        - Page number 1-5 (200 results per page)
 */

function normalizeItem(item) {
  // Use ?? instead of || so we don't fall through on empty objects
  const p = item?.raw?.property ?? item;

  return {
    id:               p.zpid ?? null,
    zpid:             p.zpid ?? null,
    address:          p.address?.streetAddress ?? null,
    city:             p.address?.city ?? null,
    state:            p.address?.state ?? null,
    zip:              p.address?.zipcode ?? null,
    lat:              p.location?.latitude ?? null,
    lng:              p.location?.longitude ?? null,
    listPrice:        p.price?.value ?? null,
    priceChange:      p.price?.priceChange ?? null,
    priceChangedDate: p.price?.changedDate ?? null,
    pricePerSqft:     p.price?.pricePerSquareFoot ?? null,
    zestimate:        p.estimates?.zestimate ?? null,
    rentZestimate:    p.estimates?.rentZestimate ?? null,
    taxAssessedValue: p.taxAssessment?.taxAssessedValue ?? null,
    beds:             p.bedrooms ?? null,
    baths:            p.bathrooms ?? null,
    sqft:             p.livingArea ?? null,
    lotSize:          p.lotSizeWithUnit?.lotSize ?? null,
    yearBuilt:        p.yearBuilt ?? null,
    propertyType:     p.propertyType ?? null,
    mlsStatus:        p.listing?.listingStatus ?? null,
    daysOnMarket:     p.daysOnZillow ?? null,
    isOpenHouse:      p.listing?.listingSubType?.isOpenHouse ?? false,
    openHouseTimes:   p.openHouseShowingList ?? [],
    photo:            p.media?.propertyPhotoLinks?.mediumSizeLink ?? null,
    photoHiRes:       p.media?.propertyPhotoLinks?.highResolutionLink ?? null,
    allPhotos:        p.media?.allPropertyPhotos?.medium ?? [],
    allPhotosHiRes:   p.media?.allPropertyPhotos?.highResolution ?? [],
    agentName:        p.propertyDisplayRules?.agent?.agentName ?? null,
    brokerName:       p.propertyDisplayRules?.mls?.brokerName ?? null,
    mlsId:            p.propertyDisplayRules?.mls?.mlsIdOnMap ?? null,
    zillowUrl:        p.hdpView?.hdpUrl ? `https://www.zillow.com${p.hdpView.hdpUrl}` : null,
    insights:         p.listCardRecommendation?.flexFieldRecommendations?.map(f => f.displayString).filter(Boolean) ?? [],
    resoFacts:        p.resoFacts ?? null,
    // Flattened resoFacts fields for House Profile scoring
    hasFireplace:     p.resoFacts?.hasFireplace ?? null,
    hasGarage:        p.resoFacts?.hasGarage ?? null,
    hasCooling:       p.resoFacts?.hasCooling ?? null,
    hasHeating:       p.resoFacts?.hasHeating ?? null,
    hasView:          p.resoFacts?.hasView ?? null,
    hasWaterfront:    p.resoFacts?.hasWaterfrontView ?? null,
    hasPool:          p.resoFacts?.hasPrivatePool ?? null,
    hasAssociation:   p.resoFacts?.hasAssociation ?? null,
    monthlyHoaFee:    p.resoFacts?.associationFee ?? p.monthlyHoaFee ?? null,
    parkingSpaces:    p.resoFacts?.coveredParkingCapacity ?? p.resoFacts?.garageParkingCapacity ?? null,
    fireplaceCount:   p.resoFacts?.fireplaces ?? null,
    raw:              p,
  };
}

export default async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const zpid     = searchParams.get('zpid');
    const url      = searchParams.get('url');
    const location = searchParams.get('location');

    // --- zpid detail path ---
    if (zpid) {
      const data = await getPropertyByZpid(zpid);
      return new Response(
        JSON.stringify({ property: data }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // --- Zillow URL import path ---
    if (url) {
      const data = await searchByUrl(url);
      return new Response(
        JSON.stringify({ property: data }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // --- Location search path ---
    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Provide location, zpid, or url parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const params = {
      location,
      listingStatus: searchParams.get('status') || 'For_Sale',
      minPrice:   searchParams.get('minPrice')   ? Number(searchParams.get('minPrice'))  : undefined,
      maxPrice:   searchParams.get('maxPrice')   ? Number(searchParams.get('maxPrice'))  : undefined,
      minBeds:    searchParams.get('minBeds')    ? Number(searchParams.get('minBeds'))   : undefined,
      maxBeds:    searchParams.get('maxBeds')    ? Number(searchParams.get('maxBeds'))   : undefined,
      homeType:   searchParams.get('homeType')   || undefined,
      sqft:       searchParams.get('sqft')       || undefined,
      yearBuilt:  searchParams.get('yearBuilt')  || undefined,
      lotSize:    searchParams.get('lotSize')    || undefined,
      hasHOA:     searchParams.get('hasHOA') !== null ? searchParams.get('hasHOA') : undefined,
      keywords:   searchParams.get('keywords')  || undefined,
      amenities:  searchParams.get('amenities') || undefined,
      views:      searchParams.get('views')     || undefined,
      page:       searchParams.get('page')      ? Number(searchParams.get('page'))      : 1,
    };

    const data = await searchListings(params);
    const raw = data?.listings ?? data?.results ?? data?.searchResults ?? data?.listResults ?? [];
    const listings = Array.isArray(raw) ? raw.map(normalizeItem) : [];

    return new Response(
      JSON.stringify({ listings, count: listings.length, totalCount: data?.totalCount ?? null }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Listings function error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const config = {
  path: '/api/listings',
};
