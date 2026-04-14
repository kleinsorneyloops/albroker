import Link from 'next/link';

// ── On-brand SVG icons — unique per use, never reused ─────────────
// Trust signal icons
function IconNoAccount({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="4" y="4" width="32" height="32" rx="8" stroke="#263238" strokeWidth="2.5"/>
      <circle cx="20" cy="16" r="5" stroke="#263238" strokeWidth="2.5"/>
      <path d="M9 34c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke="#263238" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="8" x2="34" y2="14" stroke="#FF7043" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="34" y1="8" x2="28" y2="14" stroke="#FF7043" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconNoSell({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="15" stroke="#263238" strokeWidth="2.5"/>
      <path d="M20 10v10l6 4" stroke="#02DFD8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="8" y1="8" x2="32" y2="32" stroke="#FF7043" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="14" y="17" width="12" height="6" rx="2" fill="#263238"/>
      <line x1="17" y1="17" x2="17" y2="23" stroke="#02DFD8" strokeWidth="1.5"/>
      <line x1="20" y1="17" x2="20" y2="23" stroke="#02DFD8" strokeWidth="1.5"/>
      <line x1="23" y1="17" x2="23" y2="23" stroke="#02DFD8" strokeWidth="1.5"/>
    </svg>
  );
}
function IconFree({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="15" stroke="#263238" strokeWidth="2.5"/>
      <path d="M24 14c-2.2-2-5.8-2-8 0s-2 5.8 0 8l8 8" stroke="#263238" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="14" y1="20" x2="26" y2="20" stroke="#02DFD8" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="20" cy="20" r="3" fill="#FF7043"/>
    </svg>
  );
}
function IconUserControl({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="5" y="12" width="30" height="20" rx="4" stroke="#263238" strokeWidth="2.5"/>
      <circle cx="14" cy="22" r="3" fill="#02DFD8"/>
      <circle cx="26" cy="22" r="3" fill="#FF7043"/>
      <line x1="14" y1="12" x2="14" y2="8" stroke="#263238" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="26" y1="12" x2="26" y2="8" stroke="#263238" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="11" y="5" width="6" height="5" rx="1.5" fill="#02DFD8"/>
      <rect x="23" y="5" width="6" height="5" rx="1.5" fill="#FF7043"/>
      <line x1="17" y1="22" x2="23" y2="22" stroke="#263238" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2"/>
    </svg>
  );
}
// How it works icons
function IconPassphrase({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="15" cy="17" r="8" stroke="#263238" strokeWidth="2.5"/>
      <circle cx="15" cy="17" r="3.5" fill="#02DFD8"/>
      <rect x="21" y="15" width="14" height="4" rx="2" fill="#263238"/>
      <rect x="30" y="19" width="4" height="5" rx="2" fill="#263238"/>
      <rect x="25" y="19" width="4" height="4" rx="2" fill="#263238"/>
    </svg>
  );
}
function IconQuestions({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="5" y="5" width="30" height="22" rx="5" stroke="#263238" strokeWidth="2.5"/>
      <circle cx="20" cy="35" r="2" fill="#263238"/>
      <line x1="20" y1="27" x2="20" y2="32" stroke="#263238" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="13" y1="13" x2="27" y2="13" stroke="#02DFD8" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="13" y1="19" x2="21" y2="19" stroke="#263238" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="26" cy="19" r="3" fill="#FF7043"/>
    </svg>
  );
}
function IconSwipe({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="8" y="4" width="24" height="32" rx="5" stroke="#263238" strokeWidth="2.5"/>
      <line x1="13" y1="13" x2="27" y2="13" stroke="#02DFD8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="13" y1="19" x2="27" y2="19" stroke="#263238" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="13" y1="24" x2="20" y2="24" stroke="#263238" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="28" cy="28" r="7" fill="#FF7043"/>
      <path d="M25 28l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconBrain({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="14" stroke="#263238" strokeWidth="2.5"/>
      <path d="M13 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#02DFD8" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="20" cy="20" r="3" fill="#FF7043"/>
      <line x1="20" y1="23" x2="20" y2="29" stroke="#263238" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="26" x2="24" y2="26" stroke="#263238" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function IconProfile({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="5" y="4" width="30" height="32" rx="4" stroke="#263238" strokeWidth="2.5"/>
      <line x1="11" y1="13" x2="29" y2="13" stroke="#02DFD8" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="11" y1="19" x2="29" y2="19" stroke="#263238" strokeWidth="2" strokeLinecap="round"/>
      <line x1="11" y1="25" x2="22" y2="25" stroke="#263238" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="28" cy="28" r="6" fill="#FF7043" stroke="white" strokeWidth="2"/>
      <path d="M25.5 28l1.5 1.5L30.5 26" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
// What you get icons
function IconListings({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="18" cy="18" r="11" stroke="#263238" strokeWidth="2.5"/>
      <line x1="26" y1="26" x2="35" y2="35" stroke="#FF7043" strokeWidth="3" strokeLinecap="round"/>
      <path d="M12 18l4 4 8-8" stroke="#02DFD8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconBriefcase({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="4" y="14" width="32" height="22" rx="4" stroke="#263238" strokeWidth="2.5"/>
      <path d="M14 14v-4a2 2 0 012-2h8a2 2 0 012 2v4" stroke="#263238" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="4" y1="24" x2="36" y2="24" stroke="#02DFD8" strokeWidth="2" strokeLinecap="round"/>
      <rect x="17" y="21" width="6" height="6" rx="1.5" fill="#FF7043"/>
    </svg>
  );
}
function IconHandshake({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M4 22l6-6h8l4 4 8-4h6" stroke="#263238" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 22l6 6h6l4-4" stroke="#263238" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M36 22l-6 6h-6l-4-4" stroke="#263238" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="22" r="4" fill="#02DFD8" stroke="#263238" strokeWidth="2"/>
      <circle cx="20" cy="22" r="1.5" fill="#FF7043"/>
    </svg>
  );
}

const SectionLabel = ({ children }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', fontFamily: 'monospace',
    color: 'var(--text-muted)', marginBottom: 12,
  }}>
    <span style={{ display: 'block', width: 20, height: 2, background: 'var(--color-rocket)', flexShrink: 0 }} />
    {children}
  </div>
);

export default function Page() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section style={{ paddingTop: '3rem', paddingBottom: '4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(var(--color-teal) 1px, transparent 1px), linear-gradient(90deg, var(--color-teal) 1px, transparent 1px)',
          backgroundSize: '32px 32px', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          {/* Headline */}
          <h1 style={{ maxWidth: 700, marginBottom: '1.25rem', lineHeight: 1.08 }}>
            Buy your next home with{' '}
            <span style={{ color: 'var(--color-rocket)' }}>intelligence</span>,
            not <span style={{ color: 'var(--color-teal)' }}>anxiety</span>
          </h1>

          <p style={{
            fontSize: '1.15rem', lineHeight: 1.75, color: 'var(--text-muted)',
            maxWidth: 520, marginBottom: '2rem',
          }}>
            Al Broker is your Robo-Realtor — a free platform that learns what you actually want,
            builds a private profile from how you browse, and prepares you to walk into
            any agent meeting already knowing what to ask.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: '3rem' }}>
            <Link href="/onboard" className="btn btn-lg" style={{ boxShadow: '4px 4px 0 var(--shadow)' }}>
              Build my profile →
            </Link>
            <Link href="/listings" className="btn btn-lg btn-outline">
              Browse listings first
            </Link>
          </div>

          {/* Trust signals */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            {[
              { icon: <IconNoAccount size={44} />, label: 'No account required' },
              { icon: <IconNoSell size={44} />, label: 'Never sells your data' },
              { icon: <IconFree size={44} />, label: 'Free forever for buyers' },
              { icon: <IconUserControl size={44} />, label: 'You control every data share' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 56, height: 56, borderRadius: 10,
                  background: 'var(--bg-card)',
                  border: '1.5px solid var(--border)',
                  boxShadow: '2px 2px 0 var(--shadow)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>{s.icon}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', maxWidth: 120, lineHeight: 1.3 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{
        borderTop: '1.5px solid var(--border)',
        paddingTop: '4rem', paddingBottom: '4rem',
      }}>
        <SectionLabel>The process</SectionLabel>
        <h2 style={{ marginBottom: '2.5rem' }}>How Al Broker works</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {[
            { n: '01', title: 'Get your access code',        body: 'No email, no password. You get a three-word passphrase that\'s your private key. Write it down — that\'s the only copy. Your data stays yours.', icon: <IconPassphrase size={44} /> },
            { n: '02', title: 'Tell Al what you\'re after',  body: 'Budget, timeline, location. Three questions. Your Robo-Realtor uses this to fetch live listings immediately — no starting from scratch.', icon: <IconQuestions size={44} /> },
            { n: '03', title: 'Pick homes that appeal',      body: 'Al shows you live listings. Save the ones that catch your eye — don\'t overthink it. Al reads what they have in common and builds your profile silently.', icon: <IconSwipe size={44} /> },
            { n: '04', title: 'Confirm what Al learned',     body: 'Your Robo-Realtor surfaces the pattern: "You prefer modern builds in walkable neighborhoods." Confirm, adjust, or dismiss — these become your House Profile.', icon: <IconBrain size={44} /> },
            { n: '05', title: 'Browse smarter over time',    body: 'Every listing you save sharpens your profile. When you\'re ready, Al generates a complete buyer dossier — preferences, priorities, and talking points — ready to share.', icon: <IconProfile size={44} /> },
          ].map((step) => (
            <div key={step.n} className="card" style={{
              padding: '1.75rem',
              display: 'flex', flexDirection: 'column', gap: 16,
              borderLeft: '3px solid var(--color-teal)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 12,
                  background: 'color-mix(in oklab, var(--color-teal) 10%, white)',
                  border: '1.5px solid var(--color-teal)',
                  boxShadow: '2px 2px 0 var(--shadow)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>{step.icon}</div>
                <span style={{
                  fontSize: 32, fontWeight: 900, fontStyle: 'italic',
                  color: 'color-mix(in oklab, var(--text) 15%, transparent)',
                  fontFamily: 'monospace', lineHeight: 1,
                }}>{step.n}</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', margin: 0, lineHeight: 1.3 }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Privacy ── */}
      <section style={{ borderTop: '1.5px solid var(--border)', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <SectionLabel>Privacy</SectionLabel>
        <h2 style={{ marginBottom: '0.75rem' }}>What we collect. What we don't.</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: 520, marginBottom: '2rem', lineHeight: 1.7 }}>
          Most real estate platforms make money selling your data to agents and advertisers.
          Al Broker doesn't. Here's exactly what we store and why.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, maxWidth: 800 }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-teal)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
              ◈ What we store
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Budget range', 'To find listings that fit. Never shared without consent.'],
                ['Location preferences', 'Derived from listings you interact with. Clear it anytime.'],
                ['Listing interactions', 'Which listings you saved or flagged. Builds your House Profile.'],
                ['Quiz answers', 'Timeline, confidence, concerns. Feeds your Readiness Score.'],
                ['Your passphrase hash', 'One-way hash only — we can\'t reverse it. Ever.'],
              ].map(([label, desc]) => (
                <div key={label} style={{ display: 'flex', gap: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--color-teal)', flexShrink: 0, fontWeight: 700, marginTop: 1 }}>✓</span>
                  <div><strong style={{ color: 'var(--text)' }}>{label}</strong> — <span style={{ color: 'var(--text-muted)' }}>{desc}</span></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '3px solid var(--color-rocket)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-rocket)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
              ✕ What we never do
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Sell your data to agents, lenders, or advertisers',
                'Share your profile without explicit consent each time',
                'Require personal information to use the platform',
                'Show ads or accept payment to promote listings',
                'Store your passphrase — only a one-way hash',
              ].map(line => (
                <div key={line} style={{ display: 'flex', gap: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--color-rocket)', flexShrink: 0, fontWeight: 700, marginTop: 1 }}>✕</span>
                  <span style={{ color: 'var(--text-muted)' }}>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What you get ── */}
      <section style={{ borderTop: '1.5px solid var(--border)', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <SectionLabel>What you get</SectionLabel>
        <h2 style={{ marginBottom: '2rem' }}>Everything a buyer needs. Nothing you don't.</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            {
              icon: <IconListings size={44} />,
              title: 'Profile-driven listings',
              desc: 'The listings page auto-searches based on your profile — location, budget, bedroom minimum. Your Robo-Realtor does the searching for you.',
            },
            {
              icon: <IconBriefcase size={44} />,
              title: 'Your buyer dossier',
              desc: 'A complete brief — readiness scores, property preferences, must-haves, deal-breakers — that you own and share with agents on your terms.',
            },
            {
              icon: <IconHandshake size={44} />,
              title: 'Vetted agent marketplace',
              desc: 'When you\'re ready, browse agents with transparent commission rates and milestone satisfaction scores from real buyers.',
            },
          ].map(f => (
            <div key={f.title} className="card" style={{
              padding: '1.75rem',
              display: 'flex', flexDirection: 'column', gap: 16,
              borderLeft: '3px solid var(--color-teal)',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 12,
                background: 'color-mix(in oklab, var(--color-teal) 10%, white)',
                border: '1.5px solid var(--color-teal)',
                boxShadow: '2px 2px 0 var(--shadow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{f.icon}</div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div style={{
          background: '#26323B',
          borderRadius: 12, padding: '3rem 2.5rem',
          border: '2px solid var(--border)',
          boxShadow: '6px 6px 0 var(--color-teal)',
          display: 'flex', flexDirection: 'column', gap: 24,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: 'linear-gradient(var(--color-teal) 1px, transparent 1px), linear-gradient(90deg, var(--color-teal) 1px, transparent 1px)',
            backgroundSize: '24px 24px', pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: 12, fontFamily: 'monospace' }}>
              ◈ Ready to start
            </div>
            <h2 style={{ color: '#ffffff', marginBottom: 10, maxWidth: 480 }}>
              Meet your Robo-Realtor in under 2 minutes
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 440, lineHeight: 1.7, fontSize: 14, margin: 0 }}>
              No account. No credit card. No commitment.
              Just a passphrase, three questions, and a listings page that already knows what you're looking for.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, position: 'relative' }}>
            <Link href="/onboard" className="btn btn-lg" style={{
              background: 'var(--color-rocket)', color: '#ffffff',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
            }}>
              Build my profile →
            </Link>
            <Link href="/listings" className="btn btn-lg" style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.8)',
              border: '1.5px solid rgba(255,255,255,0.2)',
            }}>
              Browse listings first
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
