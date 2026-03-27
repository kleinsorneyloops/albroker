'use client';

import { useState, useEffect } from 'react';
import { PropertySearch } from 'components/property/property-search';
import { PropertySpecs } from 'components/property/property-specs';
import { NeighborhoodFactors } from 'components/property/neighborhood-factors';
import { MentorSection } from 'components/mentor/mentor-section';

export function Dashboard() {
  const [property, setProperty] = useState(null);
  const [neighborhoodContext, setNeighborhoodContext] = useState(null);
  const [mentorAnalysis, setMentorAnalysis] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isMentorLoading, setIsMentorLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setUserId(localStorage.getItem('albroker_user'));
  }, []);

  async function handleSearch(url) {
    setError(null);
    setProperty(null);
    setNeighborhoodContext(null);
    setMentorAnalysis(null);
    setSaveStatus(null);
    setNotes('');
    setIsSearching(true);
    try {
      const propertyRes = await fetch('/api/property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!propertyRes.ok) {
        const errData = await propertyRes.json();
        throw new Error(errData.error || 'Failed to fetch property data');
      }
      const { property: propData } = await propertyRes.json();
      setProperty(propData);
      setIsSearching(false);
      setIsMentorLoading(true);
      const mentorRes = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property: propData, userId }),
      });
      if (!mentorRes.ok) {
        const errData = await mentorRes.json();
        throw new Error(errData.error || 'Failed to fetch analysis');
      }
      const mentorData = await mentorRes.json();
      setMentorAnalysis(mentorData.analysis);
      setNeighborhoodContext(mentorData.neighborhoodContext);
    } catch (err) {
      setError(err.message);
      setIsSearching(false);
    } finally {
      setIsMentorLoading(false);
    }
  }

  async function handleSave() {
    if (!userId || !property) return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/saved-homes?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property, notes }),
      });
      if (res.ok) setSaveStatus('saved');
      else if (res.status === 409) setSaveStatus('duplicate');
      else setSaveStatus('error');
    } catch {
      setSaveStatus('error');
    }
  }

  return (
    <div className="flex flex-col gap-8">

      <div>
        <h1 className="mb-2">Search Homes</h1>
        <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
          Paste a listing URL or enter an address to get personalized insights about any property.
        </p>
      </div>

      {/* Search inside a card */}
      <div className="card px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
          Search Location
        </p>
        <PropertySearch onSearch={handleSearch} isLoading={isSearching} />
      </div>

      {/* Error */}
      {error && (
        <div className="card px-6 py-4" style={{ borderColor: 'var(--color-rocket)', boxShadow: '3px 3px 0 var(--color-rocket)' }}>
          <p className="font-semibold" style={{ color: 'var(--color-rocket)' }}>⚠ {error}</p>
        </div>
      )}

      {/* Results */}
      {property && (
        <div className="flex flex-col gap-6">
          <PropertySpecs property={property} />

          {/* Save card */}
          {userId && (
            <div className="card px-6 py-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-new">Save</span>
                <h3 className="text-base">Save this home</h3>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                Add a note so you remember what stood out.
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. loved the natural light, great school district…"
                className="input w-full mb-4 min-h-[80px] resize-y"
              />
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSave}
                  className="btn btn-accent"
                  disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                >
                  {saveStatus === 'saving' ? 'Saving...' :
                   saveStatus === 'saved' ? '✓ Saved!' :
                   saveStatus === 'duplicate' ? 'Already Saved' : 'Save to My Homes'}
                </button>
                {saveStatus === 'saved' && (
                  <a href="/saved" className="text-sm font-bold" style={{ color: 'var(--color-rocket)' }}>
                    View saved homes →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* CTA to onboard */}
          {!userId && (
            <div className="card px-6 py-6 text-center">
              <p className="mb-1 font-semibold" style={{ color: 'var(--text)' }}>
                Want personalized insights for every home?
              </p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                Complete your profile so Al Broker can tailor analysis to your priorities.
              </p>
              <a href="/onboard" className="btn">Complete Your Profile →</a>
            </div>
          )}

          <NeighborhoodFactors context={neighborhoodContext} />
          <MentorSection analysis={mentorAnalysis} isLoading={isMentorLoading} />
        </div>
      )}

      {/* Empty state */}
      {!property && !isSearching && !error && (
        <div className="card px-6 py-16 text-center">
          <div
            className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-xl"
            style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', boxShadow: '2px 2px 0 var(--shadow)' }}
          >
            <span style={{ fontSize: '1.75rem' }}>🏠</span>
          </div>
          <p className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>No property selected</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Enter a Zillow, Realtor.com, or Redfin URL above — or type a street address directly.
          </p>
        </div>
      )}

    </div>
  );
}
