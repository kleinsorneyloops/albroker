'use client';

import { use, useEffect, useState } from 'react';
import { passphraseToUserId, passphrasePersona, isValidPassphrase } from '@/lib/passphrase';

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

const MUST_HAVE_ICONS = {
  fireplace: '🔥', garage: '🚗', ac: '❄️', yard: '🌿',
  pool: '🏊', view: '🏔️', laundry: '🧺', basement: '🏚️',
};

function fmt(n) {
  if (!n) return null;
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  return `$${(n / 1000).toFixed(0)}k`;
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid color-mix(in oklab, var(--border) 50%, transparent)' }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}

export default function ShareProfilePage({ params }) {
  // Next.js 16 App Router: params is a Promise in client components — unwrap with React.use()
  const resolvedParams = use(params);
  const passphrase = decodeURIComponent(resolvedParams.passphrase);

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [profile, setProfile] = useState(null);
  const [hp, setHp]           = useState(null);

  useEffect(() => {
    if (!isValidPassphrase(passphrase)) {
      setError('Invalid profile link.');
      setLoading(false);
      return;
    }

    passphraseToUserId(passphrase).then(userId =>
      fetch(`/api/profile?userId=${userId}`)
        .then(r => {
          if (!r.ok) throw new Error('not found');
          return r.json();
        })
        .then(data => {
          if (!data.profile && !data.houseProfile) throw new Error('not found');
          setProfile(data.profile || {});
          setHp(data.houseProfile || {});
        })
        .catch(() => setError('Profile not found. The link may be outdated.'))
        .finally(() => setLoading(false))
    );
  }, [passphrase]);

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: 13 }}>
        Loading profile…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{error}</p>
      </div>
    );
  }

  const budgetMin = hp.budget_min;
  const budgetMax = hp.budget_max;
  const budgetStr = budgetMin && budgetMax
    ? `${fmt(budgetMin)} – ${fmt(budgetMax)}`
    : fmt(budgetMax) || fmt(budgetMin) || null;

  const location = hp.locations_explicit?.[0]?.name
    || hp.inferred_summary?.locationClusters?.[0]?.name
    || profile.targetMarket
    || null;

  const mustHaves     = hp.must_haves    || [];
  const dealBreakers  = hp.deal_breakers || [];
  const propertyTypes = hp.inferred_summary?.propertyTypes || [];
  const insights      = hp.inferred_summary?.insights || [];
  const completeness  = hp.profile_completeness || 0;

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 60 }}>

      {/* Header */}
      <div style={{
        background: '#1a2530', borderRadius: 14, padding: '24px 20px',
        border: '1.5px solid var(--color-teal)', boxShadow: '4px 4px 0 var(--color-teal)',
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-teal)', fontFamily: 'monospace', marginBottom: 8 }}>
          ◈ Al Broker · Buyer Profile
        </div>
        <div style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: 800, color: '#fff', fontFamily: 'monospace', letterSpacing: '0.06em', marginBottom: 4 }}>
          {passphrase}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', marginBottom: 16 }}>
          {passphrasePersona(passphrase)}
        </div>
        {completeness > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 2, background: 'var(--color-teal)', width: `${completeness}%` }} />
            </div>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>
              {completeness}% complete
            </span>
          </div>
        )}
      </div>

      {/* Read-only notice */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 14px', borderRadius: 8,
        fontSize: 12, background: 'color-mix(in oklab, var(--color-teal) 6%, transparent)',
        border: '1px solid color-mix(in oklab, var(--color-teal) 20%, transparent)', color: 'var(--text-muted)',
      }}>
        <span>👁</span>
        <span>This is a read-only view shared by the buyer. Only they can edit their profile.</span>
      </div>

      {/* Buyer snapshot */}
      <div className="card" style={{ padding: '18px 20px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: 12 }}>
          ◈ Buyer snapshot
        </div>
        <Row label="Buyer type"     value={BUYER_TYPE_LABELS[profile.buyerType] || profile.buyerType} />
        <Row label="Timeline"       value={TIMELINE_LABELS[profile.purchaseTimeframe] || profile.purchaseTimeframe} />
        <Row label="Budget"         value={budgetStr} />
        <Row label="Location"       value={location} />
        <Row label="Min bedrooms"   value={hp.bedrooms_min ? `${hp.bedrooms_min}+` : null} />
        <Row label="Property types" value={propertyTypes.length > 0 ? propertyTypes.join(', ') : null} />
      </div>

      {/* Must-haves */}
      {mustHaves.length > 0 && (
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: 12 }}>
            ◈ Must-haves
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {mustHaves.map(v => (
              <span key={v} style={{
                padding: '6px 12px', borderRadius: 20, fontSize: 13,
                background: 'color-mix(in oklab, var(--color-teal) 12%, var(--bg-card))',
                border: '1px solid color-mix(in oklab, var(--color-teal) 30%, transparent)',
                color: 'var(--text)',
              }}>
                {MUST_HAVE_ICONS[v] || ''} {v.charAt(0).toUpperCase() + v.slice(1)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Deal-breakers */}
      {dealBreakers.length > 0 && (
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: 12 }}>
            ◈ Deal-breakers
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {dealBreakers.map(v => (
              <span key={v} style={{
                padding: '6px 12px', borderRadius: 20, fontSize: 13,
                background: 'color-mix(in oklab, #DC2626 8%, var(--bg-card))',
                border: '1px solid color-mix(in oklab, #DC2626 25%, transparent)',
                color: '#DC2626',
              }}>
                ✕ {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Al insights */}
      {insights.length > 0 && (
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: 12 }}>
            ◈ Detected preferences
          </div>
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
            AI-detected from the buyer's listing interactions.
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <a href="/" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'monospace' }}>
          Powered by Al Broker →
        </a>
      </div>
    </div>
  );
}
