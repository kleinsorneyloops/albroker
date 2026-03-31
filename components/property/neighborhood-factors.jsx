export function NeighborhoodFactors({ context }) {
  if (!context?.factors?.length) return null;

  return (
    <div className="card px-6 py-8">
      <h3 className="mb-4" style={{ color: 'var(--text)' }}>Property Analysis</h3>
      <div className="grid gap-3">
        {context.factors.map((factor, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3"
            style={{ borderBottom: i < context.factors.length - 1 ? '1px solid color-mix(in oklab, var(--border) 20%, transparent)' : 'none' }}
          >
            <span
              className="text-sm font-semibold sm:w-36 shrink-0"
              style={{ color: 'var(--text-muted)' }}
            >
              {factor.label}
            </span>
            <span className="font-medium" style={{ color: 'var(--text)' }}>{factor.value}</span>
            <span className="text-sm sm:ml-auto" style={{ color: 'var(--color-rocket)' }}>{factor.insight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
