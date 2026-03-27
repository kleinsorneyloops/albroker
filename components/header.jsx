import Link from 'next/link';

const navItems = [
    { linkText: 'Home', href: '/' },
    { linkText: 'Search', href: '/dashboard' },
    { linkText: 'Saved', href: '/saved' },
    { linkText: 'Learn', href: '/learn' },
];

function AlBrokerLogo() {
    return (
        <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
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
        <nav className="flex flex-wrap items-center gap-4 pt-6 pb-12 sm:pt-12 md:pb-16">
            <Link
                href="/"
                className="flex items-center gap-2 no-underline transition-opacity hover:opacity-80"
                style={{ color: 'var(--text)' }}
            >
                <AlBrokerLogo />
                <span
                    className="text-xl font-black italic"
                    style={{ color: 'var(--text)' }}
                >
                    AL BR
                    <span style={{ color: 'var(--color-rocket)' }}>O</span>
                    KER
                </span>
            </Link>

            <ul className="flex flex-wrap gap-x-1 gap-y-1 ml-4">
                {navItems.map((item, index) => (
                    <li key={index}>
                        <Link
                            href={item.href}
                            className="inline-flex px-3 py-2 text-sm font-semibold no-underline transition-all rounded"
                            style={{ color: 'var(--text)' }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = 'var(--color-rocket)';
                                e.currentTarget.style.background = 'color-mix(in oklab, var(--color-rocket) 8%, transparent)';
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
            </ul>
        </nav>
    );
}import Link from 'next/link';

const navItems = [
    { linkText: 'Home', href: '/' },
    { linkText: 'Search', href: '/dashboard' },
    { linkText: 'Saved', href: '/saved' },
    { linkText: 'Learn', href: '/learn' },
];

function AlBrokerLogo() {
    return (
        <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
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
        <nav className="flex flex-wrap items-center gap-4 pt-6 pb-12 sm:pt-12 md:pb-16">
            <Link
                href="/"
                className="flex items-center gap-2 no-underline transition-opacity hover:opacity-80"
                style={{ color: 'var(--text)' }}
            >
                <AlBrokerLogo />
                <span
                    className="text-xl font-black italic"
                    style={{ color: 'var(--text)' }}
                >
                    AL BR
                    <span style={{ color: 'var(--color-rocket)' }}>O</span>
                    KER
                </span>
            </Link>

            <ul className="flex flex-wrap gap-x-1 gap-y-1 ml-4">
                {navItems.map((item, index) => (
                    <li key={index}>
                        <Link
                            href={item.href}
                            className="inline-flex px-3 py-2 text-sm font-semibold no-underline transition-all rounded"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = 'var(--color-rocket)';
                                e.currentTarget.style.background = 'color-mix(in oklab, var(--color-rocket) 8%, transparent)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = 'var(--text-muted)';
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            {item.linkText}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
