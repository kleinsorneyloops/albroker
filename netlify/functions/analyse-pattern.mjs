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

    function callGemini(prompt) {
      return fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 800,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      });
    }

    const prompt = `A homebuyer saved or selected these ${listings.length} listings. Identify 3-5 specific preferences from what they have in common.

Listings:
${JSON.stringify(listings, null, 2)}
${budgetContext}

Return ONLY a valid JSON array with 3-5 objects. No other text. No markdown. No explanation before or after.
Each object must have exactly these keys: "signal" (string), "description" (string), "icon" (single emoji string).
Example format: [{"signal":"Acreage","description":"All selected homes have half an acre or more.","icon":"🌿"}]

Focus on specific observable patterns — price range, size, lot size, garage, views, HOA presence, location type, age of home.`;

    // Retry once on 503 (model overloaded)
    let res = await callGemini(prompt);
    if (res.status === 503) {
      await new Promise(r => setTimeout(r, 2000));
      res = await callGemini(prompt);
    }

    if (!res.ok) {
      const err = await res.text();
      console.error('Gemini API error:', err);
      return new Response(JSON.stringify({ error: 'AI analysis failed', insights: [] }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    const data  = await res.json();
    const text  = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    console.log('Gemini raw response:', text.slice(0, 500));

    if (!text) {
      console.error('Empty response from Gemini');
      return new Response(JSON.stringify({ insights: [] }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract JSON array from response — handles markdown fences and prose wrapping
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No JSON array found in Gemini response:', text.slice(0, 200));
      return new Response(JSON.stringify({ insights: [] }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    }

    const insights = JSON.parse(jsonMatch[0]);

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
