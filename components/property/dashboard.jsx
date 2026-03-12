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
    setUserId(localStorage.getItem('homewise_user'));
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

      if (res.ok) {
        setSaveStatus('saved');
      } else if (res.status === 409) {
        setSaveStatus('duplicate');
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-2">Search Homes</h1>
        <p className="text-lg text-white/70">
          Paste a listing URL or enter an address to get personalized insights about any property.
        </p>
      </div>

      <PropertySearch onSearch={handleSearch} isLoading={isSearching} />

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-6 py-4 text-red-200">
          {error}
        </div>
      )}

      {property && (
        <div className="flex flex-col gap-6">
          <PropertySpecs property={property} />

          {userId && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="mb-3 text-lg">Save this home</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note — what caught your eye about this property?"
                className="input w-full mb-3 min-h-[80px] resize-y"
              />
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSave}
                  className="btn btn-accent"
                  disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                >
                  {saveStatus === 'saving' ? 'Saving...' :
                   saveStatus === 'saved' ? 'Saved!' :
                   saveStatus === 'duplicate' ? 'Already Saved' :
                   'Save to My Homes'}
                </button>
                {saveStatus === 'saved' && (
                  <a href="/saved" className="text-sm text-primary">View saved homes</a>
                )}
              </div>
            </div>
          )}

          {!userId && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
              <p className="text-white/60 mb-3">
                Want to save this home and get personalized insights?
              </p>
              <a href="/onboard" className="btn">Complete Your Profile</a>
            </div>
          )}

          <NeighborhoodFactors context={neighborhoodContext} />
          <MentorSection analysis={mentorAnalysis} isLoading={isMentorLoading} />
        </div>
      )}

      {!property && !isSearching && !error && (
        <div className="bg-white/5 border border-white/10 rounded-lg px-6 py-12 text-center">
          <p className="text-white/50 text-lg mb-2">No property selected</p>
          <p className="text-white/30 text-sm">
            Enter a Zillow, Realtor.com, or Redfin URL above — or type a street address directly.
          </p>
        </div>
      )}
    </div>
  );
}
