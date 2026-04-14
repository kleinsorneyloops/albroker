/**
 * Al Broker — Learn Function (Gemini)
 * Generates homebuying education content personalised to the buyer's profile.
 */

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { topic, userId } = await req.json();

    // Profile context — reads from Neon if userId present
    let profileContext = 'No specific buyer profile available — provide general guidance.';
    if (userId) {
      try {
        const { neon } = await import('@neondatabase/serverless');
        const sql = neon(process.env.NETLIFY_DATABASE_URL);
        const rows = await sql`
          SELECT pp.quiz_answers, hp.budget_min, hp.budget_max, hp.inferred_summary
          FROM personal_profiles pp
          LEFT JOIN house_profiles hp ON hp.user_id = pp.user_id
          WHERE pp.user_id = ${userId}
          LIMIT 1
        `;
        if (rows[0]) {
          const qa = rows[0].quiz_answers || {};
          const hp = rows[0];
          profileContext = [
            qa.journeyStage   && `Buyer stage: ${qa.journeyStage}`,
            qa.purchaseTimeframe && `Timeline: ${qa.purchaseTimeframe}`,
            hp.budget_min     && `Budget: $${hp.budget_min.toLocaleString()}–$${hp.budget_max?.toLocaleString()}`,
            hp.inferred_summary?.summary && `Preferences: ${hp.inferred_summary.summary}`,
          ].filter(Boolean).join('. ') || profileContext;
        }
      } catch (e) {
        console.error('Profile fetch error:', e);
        // Non-fatal — continue with generic context
      }
    }

    const topicPrompts = {
      schools:       'Explain how to research school quality when buying a home. Cover school ratings, how school districts affect home values, what to look for beyond test scores, and how to find this information.',
      commute:       'Help the buyer understand how to evaluate commute impact. Cover how to test commute times realistically, transit options, how commute affects quality of life and home value, and tools to estimate commutes.',
      mortgage:      'Explain mortgage basics for a homebuyer. Cover the difference between pre-qualification and pre-approval, fixed vs adjustable rates, how credit score affects rates, and what documents they will need.',
      inspection:    'Walk through what happens during a home inspection. Cover what inspectors look for, red flags vs minor issues, how to use inspection results in negotiation, and when to walk away.',
      offers:        'Explain how to make a competitive offer. Cover offer components, earnest money, contingencies, escalation clauses, and how to stand out in a competitive market without overpaying.',
      closing:       'Walk the buyer through the closing process from accepted offer to getting keys. Cover timeline, paperwork, final walkthrough, closing costs breakdown, and what to expect on closing day.',
      costs:         'Break down the true cost of homeownership beyond the mortgage. Cover property taxes, insurance, HOA fees, maintenance reserves, utilities, and how to budget for unexpected repairs.',
      neighborhoods: 'Help the buyer evaluate neighborhoods effectively. Cover walkability, crime data sources, future development plans, how to research a neighborhood in person and online, and what to ask locals.',
    };

    const topicPrompt = topicPrompts[topic] || `Provide helpful homebuying education about: ${topic}`;

    const prompt = `You are a friendly homebuying educator helping a real buyer feel confident and prepared.

Buyer context: ${profileContext}

Task: ${topicPrompt}

Format your response with clear sections using **bold headers**. Use short paragraphs and bullet points for readability. Keep the tone warm, encouraging, and practical. Aim for 400-600 words.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1500 },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('Gemini learn error:', err);
      throw new Error('AI content generation failed');
    }

    const data    = await res.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return new Response(
      JSON.stringify({ content }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Learn function error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const config = { path: '/api/learn' };
