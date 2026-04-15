'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { generatePassphrase, passphraseToUserId, isValidPassphrase, passphrasePersona } from '@/lib/passphrase';

// ── Constants ─────────────────────────────────────────────────────────────────

const BUDGET_MIN       = 100000;
const BUDGET_MAX       = 1500000;
const BUDGET_STEP      = 25000;
const MIN_SELECTIONS   = 5;   // minimum saves before pattern analysis fires (both paths)

const TIMELINE_OPTIONS = [
  { value: 'exploring',  label: 'Just exploring',   icon: '🔭', sub: 'No rush' },
  { value: '3mo',        label: 'Within 3 months',  icon: '⚡', sub: 'Moving fast' },
  { value: '6mo',        label: '3–6 months',       icon: '📡', sub: 'Active search' },
  { value: '12mo',       label: '6–12 months',      icon: '🛸', sub: 'Planning ahead' },
  { value: '2yr',        label: '1–2 years',        icon: '🌌', sub: 'Long range' },
  { value: 'none',       label: 'No set timeline',  icon: '∞',  sub: 'When it\'s right' },
];

const STAGE_OPTIONS = [
  { value: 'first',    label: 'First-time buyer',  icon: '🚀', sub: 'New to this' },
  { value: 'repeat',   label: 'Repeat buyer',      icon: '🛰', sub: 'Done it before' },
  { value: 'investor', label: 'Investor',          icon: '📊', sub: 'Building portfolio' },
];

function fmtMoney(n) {
  if (n >= 1000000) {
    const m = n / 1000000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  return `$${(n / 1000).toFixed(0)}k`;
}

function fmtMoneyFull(n) {
  return '$' + Math.round(n).toLocaleString();
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function ScreenLabel({ step, total, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width: i === step - 1 ? 20 : 6, height: 6, borderRadius: 3,
            background: i < step ? 'var(--color-teal)' : 'var(--border)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
        {label}
      </span>
    </div>
  );
}

// ── Screen 1: Passphrase + Privacy ────────────────────────────────────────────

function PassphraseScreen({ onNew, onReturning }) {
  const [phrase, setPhrase] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate passphrase client-side only to avoid server/client mismatch
  useEffect(() => {
    setPhrase(generatePassphrase());
  }, []);

  function regenerate() { setPhrase(generatePassphrase()); setCopied(false); }

  function copy() {
    navigator.clipboard?.writeText(phrase).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <ScreenLabel step={1} total={5} label="Identity · No account needed" />

      <div>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.15, marginBottom: 10 }}>
          Your access code
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: 14 }}>
          No email. No password. Just three words that are yours.
          Use them on any device to return to your profile.
        </p>
      </div>

      {/* Passphrase card */}
      <div style={{
        background: '#1a2530',
        border: '2px solid var(--color-teal)',
        borderRadius: 14,
        padding: '24px 20px',
        boxShadow: '5px 5px 0 var(--color-teal)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(var(--color-teal) 1px, transparent 1px), linear-gradient(90deg, var(--color-teal) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }} />

        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: 10, fontFamily: 'monospace' }}>
          ◈ your passphrase
        </div>
        <div style={{
          fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: 800,
          color: '#ffffff', fontFamily: 'monospace', letterSpacing: '0.06em',
          marginBottom: 10, wordBreak: 'break-all', lineHeight: 1.3,
        }}>
          {phrase}
        </div>
        <div style={{
          fontSize: 12, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic',
          marginBottom: 18, lineHeight: 1.4,
        }}>
          {passphrasePersona(phrase)}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: copied ? '✓ Copied' : 'Copy', onClick: copy, primary: copied },
            { label: '↺ New phrase', onClick: regenerate, primary: false },
          ].map(btn => (
            <button key={btn.label} onClick={btn.onClick} style={{
              fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 6,
              cursor: 'pointer', fontFamily: 'monospace',
              background: btn.primary ? 'var(--color-teal)' : 'rgba(255,255,255,0.08)',
              color: btn.primary ? '#1a2530' : 'rgba(255,255,255,0.7)',
              border: btn.primary ? 'none' : '1px solid rgba(255,255,255,0.15)',
              transition: 'all 0.15s',
            }}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Write-it-down warning */}
      <div style={{
        display: 'flex', gap: 10, alignItems: 'flex-start',
        background: 'color-mix(in oklab, #FF7043 8%, transparent)',
        border: '1px solid color-mix(in oklab, #FF7043 25%, transparent)',
        borderRadius: 8, padding: '12px 14px', fontSize: 13, color: 'var(--text)',
      }}>
        <span style={{ flexShrink: 0, marginTop: 1 }}>⚠</span>
        <span><strong>Write this down.</strong> We don't store it — there's no recovery if you lose it. That's the privacy trade-off.</span>
      </div>

      {/* Privacy promise */}
      <div style={{
        background: 'color-mix(in oklab, var(--color-teal) 6%, transparent)',
        border: '1px solid color-mix(in oklab, var(--color-teal) 20%, transparent)',
        borderRadius: 10, padding: '16px 18px',
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-teal)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
          ◈ Privacy promise
        </div>
        {[
          'Al Broker never sells your data. Not now, not ever.',
          'Your profile is yours. Agents only see what you choose to share.',
          'Every time your information is shared with anyone, you elect to do it.',
          'No ads. No third-party trackers. No surprise emails.',
        ].map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text)', marginBottom: i < 3 ? 6 : 0, lineHeight: 1.5 }}>
            <span style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: 1 }}>✓</span>
            <span>{line}</span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => onNew(phrase)} className="btn btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
          I've saved it — let's go →
        </button>
        <button onClick={onReturning} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, color: 'var(--text-muted)', padding: '4px 0', textAlign: 'center',
        }}>
          I already have a passphrase →
        </button>
      </div>
    </div>
  );
}

