import Link from 'next/link';

export default function Page() {
    return (
        <div className="flex flex-col gap-20">

            {/* ── Hero ── */}
            <section className="pt-6 sm:pt-10">
                {/* Pill badges */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="badge badge-new">Est. 2024</span>
                    <span className="badge badge-verified">AI-Powered</span>
                    <span className="badge badge-active">Free to Use</span>
                </div>

                <h1 className="mb-5" style={{ maxWidth: '720px' }}>
                    Find your home with
                    <span style={{ color: 'var(--color-rocket)' }}> confidence</span>
                </h1>

                <p className="text-lg mb-8" style={{ color: 'var(--text-muted)', maxWidth: '560px', lineHeight: 1.6 }}>
                    Al Broker helps you understand what matters most when buying a home.
                    Save listings, get personalized AI insights, and feel prepared when
                    working with your realtor.
                </p>

                {/* Stat strip */}
                <div className="flex flex-wrap gap-6 mb-10">
                    {[
                        { icon: '🏠', label: 'Any listing site' },
                        { icon: '🤖', label: 'AI-powered insights' },
                        { icon: '✓', label: 'Free to use' },
                    ].map(s => (
                        <div key={s.label} className="flex items-center gap-2">
                            <span style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '1.75rem', height: '1.75rem',
                                background: 'var(--color-teal)',
                                borderRadius: '50%',
                                fontSize: '0.7rem',
                                border: '1.5px solid var(--border)',
                                boxShadow: '2px 2px 0 var(--shadow)'
                            }}>{s.icon}</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)' }}>{s.label}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-4">
                    <Link href="/onboard" className="btn btn-lg">Get Started →</Link>
                    <Link href="/dashboard" className="btn btn-lg btn-outline">Search Homes</Link>
                </div>
            </section>

            {/* ── Feature Cards ── */}
            <section>
                <p className="section-label mb-8">How it helps you</p>
                <div className="grid gap-6 sm:grid-cols-3">
                    <FeatureCard
                        title="Tell us about you"
                        description="Answer a few questions about your lifestyle, budget, and priorities so we can personalize your experience."
                        accentColor="var(--color-teal)"
                        icon={
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        }
                    />
                    <FeatureCard
                        title="Save homes you like"
                        description="Paste listings from Zillow, Realtor.com, or Redfin. We'll pull the details and save them for you to review."
                        accentColor="var(--color-rocket)"
                        icon={
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        }
                    />
                    <FeatureCard
                        title="Learn what matters"
                        description="Get AI-powered insights on schools, commutes, neighborhoods, and what to ask your realtor."
                        accentColor="var(--text)"
                        icon={
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        }
                    />
                </div>
            </section>

            {/* ── How it works ── */}
            <section
                className="rounded-lg p-8 sm:p-10"
                style={{
                    background: 'var(--bg-card)',
                    border: '1.5px solid var(--border)',
                    boxShadow: '4px 4px 0 var(--shadow)'
                }}
            >
                <p className="section-label mb-2">The process</p>
                <h2 className="mb-8">How it works</h2>
                <div className="grid gap-8 sm:grid-cols-4">
                    <Step number="1" title="Share your priorities"
                        description="Tell us about your budget, lifestyle, and what you need in a home."
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                    />
                    <Step number="2" title="Browse listings"
                        description="Paste links to homes from Zillow, Redfin, or any major listing site."
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />}
                    />
                    <Step number="3" title="Get AI insights"
                        description="Our AI analyzes each home based on your priorities and educates you on key factors."
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />}
                    />
                    <Step number="4" title="Meet prepared"
                        description="Walk into conversations knowing what to ask and what matters most to you."
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />}
                    />
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section
                className="rounded-lg p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                style={{
                    background: 'var(--color-rocket)',
                    border: '1.5px solid var(--border)',
                    boxShadow: '4px 4px 0 var(--shadow)'
                }}
            >
                <div>
                    <h2 className="mb-2" style={{ color: '#ffffff' }}>Ready to start your search?</h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '420px' }}>
                        It only takes 2 minutes to set up your profile and start getting personalized insights.
                    </p>
                </div>
                <Link
                    href="/onboard"
                    className="btn whitespace-nowrap"
                    style={{
                        background: '#ffffff',
                        color: 'var(--color-rocket)',
                        border: '2px solid #263238',
                        boxShadow: '3px 3px 0 #263238',
                        flexShrink: 0
                    }}
                >
                    Get Started →
                </Link>
            </section>

        </div>
    );
}

