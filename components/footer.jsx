import Link from 'next/link';

export function Footer() {
    return (
        <footer className="pt-16 pb-12 sm:pt-20 sm:pb-16">
            <div
                style={{ borderTop: '1.5px solid color-mix(in oklab, var(--border) 25%, transparent)', paddingTop: '2rem' }}
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    {/* Brand lockup */}
                    <div>
                        <p className="font-black italic text-lg mb-1" style={{ color: 'var(--text)' }}>
                            AL BR<span style={{ color: 'var(--color-rocket)' }}>O</span>KER
                        </p>
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                            Your AI Real Estate Assistant · Est. 2024
                        </p>
                    </div>

                    {/* Nav */}
                    <nav className="flex gap-1">
                        {[
                            { label: 'Get Started', href: '/onboard' },
                            { label: 'Search', href: '/dashboard' },
                            { label: 'Saved', href: '/saved' },
                            { label: 'Learn', href: '/learn' },
                        ].map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="inline-flex px-3 py-2 text-sm font-semibold no-underline rounded-md transition-all"
                                style={{ color: 'var(--text-muted)' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = 'var(--color-rocket)';
                                    e.currentTarget.style.background = 'color-mix(in oklab, var(--color-rocket) 10%, transparent)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = 'var(--text-muted)';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
}import Link from 'next/link';

export function Footer() {
    return (
        <footer className="pt-16 pb-12 sm:pt-24 sm:pb-16">
            <div
                className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
                style={{ borderTop: '1.5px solid color-mix(in oklab, var(--border) 20%, transparent)', paddingTop: '1.5rem' }}
            >
                <p className="font-semibold italic" style={{ color: 'var(--text)' }}>
                    <span style={{ color: 'var(--color-rocket)' }}>AL BR</span>
                    <span style={{ color: 'var(--text)' }}>OKER</span>
                    <span className="font-normal not-italic ml-2" style={{ color: 'var(--text)' }}>
                        — Your AI real estate assistant · Est. 2024
                    </span>
                </p>
                <div className="flex gap-6">
                    <Link
                        href="/onboard"
                        className="text-sm font-semibold no-underline transition-opacity hover:opacity-80"
                        style={{ color: 'var(--text)' }}
                    >
                        Get Started
                    </Link>
                    <Link
                        href="/learn"
                        className="text-sm font-semibold no-underline transition-opacity hover:opacity-80"
                        style={{ color: 'var(--text)' }}
                    >
                        Learn
                    </Link>
                </div>
            </div>
        </footer>
    );
}import Link from 'next/link';

export function Footer() {
    return (
        <footer className="pt-16 pb-12 sm:pt-24 sm:pb-16">
            <div
                className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
                style={{ borderTop: '1.5px solid color-mix(in oklab, var(--border) 20%, transparent)', paddingTop: '1.5rem' }}
            >
                <p className="font-semibold italic" style={{ color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--color-rocket)' }}>AL BR</span>
                    <span style={{ color: 'var(--text-muted)' }}>OKER</span>
                    <span className="font-normal not-italic ml-2" style={{ color: 'var(--text-muted)' }}>
                        — Your AI real estate assistant · Est. 2024
                    </span>
                </p>
                <div className="flex gap-6">
                    <Link
                        href="/onboard"
                        className="text-sm font-semibold no-underline transition-opacity hover:opacity-80"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        Get Started
                    </Link>
                    <Link
                        href="/learn"
                        className="text-sm font-semibold no-underline transition-opacity hover:opacity-80"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        Learn
                    </Link>
                </div>
            </div>
        </footer>
    );
}import Link from 'next/link';

export function Footer() {
    return (
        <footer className="pt-16 pb-12 sm:pt-24 sm:pb-16">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
                <p>Al Broker — Your AI real estate assistant.</p>
                <div className="flex gap-6">
                    <Link href="/onboard" className="text-white/40 hover:text-white/60 no-underline">
                        Get Started
                    </Link>
                    <Link href="/learn" className="text-white/40 hover:text-white/60 no-underline">
                        Learn
                    </Link>
                </div>
            </div>
        </footer>
    );
}
