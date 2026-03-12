export function MentorSection({ analysis, isLoading }) {
  return (
    <div className="bg-white rounded-sm text-neutral-600">
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full">
            <svg
              className="w-5 h-5 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-neutral-900">Mentor Analysis</h3>
            <p className="text-sm text-neutral-500">AI-powered market valuation insight</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center gap-3 py-8">
            <div className="w-5 h-5 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-neutral-500">Your mentor is analyzing this property...</p>
          </div>
        )}

        {!isLoading && analysis && (
          <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-wrap leading-relaxed">
            {analysis}
          </div>
        )}

        {!isLoading && !analysis && (
          <p className="text-neutral-400 py-4">
            Search for a property above to receive a mentor analysis.
          </p>
        )}
      </div>
    </div>
  );
}
