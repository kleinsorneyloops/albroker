'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const sections = [
  {
    title: 'Journey Snapshot',
    items: [
      { label: 'Homebuying journey', field: 'journeyStage' },
      { label: 'Buyer type', field: 'buyerType' },
      { label: 'Primary reason for buying', field: 'buyingReason' },
      { label: 'Target purchase timeframe', field: 'purchaseTimeframe' },
    ],
  },
  {
    title: 'Knowledge & Process Confidence',
    items: [
      { label: 'Confidence in process (1-5)', field: 'processConfidence' },
      { label: 'Topics understood well', field: 'topicsUnderstood' },
      { label: 'Topics that feel unclear', field: 'topicsConfusing' },
      { label: 'Understanding of monthly costs (1-5)', field: 'monthlyCostUnderstanding' },
    ],
  },
  {
    title: 'Concerns & Blockers',
    items: [
      { label: 'Financial fears', field: 'financialFears' },
      { label: 'Process/emotional fears', field: 'processFears' },
      { label: 'Financial uncertainty influence (1-5)', field: 'financialUncertaintyInfluence' },
      { label: 'Biggest blocker', field: 'biggestBlocker' },
      { label: 'Wish known before starting', field: 'wishKnewBeforeSearch' },
    ],
  },
  {
    title: 'Decision Drivers & Priorities',
    items: [
      { label: 'Ranked home priorities', field: 'homePriorities' },
      { label: 'Primary decision influence', field: 'decisionInfluence' },
      { label: 'Primary research method', field: 'researchMethod' },
    ],
  },
  {
    title: 'Demographics',
    items: [
      { label: 'Age range', field: 'ageRange' },
      { label: 'Household size', field: 'householdSize' },
      { label: 'Annual household income', field: 'householdIncome' },
      { label: 'Target budget range', field: 'targetBudgetRange' },
      { label: 'Current housing situation', field: 'currentHousingSituation' },
      { label: 'Employment situation', field: 'employmentSituation' },
      { label: 'Target market/location', field: 'targetMarket' },
      { label: 'Additional context', field: 'additionalContext' },
    ],
  },
];

function formatValue(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) return 'Not provided';
    return value.join(', ');
  }

  if (typeof value === 'string') {
    return value.trim() ? value : 'Not provided';
  }

  return value || 'Not provided';
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('albroker_user');

    if (!userId) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch(`/api/profile?userId=${userId}`);
        if (!res.ok) {
          setError('Unable to load profile right now.');
          setLoading(false);
          return;
        }

        const data = await res.json();
        setProfile(data.profile || null);
      } catch {
        setError('Unable to load profile right now.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const hasProfile = useMemo(() => {
    if (!profile) return false;

    return sections.some((section) =>
      section.items.some((item) => {
        const value = profile[item.field];
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'string') return value.trim().length > 0;
        return Boolean(value);
      })
    );
  }, [profile]);

  if (loading) {
    return (
      <div className="py-6">
        <div className="card p-8 text-center">
          <p style={{ color: 'var(--text-muted)' }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="py-6 flex flex-col gap-6">
        <div>
          <h1 className="mb-2">Profile</h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Build your profile once so the experience can stay tailored to your goals.
          </p>
        </div>
        <div className="card p-8 text-center">
          <p className="mb-4" style={{ color: 'var(--text)' }}>No saved profile yet.</p>
          {error && <p className="mb-4 text-sm" style={{ color: 'var(--color-rocket)' }}>{error}</p>}
          <Link className="btn" href="/onboard">Create Your Profile</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 flex flex-col gap-8">
      <div className="flex flex-wrap gap-4 items-end justify-between">
        <div>
          <h1 className="mb-2">Profile</h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Answers below shape recommendations, property guidance, and what gets prioritized.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard" className="btn btn-outline">Search Homes</Link>
          <Link href="/onboard" className="btn">Adjust Profile</Link>
        </div>
      </div>

      <div className="grid gap-5">
        {sections.map((section) => (
          <section key={section.title} className="card p-6">
            <h2 className="text-xl mb-4">{section.title}</h2>
            <div className="grid gap-3">
              {section.items.map((item) => (
                <div key={item.field} className="panel p-4">
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                    {item.label}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text)' }}>
                    {formatValue(profile[item.field])}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
