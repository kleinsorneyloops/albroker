'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const MUST_HAVE_OPTIONS = [
  { value: 'fireplace',  label: 'Fireplace',      icon: '🔥' },
  { value: 'garage',     label: 'Garage',          icon: '🚗' },
  { value: 'ac',         label: 'A/C',             icon: '❄️' },
  { value: 'yard',       label: 'Yard',            icon: '🌿' },
  { value: 'pool',       label: 'Pool',            icon: '🏊' },
  { value: 'view',       label: 'View',            icon: '🏔️' },
  { value: 'laundry',    label: 'In-unit laundry', icon: '🧺' },
  { value: 'basement',   label: 'Basement',        icon: '🏚️' },
];

const DEAL_BREAKER_OPTIONS = [
  { value: 'high-hoa',    label: 'High HOA (>$400/mo)' },
  { value: 'busy-street', label: 'Busy street' },
  { value: 'no-garage',   label: 'No parking/garage' },
  { value: 'old-build',   label: 'Pre-1970 build' },
  { value: 'no-ac',       label: 'No A/C' },
  { value: 'small-sqft',  label: 'Under 1,000 sqft' },
];

const PROPERTY_TYPES = [
  { value: 'Houses',        label: 'Single Family' },
  { value: 'Townhomes',     label: 'Townhome' },
  { value: 'Condos/Co-ops', label: 'Condo' },
  { value: 'Multi-family',  label: 'Multi-family' },
];

const TIMELINE_LABELS = {
  exploring: 'Just exploring',
  '3mo':     'Within 3 months',
  '6mo':     '3–6 months',
  '12mo':    '6–12 months',
  '2yr':     '1–2 years',
  none:      'No set timeline',
};

function fmt(n) {
  if (!n) return '';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  return `$${(n / 1000).toFixed(0)}k`;
}

function SectionHeader({ label }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'var(--text-muted)',
      fontFamily: 'monospace', marginBottom: 12,
    }}>
      ◈ {label}
    </div>
  );
}

function SaveBanner({ status }) {
  if (!status) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: status === 'saved' ? 'var(--color-teal)' : '#DC2626',
      color: status === 'saved' ? '#1a2530' : '#fff',
      padding: '10px 20px', borderRadius: 8, fontWeight: 700,
      fontSize: 13, fontFamily: 'monospace',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      zIndex: 200,
    }}>
      {status === 'saved' ? '✓ Profile saved' : '✕ Save failed — try again'}
    </div>
  );
}

