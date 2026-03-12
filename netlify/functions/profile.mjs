import { getStore } from '@netlify/blobs';
import { randomUUID } from 'crypto';

export default async (req) => {
  const store = getStore('profiles');

  if (req.method === 'POST') {
    try {
      const { profile, userId: existingId } = await req.json();
      const userId = existingId || randomUUID();

      await store.setJSON(userId, {
        ...profile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return new Response(JSON.stringify({ userId }), {
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

  if (req.method === 'GET') {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const profile = await store.get(userId, { type: 'json' });

    return new Response(JSON.stringify({ profile }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const config = {
  path: '/api/profile',
};
