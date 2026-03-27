import Link from 'next/link';

export default function Page() {
    return (
        <div className="flex flex-col">

            {/* ── Hero — mint bg ── */}
            <section className="pt-6 sm:pt-10 pb-16">
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="badge badge-new">Est. 2024</span>
                    <span className="badge badge-verified">AI-Powered</span>
                    <span className="badge badge-active">Free to Use</span>
                </div>

                <h1 className="mb-5" style={{ maxWidth: '720px' }}>
                    Find your home with
                    <span style={{ color: 'var(--color-rocket)' }}> confidence</span>
                </h1>

                <p className="text-lg mb-8" style={{ color: 'var(--text-muted)', maxWidth: '560px', lineHeight: 1.7 }}>
                    Al Broker helps you understand what matters most when buying a home.
                    Save listings, get personalized AI insights, and feel prepared when
                    working with your realtor.
                </p>

                <div className="flex flex-wrap gap-4 mb-10">
                    <Link href="/onboard" className="btn btn-lg">Get Started →</Link>
                    <Link href="/dashboard" className="btn btn-lg btn-outline">Search Homes</Link>
                </div>

                <div className="flex flex-wrap gap-6">
                    {[
                        { icon: '🏠', label: 'Any listing site' },
                        { icon: '🤖', label: 'AI-powered insights' },
                        { icon: '✓', label: 'Free to use' },
                    ].map(s => (
                        <div key={s.label} className="flex items-center gap-2">
                            <span style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'c
