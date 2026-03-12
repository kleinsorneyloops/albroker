import { getStore } from '@netlify/blobs';

export default async (req) => {
  const store = getStore('saved-homes');

  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const key = `user:${userId}`;

  if (req.method === 'GET') {
    const homes = await store.get(key, { type: 'json' });
    return new Response(JSON.stringify({ homes: homes || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'POST') {
    try {
      const { property, notes } = await req.json();
      const existing = (await store.get(key, { type: 'json' })) || [];

      const isDuplicate = existing.some(
        (h) => h.property.address === property.address
      );
      if (isDuplicate) {
        return new Response(
          JSON.stringify({ error: 'This home is already saved' }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const saved = {
        id: Date.now().toString(36),
        property,
        notes: notes || '',
        savedAt: new Date().toISOString(),
      };

      existing.push(saved);
      await store.setJSON(key, existing);

      return new Response(JSON.stringify({ saved, total: existing.length }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { homeId } = await req.json();
      const existing = (await store.get(key, { type: 'json' })) || [];
      const updated = existing.filter((h) => h.id !== homeId);
      await store.setJSON(key, updated);

      return new Response(JSON.stringify({ total: updated.length }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const config = {
  path: '/api/saved-homes',
};
