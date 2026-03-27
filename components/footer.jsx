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
}
