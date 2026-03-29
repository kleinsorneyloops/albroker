'use client';

import { useState, useEffect } from 'react';

export default function SavedPage() {
  const [homes, setHomes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('albroker_user');
    setUserId(id);
    if (id) {
      loadHomes(id);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function loadHomes(id) {
    try {
      const res = await fetch(`/api/saved-homes?userId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setHomes(data.homes || []);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }

  async function removeHome(homeId) {
    if (!userId) return;
    try {
      const res = await fetch(`/api/saved-homes?userId=${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeId }),
      });
      if (res.ok) {
        setHomes((prev) => prev.filter((h) => h.id !== homeId));
      }
    } catch {
      // silently fail
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{
            borderColor: 'color-mix(in oklab, var(--color-rocket) 30%, transparent)',
            borderTopColor: 'var(--color-rocket)',
          }}
        />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col gap-6 items-center py-24">
        <h1>Saved Homes</h1>
        <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
          Complete the onboarding to start saving homes.
        </p>
        <a href="/onboard" className="btn btn-lg">Get Started</a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-2">Saved Homes</h1>
        <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
          {homes.length === 0
            ? 'No homes saved yet. Search for properties on the dashboard and save the ones you like.'
            : `You have ${homes.length} saved home${homes.length !== 1 ? 's' : ''}.`}
        </p>
      </div>

      {homes.length === 0 && (
        <div className="card px-6 py-12 text-center">
          <p className="text-lg mb-4" style={{ color: 'var(--text-muted)' }}>Your saved homes will appear here</p>
          <a href="/dashboard" className="btn">Search for Homes</a>
        </div>
      )}

      <div className="grid gap-6">
        {homes.map((home) => (
          <div key={home.id} className="card px-6 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h3 className="mb-1" style={{ color: 'var(--text)' }}>{home.property.address}</h3>
                {home.property.price && (
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-rocket)' }}>
                    ${home.property.price.toLocaleString()}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {home.property.beds && <span>{home.property.beds} bed</span>}
                  {home.property.baths && <span>{home.property.baths} bath</span>}
                  {home.property.sqft && <span>{home.property.sqft.toLocaleString()} sqft</span>}
                  {home.property.yearBuilt && <span>Built {home.property.yearBuilt}</span>}
                </div>
                {home.notes && (
                  <p className="mt-3 text-sm italic" style={{ color: 'var(--text-muted)' }}>
                    &ldquo;{home.notes}&rdquo;
                  </p>
                )}
                <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                  Saved {new Date(home.savedAt).toLocaleDateString()}
                </p>
              </div>
              {home.property.photo && (
                <img
                  src={home.property.photo}
                  alt={home.property.address}
                  className="w-32 h-24 object-cover rounded"
                  style={{ border: '1.5px solid var(--border)' }}
                />
              )}
            </div>
            <div
              className="flex justify-end mt-4 pt-4"
              style={{ borderTop: '1px solid color-mix(in oklab, var(--border) 20%, transparent)' }}
            >
              <button
                onClick={() => removeHome(home.id)}
                className="text-sm font-semibold transition hover:opacity-70"
                style={{ color: 'var(--color-rocket)' }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}'use client';

import { useState, useEffect } from 'react';

export default function SavedPage() {
  const [homes, setHomes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('albroker_user');
    setUserId(id);
    if (id) {
      loadHomes(id);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function loadHomes(id) {
    try {
      const res = await fetch(`/api/saved-homes?userId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setHomes(data.homes || []);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }

  async function removeHome(homeId) {
    if (!userId) return;

    try {
      const res = await fetch(`/api/saved-homes?userId=${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeId }),
      });

      if (res.ok) {
        setHomes((prev) => prev.filter((h) => h.id !== homeId));
      }
    } catch {
      // silently fail
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col gap-6 items-center py-24">
        <h1>Saved Homes</h1>
        <p className="text-white/60 text-lg">
          Complete the onboarding to start saving homes.
        </p>
        <a href="/onboard" className="btn btn-lg">Get Started</a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-2">Saved Homes</h1>
        <p className="text-lg text-white/70">
          {homes.length === 0
            ? 'No homes saved yet. Search for properties on the dashboard and save the ones you like.'
            : `You have ${homes.length} saved home${homes.length !== 1 ? 's' : ''}.`}
        </p>
      </div>

      {homes.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-lg px-6 py-12 text-center">
          <p className="text-white/50 text-lg mb-4">Your saved homes will appear here</p>
          <a href="/dashboard" className="btn">Search for Homes</a>
        </div>
      )}

      <div className="grid gap-6">
        {homes.map((home) => (
          <div key={home.id} className="bg-white rounded-lg text-neutral-600">
            <div className="px-6 py-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-neutral-900 mb-1">{home.property.address}</h3>
                  {home.property.price && (
                    <p className="text-2xl font-bold text-primary">
                      ${home.property.price.toLocaleString()}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-neutral-500">
                    {home.property.beds && <span>{home.property.beds} bed</span>}
                    {home.property.baths && <span>{home.property.baths} bath</span>}
                    {home.property.sqft && <span>{home.property.sqft.toLocaleString()} sqft</span>}
                    {home.property.yearBuilt && <span>Built {home.property.yearBuilt}</span>}
                  </div>
                  {home.notes && (
                    <p className="mt-3 text-sm text-neutral-600 italic">&ldquo;{home.notes}&rdquo;</p>
                  )}
                  <p className="mt-2 text-xs text-neutral-400">
                    Saved {new Date(home.savedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {home.property.photo && (
                    <img
                      src={home.property.photo}
                      alt={home.property.address}
                      className="w-32 h-24 object-cover rounded"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-4 pt-4 border-t border-neutral-100">
                <button
                  onClick={() => removeHome(home.id)}
                  className="text-sm text-red-500 hover:text-red-700 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
