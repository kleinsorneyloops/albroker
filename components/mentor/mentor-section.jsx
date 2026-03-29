export function MentorSection({ analysis, isLoading }) {
  return (
    <div className="card px-6 py-8">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{ background: 'color-mix(in oklab, var(--color-rocket) 15%, transparent)', border: '1.5px solid var(--border)' }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="var(--color-rocket)"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <div>
          <h3 style={{ color: 'var(--text)' }}>Homebuying Insights</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Personalized guidance for this property</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 py-8">
          <div
            className="w-5 h-5 border-2 rounded-full animate-spin"
            style={{
              borderColor: 'color-mix(in oklab, var(--color-rocket) 30%, transparent)',
              borderTopColor: 'var(--color-rocket)',
            }}
          />
          <p style={{ color: 'var(--text-muted)' }}>Analyzing this property for you...</p>
        </div>
      )}

      {!isLoading && analysis && (
        <div
          className="prose prose-sm max-w-none leading-relaxed whitespace-pre-wrap"
          style={{ color: 'var(--text)' }}
        >
          {analysis}
        </div>
      )}

      {!isLoading && !analysis && (
        <p className="py-4" style={{ color: 'var(--text-muted)' }}>
          Search for a property above to get personalized insights.
        </p>
      )}
    </div>
  );
}export function MentorSection({ analysis, isLoading }) {
  return (
    <div className="bg-white rounded-lg text-neutral-600">
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-full">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-neutral-900">Homebuying Insights</h3>
            <p className="text-sm text-neutral-500">Personalized guidance for this property</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center gap-3 py-8">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-neutral-500">Analyzing this property for you...</p>
          </div>
        )}

        {!isLoading && analysis && (
          <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-wrap leading-relaxed">
            {analysis}
          </div>
        )}

        {!isLoading && !analysis && (
          <p className="text-neutral-400 py-4">
            Search for a property above to get personalized insights.
          </p>
        )}
      </div>
    </div>
  );
}
