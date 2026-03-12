'use client';

import { useState, useEffect } from 'react';

const topics = [
  { id: 'schools', label: 'School Quality', description: 'How to research and evaluate schools in a neighborhood', icon: '🎓' },
  { id: 'commute', label: 'Commute & Transit', description: 'Evaluating commute times and transportation options', icon: '🚗' },
  { id: 'outdoors', label: 'Outdoor Access', description: 'Parks, trails, recreation, and green spaces near your home', icon: '🌲' },
  { id: 'inspection', label: 'Home Inspections', description: 'What happens during an inspection and what to look for', icon: '🔍' },
  { id: 'mortgage', label: 'Mortgage Basics', description: 'Understanding loans, rates, and the financing process', icon: '🏦' },
  { id: 'negotiation', label: 'Making an Offer', description: 'How to negotiate and what contingencies to consider', icon: '🤝' },
  { id: 'neighborhood', label: 'Evaluating Neighborhoods', description: 'How to thoroughly assess a neighborhood before buying', icon: '🏘️' },
  { id: 'closing', label: 'The Closing Process', description: 'From accepted offer to getting your keys', icon: '🔑' },
];

export default function LearnPage() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(localStorage.getItem('homewise_user'));
  }, []);

  async function loadTopic(topicId) {
    setSelectedTopic(topicId);
    setContent('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicId, userId }),
      });

      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
      }
    } catch {
      setContent('Unable to load this topic right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-2">Learn</h1>
        <p className="text-lg text-white/70">
          Build your homebuying knowledge. Pick a topic and get personalized guidance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => loadTopic(topic.id)}
            className={`text-left p-5 rounded-lg border transition-all ${
              selectedTopic === topic.id
                ? 'bg-primary/20 border-primary'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{topic.icon}</span>
              <div>
                <h3 className="text-base mb-1">{topic.label}</h3>
                <p className="text-sm text-white/60">{topic.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedTopic && (
        <div className="bg-white rounded-lg text-neutral-700">
          <div className="px-6 py-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">
                {topics.find((t) => t.id === selectedTopic)?.icon}
              </span>
              <h2 className="text-neutral-900 text-xl">
                {topics.find((t) => t.id === selectedTopic)?.label}
              </h2>
            </div>

            {isLoading && (
              <div className="flex items-center gap-3 py-8">
                <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-neutral-500">Loading personalized guidance...</p>
              </div>
            )}

            {!isLoading && content && (
              <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-wrap leading-relaxed">
                {content}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
