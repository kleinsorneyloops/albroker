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
                <h3 className="text-base">