// ── Screen 1b: Returning user ─────────────────────────────────────────────────

function ReturningScreen({ onBack, onSignIn }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const phrase = input.trim().toLowerCase();
    if (!isValidPassphrase(phrase)) {
      setError('Three words separated by dashes — e.g. quantum-beacon-locked');
      return;
    }
    setLoading(true);
    setError('');
    const result = await onSignIn(phrase);
    if (result === 'not-found') {
      setError('No profile found for that passphrase. Double-check your spelling.');
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--color-teal)', alignSelf: 'flex-start' }}>
        ← Back
      </button>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Welcome back</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Enter your three-word passphrase to return to your profile.</p>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text" value={input} onChange={e => { setInput(e.target.value); setError(''); }}
          placeholder="quantum-beacon-locked" autoFocus
          style={{
            padding: '14px 16px', fontSize: 16, borderRadius: 8,
            border: `1.5px solid ${error ? '#DC2626' : 'var(--border)'}`,
            background: 'var(--bg-card)', color: 'var(--text)',
            fontFamily: 'monospace', outline: 'none', letterSpacing: '0.04em',
          }}
        />
        {error && <p style={{ fontSize: 13, color: '#DC2626' }}>{error}</p>}
        <button type="submit" className="btn btn-lg" disabled={!input.trim() || loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Looking up your profile…' : 'Sign in →'}
        </button>
      </form>
    </div>
  );
}

// ── Screen 2: Interactive preferences ────────────────────────────────────────

