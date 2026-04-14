'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

function AlBrokerLogo() {
  return (
    <img
      src="/images/brand/logo-mark-light.svg"
      alt="Al Broker"
      width={36}
      height={36}
      style={{ flexShrink: 0 }}
    />
  );
}

// Static shell — matches server render exactly, preventing hydration mismatch
function NavShell({ children }) {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      paddingTop: '1.25rem', paddingBottom: '1.5rem',
      borderBottom: '1px solid color-mix(in oklab, var(--border) 20%, transparent)',
      marginBottom: '0.5rem',
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <img
          src="/images/brand/logo-wordmark-light.svg"
          alt="Al Broker"
          style={{ height: 48, width: 'auto', display: 'block' }}
        />
      </Link>
      {children}
    </nav>
  );
}

export function Header() {
  const pathname              = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hasUser, setHasUser] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setHasUser(!!localStorage.getItem('albroker_user'));
    setMounted(true);
  }, [pathname]); // re-check on route change in case user just completed onboard

  function isActive(href) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  const navLinks = hasUser
    ? [
        { label: 'Listings', href: '/listings' },
        { label: 'Saved',    href: '/saved'    },
        { label: 'Profile',  href: '/profile'  },
        { label: 'Learn',    href: '/learn'    },
      ]
    : [
        { label: 'Listings', href: '/listings' },
        { label: 'Learn',    href: '/learn'    },
      ];

  // Server render + pre-mount: just the logo, no user-specific content
  if (!mounted) {
    return (
      <NavShell>
        <div style={{ width: 110 }} /> {/* spacer to prevent layout shift */}
      </NavShell>
    );
  }

  return (
    <NavShell>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>

        {/* Nav links */}
        <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 2 }}>
          {navLinks.map(item => (
            <Link key={item.href} href={item.href} style={{
              padding: '6px 12px', borderRadius: 6,
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
              transition: 'all 0.12s',
              color: isActive(item.href) ? 'var(--color-rocket)' : 'var(--text-muted)',
              background: isActive(item.href)
                ? 'color-mix(in oklab, var(--color-rocket) 10%, transparent)'
                : 'transparent',
            }}>
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden sm:block" style={{ marginLeft: 8 }}>
          {hasUser ? (
            <Link href="/listings" className="btn" style={{ fontSize: 13, padding: '7px 16px' }}>
              My listings →
            </Link>
          ) : (
            <Link href="/onboard" className="btn" style={{ fontSize: 13, padding: '7px 16px' }}>
              Get started →
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="sm:hidden"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--text)' }}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {mobileOpen
              ? <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              : <path fillRule="evenodd" clipRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
            }
          </svg>
        </button>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
            background: 'var(--bg)', border: '1.5px solid var(--border)',
            borderRadius: '0 0 12px 12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            padding: '8px 0 12px',
          }}>
            {navLinks.map(item => (
              <Link key={item.href} href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block', padding: '10px 20px',
                  fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  color: isActive(item.href) ? 'var(--color-rocket)' : 'var(--text)',
                  background: isActive(item.href)
                    ? 'color-mix(in oklab, var(--color-rocket) 8%, transparent)'
                    : 'transparent',
                }}
              >
                {item.label}
              </Link>
            ))}
            <div style={{ padding: '8px 16px 0', borderTop: '1px solid var(--border)', marginTop: 8 }}>
              {hasUser ? (
                <Link href="/listings" className="btn"
                  style={{ display: 'block', textAlign: 'center', fontSize: 13 }}
                  onClick={() => setMobileOpen(false)}>
                  My listings →
                </Link>
              ) : (
                <Link href="/onboard" className="btn"
                  style={{ display: 'block', textAlign: 'center', fontSize: 13 }}
                  onClick={() => setMobileOpen(false)}>
                  Get started →
                </Link>
              )}
            </div>
          </div>
        )}

      </div>
    </NavShell>
  );
}
