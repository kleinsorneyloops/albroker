'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const steps = [
  {
    id: 'welcome',
    question: "Welcome! Let's get to know you. Are you a first-time homebuyer?",
    type: 'choice',
    options: ['Yes, first time', 'I\'ve bought before', 'Just exploring'],
    field: 'experience',
  },
  {
    id: 'location',
    question: 'What area are you looking to buy in?',
    type: 'text',
    placeholder: 'e.g. Austin, TX or "anywhere in the Pacific Northwest"',
    field: 'location',
  },
  {
    id: 'budget',
    question: "What's your approximate budget range?",
    type: 'choice',
    options: ['Under $300K', '$300K – $500K', '$500K – $750K', '$750K – $1M', 'Over $1M', 'Not sure yet'],
    field: 'budget',
  },
  {
    id: 'size',
    question: 'How many bedrooms do you need?',
    type: 'choice',
    options: ['1–2', '3', '4', '5+', 'Flexible'],
    field: 'bedrooms',
  },
  {
    id: 'priorities',
    question: 'What matters most to you? Pick your top 3.',
    type: 'multi',
    options: [
      'Good schools',
      'Short commute',
      'Outdoor access',
      'Walkability',
      'Low crime',
      'New construction',
      'Large yard',
      'Quiet neighborhood',
      'Near family/friends',
      'Investment value',
    ],
    maxSelect: 3,
    field: 'priorities',
  },
  {
    id: 'timeline',
    question: 'When are you hoping to buy?',
    type: 'choice',
    options: ['Within 3 months', '3–6 months', '6–12 months', 'Over a year', 'Just exploring'],
    field: 'timeline',
  },
  {
    id: 'concerns',
    question: "What's your biggest concern about buying a home?",
    type: 'text',
    placeholder: 'e.g. "I don\'t know what to look for during a showing"',
    field: 'concerns',
  },
];

export function OnboardFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [textValue, setTextValue] = useState('');
  const [multiSelected, setMultiSelected] = useState([]);
  const [saving, setSaving] = useState(false);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    setTextValue('');
    setMultiSelected([]);
  }, [currentStep]);

  function handleChoice(value) {
    const updated = { ...answers, [step.field]: value };
    setAnswers(updated);
    if (!isLast) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleMultiToggle(value) {
    setMultiSelected((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      }
      if (prev.length >= (step.maxSelect || 99)) return prev;
      return [...prev, value];
    });
  }

  function handleTextSubmit(e) {
    e.preventDefault();
    if (!textValue.trim()) return;
    const updated = { ...answers, [step.field]: textValue.trim() };
    setAnswers(updated);
    if (!isLast) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleMultiSubmit() {
    if (multiSelected.length === 0) return;
    const updated = { ...answers, [step.field]: multiSelected };
    setAnswers(updated);
    if (!isLast) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  async function handleFinish() {
    let finalAnswers = { ...answers };

    if (step.type === 'text' && textValue.trim()) {
      finalAnswers[step.field] = textValue.trim();
    } else if (step.type === 'multi' && multiSelected.length > 0) {
      finalAnswers[step.field] = multiSelected;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: finalAnswers }),
      });

      if (res.ok) {
        const { userId } = await res.json();
        localStorage.setItem('homewise_user', userId);
        router.push('/dashboard');
      }
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/50">
            Step {currentStep + 1} of {steps.length}
          </span>
          {currentStep > 0 && (
            <button onClick={handleBack} className="text-sm text-primary hover:underline">
              Back
            </button>
          )}
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-8">
        <h2 className="mb-6 text-2xl">{step.question}</h2>

        {step.type === 'choice' && (
          <div className="grid gap-3">
            {step.options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  if (isLast) {
                    const updated = { ...answers, [step.field]: option };
                    setAnswers(updated);
                  } else {
                    handleChoice(option);
                  }
                }}
                className={`text-left px-5 py-4 rounded-lg border transition-all ${
                  answers[step.field] === option
                    ? 'bg-primary/20 border-primary text-white'
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {step.type === 'text' && (
          <form onSubmit={isLast ? (e) => { e.preventDefault(); handleFinish(); } : handleTextSubmit}>
            <input
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={step.placeholder}
              className="input w-full mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="btn"
              disabled={!textValue.trim() || saving}
            >
              {isLast ? (saving ? 'Saving...' : 'Finish') : 'Continue'}
            </button>
          </form>
        )}

        {step.type === 'multi' && (
          <div>
            <div className="grid gap-3 sm:grid-cols-2 mb-6">
              {step.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleMultiToggle(option)}
                  className={`text-left px-5 py-3 rounded-lg border transition-all ${
                    multiSelected.includes(option)
                      ? 'bg-primary/20 border-primary text-white'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {multiSelected.includes(option) ? '✓ ' : ''}{option}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">
                {multiSelected.length} of {step.maxSelect} selected
              </span>
              <button
                onClick={isLast ? handleFinish : handleMultiSubmit}
                className="btn"
                disabled={multiSelected.length === 0 || saving}
              >
                {isLast ? (saving ? 'Saving...' : 'Finish') : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {isLast && step.type === 'choice' && answers[step.field] && (
          <button
            onClick={handleFinish}
            className="btn btn-lg mt-6 w-full"
            disabled={saving}
          >
            {saving ? 'Saving your profile...' : 'Finish & Go to Dashboard'}
          </button>
        )}
      </div>
    </div>
  );
}
