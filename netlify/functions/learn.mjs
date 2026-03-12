import Anthropic from '@anthropic-ai/sdk';
import { getStore } from '@netlify/blobs';

const anthropic = new Anthropic();

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { topic, userId } = await req.json();

    let userProfile = null;
    if (userId) {
      const profileStore = getStore('profiles');
      userProfile = await profileStore.get(userId, { type: 'json' });
    }

    const profileContext = userProfile
      ? `The buyer is a ${userProfile.experience || 'potential'} buyer looking in ${userProfile.location || 'an unspecified area'} with a budget of ${userProfile.budget || 'unspecified'}. Their priorities are: ${userProfile.priorities?.join(', ') || 'not specified'}. Their main concern is: ${userProfile.concerns || 'not specified'}.`
      : 'No specific buyer profile available — provide general guidance.';

    const topicPrompts = {
      schools: 'Explain how to research school quality when buying a home. Cover school ratings, how school districts affect home values, what to look for beyond test scores, and how to find this information. Mention GreatSchools and state education websites.',
      commute: 'Help the buyer understand how to evaluate commute impact. Cover how to test commute times realistically, transit options, how commute affects quality of life and home value, and tools they can use to estimate commutes.',
      outdoors: 'Explain how to evaluate outdoor access and recreation when choosing a home. Cover proximity to parks, trails, water, community amenities, and how outdoor access affects property values and lifestyle.',
      inspection: 'Walk the buyer through what happens during a home inspection. Cover what inspectors look for, red flags to watch out for, common issues in different property ages, and questions to ask the inspector.',
      mortgage: 'Explain mortgage basics in plain language. Cover pre-approval vs pre-qualification, fixed vs adjustable rates, down payment options, closing costs, and how to shop for the best rate. Mention common first-time buyer programs.',
      negotiation: 'Teach the buyer about the offer and negotiation process. Cover how to make a competitive offer, contingencies they should know about, when to negotiate vs accept, and common mistakes buyers make.',
      neighborhood: 'Help the buyer evaluate a neighborhood thoroughly. Cover visiting at different times of day, checking crime stats, talking to neighbors, evaluating future development plans, and noise/traffic patterns.',
      closing: 'Walk the buyer through the closing process from accepted offer to getting keys. Cover timeline, paperwork, final walkthrough, closing costs breakdown, and what to expect on closing day.',
    };

    const topicPrompt = topicPrompts[topic] || `Provide helpful homebuying education about: ${topic}`;

    const prompt = `You are a friendly homebuying educator. ${profileContext}

${topicPrompt}

Format your response with clear sections using **bold headers**. Use short paragraphs and bullet points for readability. Keep the tone warm, encouraging, and practical. The goal is to make the buyer feel more confident and prepared.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    return new Response(
      JSON.stringify({ content: message.content[0].text }),
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

export const config = {
  path: '/api/learn',
};