function FeatureCard({ title, description, icon, accentColor }) {
    return (
        <div className="card rounded-lg p-6 flex flex-col gap-4">
            <div
                className="flex items-center justify-center w-12 h-12 rounded-lg"
                style={{ background: accentColor, border: '1.5px solid var(--border)', boxShadow: '2px 2px 0 var(--shadow)' }}
            >
                <svg className="w-6 h-6" fill="none"
                    stroke={accentColor === 'var(--text)' ? '#ffffff' : '#263238'}
                    viewBox="0 0 24 24">
                    {icon}
                </svg>
            </div>
            <div>
                <h3 className="mb-2" style={{ fontSize: '1.05rem' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
            </div>
        </div>
    );
}

function Step({ number, title, description, icon }) {
    return (
        <div className="flex flex-col gap-3">
            <div className="relative w-12 h-12">
                <div
                    className="flex items-center justify-center w-12 h-12 rounded-lg"
                    style={{ background: 'var(--bg)', border: '1.5px solid var(--border)' }}
                >
                    <svg className="w-6 h-6" fill="none" stroke="var(--text)" viewBox="0 0 24 24">
                        {icon}
                    </svg>
                </div>
                <div
                    className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full text-xs font-black"
                    style={{ background: 'var(--color-rocket)', color: '#ffffff', border: '1.5px solid var(--border)' }}
                >
                    {number}
                </div>
            </div>
            <h3 className="text-base font-bold">{title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
        </div>
    );
}import Link from 'next/link';

const ROCKET = '#FF7043';
const TEAL = '#02DFD8';
const DEEPSPACE = '#263238';
const MINT_BG = '#E0F2F1';
const WHITE = '#FFFFFF';

export default function Page() {
    return (
        <div className="flex flex-col gap-16">

            {/* ── Hero ── */}
            <section className="pt-8 sm:pt-12">
                <div className="inline-flex items-center gap-2 mb-4">
                    <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '0.2rem 0.65rem',
                        border: `1.5px solid ${DEEPSPACE}`,
                        borderRadius: '9999px',
                        fontSize: '0.65rem', fontWeight: 700,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        color: DEEPSPACE
                    }}>Est. 2024</span>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '0.2rem 0.65rem',
                        border: `1.5px solid ${TEAL}`,
                        borderRadius: '9999px',
                        fontSize: '0.65rem', fontWeight: 700,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        color: TEAL
                    }}>AI-Powered</span>
                </div>

                <h1 className="mb-6" style={{ color: DEEPSPACE }}>
                    Find your home with
                    <span style={{ color: ROCKET }}> confidence</span>
                </h1>

                <p className="text-lg max-w-2xl mb-8" style={{ color: DEEPSPACE }}>
                    Al Broker helps you understand what matters most when buying a home.
                    Save listings you love, get personalized insights, and feel
                    prepared when working with your realtor.
                </p>

                {/* Stat strip */}
                <div className="flex flex-wrap gap-6 mb-8">
                    {[
                        { icon: '🏠', label: 'Any listing site' },
                        { icon: '🤖', label: 'AI-powered insights' },
                        { icon: '✓', label: 'Free to use' },
                    ].map(s => (
                        <div key={s.label} className="flex items-center gap-2">
                            <span style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '1.5rem', height: '1.5rem',
                                background: TEAL, borderRadius: '50%',
                                fontSize: '0.65rem', color: DEEPSPACE, fontWeight: 900
                            }}>{s.icon}</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: DEEPSPACE }}>{s.label}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-4">
                    <Link href="/onboard" className="btn btn-lg">Get Started →</Link>
                    <Link href="/dashboard" className="btn btn-lg btn-outline">Search Homes</Link>
                </div>
            </section>

            {/* ── Feature Cards ── */}
            <section className="grid gap-6 sm:grid-cols-3">
                <FeatureCard
                    title="Tell us about you"
                    description="Answer a few questions about your lifestyle, budget, and priorities so we can personalize your experience."
                    iconBg={TEAL}
                    icon={
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    }
                />
                <FeatureCard
                    title="Save homes you like"
                    description="Paste listings from Zillow, Realtor.com, or Redfin. We'll pull the details and save them for you to review."
                    iconBg={ROCKET}
                    icon={
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    }
                />
                <FeatureCard
                    title="Learn what matters"
                    description="Get AI-powered insights on schools, commutes, neighborhoods, and what to ask your realtor."
                    iconBg={DEEPSPACE}
                    icon={
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    }
                />
            </section>

            {/* ── How it works ── */}
            <section
                className="rounded-lg p-8"
                style={{
                    background: WHITE,
                    border: `1.5px solid ${DEEPSPACE}`,
                    boxShadow: `4px 4px 0 ${DEEPSPACE}`
                }}
            >
                <h2 className="mb-8" style={{ color: DEEPSPACE }}>How it works</h2>
                <div className="grid gap-8 sm:grid-cols-4">
                    <Step
                        number="1"
                        title="Share your priorities"
                        description="Tell us about your budget, lifestyle, and what you need in a home."
                        icon={
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        }
                    />
                    <Step
                        number="2"
                        title="Browse listings"
                        description="Paste links to homes from Zillow, Redfin, or any major listing site."
                        icon={
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        }
                    />
                    <Step
                        number="3"
                        title="Get personalized insights"
                        description="Our AI analyzes each home based on your priorities and educates you on key factors."
                        icon={
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        }
                    />
                    <Step
                        number="4"
                        title="Meet your realtor prepared"
                        description="Walk into conversations knowing what to ask and what matters most to you."
                        icon={
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        }
                    />
                </div>
            </section>

        </div>
    );
}