function computeCompleteness({ budgetMin, budgetMax, bedsMin, location, mustHaves, dealBreakers }) {
  let score = 0;
  if (budgetMin || budgetMax) score += 30;
  if (bedsMin)                score += 15;
  if (location)               score += 20;
  if (mustHaves.length > 0)   score += 20;
  if (dealBreakers.length > 0) score += 15;
  return score;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [userId, setUserId]       = useState(null);

  // Personal
  const [buyerType, setBuyerType] = useState('');
  const [timeline, setTimeline]   = useState('');

  // House
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [bedsMin, setBedsMin]     = useState('3');
  const [location, setLocation]   = useState('');
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [mustHaves, setMustHaves]         = useState([]);
  const [dealBreakers, setDealBreakers]   = useState([]);

  // Read-only insights from onboarding
  const [insights, setInsights]         = useState([]);
  const [completeness, setCompleteness] = useState(0);

  useEffect(() => {
    const id = localStorage.getItem('albroker_user');
    if (!id) { router.push('/onboard'); return; }
    setUserId(id);

    fetch(`/api/profile?userId=${id}`)
      .then(r => r.json())
      .then(data => {
        const p  = data.profile      || {};
        const hp = data.houseProfile || {};

        setBuyerType(p.buyerType || '');
        setTimeline(p.purchaseTimeframe || '');

        setBudgetMin(hp.budget_min ? String(hp.budget_min) : '');
        setBudgetMax(hp.budget_max ? String(hp.budget_max) : '');
        setBedsMin(hp.bedrooms_min ? String(hp.bedrooms_min) : '3');

        // Location from explicit list, then inferred clusters, then personal profile
        const explicit  = hp.locations_explicit || [];
        const clusters  = hp.inferred_summary?.locationClusters || [];
        const loc = explicit[0]?.name || clusters[0]?.name || p.targetMarket || '';
        setLocation(loc);

        setMustHaves(hp.must_haves    || []);
        setDealBreakers(hp.deal_breakers || []);
        setPropertyTypes(hp.inferred_summary?.propertyTypes || []);
        setInsights(hp.inferred_summary?.insights || []);
        setCompleteness(hp.profile_completeness || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  function toggleItem(list, setList, value) {
    setList(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  }

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const locationClusters = location.trim()
        ? [{ name: location.trim(), count: 1 }]
        : [];

      // property_types stored in inferred_summary since no dedicated column exists yet
      const houseProfile = {
        budget_min:       budgetMin ? Number(budgetMin) : null,
        budget_max:       budgetMax ? Number(budgetMax) : null,
        budget_confirmed: !!(budgetMin || budgetMax),
        bedrooms_min:     bedsMin ? Number(bedsMin) : 3,
        must_haves:       mustHaves,
        deal_breakers:    dealBreakers,
        locations_explicit: location.trim() ? [{ name: location.trim() }] : [],
        inferred_summary: {
          insights,
          locationClusters,
          propertyTypes: propertyTypes,
          priceRange: {
            serious_min: budgetMin ? Number(budgetMin) : null,
            serious_max: budgetMax ? Number(budgetMax) : null,
          },
        },
        profile_completeness: computeCompleteness({
          budgetMin, budgetMax, bedsMin, location, mustHaves, dealBreakers,
        }),
      };

      const profile = {
        buyerType,
        purchaseTimeframe: timeline,
        targetMarket: location.trim() || null,
      };

      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, profile }),
      });

      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, houseProfile }),
      });

      setCompleteness(computeCompleteness({ budgetMin, budgetMax, bedsMin, location, mustHaves, dealBreakers }));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2500);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: 13 }}>
        Loading your profile…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 80 }}>

      {/* Header */}
      <div>
        <h1 style={{ marginBottom: 6 }}>Your profile</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          These preferences drive your listings search. Update them anytime.
        </p>
        {completeness > 0 && (
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--border)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 2, background: 'var(--color-teal)', width: `${completeness}%`, transition: 'width 0.4s' }} />
            </div>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)', flexShrink: 0 }}>
              {completeness}% complete
            </span>
          </div>
        )}
      </div>

      {/* About you */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="About you" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Buyer type</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[['first', 'First-time buyer'], ['repeat', 'Repeat buyer'], ['investor', 'Investor']].map(([val, label]) => (
                <button key={val} onClick={() => setBuyerType(val)} style={{
                  padding: '8px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  fontSize: 13, fontWeight: buyerType === val ? 700 : 400,
                  background: buyerType === val ? 'color-mix(in oklab, var(--color-teal) 15%, var(--bg-card))' : 'var(--bg-card)',
                  border: buyerType === val ? '1.5px solid var(--color-teal)' : '1.5px solid var(--border)',
                  color: 'var(--text)',
                }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Timeline</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(TIMELINE_LABELS).map(([val, label]) => (
                <button key={val} onClick={() => setTimeline(val)} style={{
                  padding: '8px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  fontSize: 13, fontWeight: timeline === val ? 700 : 400,
                  background: timeline === val ? 'color-mix(in oklab, var(--color-rocket) 12%, var(--bg-card))' : 'var(--bg-card)',
                  border: timeline === val ? '1.5px solid var(--color-rocket)' : '1.5px solid var(--border)',
                  color: 'var(--text)',
                }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Budget */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="Budget" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['Min price', budgetMin, setBudgetMin, '200000'], ['Max price', budgetMax, setBudgetMax, '600000']].map(([label, val, setter, ph]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
              <input
                type="number" value={val} onChange={e => setter(e.target.value)} placeholder={ph}
                style={{
                  width: '100%', padding: '10px 12px', fontSize: 14, borderRadius: 8,
                  border: '1.5px solid var(--border)', background: 'var(--bg-card)',
                  color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
                }}
              />
              {val && <div style={{ fontSize: 11, color: 'var(--color-rocket)', marginTop: 4, fontFamily: 'monospace' }}>{fmt(Number(val))}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Location & beds */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="Location & size" />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Where are you looking?</div>
            <input
              type="text" value={location} onChange={e => setLocation(e.target.value)}
              placeholder="City, region, or ZIP — e.g. Fort Collins CO"
              style={{
                width: '100%', padding: '10px 12px', fontSize: 14, borderRadius: 8,
                border: '1.5px solid var(--border)', background: 'var(--bg-card)',
                color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Min bedrooms</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['1','2','3','4','5'].map(n => (
                <button key={n} onClick={() => setBedsMin(n)} style={{
                  flex: 1, padding: '10px 0', borderRadius: 8, cursor: 'pointer',
                  fontSize: 14, fontWeight: bedsMin === n ? 700 : 400,
                  background: bedsMin === n ? 'var(--color-teal)' : 'var(--bg-card)',
                  color: bedsMin === n ? '#1a2530' : 'var(--text)',
                  border: bedsMin === n ? '1.5px solid var(--color-teal)' : '1.5px solid var(--border)',
                }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Property type */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="Property type" />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PROPERTY_TYPES.map(({ value, label }) => {
            const active = propertyTypes.includes(value);
            return (
              <button key={value} onClick={() => toggleItem(propertyTypes, setPropertyTypes, value)} style={{
                padding: '8px 16px', borderRadius: 20, cursor: 'pointer',
                fontSize: 13, fontWeight: active ? 700 : 400,
                background: active ? 'var(--color-rocket)' : 'var(--bg-card)',
                color: active ? '#fff' : 'var(--text)',
                border: active ? '1.5px solid var(--color-rocket)' : '1.5px solid var(--border)',
                boxShadow: active ? '2px 2px 0 var(--shadow)' : 'none',
                transition: 'all 0.12s',
              }}>
                {label}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Leave blank to search all types.</div>
      </div>

      {/* Must-haves */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="Must-haves" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {MUST_HAVE_OPTIONS.map(({ value, label, icon }) => {
            const active = mustHaves.includes(value);
            return (
              <button key={value} onClick={() => toggleItem(mustHaves, setMustHaves, value)} style={{
                padding: '12px 8px', borderRadius: 10, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                background: active ? 'color-mix(in oklab, var(--color-teal) 15%, var(--bg-card))' : 'var(--bg-card)',
                border: active ? '1.5px solid var(--color-teal)' : '1.5px solid var(--border)',
                boxShadow: active ? '2px 2px 0 var(--color-teal)' : 'none',
                transition: 'all 0.12s',
              }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <span style={{ fontSize: 11, fontWeight: active ? 700 : 400, color: 'var(--text)', textAlign: 'center' }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deal-breakers */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="Deal-breakers" />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DEAL_BREAKER_OPTIONS.map(({ value, label }) => {
            const active = dealBreakers.includes(value);
            return (
              <button key={value} onClick={() => toggleItem(dealBreakers, setDealBreakers, value)} style={{
                padding: '8px 14px', borderRadius: 20, cursor: 'pointer',
                fontSize: 13, fontWeight: active ? 700 : 400,
                background: active ? 'color-mix(in oklab, #DC2626 12%, var(--bg-card))' : 'var(--bg-card)',
                color: active ? '#DC2626' : 'var(--text)',
                border: active ? '1.5px solid #DC2626' : '1.5px solid var(--border)',
                transition: 'all 0.12s',
              }}>
                {active ? '✕ ' : ''}{label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Insights (read-only) */}
      {insights.length > 0 && (
        <div className="card" style={{ padding: '20px 20px 16px' }}>
          <SectionHeader label="What Al noticed from your saves" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {insights.map((insight, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 8,
                background: 'color-mix(in oklab, var(--color-teal) 6%, var(--bg-card))',
                border: '1px solid color-mix(in oklab, var(--color-teal) 20%, transparent)',
              }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{insight.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{insight.signal}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{insight.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
            Detected from your onboarding picks. Updates as you save more homes.
          </div>
        </div>
      )}

      {/* Save */}
      <button onClick={handleSave} disabled={saving} className="btn btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
        {saving ? 'Saving…' : 'Save profile →'}
      </button>

      <SaveBanner status={saveStatus} />
      <style>{`@keyframes pulse{0%,100%{opacity:0.4}50%{opacity:0.7}}`}</style>
    </div>
  );
}
