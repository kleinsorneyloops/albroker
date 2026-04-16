'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { passphraseToUserId, passphrasePersona, isValidPassphrase } from '@/lib/passphrase';

const MUST_HAVE_OPTIONS = [
  { value: 'fireplace',  label: 'Fireplace',      icon: '🔥' },
  { value: 'garage',     label: 'Garage',          icon: '🚗' },
  { value: 'ac',         label: 'A/C',             icon: '❄️' },
  { value: 'yard',       label: 'Yard',            icon: '🌿' },
  { value: 'pool',       label: 'Pool',            icon: '🏊' },
  { value: 'view',       label: 'View',            icon: '🏔️' },
  { value: 'laundry',    label: 'In-unit laundry', icon: '🧺' },
  { value: 'basement',   label: 'Basement',        icon: '🏚️' },
  { value: 'office',     label: 'Home office',     icon: '💻' },
  { value: 'patio',      label: 'Patio/deck',      icon: '☀️' },
];

const DEAL_BREAKER_OPTIONS = [
  { value: 'high-hoa',    label: 'High HOA (>$400/mo)' },
  { value: 'busy-street', label: 'Busy street' },
  { value: 'no-garage',   label: 'No parking/garage' },
  { value: 'old-build',   label: 'Pre-1970 build' },
  { value: 'no-ac',       label: 'No A/C' },
  { value: 'small-sqft',  label: 'Under 1,000 sqft' },
  { value: 'no-yard',     label: 'No outdoor space' },
  { value: 'hoa-required', label: 'HOA required' },
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

const BUYER_TYPE_LABELS = {
  first:    'First-time buyer',
  repeat:   'Repeat buyer',
  investor: 'Investor',
};

const NEIGHBORHOOD_OPTIONS = [
  { value: 'urban',    label: 'Urban',    sub: 'City life, walkable, dense',    icon: '🏙️' },
  { value: 'suburban', label: 'Suburban', sub: 'Quiet neighborhoods, drives',   icon: '🏡' },
  { value: 'rural',    label: 'Rural',    sub: 'Space, privacy, land',          icon: '🌾' },
];

const VIEW_OPTIONS = [
  { value: 'Mountain',   label: 'Mountain',   icon: '🏔️' },
  { value: 'City',       label: 'City',       icon: '🌆' },
  { value: 'Park',       label: 'Park',       icon: '🌳' },
  { value: 'Water',      label: 'Water',      icon: '💧' },
  { value: 'Waterfront', label: 'Waterfront', icon: '⚓' },
];

const LOT_OPTIONS = [
  { value: 'any',      label: 'No preference' },
  { value: 'small',    label: 'Small yard',      sub: 'Low maintenance' },
  { value: 'large',    label: 'Large yard',      sub: '10,000+ sqft' },
  { value: 'acreage',  label: 'Acreage',         sub: '1+ acres' },
];

const YEAR_BUILT_OPTIONS = [
  { value: 'any',         label: 'Any era' },
  { value: 'modern',      label: 'Modern',      sub: '2000+' },
  { value: 'established', label: 'Established', sub: '1980–2000' },
  { value: 'historic',    label: 'Historic',    sub: 'Pre-1980' },
];

const HOA_OPTIONS = [
  { value: 'none', label: 'No HOA',  sub: 'Prefer no association' },
  { value: 'low',  label: 'Low OK',  sub: 'Under $200/mo' },
  { value: 'any',  label: 'Any',     sub: 'Not a factor' },
];

function fmt(n) {
  if (!n) return '';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  return `$${(n / 1000).toFixed(0)}k`;
}

function fmtCurrency(raw) {
  if (!raw) return '';
  const n = Number(raw);
  if (isNaN(n)) return '';
  return n.toLocaleString();
}

function SectionHeader({ label, sub }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        fontStyle: 'italic', fontWeight: 800, fontSize: 20,
        color: 'var(--text)',
      }}>
        <span style={{ display: 'block', width: '1.5rem', height: '2px', background: 'var(--color-rocket)', flexShrink: 0 }} />
        {label}
      </div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, paddingLeft: '2rem' }}>{sub}</div>}
    </div>
  );
}

