export function NeighborhoodFactors({ context }) {
  if (!context?.factors?.length) return null;

  return (
    <div className="bg-white rounded-sm text-neutral-600">
      <div className="px-6 py-8">
        <h3 className="text-neutral-900 mb-4">Neighborhood Context</h3>
        <div className="grid gap-3">
          {context.factors.map((factor, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b border-neutral-100 last:border-0"
            >
              <span className="text-sm font-semibold text-neutral-500 sm:w-36 shrink-0">
                {factor.label}
              </span>
              <span className="font-medium text-neutral-900">{factor.value}</span>
              <span className="text-sm text-emerald-600 sm:ml-auto">{factor.insight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
