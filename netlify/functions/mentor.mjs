import Anthropic from '@anthropic-ai/sdk';
import { getStore } from '@netlify/blobs';
import { buildNeighborhoodContext, buildMentorPrompt } from '../../lib/neighborhood/context.js';

const anthropic = new Anthropic();

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { property, userId } = body;

    if (!property) {
      return new Response(
        JSON.stringify({ error: 'Missing "property" in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let userProfile = null;
    if (userId) {
      const profileStore = getStore('profiles');
      userProfile = await profileStore.get(userId, { type: 'json' });
    }

    const neighborhoodContext = buildNeighborhoodContext(property);
    const prompt = buildMentorPrompt(property, neighborhoodContext, userProfile);

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const analysis = message.content[0].text;

    return new Response(
      JSON.stringify({ analysis, neighborhoodContext }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Mentor function error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const config = {
  path: '/api/mentor',
};