function LayerDivider({ label }) {
  return (
    <div style={{ fontSize: 25, fontWeight: 800, fontStyle: 'italic', color: 'var(--color-teal)', paddingLeft: 2 }}>
      {label}
    </div>
  );
}

function PillGroup({ options, value, onChange, multiSelect = false }) {
  function isActive(v) {
    return multiSelect ? (value || []).includes(v) : value === v;
  }
  function handleClick(v) {
    if (multiSelect) {
      const cur = value || [];
      onChange(cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]);
    } else {
      onChange(value === v ? '' : v);
    }
  }
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map(opt => (
        <button key={opt.value} onClick={() => handleClick(opt.value)} style={{
          padding: '8px 14px', borderRadius: 20, cursor: 'pointer',
          fontSize: 13, fontWeight: isActive(opt.value) ? 700 : 400,
          background: isActive(opt.value) ? 'var(--color-rocket)' : 'var(--bg-card)',
          color: isActive(opt.value) ? '#fff' : 'var(--text)',
          border: isActive(opt.value) ? '1.5px solid var(--color-rocket)' : '1.5px solid var(--border)',
          boxShadow: isActive(opt.value) ? '2px 2px 0 var(--shadow)' : 'none',
          transition: 'all 0.12s', display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        }}>
          {opt.icon && <span style={{ fontSize: 18, marginBottom: 3 }}>{opt.icon}</span>}
          <span>{opt.label}</span>
          {opt.sub && <span style={{ fontSize: 10, opacity: 0.7, fontWeight: 400 }}>{opt.sub}</span>}
        </button>
      ))}
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
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 200,
    }}>
      {status === 'saved' ? '✓ Profile saved' : '✕ Save failed — try again'}
    </div>
  );
}

function computeCompleteness({ budgetMin, budgetMax, bedsMin, location, mustHaves, dealBreakers, neighborhoodChar, hoaTolerance }) {
  let score = 0;
  if (budgetMin || budgetMax)                        score += 25;
  if (bedsMin)                                       score += 10;
  if (location)                                      score += 15;
  if (mustHaves.length > 0)                          score += 15;
  if (dealBreakers.length > 0)                       score += 10;
  if (neighborhoodChar && neighborhoodChar.length > 0) score += 10;
  if (hoaTolerance)                                  score += 5;
  return Math.min(score, 100);
}

