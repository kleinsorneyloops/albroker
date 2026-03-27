import Link from 'next/link';

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