function FeatureCard({ title, description, icon, iconBg }) {
    return (
        <div
            className="rounded-lg p-6"
            style={{
                background: WHITE,
                border: `1.5px solid ${DEEPSPACE}`,
                boxShadow: `3px 3px 0 ${DEEPSPACE}`
            }}
        >
            <div
                className="flex items-center justify-center w-12 h-12 rounded-lg mb-4"
                style={{ background: iconBg }}
            >
                <svg className="w-6 h-6" fill="none" stroke={iconBg === DEEPSPACE ? WHITE : DEEPSPACE} viewBox="0 0 24 24">
                    {icon}
                </svg>
            </div>
            <h3 className="mb-2 text-lg" style={{ color: DEEPSPACE }}>{title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: DEEPSPACE }}>{description}</p>
        </div>
    );
}

function Step({ number, title, description, icon }) {
    return (
        <div className="flex flex-col gap-3">
            {/* Icon circle with number badge */}
            <div className="relative w-12 h-12 mb-1">
                <div
                    className="flex items-center justify-center w-12 h-12 rounded-lg"
                    style={{ background: MINT_BG, border: `1.5px solid ${DEEPSPACE}` }}
                >
                    <svg className="w-6 h-6" fill="none" stroke={DEEPSPACE} viewBox="0 0 24 24">
                        {icon}
                    </svg>
                </div>
                <div
                    className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full text-xs font-black"
                    style={{ background: ROCKET, color: WHITE }}
                >
                    {number}
                </div>
            </div>
            <h3 className="text-base font-bold" style={{ color: DEEPSPACE }}>{title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: DEEPSPACE }}>{description}</p>
        </div>
    );
}
