import Link from 'next/link';

export default function Page() {
    return (
        <div className="flex flex-col gap-16">
            <section className="pt-8 sm:pt-12">
                <div className="inline-flex items-center gap-2 mb-4">
                    <span className="badge badge-new">Est. 2024</span>
                    <span className="badge badge-verified">AI-Powered</span>
                </div>
                <h1 className="mb-6" style={{ color: 'var(--text)' }}>
                    Find your home with
                    <span style={{ color: 'var(--color-rocket)' }}> confidence</span>
                </h1>
                <p
                    className="text-lg max-w-2xl mb-8"
                    style={{ color: 'var(--text)' }}
                >
                    Al Broker helps you understand what matters most when buying a home.
                    Save listings you love, get personalized insights, and feel
                    prepared when working with your realtor.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Link href="/onboard" className="btn btn-lg">
                        Get Started →
                    </Link>
                    <Link href="/dashboard" className="btn btn-lg btn-outline">
                        Search Homes
                    </Link>
                </div>
            </section>

            <section className="grid gap-6 sm:grid-cols-3">
                <FeatureCard
                    title="Tell us about you"
                    description="Answer a few questions about your lifestyle, budget, and priorities so we can personalize your experience."
                    icon={
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    }
                />
                <FeatureCard
                    title="Save homes you like"
                    description="Paste listings from Zillow, Realtor.com, or Redfin. We'll pull the details and save them for you to review."
                    icon={
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    }
                />
                <FeatureCard
                    title="Learn what matters"
                    description="Get AI-powered insights on schools, commutes, neighborhoods, and what to ask your realtor."
                    icon={
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                    }
                />
            </section>

            <section
                className="rounded-lg p-8"
                style={{
                    background: 'var(--bg-card)',
                    border: '1.5px solid var(--border)',
                    boxShadow: '4px 4px 0 var(--shadow)'
                }}
            >
                <h2 className="mb-6" style={{ color: 'var(--text)' }}>How it works</h2>
                <div className="grid gap-8 sm:grid-cols-4">
                    <Step number="1" title="Share your priorities" description="Tell us about your budget, lifestyle, and what you need in a home." />
                    <Step number="2" title="Browse listings" description="Paste links to homes you find interesting from any major listing site." />
                    <Step number="3" title="Get personalized insights" description="Our AI analyzes each home based on your priorities and educates you on key factors." />
                    <Step number="4" title="Meet your realtor prepared" description="Walk into conversations knowing what to ask and what matters most to you." />
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ title, description, icon }) {
    return (
        <div
            className="rounded-lg p-6 transition-all"
            style={{
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border)',
                boxShadow: '3px 3px 0 var(--shadow)'
            }}
        >
            <div
                className="flex items-center justify-center w-12 h-12 rounded-lg mb-4"
                style={{ background: 'color-mix(in oklab, var(--color-rocket) 12%, transparent)' }}
            >
                <svg className="w-6 h-6" fill="none" stroke="var(--color-rocket)" viewBox="0 0 24 24">
                    {icon}
                </svg>
            </div>
            <h3 className="mb-2 text-lg" style={{ color: 'var(--text)' }}>{title}</h3>
            <p className="text-sm" style={{ color: 'var(--text)' }}>{description}</p>
        </div>
    );
}

function Step({ number, title, description }) {
    return (
        <div className="flex flex-col gap-2">
            <div
                className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-black italic"
                style={{ background: 'var(--color-rocket)', color: '#fff' }}
            >
                {number}
            </div>
            <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>{title}</h3>
            <p className="text-sm" style={{ color: 'var(--text)' }}>{description}</p>
        </div>
    );
}
