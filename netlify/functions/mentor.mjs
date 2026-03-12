import Anthropic from '@anthropic-ai/sdk';
import { buildNeighborhoodContext, buildMentorPrompt } from '../../lib/neighborhood/context.js';

const anthropic = new Anthropic();

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { property } = body;

    if (!property) {
      return new Response(
        JSON.stringify({ error: 'Missing "property" in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const neighborhoodContext = buildNeighborhoodContext(property);
    const prompt = buildMentorPrompt(property, neighborhoodContext);

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
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
