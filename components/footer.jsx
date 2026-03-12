import Link from 'next/link';

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
