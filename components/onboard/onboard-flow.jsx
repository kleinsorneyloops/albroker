'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const steps = [
  {
    id: 'journey_stage',
    section: 'Section 1 — Journey Snapshot',
    question: 'Where are you in your homebuying journey?',
    type: 'choice',
    options: ['Just exploring', 'Actively searching', 'Under contract', 'Bought in last 12 months', 'Waiting for the right time'],
    field: 'journeyStage',
  },
  {
    id: 'buyer_type',
    section: 'Section 1 — Journey Snapshot',
    question: 'Is this your first time buying a home?',
    type: 'choice',
    options: ['Yes, first-time', 'No, repeat buyer', 'Investor'],
    field: 'buyerType',
  },
  {
    id: 'buying_reason',
    section: 'Section 1 — Journey Snapshot',
    question: 'Primary reason for buying',
    type: 'choice',
    options: ['Starting a family', 'Relocation', 'Wealth building', 'Tired of renting', 'Downsizing', 'Other'],
    field: 'buyingReason',
  },
  {
    id: 'purchase_timeframe',
    section: 'Section 1 — Journey Snapshot',
    question: 'Target purchase timeframe',
    type: 'choice',
    options: ['Within 3 months', '3–6 months', '6–12 months', '1–2 years', 'No set timeline'],
    field: 'purchaseTimeframe',
  },
  {
    id: 'confidence_process',
    section: 'Section 2 — Knowledge & Process Confidence',
    question: 'Overall confidence in the homebuying process',
    type: 'scale',
    min: 1,
    max: 5,
    field: 'processConfidence',
    helperText: '1 = very low confidence, 5 = very confident',
  },
  {
    id: 'understand_well',
    section: 'Section 2 — Knowledge & Process Confidence',
    question: 'Topics you feel you understand well',
    type: 'multi',
    options: [
      'Mortgage pre-approval',
      'Down payment requirements',
      'Closing costs',
      'Home inspection',
      'Making an offer',
      'Negotiating price',
      'Title & escrow',
      'HOA rules',
      'Property taxes',
      'None',
    ],
    field: 'topicsUnderstood',
  },
  {
    id: 'confusing_topics',
    section: 'Section 2 — Knowledge & Process Confidence',
    question: 'Topics that feel confusing or unclear',
    type: 'multi',
    options: [
      'Mortgage types',
      'How much I can afford',
      'What a good deal looks like',
      'Timing the market',
      'Hidden ownership costs',
      'Choosing a neighborhood',
      'Working with an agent',
      'Legal paperwork',
    ],
    field: 'topicsConfusing',
  },
  {
    id: 'monthly_cost_confidence',
    section: 'Section 2 — Knowledge & Process Confidence',
    question: 'Understanding of total monthly costs after buying',
    type: 'scale',
    min: 1,
    max: 5,
    field: 'monthlyCostUnderstanding',
    helperText: '1 = unclear, 5 = very clear',
  },
  {
    id: 'financial_fears',
    section: 'Section 3 — Concerns & Blockers',
    question: 'Financial fears (pick up to 2)',
    type: 'multi',
    options: [
      'Overpaying',
      'Not qualifying for a mortgage',
      'Not enough saved',
      'Interest rates rising',
      'Market crashing after I buy',
      'Job/income instability',
    ],
    maxSelect: 2,
    field: 'financialFears',
  },
  {
    id: 'process_fears',
    section: 'Section 3 — Concerns & Blockers',
    question: 'Process/emotional fears (pick up to 2)',
    type: 'multi',
    options: [
      'Missing hidden defects',
      'Being outbid',
      'Making a decision I\'ll regret',
      'Getting bad advice',
      'Feeling rushed or pressured',
    ],
    maxSelect: 2,
    field: 'processFears',
  },
  {
    id: 'uncertainty_influence',
    section: 'Section 3 — Concerns & Blockers',
    question: 'How much does financial uncertainty influence your decision right now?',
    type: 'scale',
    min: 1,
    max: 5,
    field: 'financialUncertaintyInfluence',
    helperText: '1 = minimal impact, 5 = major impact',
  },
  {
    id: 'biggest_blocker',
    section: 'Section 3 — Concerns & Blockers',
    question: 'Single biggest thing holding you back today',
    type: 'choice',
    options: [
      'Not enough down payment',
      'Credit score',
      "Haven't found the right home",
      'Waiting for prices to drop',
      'Life circumstances',
      'Nothing — ready now',
    ],
    field: 'biggestBlocker',
  },
  {
    id: 'wish_knew',
    section: 'Section 3 — Concerns & Blockers',
    question: 'What do you wish someone had told you before starting your search?',
    type: 'text',
    placeholder: 'Share anything you wish you had known earlier...',
    field: 'wishKnewBeforeSearch',
  },
  {
    id: 'home_priorities',
    section: 'Section 4 — Decision Drivers & Priorities',
    question: 'Top 3 priorities when choosing a home (ranked by selection order)',
    type: 'ranked-multi',
    options: [
      'Price',
      'School district',
      'Commute',
      'Size & layout',
      'Neighborhood safety',
      'Investment value',
      'Proximity to family',
      'Move-in ready',
      'Outdoor space',
    ],
    maxSelect: 3,
    field: 'homePriorities',
  },
  {
    id: 'decision_influence',
    section: 'Section 4 — Decision Drivers & Priorities',
    question: 'Who has the most influence on your decision?',
    type: 'choice',
    options: ['Spouse/partner', 'Parents/family', 'Financial advisor', 'Real estate agent', "Friends who've bought", 'Primarily myself'],
    field: 'decisionInfluence',
  },
  {
    id: 'research_method',
    section: 'Section 4 — Decision Drivers & Priorities',
    question: 'Primary research method',
    type: 'choice',
    options: ['Zillow/Realtor.com', 'Working with an agent', 'YouTube/podcasts', 'Friends & family', 'Social media', 'Books & articles'],
    field: 'researchMethod',
  },
  {
    id: 'age_range',
    section: 'Section 5 — Demographics',
    question: 'Age range',
    type: 'choice',
    options: ['Under 25', '25–34', '35–44', '45–54', '55–64', '65+'],
    field: 'ageRange',
  },
  {
    id: 'household_size',
    section: 'Section 5 — Demographics',
    question: 'Household size',
    type: 'choice',
    options: ['Just me', '2 adults no children', '2 adults + children', 'Single parent', 'Multi-generational'],
    field: 'householdSize',
  },
  {
    id: 'income',
    section: 'Section 5 — Demographics',
    question: 'Combined annual household income',
    type: 'choice',
    options: ['Under $50k', '$50k–$100k', '$100k–$150k', '$150k–$200k', '$200k–$300k', '$300k+', 'Prefer not to say'],
    field: 'householdIncome',
  },
  {
    id: 'budget_range',
    section: 'Section 5 — Demographics',
    question: 'Target budget range for home purchase',
    type: 'choice',
    options: ['Under $200k', '$200k–$350k', '$350k–$500k', '$500k–$750k', '$750k–$1M', '$1M+'],
    field: 'targetBudgetRange',
  },
  {
    id: 'housing_situation',
    section: 'Section 5 — Demographics',
    question: 'Current housing situation',
    type: 'choice',
    options: ['Renting apartment', 'Renting house', 'Living with family or friends', 'Own a home looking to move'],
    field: 'currentHousingSituation',
  },
  {
    id: 'employment',
    section: 'Section 5 — Demographics',
    question: 'Employment situation',
    type: 'choice',
    options: ['Employed full-time salary', 'Employed full-time hourly', 'Self-employed/freelance', 'Two-income household', 'Retired', 'Other'],
    field: 'employmentSituation',
  },
  {
    id: 'target_market',
    section: 'Section 5 — Demographics',
    question: 'Where are you looking to buy?',
    type: 'text',
    placeholder: 'City, metro area, or region',
    field: 'targetMarket',
  },
  {
    id: 'additional_context',
    section: 'Section 5 — Demographics',
    question: "Anything else you'd like us to know about your situation or what would help you most?",
    type: 'text',
    placeholder: 'Optional notes...',
    field: 'additionalContext',
    optional: true,
  },
];

