import Link from 'next/link';

const navItems = [
    { linkText: 'Home', href: '/' },
    { linkText: 'Search', href: '/dashboard' },
    { linkText: 'Saved', href: '/saved' },
    { linkText: 'Learn', href: '/learn' },
];

export function Header() {
    return (
        <nav className="flex flex-wrap items-center gap-4 pt-6 pb-12 sm:pt-12 md:pb-16">
            <Link href="/" className="text-xl font-bold no-underline text-white hover:text-primary transition">
                HomeWise
            </Link>
            <ul className="flex flex-wrap gap-x-2 gap-y-1 ml-4">
                {navItems.map((item, index) => (
                    <li key={index}>
                        <Link
                            href={item.href}
                            className="inline-flex px-3 py-2 text-sm text-white/70 no-underline hover:text-white transition"
                        >
                            {item.linkText}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
