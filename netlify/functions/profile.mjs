function computeCompleteness(profile) {
  const fields = [
    'journeyStage', 'buyerType', 'buyingReason', 'purchaseTimeframe',
    'processConfidence', 'topicsUnderstood', 'topicsConfusing', 'monthlyCostUnderstanding',
    'financialFears', 'processFears', 'financialUncertaintyInfluence', 'biggestBlocker',
    'wishKnewBeforeSearch', 'homePriorities', 'decisionInfluence', 'researchMethod',
    'ageRange', 'householdSize', 'householdIncome', 'targetBudgetRange',
    'currentHousingSituation', 'employmentSituation', 'targetMarket',
  ];
  const filled = fields.filter((f) => {
    const v = profile[f];
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== null && v !== '';
  });
  return Math.round((filled.length / fields.length) * 100);
}

export const config = {
  path: '/api/profile',
};
