import { autocompleteAddress } from '../../lib/reapi.js';

/**
 * GET /api/autocomplete?q=<partial address>
 *
 * Returns address suggestions as the buyer types.
 * Each suggestion includes a RealtyAPI property id that can be
 * passed directly to /api/property?id=<id> for full detail.
 *
 * Debounce this on the frontend — fire after 300ms of no typing.
 */
export default async (req) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    if (!q || q.trim().length < 3) {
      return new Response(
        JSON.stringify({ suggestions: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const suggestions = await autocompleteAddress(q);

    return new Response(
      JSON.stringify({ suggestions }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Autocomplete function error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const config = {
  path: '/api/autocomplete',
};
