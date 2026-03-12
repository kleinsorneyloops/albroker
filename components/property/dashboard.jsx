'use client';

import { useState } from 'react';
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

  async function handleSearch(url) {
    setError(null);
    setProperty(null);
    setNeighborhoodContext(null);
    setMentorAnalysis(null);
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

      // Fetch mentor analysis
      setIsMentorLoading(true);
      const mentorRes = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property: propData }),
      });

      if (!mentorRes.ok) {
        const errData = await mentorRes.json();
        throw new Error(errData.error || 'Failed to fetch mentor analysis');
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

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-2">Property Analyzer</h1>
        <p className="text-lg text-white/70">
          Paste a Zillow URL or enter a property address to get AI-powered investment analysis.
        </p>
      </div>

      <PropertySearch onSearch={handleSearch} isLoading={isSearching} />

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-sm px-6 py-4 text-red-200">
          {error}
        </div>
      )}

      {property && (
        <div className="flex flex-col gap-6">
          <PropertySpecs property={property} />
          <NeighborhoodFactors context={neighborhoodContext} />
          <MentorSection analysis={mentorAnalysis} isLoading={isMentorLoading} />
        </div>
      )}

      {!property && !isSearching && !error && (
        <div className="bg-white/5 border border-white/10 rounded-sm px-6 py-12 text-center">
          <p className="text-white/50 text-lg mb-2">No property selected</p>
          <p className="text-white/30 text-sm">
            Enter a Zillow, Realtor.com, or Redfin URL above — or type a street address directly.
          </p>
        </div>
      )}
    </div>
  );
}
