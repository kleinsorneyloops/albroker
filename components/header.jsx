"use client";

import Link from 'next/link';

const navItems = [
    { linkText: 'Home', href: '/' },
    { linkText: 'Search', href: '/dashboard' },
    { linkText: 'Saved', href: '/saved' },
];

function AlBrokerLogo({ size = 40 }) {
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

export function Header() {
    return (
        <nav
            className="flex flex-wrap items-center justify-between gap-4 pt-6 pb-10 sm:pt-10 md:pb-14"
            style={{ borderBottom: '1.5px solid color-mix(in oklab, var(--border) 15%, transparent)', marginBottom: '0.5rem' }}
        >
            {/* ── Logo lockup ── */}
            <Link
                href="/"
                className="flex items-center gap-3 no-underline group"
                style={{ color: 'var(--text)' }}
            >
                <div
                    className="relative flex items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105"
                    style={{
                        background: 'var(--bg-card)',
                        border: '1.5px solid var(--border)',
                        boxShadow: '3px 3px 0 var(--shadow)',
                        padding: '6px',
                    }}
                >
                    <AlBrokerLogo size={40} />
                </div>

                <div className="flex flex-col leading-none gap-1">
                    <span
                        className="text-2xl sm:text-3xl font-black italic tracking-tight"
                        style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
                    >
                        AL BR<span style={{ color: 'var(--color-rocket)' }}>O</span>KER
                    </span>
                    <span
                        className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: 'var(--text-muted)', letterSpacing: '0.12em' }}
                    >
                        AI Real Estate
                    </span>
                </div>
            </Link>

            {/* ── Nav links ── */}
            <ul className="flex flex-wrap gap-x-1 gap-y-1 items-center">
                {navItems.map((item, index) => (
                    <li key={index}>
                        <Link
                            href={item.href}
                            className="inline-flex px-4 py-2 text-sm font-bold no-underline transition-all rounded-md"
                            style={{ color: 'var(--text)' }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = 'var(--color-rocket)';
                                e.currentTarget.style.background = 'color-mix(in oklab, var(--color-rocket) 10%, transparent)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = 'var(--text)';
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            {item.linkText}
                        </Link>
                    </li>
                ))}
                <li>
                    <Link href="/learn" className="btn" style={{ '--btn-py': '0.5rem', '--btn-px': '1rem', fontSize: '0.875rem' }}>
                        Learn →
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