function DualRangeSlider({ min, max, step, valueMin, valueMax, onChange }) {
  const trackRef = useRef(null);
  const dragging = useRef(null);

  function posToValue(pos) {
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (pos - rect.left) / rect.width));
    return Math.round((min + pct * (max - min)) / step) * step;
  }

  function onMouseDown(handle, e) {
    e.preventDefault();
    dragging.current = handle;

    function onMove(ev) {
      const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const val = posToValue(clientX);
      if (dragging.current === 'min') onChange(Math.min(val, valueMax - step), valueMax);
      else onChange(valueMin, Math.max(val, valueMin + step));
    }

    function onUp() {
      dragging.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
  }

  const pctMin = ((valueMin - min) / (max - min)) * 100;
  const pctMax = ((valueMax - min) / (max - min)) * 100;

  return (
    <div style={{ padding: '8px 0 4px' }}>
      {/* Value display */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Min</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-rocket)', fontFamily: 'monospace' }}>{fmtMoney(valueMin)}</div>
        </div>
        <div style={{ alignSelf: 'flex-end', fontSize: 18, color: 'var(--border)', marginBottom: 4 }}>→</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Max</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-rocket)', fontFamily: 'monospace' }}>{fmtMoney(valueMax)}</div>
        </div>
      </div>

      {/* Track */}
      <div ref={trackRef} style={{ position: 'relative', height: 8, borderRadius: 4, background: 'var(--border)', cursor: 'pointer', userSelect: 'none' }}>
        {/* Active range */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, borderRadius: 4,
          background: 'var(--color-teal)',
          left: `${pctMin}%`, right: `${100 - pctMax}%`,
        }} />
        {/* Min handle */}
        {['min', 'max'].map((handle) => {
          const pct = handle === 'min' ? pctMin : pctMax;
          return (
            <div key={handle}
              onMouseDown={e => onMouseDown(handle, e)}
              onTouchStart={e => onMouseDown(handle, e)}
              style={{
                position: 'absolute', top: '50%',
                left: `${pct}%`, transform: 'translate(-50%, -50%)',
                width: 22, height: 22, borderRadius: '50%',
                background: 'var(--color-teal)',
                border: '3px solid white',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                cursor: 'grab', zIndex: 2,
                transition: 'transform 0.1s',
              }}
            />
          );
        })}
      </div>

      {/* Scale labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {[BUDGET_MIN, 400000, 700000, 1000000, BUDGET_MAX].map(v => (
          <span key={v} style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{fmtMoney(v)}</span>
        ))}
      </div>
    </div>
  );
}

function PreferencesScreen({ onComplete }) {
  const [budgetMin, setBudgetMin] = useState(250000);
  const [budgetMax, setBudgetMax] = useState(750000);
  const [timeline, setTimeline] = useState(null);
  const [stage, setStage] = useState(null);
  const [location, setLocation] = useState('');

  const isComplete = timeline && stage;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <ScreenLabel step={2} total={5} label="Profile seed" />
      <div>
        <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.15, marginBottom: 8 }}>
          Tell Al about your search
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
          Three questions. You can refine everything later as you browse.
        </p>
      </div>

      {/* Budget range slider */}
      <div className="card" style={{ padding: '20px 20px 16px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 16, fontFamily: 'monospace' }}>
          ◈ Budget range
        </div>
        <DualRangeSlider
          min={BUDGET_MIN} max={BUDGET_MAX} step={BUDGET_STEP}
          valueMin={budgetMin} valueMax={budgetMax}
          onChange={(mn, mx) => { setBudgetMin(mn); setBudgetMax(mx); }}
        />
      </div>

      {/* Timeline */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 14, fontFamily: 'monospace' }}>
          ◈ When are you looking to buy?
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {TIMELINE_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setTimeline(opt.value)}
              style={{
                padding: '12px 8px', borderRadius: 10, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                background: timeline === opt.value ? 'var(--color-rocket)' : 'var(--bg-card)',
                color: timeline === opt.value ? '#fff' : 'var(--text)',
                border: timeline === opt.value ? '2px solid var(--color-rocket)' : '1.5px solid var(--border)',
                boxShadow: timeline === opt.value ? '3px 3px 0 var(--shadow)' : 'none',
                transition: 'all 0.12s',
              }}>
              <span style={{ fontSize: 20 }}>{opt.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2, textAlign: 'center' }}>{opt.label}</span>
              <span style={{ fontSize: 10, opacity: 0.7, textAlign: 'center' }}>{opt.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Buyer stage */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 14, fontFamily: 'monospace' }}>
          ◈ What kind of buyer are you?
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {STAGE_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setStage(opt.value)}
              style={{
                padding: '14px 10px', borderRadius: 10, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                background: stage === opt.value ? 'color-mix(in oklab, var(--color-teal) 15%, var(--bg-card))' : 'var(--bg-card)',
                color: 'var(--text)',
                border: stage === opt.value ? '2px solid var(--color-teal)' : '1.5px solid var(--border)',
                boxShadow: stage === opt.value ? '3px 3px 0 var(--color-teal)' : 'none',
                transition: 'all 0.12s',
              }}>
              <span style={{ fontSize: 22 }}>{opt.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{opt.label}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{opt.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10, fontFamily: 'monospace' }}>
          ◈ Where are you looking? <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
        </div>
        <input
          type="text" value={location} onChange={e => setLocation(e.target.value)}
          placeholder="City, region, or state — e.g. Gunnison CO"
          style={{
            width: '100%', padding: '12px 14px', fontSize: 14, borderRadius: 8,
            border: '1.5px solid var(--border)', background: 'var(--bg-card)',
            color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      <button
        onClick={() => onComplete({ budgetMin, budgetMax, timeline, stage, location })}
        className="btn btn-lg" disabled={!isComplete}
        style={{ width: '100%', justifyContent: 'center' }}>
        Show me listings →
      </button>
    </div>
  );
}

