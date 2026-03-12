import { parsePropertyUrl } from '../../lib/property/parseUrl.js';
import { fetchPropertyData, normalizeProperty } from '../../lib/property/fetchProperty.js';

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'Missing "url" in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const address = parsePropertyUrl(url);
    if (!address) {
      return new Response(
        JSON.stringify({ error: 'Could not extract an address from the provided input' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiData = await fetchPropertyData(address);
    const property = normalizeProperty(apiData);

    return new Response(
      JSON.stringify({ address, property }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Property function error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const config = {
  path: '/api/property',
};
