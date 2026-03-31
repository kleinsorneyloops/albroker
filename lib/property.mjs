import { getPropertyDetail, normalizeProperty } from '../../lib/reapi.js';

/**
 * GET /api/property?id=<reapi_id>
 * GET /api/property?address=<full address>
 *
 * Returns normalized property detail for a single property.
 * The `id` param is preferred (comes from AutoComplete).
 * The `address` param is the fallback for direct address entry.
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
    const id = searchParams.get('id');
    const address = searchParams.get('address');

    if (!id && !address) {
      return new Response(
        JSON.stringify({ error: 'Provide either an "id" or "address" query parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const raw = await getPropertyDetail({ id, address });

    if (!raw) {
      return new Response(
        JSON.stringify({ error: 'Property not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const property = normalizeProperty(raw);

    return new Response(
      JSON.stringify({ property }),
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