// ── Screen 3: Live listings demo ──────────────────────────────────────────────

function ListingDemoCard({ listing, selected, onToggle }) {
  const p = listing?.raw?.property ?? listing;
  if (!p) return null;

  const address = p.address?.streetAddress ?? '—';
  const city    = p.address?.city ?? '';
  const state   = p.address?.state ?? '';
  const price   = p.price?.value;
  const beds    = p.bedrooms;
  const sqft    = p.livingArea;
  const photo   = p.media?.propertyPhotoLinks?.mediumSizeLink;

  return (
    <button onClick={onToggle} style={{
      all: 'unset', display: 'block', cursor: 'pointer',
      borderRadius: 12, overflow: 'hidden',
      border: selected ? '3px solid var(--color-teal)' : '2px solid var(--border)',
      boxShadow: selected ? '4px 4px 0 var(--color-teal)' : '2px 2px 0 var(--border)',
      transition: 'all 0.15s', position: 'relative',
      transform: selected ? 'translateY(-2px)' : 'none',
    }}>
      {/* Selected checkmark */}
      {selected && (
        <div style={{
          position: 'absolute', top: 8, right: 8, zIndex: 2,
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--color-teal)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#1a2530',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }}>✓</div>
      )}
      {/* Photo */}
      <div style={{ height: 140, background: 'var(--border)', overflow: 'hidden', position: 'relative' }}>
        {photo
          ? <img src={photo} alt={address} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🏠</div>
        }
        {selected && (
          <div style={{ position: 'absolute', inset: 0, background: 'color-mix(in oklab, var(--color-teal) 20%, transparent)' }} />
        )}
      </div>
      {/* Info */}
      <div style={{ padding: '10px 12px', background: 'var(--bg-card)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2, lineHeight: 1.3 }}>{address}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{city}{city && state ? ', ' : ''}{state}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-rocket)' }}>
            {price ? '$' + Math.round(price).toLocaleString() : '—'}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {beds ? `${beds} bd` : ''}{beds && sqft ? ' · ' : ''}{sqft ? sqft.toLocaleString() + ' sqft' : ''}
          </span>
        </div>
      </div>
    </button>
  );
}

function ListingDemoScreen({ preferences, onComplete }) {
  const [listings,    setListings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error,       setError]       = useState(null);
  const [selected,    setSelected]    = useState(new Set());
  const [page,        setPage]        = useState(1);
  const [hasMore,     setHasMore]     = useState(true);
  const [locationInput, setLocationInput] = useState(preferences.location?.trim() || '');
  const [activeLocation, setActiveLocation] = useState(preferences.location?.trim() || 'Colorado');
  const [tooFew,      setTooFew]      = useState(false);

  const CARDS_PER_PAGE = 12;

  async function doFetch(loc, pg, append = false) {
    try {
      // Budget params are intentionally excluded from the demo fetch.
      // The demo is for taste calibration — budget filtering causes empty
      // results in high-price markets. Budget filtering applies on the
      // main listings page after the profile is fully established.
      const params = new URLSearchParams({
        location: loc,
        minBeds:  3,
        homeType: 'Houses',
        status:   'For_Sale',
        page:     pg,
      });
      const res  = await fetch(`/api/listings?${params}`);
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      const raw  = (data.listings || []).filter(l => l?.raw?.property?.zpid);
      const slice = raw.slice(0, CARDS_PER_PAGE);

      // City mismatch detection: check if results are actually from the
      // searched location. The API sometimes falls back to nearby cities.
      let cityMismatch = false;
      if (pg === 1 && slice.length > 0 && loc !== 'Colorado') {
        const searchedCity = loc.split(',')[0].trim().toLowerCase();
        const returnedCities = slice
          .map(l => l?.raw?.property?.address?.city?.toLowerCase())
          .filter(Boolean);
        const anyMatch = returnedCities.some(c => c.includes(searchedCity) || searchedCity.includes(c));
        if (!anyMatch) cityMismatch = true;
      }

      setListings(prev => append ? [...prev, ...slice] : slice);
      setHasMore(raw.length >= CARDS_PER_PAGE);
      setTooFew((slice.length < MIN_SELECTIONS || cityMismatch) && pg === 1);
    } catch {
      setError('Could not load listings. Try a different location.');
    }
  }

  useEffect(() => {
    async function init() {
      await doFetch(activeLocation, 1, false);
      setLoading(false);
    }
    init();
  }, []);

  async function loadMore() {
    const nextPage = page + 1;
    setLoadingMore(true);
    await doFetch(activeLocation, nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  }

  async function retryLocation() {
    const loc = locationInput.trim() || 'Colorado';
    setActiveLocation(loc);
    setLoading(true);
    setListings([]);
    setSelected(new Set());
    setPage(1);
    setError(null);
    await doFetch(loc, 1, false);
    setLoading(false);
  }

  function toggle(zpid) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(zpid) ? next.delete(zpid) : next.add(zpid);
      return next;
    });
  }

  const selectedListings = listings.filter(l => selected.has(String(l?.raw?.property?.zpid)));

  // Dynamic threshold — if inventory is thin, drop to 3 minimum
  const effectiveMin = tooFew ? 3 : MIN_SELECTIONS;
  const remaining    = effectiveMin - selected.size;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <ScreenLabel step={3} total={5} label="Taste calibration" />
      <div>
        <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.15, marginBottom: 8 }}>
          Tap the homes that appeal to you
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
          Don't overthink it — just tap anything that catches your eye. Al will read the pattern.
        </p>
      </div>

      {/* Too few results or city mismatch */}
      {tooFew && !loading && (
        <div style={{
          padding: '14px 16px', borderRadius: 10,
          background: 'color-mix(in oklab, #FF7043 8%, transparent)',
          border: '1px solid color-mix(in oklab, #FF7043 25%, transparent)',
          fontSize: 13, color: 'var(--text)',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            Not many listings match your criteria in {activeLocation}.
          </div>
          <div style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
            Try a nearby town, a different region, or broaden your search area.
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              type="text"
              value={locationInput}
              onChange={e => setLocationInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && retryLocation()}
              placeholder="Try: Denver CO, Colorado Springs, Durango CO…"
              style={{
                flex: 1, minWidth: 180, padding: '8px 12px', fontSize: 13,
                borderRadius: 6, border: '1.5px solid var(--border)',
                background: 'var(--bg-card)', color: 'var(--text)', outline: 'none',
              }}
            />
            <button onClick={retryLocation} className="btn" style={{ fontSize: 12, padding: '8px 14px', flexShrink: 0 }}>
              Search →
            </button>
          </div>
        </div>
      )}

      {/* Skeletons */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{ height: 200, borderRadius: 12, background: 'var(--border)', opacity: 0.5, animation: 'pulse 1.5s infinite', animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      )}

      {error && (
        <div style={{ padding: 16, borderRadius: 8, background: '#FFEBEE', color: '#B71C1C', fontSize: 14 }}>{error}</div>
      )}

      {/* Cards — 3 column grid */}
      {!loading && listings.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {listings.map(l => {
            const zpid = String(l?.raw?.property?.zpid);
            return <ListingDemoCard key={zpid} listing={l} selected={selected.has(zpid)} onToggle={() => toggle(zpid)} />;
          })}
        </div>
      )}

      {/* Load more */}
      {!loading && hasMore && listings.length > 0 && (
        <button
          onClick={loadMore}
          disabled={loadingMore}
          style={{
            background: 'none', border: '1.5px solid var(--border)', borderRadius: 8,
            padding: '10px 0', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            color: 'var(--text-muted)', width: '100%', transition: 'all 0.12s',
          }}>
          {loadingMore ? 'Loading more…' : `Load more listings ↓`}
        </button>
      )}

      {/* Selection counter */}
      {!loading && selected.size > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, fontSize: 13, color: 'var(--text-muted)',
        }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: effectiveMin }).map((_, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i < selected.size ? 'var(--color-teal)' : 'var(--border)',
                transition: 'background 0.2s',
              }} />
            ))}
          </div>
          <span>{selected.size} selected{remaining > 0 ? ` — ${remaining} more to go` : ' — ready!'}</span>
        </div>
      )}

      {/* CTAs */}
      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => onComplete(selectedListings)}
            className="btn btn-lg"
            disabled={selected.size < effectiveMin}
            style={{ width: '100%', justifyContent: 'center' }}>
            {selected.size < effectiveMin
              ? `Select ${remaining} more home${remaining !== 1 ? 's' : ''}`
              : `Al, analyse my ${selected.size} pick${selected.size !== 1 ? 's' : ''} →`}
          </button>
          <button onClick={() => onComplete([])} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: 'var(--text-muted)', padding: '4px 0', textAlign: 'center',
          }}>
            Skip — I'll build my profile as I browse
          </button>
        </div>
      )}
    </div>
  );
}

