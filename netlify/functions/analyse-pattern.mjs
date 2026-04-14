/**
 * Al Broker — Pattern Analysis Function (Gemini)
 * Proxies Gemini API calls server-side to avoid CORS + key exposure.
 */

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { listings, budgetMin, budgetMax } = await req.json();

    if (!listings || listings.length < 1) {
      return new Response(JSON.stringify({ insights: [] }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    const budgetContext = budgetMin && budgetMax
      ? `Budget range: $${Math.round(budgetMin).toLocaleString()}–$${Math.round(budgetMax).toLocaleString()}`
      : '';

    const prompt = `A homebuyer saved or selected these ${listings.length} listings. Identify 3-5 specific preferences from what they have in common.

Listings:
${JSON.stringify(listings, null, 2)}
${budgetContext}

Return ONLY a JSON array. No preamble, no markdown, no backticks.
Each object: { "signal": "short label", "description": "one sentence", "icon": "single emoji" }

Focus on specific observable patterns — price range, size, lot size, garage, views, HOA presence, location type, age of home. Avoid vague statements.`;

    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1000 },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Gemini API error:', err);
      return new Response(JSON.stringify({ error: 'AI analysis failed', insights: [] }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    const data     = await res.json();
    const text     = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const clean    = text.replace(/```json|```/g, '').trim();
    const insights = JSON.parse(clean);

    return new Response(JSON.stringify({ insights }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('analyse-pattern error:', err);
    return new Response(JSON.stringify({ error: err.message, insights: [] }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = { path: '/api/analyse-pattern' };
