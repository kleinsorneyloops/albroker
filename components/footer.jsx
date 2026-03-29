"use client";

import Link from 'next/link';

function AlBrokerLogo({ size = 28 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <circle cx="50" cy="8" r="5" fill="#FF7043" />
            <rect x="48" y="12" width="4" height="14" rx="2" fill="#02DFD8" />
            <rect x="18" y="26" width="64" height="58" rx="16" fill="#FF7043" />
            <circle cx="37" cy="52" r="10" fill="#263238" />
            <circle cx="63" cy="52" r="10" fill="#263238" />
            <circle cx="39" cy="50" r="4" fill="#FFFFFF" />
            <circle cx="65" cy="50" r="4" fill="#FFFFFF" />
            <rect x="35" y="68" width="30" height="6" rx="3" fill="#263238" />
            <rect x="8" y="42" width="10" height="20" rx="5" fill="#02DFD8" />
            <rect x="82" y="42" width="10" height="20" rx="5" fill="#02DFD8" />
        </svg>
    );
}

export function Footer() {
    return (
        <footer className="pt-16 pb-12 sm:pt-20 sm:pb-16">
            <div
                style={{ borderTop: '1.5px solid color-mix(in oklab, var(--border) 25%, transparent)', paddingTop: '2rem' }}
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    {/* Brand lockup */}
                    <div className="flex items-center gap-2">
                        <div
                            className="flex items-center justify-center rounded-lg"
                            style={{
                                background: 'var(--bg-card)',
                                border: '1.5px solid var(--border)',
                                boxShadow: '2px 2px 0 var(--shadow)',
                                padding: '4px',
                            }}
                        >
                            <AlBrokerLogo size={28} />
                        </div>
                        <div>
                            <p className="font-black italic text-lg leading-none mb-0.5" style={{ color: 'var(--text)' }}>
                                AL BR<span style={{ color: 'var(--color-rocket)' }}>O</span>KER
                            </p>
                            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                                Your AI Real Estate Assistant · Est. 2024
                            </p>
                        </div>
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