// ── Screen 4: Pattern reading ─────────────────────────────────────────────────

function PatternScreen({ selectedListings, preferences, onConfirm }) {
  const [insights, setInsights]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [confirmed, setConfirmed] = useState(new Set());

  useEffect(() => {
    if (selectedListings.length === 0) {
      setInsights([]);
      setLoading(false);
      return;
    }

    async function readPattern() {
      try {
        const summaries = selectedListings.map(l => {
          const p = l?.raw?.property ?? l;
          return {
            address:  p.address?.streetAddress,
            city:     p.address?.city,
            price:    p.price?.value,
            beds:     p.bedrooms,
            sqft:     p.livingArea,
            yearBuilt: p.yearBuilt,
            lotSize:  p.resoFacts?.lotSize,
            hasGarage: p.resoFacts?.hasGarage,
            hasFireplace: p.resoFacts?.hasFireplace,
            hasCooling: p.resoFacts?.hasCooling,
            hasView:   p.resoFacts?.hasView,
            hoaFee:    p.resoFacts?.monthlyHoaFee,
            homeType:  p.homeType,
          };
        });

        const res = await fetch('/api/analyse-pattern', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listings: summaries,
            budgetMin: preferences.budgetMin,
            budgetMax: preferences.budgetMax,
          }),
        });

        const data   = await res.json();
        const parsed = data.insights || [];
        setInsights(parsed);
        setConfirmed(new Set(parsed.map((_, i) => i)));
      } catch (e) {
        console.error(e);
        setInsights([]);
      } finally {
        setLoading(false);
      }
    }

    readPattern();
  }, [selectedListings, preferences]);

  function toggleInsight(i) {
    setConfirmed(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  const confirmedInsights = (insights || []).filter((_, i) => confirmed.has(i));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <ScreenLabel step={4} total={5} label="Pattern recognition" />
      <div>
        <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.15, marginBottom: 8 }}>
          Here's what Al noticed
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
          Tap to confirm or remove any insight. These become your House Profile.
        </p>
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              height: 64, borderRadius: 10,
              background: 'var(--border)', opacity: 0.4,
              animation: 'pulse 1.5s infinite',
              animationDelay: `${i * 0.15}s`,
            }} />
          ))}
          <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
            Al is reading the pattern…
          </p>
        </div>
      )}

      {!loading && insights?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {insights.map((insight, i) => (
            <button key={i} onClick={() => toggleInsight(i)} style={{
              all: 'unset', display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
              background: confirmed.has(i)
                ? 'color-mix(in oklab, var(--color-teal) 10%, var(--bg-card))'
                : 'var(--bg-card)',
              border: confirmed.has(i)
                ? '1.5px solid var(--color-teal)'
                : '1.5px solid var(--border)',
              boxShadow: confirmed.has(i) ? '2px 2px 0 var(--color-teal)' : 'none',
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{insight.icon}</span>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{insight.signal}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{insight.description}</div>
              </div>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                background: confirmed.has(i) ? 'var(--color-teal)' : 'var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: confirmed.has(i) ? '#1a2530' : 'transparent',
                transition: 'all 0.15s',
              }}>✓</div>
            </button>
          ))}
        </div>
      )}

      {!loading && insights?.length === 0 && (
        <div className="card" style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
          Not enough data to detect patterns yet — you'll build your profile as you browse.
        </div>
      )}

      {!loading && (
        <button
          onClick={() => onConfirm(confirmedInsights)}
          className="btn btn-lg"
          style={{ width: '100%', justifyContent: 'center' }}>
          {confirmedInsights.length > 0
            ? `Add ${confirmedInsights.length} insight${confirmedInsights.length !== 1 ? 's' : ''} to my profile →`
            : 'Skip and go to listings →'}
        </button>
      )}
    </div>
  );
}

