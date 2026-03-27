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
    setUserId(localStorage.getItem('albroker_user'));
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
        <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
          Build your homebuying knowledge. Pick a topic and get personalized guidance.
        </p>
      </div>

      {/* Topic grid — each topic is a card */}
      <div className="grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => loadTopic(topic.id)}
            className="card text-left p-5 transition-all hover:-translate-y-0.5 cursor-pointer"
            style={{
              borderColor: selectedTopic === topic.id ? 'var(--color-rocket)' : 'var(--border)',
              boxShadow: selectedTopic === topic.id
                ? '3px 3px 0 var(--color-rocket)'
                : '3px 3px 0 var(--shadow)',
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="flex items-center justify-center w-10 h-10 rounded-lg text-xl shrink-0"
                style={{
                  background: selectedTopic === topic.id
                    ? 'color-mix(in oklab, var(--color-rocket) 12%, white)'
                    : 'var(--bg)',
                  border: '1.5px solid var(--border)',
                }}
              >
                {topic.icon}
              </span>
              <div>
                <h3 className="text-sm font-bold mb-0.5" style={{ color: 'var(--text)' }}>{topic.label}</h3>
                <p className="text-sm leading-snug" style={{ color: 'var(--text-muted)' }}>{topic.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Content card */}
      {selectedTopic && (
        <div className="card px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="flex items-center justify-center w-12 h-12 rounded-lg text-2xl"
              style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', boxShadow: '2px 2px 0 var(--shadow)' }}
            >
              {topics.find((t) => t.id === selectedTopic)?.icon}
            </span>
            <div>
              <h2 style={{ color: 'var(--text)' }}>
                {topics.find((t) => t.id === selectedTopic)?.label}
              </h2>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Personalized guidance
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center gap-3 py-8">
              <div
                className="w-5 h-5 border-2 rounded-full animate-spin"
                style={{ borderColor: 'color-mix(in oklab, var(--color-rocket) 30%, transparent)', borderTopColor: 'var(--color-rocket)' }}
              />
              <p style={{ color: 'var(--text-muted)' }}>Loading personalized guidance…</p>
            </div>
          )}

          {!isLoading && content && (
            <div
              className="prose prose-sm max-w-none leading-relaxed whitespace-pre-wrap"
              style={{ color: 'var(--text)' }}
            >
              {content}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