function cleanProfileForForm(profile) {
  if (!profile) return {};

  const clean = {};
  for (const step of steps) {
    if (typeof profile[step.field] !== 'undefined') {
      clean[step.field] = profile[step.field];
    }
  }

  return clean;
}

export function OnboardFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [textValue, setTextValue] = useState('');
  const [multiSelected, setMultiSelected] = useState([]);
  const [scaleValue, setScaleValue] = useState(null);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const currentSectionStep = useMemo(() => {
    let position = 1;
    for (let i = 0; i < currentStep; i += 1) {
      if (steps[i].section === step.section) position += 1;
    }
    return position;
  }, [currentStep, step.section]);

  const totalSectionSteps = useMemo(
    () => steps.filter((s) => s.section === step.section).length,
    [step.section]
  );

  useEffect(() => {
    const storedId = localStorage.getItem('albroker_user');
    setUserId(storedId);

    if (!storedId) {
      setLoadingProfile(false);
      return;
    }

    async function loadProfile() {
      try {
        const res = await fetch(`/api/profile?userId=${storedId}`);
        if (!res.ok) return;

        const data = await res.json();
        const prefilledAnswers = cleanProfileForForm(data.profile);

        if (Object.keys(prefilledAnswers).length > 0) {
          setAnswers(prefilledAnswers);
          const firstMissingIndex = steps.findIndex((s) => {
            const value = prefilledAnswers[s.field];
            if (Array.isArray(value)) return value.length === 0;
            return !value;
          });
          if (firstMissingIndex >= 0) {
            setCurrentStep(firstMissingIndex);
          }
        }
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, []);

  useEffect(() => {
    const stored = answers[step.field];
    if (step.type === 'text') {
      setTextValue(typeof stored === 'string' ? stored : '');
    } else if (step.type === 'multi' || step.type === 'ranked-multi') {
      setMultiSelected(Array.isArray(stored) ? stored : []);
    } else if (step.type === 'scale') {
      const parsed = Number.parseInt(stored, 10);
      if (Number.isInteger(parsed)) {
        setScaleValue(parsed);
      } else {
        setScaleValue(step.min || 1);
      }
    } else {
      setTextValue('');
      setMultiSelected([]);
      setScaleValue(null);
    }
  }, [currentStep, answers, step.field, step.type, step.min]);

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

      const maxSelect = step.maxSelect || 99;
      if (prev.length >= maxSelect) return prev;

      return [...prev, value];
    });
  }

  function handleTextSubmit(e) {
    e.preventDefault();
    if (!step.optional && !textValue.trim()) return;

    const updated = {
      ...answers,
      [step.field]: textValue.trim(),
    };
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

  function handleScaleSubmit() {
    if (scaleValue === null || typeof scaleValue === 'undefined') return;
    const updated = { ...answers, [step.field]: String(scaleValue) };
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
    const finalAnswers = { ...answers };

    if (step.type === 'text') {
      if (textValue.trim() || step.optional) {
        finalAnswers[step.field] = textValue.trim();
      }
    } else if ((step.type === 'multi' || step.type === 'ranked-multi') && multiSelected.length > 0) {
      finalAnswers[step.field] = multiSelected;
    } else if (step.type === 'scale' && scaleValue !== null && typeof scaleValue !== 'undefined') {
      finalAnswers[step.field] = String(scaleValue);
    }

    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: finalAnswers, userId }),
      });

      if (!res.ok) {
        setSaving(false);
        return;
      }

      const { userId: savedUserId } = await res.json();
      localStorage.setItem('albroker_user', savedUserId);
      router.push('/profile');
    } catch {
      setSaving(false);
    }
  }

  if (loadingProfile) {
    return (
      <div className="max-w-2xl mx-auto card p-8 text-center">
        <p style={{ color: 'var(--text-muted)' }}>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="label mb-2">{step.section}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Question {currentSectionStep} of {totalSectionSteps} in this section
          </span>
          {currentStep > 0 && (
            <button onClick={handleBack} className="text-sm" style={{ color: 'var(--color-rocket)' }}>
              Back
            </button>
          )}
        </div>
        <div className="w-full rounded-full h-2" style={{ background: 'color-mix(in oklab, var(--text) 12%, transparent)' }}>
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: 'var(--color-rocket)' }}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          Overall progress: {currentStep + 1} of {steps.length}
        </p>
      </div>

      <div className="card p-8">
        <h2 className="mb-2 text-2xl">{step.question}</h2>
        {step.helperText && (
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{step.helperText}</p>
        )}

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
                    ? 'text-white'
                    : 'hover:opacity-90'
                }`}
                style={
                  answers[step.field] === option
                    ? { background: 'var(--color-rocket)', borderColor: 'var(--border)' }
                    : { background: 'var(--bg-card)', borderColor: 'color-mix(in oklab, var(--border) 20%, transparent)' }
                }
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {step.type === 'text' && (
          <form onSubmit={isLast ? (e) => { e.preventDefault(); handleFinish(); } : handleTextSubmit}>
            <textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={step.placeholder}
              className="input w-full mb-4 min-h-[120px] resize-y"
              autoFocus
            />
            <button
              type="submit"
              className="btn"
              disabled={(!step.optional && !textValue.trim()) || saving}
            >
              {isLast ? (saving ? 'Saving...' : 'Finish') : 'Continue'}
            </button>
          </form>
        )}

        {(step.type === 'multi' || step.type === 'ranked-multi') && (
          <div>
            <div className="grid gap-3 sm:grid-cols-2 mb-6">
              {step.options.map((option) => {
                const selectedIndex = multiSelected.indexOf(option);

                return (
                  <button
                    key={option}
                    onClick={() => handleMultiToggle(option)}
                    className="text-left px-5 py-3 rounded-lg border transition-all"
                    style={
                      selectedIndex >= 0
                        ? { background: 'color-mix(in oklab, var(--color-rocket) 15%, white)', borderColor: 'var(--color-rocket)' }
                        : { background: 'var(--bg-card)', borderColor: 'color-mix(in oklab, var(--border) 20%, transparent)' }
                    }
                  >
                    {step.type === 'ranked-multi' && selectedIndex >= 0 ? `${selectedIndex + 1}. ` : ''}
                    {step.type === 'multi' && selectedIndex >= 0 ? '✓ ' : ''}
                    {option}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {multiSelected.length} selected{step.maxSelect ? ` (up to ${step.maxSelect})` : ''}
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

        {step.type === 'scale' && (
          <div className="space-y-6">
            <div className="px-2">
              <input
                type="range"
                min={step.min || 1}
                max={step.max || 5}
                step={1}
                value={scaleValue ?? step.min ?? 1}
                onChange={(e) => setScaleValue(Number.parseInt(e.target.value, 10))}
                className="w-full accent-[var(--color-rocket)]"
              />
              <div className="mt-3 flex items-center justify-between text-sm" style={{ color: 'var(--text-muted)' }}>
                <span>{step.min || 1}</span>
                <span className="font-bold" style={{ color: 'var(--text)' }}>
                  Selected: {scaleValue ?? step.min ?? 1}
                </span>
                <span>{step.max || 5}</span>
              </div>
            </div>
            <button
              onClick={isLast ? handleFinish : handleScaleSubmit}
              className="btn"
              disabled={(scaleValue === null || typeof scaleValue === 'undefined') || saving}
            >
              {isLast ? (saving ? 'Saving...' : 'Finish') : 'Continue'}
            </button>
          </div>
        )}

        {isLast && step.type === 'choice' && answers[step.field] && (
          <button
            onClick={handleFinish}
            className="btn btn-lg mt-6 w-full"
            disabled={saving}
          >
            {saving ? 'Saving your profile...' : 'Finish & View Profile'}
          </button>
        )}
      </div>
    </div>
  );
}