// ── Screen 5: Done ────────────────────────────────────────────────────────────

function DoneScreen() {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'var(--color-teal)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32, border: '3px solid var(--border)',
        boxShadow: '4px 4px 0 var(--shadow)',
        animation: 'pop 0.3s ease-out',
      }}>✓</div>
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Profile initialised</h2>
        <p style={{ color: 'var(--text-muted)' }}>Taking you to your personalised listings…</p>
      </div>
      <div style={{ width: 200, height: 5, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 3,
          background: 'linear-gradient(90deg, var(--color-teal), var(--color-rocket))',
          animation: 'progress-fill 1.6s ease-out forwards',
        }} />
      </div>
      <style>{`
        @keyframes progress-fill { from { width: 0% } to { width: 100% } }
        @keyframes pop { 0% { transform: scale(0.5); opacity: 0 } 70% { transform: scale(1.1) } 100% { transform: scale(1); opacity: 1 } }
        @keyframes pulse { 0%, 100% { opacity: 0.4 } 50% { opacity: 0.7 } }
      `}</style>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function OnboardFlow() {
  const router = useRouter();
  const [screen, setScreen]           = useState('passphrase');
  const [passphrase, setPassphrase]   = useState('');
  const [preferences, setPreferences] = useState(null);
  const [selectedListings, setSelectedListings] = useState([]);

  // Skip if already logged in
  useEffect(() => {
    const id = localStorage.getItem('albroker_user');
    if (id) router.push('/listings');
  }, [router]);

  async function handleNewUser(phrase) {
    setPassphrase(phrase);
    setScreen('preferences');
  }

  async function handleSignIn(phrase) {
    const userId = await passphraseToUserId(phrase);
    const res = await fetch(`/api/profile?userId=${userId}`);
    if (res.ok) {
      const data = await res.json();
      if (data.profile || data.houseProfile) {
        localStorage.setItem('albroker_user', userId);
        router.push('/listings');
        return 'ok';
      }
    }
    return 'not-found';
  }

  async function handlePreferencesComplete(prefs) {
    setPreferences(prefs);
    setScreen('demo');
  }

  async function handleDemoComplete(picks) {
    setSelectedListings(picks);
    setScreen('pattern');
  }

  async function handlePatternConfirm(confirmedInsights) {
    try {
      const userId = await passphraseToUserId(passphrase);

      // Build profile from preferences + confirmed insights
      const profile = {
        buyerType:         preferences.stage,
        targetBudgetRange: `${fmtMoneyFull(preferences.budgetMin)}–${fmtMoneyFull(preferences.budgetMax)}`,
        purchaseTimeframe: preferences.timeline,
        targetMarket:      preferences.location || null,
        journeyStage:      'Actively searching',
      };

      // Store location as a plain string — no separate state field to avoid
      // producing "City undefined" in deriveSearchParams when state is missing.
      // deriveSearchParams uses c.name directly (not c.name + c.state).
      const locationClusters = preferences.location?.trim()
        ? [{ name: preferences.location.trim(), count: 1 }]
        : [];

      const houseProfile = {
        budget_min:        preferences.budgetMin,
        budget_max:        preferences.budgetMax,
        budget_confirmed:  true,
        bedrooms_min:      3,
        inferred_summary:  {
          insights: confirmedInsights,
          locationClusters,
          priceRange: {
            serious_min: preferences.budgetMin,
            serious_max: preferences.budgetMax,
          },
          summary: confirmedInsights.map(i => i.signal).join(', ') || 'Profile in progress',
        },
        profile_completeness: confirmedInsights.length > 0 ? 40 : 20,
      };

      // Save personal profile (creates user row)
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, userId }),
      });

      // Save house profile
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, houseProfile }),
      });

      localStorage.setItem('albroker_user', userId);
      localStorage.setItem('albroker_passphrase', passphrase);
      setScreen('done');
      setTimeout(() => router.push('/listings'), 1800);
    } catch (err) {
      console.error('Profile save error:', err);
    }
  }

  return (
    <div style={{ maxWidth: 580, margin: '0 auto' }}>
      {screen === 'passphrase'   && <PassphraseScreen onNew={handleNewUser} onReturning={() => setScreen('returning')} />}
      {screen === 'returning'    && <ReturningScreen onBack={() => setScreen('passphrase')} onSignIn={handleSignIn} />}
      {screen === 'preferences'  && <PreferencesScreen onComplete={handlePreferencesComplete} />}
      {screen === 'demo'         && <ListingDemoScreen preferences={preferences} onComplete={handleDemoComplete} />}
      {screen === 'pattern'      && <PatternScreen selectedListings={selectedListings} preferences={preferences} onConfirm={handlePatternConfirm} />}
      {screen === 'done'         && <DoneScreen />}
    </div>
  );
}
