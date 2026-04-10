'use client';

import { useState, useEffect } from 'react';

const RATE = 0.06168;
const DOWN = 0.20;
const TAX_RATE = 0.0051;
const INS = 125;

function calcMonthly(price) {
  const loan = price * (1 - DOWN);
  const mo = RATE / 12;
  const n = 360;
  const pi = loan * (mo * Math.pow(1 + mo, n)) / (Math.pow(1 + mo, n) - 1);
  const tax = (price * TAX_RATE) / 12;
  return Math.round(pi + tax + INS);
}

function fmt(n) {
  if (!n) return '—';
  return '$' + Math.round(n).toLocaleString();
}

function PropertyCard({ listing, onSave, savedIds }) {
  const p = listing?.raw?.property ?? listing;
  if (!p) return null;

  const zpid = p.zpid;
  const address = p.address?.streetAddress ?? '—';
  const city = p.address?.city ?? '';
  const state = p.address?.state ?? '';
  const price = p.price?.value;
  const beds = p.bedrooms;
  const baths = p.bathrooms;
  const sqft = p.livingArea;
  const yearBuilt = p.yearBuilt;
  const propertyType = p.propertyType;
  const daysOnMarket = p.daysOnZillow;
  const priceChange = p.price?.priceChange;
  const photo = p.media?.propertyPhotoLinks?.mediumSizeLink;
  const agentName = p.propertyDisplayRules?.agent?.agentName;
  const brokerName = p.propertyDisplayRules?.mls?.brokerName;
  const insights = p.listCardRecommendation?.flexFieldRecommendations?.map(f => f.displayString) ?? [];
  const hdpUrl = p.hdpView?.hdpUrl ? `https://www.zillow.com${p.hdpView.hdpUrl}` : null;
  const monthly = price ? calcMonthly(price) : null;
  const isSaved = savedIds?.includes(String(zpid));

  const typeLabel = {
    singleFamily: 'Single Family',
    townhome: 'Townhome',
    condo: 'Condo',
    apartment: 'Apartment',
  }[propertyType] ?? propertyType ?? '';

  return (
    <div className="card overflow-hidden flex flex-col" style={{ transition: 'box-shadow 0.15s' }}>
      {/* Photo */}
      <div style={{ position: 'relative', height: '180px', background: 'var(--bg-card, #f1f5f9)', overflow: 'hidden' }}>
        {photo ? (
          <img
            src={photo}
            alt={address}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="48" height="48" fill="none" stroke="var(--text-muted)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M3 9.5L12 3l9 6.5V21H3V9.5z" />
            </svg>
          </div>
        )}
        {/* Badges */}
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {daysOnMarket !== undefined && daysOnMarket !== null && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
              background: daysOnMarket > 60 ? '#FFF3E0' : 'var(--color-teal)',
              color: daysOnMarket > 60 ? '#E65100' : '#1a3a3a',
              border: '1px solid rgba(0,0,0,0.08)',
            }}>
              {daysOnMarket}d on market
            </span>
          )}
          {priceChange && priceChange < 0 && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
              background: '#E8F5E9', color: '#2E7D32',
              border: '1px solid rgba(0,0,0,0.08)',
            }}>
              Price ↓
            </span>
          )}
          {typeLabel && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 20,
              background: 'rgba(255,255,255,0.88)', color: 'var(--text)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}>
              {typeLabel}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Address & Price */}
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, marginBottom: 2 }}>
            {address}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {city}{city && state ? ', ' : ''}{state}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-rocket)', letterSpacing: '-0.02em' }}>
            {fmt(price)}
          </span>
          {monthly && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              ~{fmt(monthly)}/mo
            </span>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {beds && (
            <span style={{ fontSize: 13, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ fontWeight: 700 }}>{beds}</span>
              <span style={{ color: 'var(--text-muted)' }}>bd</span>
            </span>
          )}
          {baths && (
            <span style={{ fontSize: 13, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ fontWeight: 700 }}>{baths}</span>
              <span style={{ color: 'var(--text-muted)' }}>ba</span>
            </span>
          )}
          {sqft && (
            <span style={{ fontSize: 13, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ fontWeight: 700 }}>{sqft.toLocaleString()}</span>
              <span style={{ color: 'var(--text-muted)' }}>sqft</span>
            </span>
          )}
          {yearBuilt && (
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Built {yearBuilt}
            </span>
          )}
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {insights.slice(0, 2).map((insight, i) => (
              <span key={i} style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 20,
                background: 'color-mix(in oklab, var(--color-teal) 15%, transparent)',
                color: 'var(--text)',
                border: '1px solid color-mix(in oklab, var(--color-teal) 30%, transparent)',
              }}>
                {insight}
              </span>
            ))}
          </div>
        )}

        {/* Agent */}
        {(agentName || brokerName) && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 'auto', paddingTop: 4 }}>
            {agentName ? `Listed by ${agentName}` : brokerName}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex', gap: 8, padding: '12px 16px',
        borderTop: '1px solid color-mix(in oklab, var(--border) 50%, transparent)',
      }}>
        {hdpUrl && (
          <a
            href={hdpUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
            style={{ flex: 1, fontSize: 12, padding: '6px 12px', textAlign: 'center' }}
          >
            View on Zillow ↗
          </a>
        )}
        <button
          onClick={() => onSave && onSave(listing)}
          style={{
            flex: 1, fontSize: 12, padding: '6px 12px', borderRadius: 6,
            fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
            background: isSaved ? 'color-mix(in oklab, var(--color-teal) 20%, transparent)' : 'var(--color-rocket)',
            color: isSaved ? 'var(--text)' : '#ffffff',
            border: isSaved ? '1.5px solid var(--color-teal)' : '1.5px solid var(--border)',
            boxShadow: isSaved ? 'none' : '2px 2px 0 var(--shadow)',
          }}
        >
          {isSaved ? '✓ Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card overflow-hidden" style={{ opacity: 0.6 }}>
      <div style={{ height: 180, background: 'color-mix(in oklab, var(--border) 40%, transparent)', animation: 'pulse 1.5s infinite' }} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[140, 80, 100].map((w, i) => (
          <div key={i} style={{
            height: i === 1 ? 28 : 14, width: w, borderRadius: 4,
            background: 'color-mix(in oklab, var(--border) 60%, transparent)',
            animation: 'pulse 1.5s infinite',
          }} />
        ))}
      </div>
    </div>
  );
}

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [userId, setUserId] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [profile, setProfile] = useState(null);

  // Load user and profile
  useEffect(() => {
    const id = localStorage.getItem('albroker_user');
    setUserId(id);
    if (id) {
      loadProfile(id);
      loadSaved(id);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function loadProfile(id) {
    try {
      const res = await fetch(`/api/profile?userId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        // Use profile to seed location
        const market = data.profile?.targetMarket;
        if (market) {
          setLocation(market);
          setSearchInput(market);
          fetchListings(market);
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  }

  async function loadSaved(id) {
    try {
      const res = await fetch(`/api/saved-homes?userId=${id}`);
      if (res.ok) {
        const data = await res.json();
        const ids = (data.homes || []).map(h => String(h.zpid || h.id));
        setSavedIds(ids);
      }
    } catch {
      // silently fail
    }
  }

  async function fetchListings(loc) {
    if (!loc?.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ location: loc.trim() });
      // Add budget from profile if available
      if (profile?.targetBudgetRange) {
        const budget = parseBudgetRange(profile.targetBudgetRange);
        if (budget.max) params.set('maxPrice', budget.max);
      }
      const res = await fetch(`/api/listings?${params}`);
      if (!res.ok) throw new Error('Failed to fetch listings');
      const data = await res.json();
      setListings(data.listings || []);
      setLocation(loc.trim());
    } catch (err) {
      setError(err.message);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }

  function parseBudgetRange(range) {
    // e.g. "$400,000 - $500,000" or "400000-500000"
    const nums = range?.replace(/[$,]/g, '').match(/\d+/g);
    if (!nums) return {};
    return { min: nums[0], max: nums[1] || nums[0] };
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchInput.trim()) fetchListings(searchInput.trim());
  }

  async function handleSave(listing) {
    if (!userId) return;
    const p = listing?.raw?.property ?? listing;
    const zpid = String(p?.zpid);
    if (!zpid || zpid === 'undefined') return;

    // Toggle save
    if (savedIds.includes(zpid)) {
      // Remove
      try {
        await fetch(`/api/saved-homes?userId=${userId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ homeId: zpid }),
        });
        setSavedIds(prev => prev.filter(id => id !== zpid));
      } catch {}
    } else {
      // Save
      try {
        await fetch('/api/saved-homes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            home: {
              id: zpid,
              zpid,
              property: {
                address: p.address?.streetAddress,
                city: p.address?.city,
                state: p.address?.state,
                price: p.price?.value,
                beds: p.bedrooms,
                baths: p.bathrooms,
                sqft: p.livingArea,
                yearBuilt: p.yearBuilt,
                photo: p.media?.propertyPhotoLinks?.mediumSizeLink,
              },
            },
          }),
        });
        setSavedIds(prev => [...prev, zpid]);
      } catch {}
    }
  }

  const validListings = listings.filter(l => l?.raw?.property?.zpid);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">
          {location ? (
            <>Listings in <span style={{ color: 'var(--color-rocket)' }}>{location}</span></>
          ) : 'Browse Listings'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
          {isLoading
            ? 'Finding properties…'
            : validListings.length > 0
              ? `${validListings.length} properties found`
              : location
                ? 'No listings found — try a different location'
                : 'Enter a city, ZIP, or neighborhood to search'}
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="City, ZIP, or neighborhood — e.g. Fort Collins CO"
          style={{
            flex: 1, padding: '10px 14px', fontSize: 14, borderRadius: 8,
            border: '1.5px solid var(--border)', background: 'var(--bg-card, white)',
            color: 'var(--text)', outline: 'none',
          }}
        />
        <button
          type="submit"
          className="btn"
          disabled={isLoading || !searchInput.trim()}
          style={{ whiteSpace: 'nowrap' }}
        >
          {isLoading ? '…' : 'Search'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div style={{
          padding: '12px 16px', borderRadius: 8,
          background: '#FFEBEE', border: '1px solid #FFCDD2', color: '#B71C1C',
          fontSize: 14,
        }}>
          {error}
        </div>
      )}

      {/* No user state */}
      {!userId && !isLoading && (
        <div className="card px-6 py-12 text-center">
          <p className="text-lg mb-4" style={{ color: 'var(--text-muted)' }}>
            Complete your profile to get personalized listings
          </p>
          <a href="/onboard" className="btn">Get Started</a>
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Results */}
      {!isLoading && validListings.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {validListings.map((listing, i) => (
            <PropertyCard
              key={listing?.raw?.property?.zpid ?? i}
              listing={listing}
              onSave={handleSave}
              savedIds={savedIds}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && validListings.length === 0 && location && (
        <div className="card px-6 py-12 text-center">
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
            No listings found for <strong>{location}</strong>. Try a nearby city or ZIP code.
          </p>
        </div>
      )}

      {/* Cost note */}
      {validListings.length > 0 && (
        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', opacity: 0.7 }}>
          Monthly estimates assume 20% down, 6.168% rate, CO property tax (0.51%), $125/mo insurance. Confirm with a lender.
        </p>
      )}
    </div>
  );
}