// Collapsed summary + dropdown to change
function CollapsibleSelect({ label, value, options, onChange, accentColor = 'var(--color-teal)', placeholder = 'Not set' }) {
  const [open, setOpen] = useState(false);
  const displayLabel = options[value] || placeholder;
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '9px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
          fontSize: 13, fontWeight: value ? 700 : 400,
          background: value ? `color-mix(in oklab, ${accentColor} 12%, var(--bg-card))` : 'var(--bg-card)',
          border: value ? `1.5px solid ${accentColor}` : '1.5px solid var(--border)',
          color: 'var(--text)',
        }}
      >
        <span>{displayLabel}</span>
        <span style={{ fontSize: 10, opacity: 0.5, marginLeft: 8 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: 'var(--bg-card)', border: '1.5px solid var(--border)',
          borderRadius: 8, marginTop: 4, overflow: 'hidden',
          boxShadow: '3px 3px 0 var(--shadow)',
        }}>
          {Object.entries(options).map(([val, lbl]) => (
            <button
              key={val}
              onClick={() => { onChange(val); setOpen(false); }}
              style={{
                width: '100%', padding: '9px 12px', textAlign: 'left', cursor: 'pointer',
                fontSize: 13, fontWeight: value === val ? 700 : 400,
                background: value === val ? `color-mix(in oklab, ${accentColor} 12%, var(--bg-card))` : 'transparent',
                color: 'var(--text)', border: 'none', borderBottom: '1px solid var(--border)',
              }}
            >
              {lbl}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [userId, setUserId]         = useState(null);
  const [passphrase, setPassphrase] = useState('');
  const [copyStatus, setCopyStatus] = useState(null);

  // Passphrase recovery
  const [recoveryInput, setRecoveryInput] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySaved, setRecoverySaved] = useState(false);

  // Personal
  const [buyerType, setBuyerType] = useState('');
  const [timeline, setTimeline]   = useState('');

  // Layer 1 — core
  const [budgetMin, setBudgetMin]         = useState('');
  const [budgetMax, setBudgetMax]         = useState('');
  const [bedsMin, setBedsMin]             = useState('3');
  const [location, setLocation]           = useState('');
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [mustHaves, setMustHaves]         = useState([]);
  const [dealBreakers, setDealBreakers]   = useState([]);

  // Layer 1 — extended search preferences
  const [neighborhoodChar, setNeighborhoodChar] = useState([]);   // multi-select: urban / suburban / rural
  const [viewPref, setViewPref]                 = useState([]);   // multi-select: Mountain / City / Park / Water / Waterfront
  const [lotPref, setLotPref]                   = useState('');
  const [yearBuiltPref, setYearBuiltPref]       = useState('');
  const [hoaTolerance, setHoaTolerance]         = useState('');
  const [sqftMin, setSqftMin]                   = useState('');
  const [sqftMax, setSqftMax]                   = useState('');
  const [commuteAddress, setCommuteAddress]     = useState('');
  const [schoolImportant, setSchoolImportant]   = useState(false);

  // AI insights (read-only)
  const [insights, setInsights]         = useState([]);
  const [completeness, setCompleteness] = useState(0);

  useEffect(() => {
    const id     = localStorage.getItem('albroker_user');
    const phrase = localStorage.getItem('albroker_passphrase');
    if (!id) { router.push('/onboard'); return; }
    setUserId(id);
    if (phrase) setPassphrase(phrase);

    fetch(`/api/profile?userId=${id}`)
      .then(r => r.json())
      .then(data => {
        const p  = data.profile      || {};
        const hp = data.houseProfile || {};
        const ext = hp.inferred_summary?.layer1_extended || {};

        setBuyerType(p.buyerType || '');
        setTimeline(p.purchaseTimeframe || '');
        setBudgetMin(hp.budget_min ? String(hp.budget_min) : '');
        setBudgetMax(hp.budget_max ? String(hp.budget_max) : '');
        setBedsMin(hp.bedrooms_min ? String(hp.bedrooms_min) : '3');

        const explicit = hp.locations_explicit || [];
        const clusters = hp.inferred_summary?.locationClusters || [];
        setLocation(explicit[0]?.name || clusters[0]?.name || p.targetMarket || '');

        setMustHaves(hp.must_haves    || []);
        setDealBreakers(hp.deal_breakers || []);
        setPropertyTypes(hp.inferred_summary?.propertyTypes || []);
        setInsights(hp.inferred_summary?.insights || []);

        setNeighborhoodChar(Array.isArray(ext.neighborhoodChar) ? ext.neighborhoodChar : (ext.neighborhoodChar ? [ext.neighborhoodChar] : []));
        setViewPref(ext.viewPref || []);
        setLotPref(ext.lotPref || '');
        setYearBuiltPref(ext.yearBuiltPref || '');
        setHoaTolerance(ext.hoaTolerance || '');
        setSqftMin(ext.sqftMin ? String(ext.sqftMin) : '');
        setSqftMax(ext.sqftMax ? String(ext.sqftMax) : '');
        setCommuteAddress(ext.commuteAddress || '');
        setSchoolImportant(ext.schoolImportant || false);

        setCompleteness(hp.profile_completeness || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  function saveRecoveryPassphrase() {
    const phrase = recoveryInput.trim().toLowerCase();
    if (!isValidPassphrase(phrase)) {
      setRecoveryError('Must be three words separated by dashes — e.g. quantum-nexus-cartographer');
      return;
    }
    localStorage.setItem('albroker_passphrase', phrase);
    setPassphrase(phrase);
    setRecoverySaved(true);
    setRecoveryError('');
  }

  function copyToClipboard(text, key) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopyStatus(key);
      setTimeout(() => setCopyStatus(null), 2000);
    });
  }

  function getShareUrl() {
    if (!passphrase) return '';
    return `${window.location.origin}/profile/share/${encodeURIComponent(passphrase)}`;
  }

  function getMailtoLink() {
    if (!passphrase) return '#';
    const subject = encodeURIComponent('My Al Broker access code');
    const body = encodeURIComponent(
      `My Al Broker passphrase: ${passphrase}\n\nView my buyer profile:\n${getShareUrl()}\n\nSign in at: ${window.location.origin}/onboard`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  }

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const locationClusters = location.trim()
        ? [{ name: location.trim(), count: 1 }]
        : [];

      const layer1_extended = {
        neighborhoodChar: neighborhoodChar.length > 0 ? neighborhoodChar : null,
        viewPref:       viewPref.length > 0 ? viewPref : null,
        lotPref,
        yearBuiltPref,
        hoaTolerance,
        sqftMin:        sqftMin ? Number(sqftMin) : null,
        sqftMax:        sqftMax ? Number(sqftMax) : null,
        commuteAddress: commuteAddress.trim() || null,
        schoolImportant,
      };

      const newCompleteness = computeCompleteness({
        budgetMin, budgetMax, bedsMin, location, mustHaves, dealBreakers,
        neighborhoodChar, hoaTolerance,
      });

      const houseProfile = {
        budget_min:         budgetMin ? Number(budgetMin) : null,
        budget_max:         budgetMax ? Number(budgetMax) : null,
        budget_confirmed:   !!(budgetMin || budgetMax),
        bedrooms_min:       bedsMin ? Number(bedsMin) : 3,
        must_haves:         mustHaves,
        deal_breakers:      dealBreakers,
        locations_explicit: location.trim() ? [{ name: location.trim() }] : [],
        inferred_summary: {
          insights,
          locationClusters,
          propertyTypes,
          layer1_extended,
          priceRange: {
            serious_min: budgetMin ? Number(budgetMin) : null,
            serious_max: budgetMax ? Number(budgetMax) : null,
          },
        },
        profile_completeness: newCompleteness,
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

      setCompleteness(newCompleteness);
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
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 80 }}>

      {/* ── Page header ── */}
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

      {/* ── Access code ── */}
      <div className="card" style={{ padding: '20px 20px 16px', background: '#1a2530', border: '1.5px solid var(--color-teal)' }}>
        <SectionHeader label="Your access code" />
        {passphrase ? (
          <>
            <div style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', fontWeight: 800, color: '#fff', fontFamily: 'monospace', letterSpacing: '0.06em', marginBottom: 4 }}>
              {passphrase}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', marginBottom: 16 }}>
              {passphrasePersona(passphrase)}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => copyToClipboard(passphrase, 'phrase')} style={{
                fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace',
                background: copyStatus === 'phrase' ? 'var(--color-teal)' : 'rgba(255,255,255,0.08)',
                color: copyStatus === 'phrase' ? '#1a2530' : 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.15s',
              }}>
                {copyStatus === 'phrase' ? '✓ Copied' : 'Copy passphrase'}
              </button>
              <a href={getMailtoLink()} target="_blank" rel="noreferrer" style={{
                fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 6,
                cursor: 'pointer', fontFamily: 'monospace', textDecoration: 'none', display: 'inline-block',
                background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                Email it to me →
              </a>
              <button onClick={() => copyToClipboard(getShareUrl(), 'link')} style={{
                fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace',
                background: copyStatus === 'link' ? 'var(--color-teal)' : 'rgba(255,255,255,0.08)',
                color: copyStatus === 'link' ? '#1a2530' : 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.15s',
              }}>
                {copyStatus === 'link' ? '✓ Link copied' : 'Copy profile link'}
              </button>
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
              Share the profile link with your agent for a read-only view. Anyone with the link can see your profile.
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>
              Your passphrase isn&apos;t saved in this browser. Enter it below to restore access code features.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text" value={recoveryInput}
                onChange={e => { setRecoveryInput(e.target.value); setRecoveryError(''); setRecoverySaved(false); }}
                onKeyDown={e => e.key === 'Enter' && saveRecoveryPassphrase()}
                placeholder="quantum-nexus-cartographer"
                style={{
                  flex: 1, padding: '9px 12px', fontSize: 13, borderRadius: 6,
                  border: `1.5px solid ${recoveryError ? '#DC2626' : 'rgba(255,255,255,0.15)'}`,
                  background: 'rgba(255,255,255,0.06)', color: '#fff',
                  fontFamily: 'monospace', outline: 'none',
                }}
              />
              <button onClick={saveRecoveryPassphrase} style={{
                padding: '9px 14px', borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace',
                fontSize: 12, fontWeight: 700, flexShrink: 0,
                background: recoverySaved ? 'var(--color-teal)' : 'rgba(255,255,255,0.1)',
                color: recoverySaved ? '#1a2530' : 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                {recoverySaved ? '✓ Saved' : 'Save →'}
              </button>
            </div>
            {recoveryError && <p style={{ fontSize: 12, color: '#FC8181', margin: 0 }}>{recoveryError}</p>}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      <LayerDivider label="Layer 1 — By the numbers" />

      {/* ── About you ── */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="About you" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <CollapsibleSelect
            label="Buyer type"
            value={buyerType}
            options={BUYER_TYPE_LABELS}
            onChange={setBuyerType}
            accentColor="var(--color-teal)"
          />
          <CollapsibleSelect
            label="Timeline"
            value={timeline}
            options={TIMELINE_LABELS}
            onChange={setTimeline}
            accentColor="var(--color-rocket)"
          />
        </div>
      </div>

      {/* ── Budget ── */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="Budget" />
        <style>{`
          input.budget-input[type=text]::-webkit-outer-spin-button,
          input.budget-input[type=text]::-webkit-inner-spin-button { display: none; }
          input.budget-input[type=text] { -moz-appearance: textfield; }
        `}</style>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            ['Min price', budgetMin, setBudgetMin, '200,000'],
            ['Max price', budgetMax, setBudgetMax, '600,000'],
          ].map(([label, val, setter, ph]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 14, color: val ? 'var(--text)' : 'var(--text-muted)', pointerEvents: 'none',
                }}>$</span>
                <input
                  type="text"
                  className="budget-input"
                  value={fmtCurrency(val)}
                  onChange={e => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    setter(raw);
                  }}
                  placeholder={ph}
                  style={{
                    width: '100%', padding: '10px 12px 10px 26px', fontSize: 14, borderRadius: 8,
                    border: '1.5px solid var(--border)', background: 'var(--bg-card)',
                    color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Location & size ── */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="Location & size" />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, alignItems: 'start', marginBottom: 16 }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['Min sqft', sqftMin, setSqftMin, '1000'], ['Max sqft', sqftMax, setSqftMax, '3000']].map(([label, val, setter, ph]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
              <input
                type="text" value={val} onChange={e => setter(e.target.value.replace(/[^0-9]/g, ''))} placeholder={ph}
                style={{
                  width: '100%', padding: '10px 12px', fontSize: 14, borderRadius: 8,
                  border: '1.5px solid var(--border)', background: 'var(--bg-card)',
                  color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Property type ── */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="Property type" sub="Select all that apply. Leave blank to search all types." />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PROPERTY_TYPES.map(({ value, label }) => {
            const active = propertyTypes.includes(value);
            return (
              <button key={value} onClick={() => setPropertyTypes(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])} style={{
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
      </div>

      {/* ── Must-haves ── */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="Must-haves" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {MUST_HAVE_OPTIONS.map(({ value, label, icon }) => {
            const active = mustHaves.includes(value);
            return (
              <button key={value} onClick={() => setMustHaves(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])} style={{
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

      {/* ── Deal-breakers ── */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="Deal-breakers" />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DEAL_BREAKER_OPTIONS.map(({ value, label }) => {
            const active = dealBreakers.includes(value);
            return (
              <button key={value} onClick={() => setDealBreakers(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])} style={{
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

      {/* ════════════════════════════════════════════════════════════════ */}
      <LayerDivider label="Search preferences" />

      {/* ── Neighborhood character ── */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="Neighborhood character" sub="Select all that apply." />
        <PillGroup options={NEIGHBORHOOD_OPTIONS} value={neighborhoodChar} onChange={setNeighborhoodChar} multiSelect={true} />
      </div>

      {/* ── Views ── */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="Views" sub="Select any view types that are important to you." />
        <PillGroup options={VIEW_OPTIONS} value={viewPref} onChange={setViewPref} multiSelect={true} />
      </div>

      {/* ── Outdoor space ── */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="Outdoor space" sub="How much land matters to you?" />
        <PillGroup options={LOT_OPTIONS} value={lotPref} onChange={setLotPref} />
      </div>

      {/* ── Build era ── */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="Build era" sub="Do you have a preference for when the home was built?" />
        <PillGroup options={YEAR_BUILT_OPTIONS} value={yearBuiltPref} onChange={setYearBuiltPref} />
      </div>

      {/* ── HOA preference ── */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="HOA preference" sub="How do you feel about homeowner associations?" />
        <PillGroup options={HOA_OPTIONS} value={hoaTolerance} onChange={setHoaTolerance} />
      </div>

      {/* ── Commute & schools ── */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <SectionHeader label="Commute & schools" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Commute destination (optional)</div>
            <input
              type="text" value={commuteAddress} onChange={e => setCommuteAddress(e.target.value)}
              placeholder="e.g. Downtown Denver, or a ZIP code"
              style={{
                width: '100%', padding: '10px 12px', fontSize: 14, borderRadius: 8,
                border: '1.5px solid var(--border)', background: 'var(--bg-card)',
                color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Used to surface commute time signals on listings.</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>School districts</div>
            <button onClick={() => setSchoolImportant(!schoolImportant)} style={{
              padding: '9px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13,
              fontWeight: schoolImportant ? 700 : 400,
              background: schoolImportant ? 'color-mix(in oklab, var(--color-teal) 15%, var(--bg-card))' : 'var(--bg-card)',
              border: schoolImportant ? '1.5px solid var(--color-teal)' : '1.5px solid var(--border)',
              color: 'var(--text)', transition: 'all 0.12s',
            }}>
              {schoolImportant ? '✓ ' : ''}School district is important to me
            </button>
          </div>
        </div>
      </div>

      {/* ── AI insights (read-only) ── */}
      {insights.length > 0 && (
        <div className="card" style={{ padding: '20px 20px 16px' }}>
          <SectionHeader label="What Al noticed from your saves" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {insights.map((insight, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8,
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

      {/* ── Save ── */}
      <button onClick={handleSave} disabled={saving} className="btn btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
        {saving ? 'Saving…' : 'Save profile →'}
      </button>

      <SaveBanner status={saveStatus} />
      <style>{`@keyframes pulse{0%,100%{opacity:0.4}50%{opacity:0.7}}`}</style>
    </div>
  );
}
