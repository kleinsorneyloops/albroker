'use client';

import { useState } from 'react';

export function PropertySearch({ onSearch, isLoading }) {
  const [url, setUrl] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (url.trim()) {
      onSearch(url.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste a Zillow URL or enter a property address..."
        className="input grow"
        disabled={isLoading}
      />
      <button type="submit" className="btn whitespace-nowrap" disabled={isLoading || !url.trim()}>
        {isLoading ? 'Searching...' : 'Look Up Property'}
      </button>
    </form>
  );
}
