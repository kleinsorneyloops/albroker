import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section style={{ paddingTop: '2.5rem', paddingBottom: '4rem', position: 'relative', overflow: 'hidden' }}>

        {/* Background grid decoration */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.035,
          backgroundImage: 'linear-gradient(var(--color-teal) 1px, transparent 1px), linear-gradient(90deg, var(--color-teal) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }} />

        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24, position: 'relative' }}>
          {[
            { label: 'Est. 2024', color: 'var(--color-teal)', bg: 'color-mix(in oklab, var(--color-teal) 12%, transparent)' },
            { label: 'AI-Powered', color: 'var(--color-rocket)', bg: 'color-mix(in oklab, var(--color-rocket) 10%, transparent)' },
            { label: 'Free to Use', color: 'var(--text)', bg: 'color-mix(in oklab, var(--text) 8%, transparent)' },
          ].map(b => (
            <span key={b.label} style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '4px 10px', borderRadius: 20, border: `1px solid ${b.color}`,
              color: b.color, background: b.bg, fontFamily: 'monospace',
            }}>{b.label}</span>
          ))}
        </div>

        {/* Headline */}
        <h1 style={{ maxWidth: 680, marginBottom: '1.25rem', lineHeight: 1.08, position: 'relative' }}>
          Buy your next home with<br />
          <span style={{ color: 'var(--color-rocket)' }}>intelligence</span>,
          not <span style={{ color: 'var(--color-teal)' }}>anxiety</span>
        </h1>

        <p style={{
          fontSize: '1.1rem', lineHeight: 1.75, color: 'var(--text-muted)',
          maxWidth: 540, marginBottom: '2rem', position: 'relative',
        }}>
          Al Broker is a free AI co-pilot for homebuyers. It learns what you actually want
          from how you browse, builds a private profile, and prepares you to walk into
          any agent meeting already knowing what to ask.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: '3rem', position: 'relative' }}>
          <Link href="/onboard" className="btn btn-lg" style={{ boxShadow: '4px 4px 0 var(--shadow)' }}>
            Build my profile →
          </Link>
          <Link href="/listings" className="btn btn-lg btn-outline">
            Browse listings first
          </Link>
        </div>

        {/* Trust signals */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, position: 'relative' }}>
          {[
            { icon: '🔒', label: 'No account required' },
            { icon: '🚫', label: 'Never sells your data' },
            { icon: '✓', label: 'Free forever for buyers' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--color-teal)', border: '1.5px solid var(--border)',
                boxShadow: '2px 2px 0 var(--shadow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', flexShrink: 0,
              }}>{s.icon}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{
        background: 'var(--color-deep, #26323B)',
        borderTop: '2px solid var(--border)',
        borderBottom: '2px solid var(--border)',
        marginLeft: 'calc(-1 * clamp(1.5rem, 5vw, 3rem))',
        marginRight: 'calc(-1 * clamp(1.5rem, 5vw, 3rem))',
        paddingLeft: 'clamp(1.5rem, 5vw, 3rem)',
        paddingRight: 'clamp(1.5rem, 5vw, 3rem)',
        paddingTop: '4rem',
        paddingBottom: '4rem',
      }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: 10, fontFamily: 'monospace' }}>
            ◈ The process
          </div>
          <h2 style={{ color: '#ffffff', marginBottom: '2.5rem' }}>How Al Broker works</h2>

          <div style={{ display: 'grid', gap: 2 }}>
            {[
              {
                n: '01',
                title: 'Get your access code',
                body: 'No email, no password. You get a three-word passphrase that\'s your private key. Write it down — that\'s the only copy. Your data stays yours.',
                accent: 'var(--color-teal)',
                icon: '🔑',
              },
              {
                n: '02',
                title: 'Tell Al what you\'re looking for',
                body: 'Budget range, timeline, location. Three questions. Al uses this to fetch real listings immediately — no browsing from scratch.',
                accent: 'var(--color-rocket)',
                icon: '📡',
              },
              {
                n: '03',
                title: 'Pick homes that appeal to you',
                body: 'Al shows you live listings. Tap the ones that catch your eye — don\'t overthink it. Al reads what they have in common and builds your preference profile silently.',
                accent: 'var(--color-teal)',
                icon: '🏠',
              },
              {
                n: '04',
                title: 'Confirm what Al learned',
                body: 'Al surfaces the pattern: "You seem to prefer acreage, functional garages, and mountain access." You confirm, adjust, or dismiss. These become your House Profile.',
                accent: 'var(--color-rocket)',
                icon: '🤖',
              },
              {
                n: '05',
                title: 'Browse smarter over time',
                body: 'Every listing you save updates your profile. When you\'re ready to meet an agent, Al generates a complete buyer dossier — your preferences, priorities, and talking points — ready to share.',
                accent: 'var(--color-teal)',
                icon: '📋',
              },
            ].map((step, i) => (
              <div key={step.n} style={{
                display: 'flex', gap: 20, alignItems: 'flex-start',
                padding: '20px 0',
                borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{
                  flexShrink: 0, width: 40, height: 40, borderRadius: 8,
                  background: `color-mix(in oklab, ${step.accent} 20%, transparent)`,
                  border: `1.5px solid ${step.accent}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>{step.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: step.accent, letterSpacing: '0.08em' }}>{step.n}</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>{step.title}</h3>
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we collect / privacy ── */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: 10, fontFamily: 'monospace' }}>
          ◈ Privacy
        </div>
        <h2 style={{ marginBottom: '0.75rem' }}>What we collect. What we don't.</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: 520, marginBottom: '2rem', lineHeight: 1.7 }}>
          Most real estate platforms make money selling your data to agents and advertisers.
          Al Broker doesn't. Here's exactly what we store and why.
        </p>

        <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
          {/* We collect */}
          <div className="card" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-teal)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
              ◈ What we store
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Budget range', 'To find listings that fit. Never shared without your consent.'],
                ['Location preferences', 'Derived from listings you interact with. You can clear it anytime.'],
                ['Listing interactions', 'Which listings you saved, viewed, or flagged. Builds your House Profile.'],
                ['Quiz answers', 'Process confidence, timeline, concerns. Feeds your Readiness Score.'],
                ['Your passphrase hash', 'A one-way hash — we can\'t reverse it to your passphrase. Ever.'],
              ].map(([label, desc]) => (
                <div key={label} style={{ display: 'flex', gap: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: 1 }}>✓</span>
                  <div><strong style={{ color: 'var(--text)' }}>{label}</strong> — <span style={{ color: 'var(--text-muted)' }}>{desc}</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* We never */}
          <div className="card" style={{ padding: '20px 22px', background: 'color-mix(in oklab, var(--color-rocket) 4%, var(--bg-card))' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-rocket)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
              ✕ What we never do
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Sell your data to agents, lenders, or advertisers',
                'Share your profile without your explicit consent each time',
                'Require personal information to use the platform',
                'Show you ads or accept payment to promote listings',
                'Store your passphrase — only a one-way hash',
              ].map(line => (
                <div key={line} style={{ display: 'flex', gap: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--color-rocket)', flexShrink: 0, marginTop: 1 }}>✕</span>
                  <span style={{ color: 'var(--text-muted)' }}>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What you get ── */}
      <section style={{
        background: '#ECEFF1',
        borderTop: '1.5px solid var(--border)',
        borderBottom: '1.5px solid var(--border)',
        marginLeft: 'calc(-1 * clamp(1.5rem, 5vw, 3rem))',
        marginRight: 'calc(-1 * clamp(1.5rem, 5vw, 3rem))',
        paddingLeft: 'clamp(1.5rem, 5vw, 3rem)',
        paddingRight: 'clamp(1.5rem, 5vw, 3rem)',
        paddingTop: '4rem',
        paddingBottom: '4rem',
      }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: 10, fontFamily: 'monospace' }}>
            ◈ What you get
          </div>
          <h2 style={{ marginBottom: '2rem' }}>Everything a buyer needs. Nothing you don't.</h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: '🏠',
                title: 'Profile-driven listings',
                desc: 'The listings page auto-searches based on your profile — location clusters, budget, bedroom minimum. No manual search required.',
                accent: 'var(--color-teal)',
              },
              {
                icon: '🤖',
                title: 'Your buyer dossier',
                desc: 'A complete brief — readiness scores, property preferences, must-haves, deal-breakers — that you own and share with agents on your terms.',
                accent: 'var(--color-rocket)',
              },
              {
                icon: '🎯',
                title: 'Vetted agent marketplace',
                desc: 'When you\'re ready, browse agents with transparent commission rates and milestone satisfaction scores from real buyers.',
                accent: 'var(--text)',
              },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10, fontSize: 20,
                  background: `color-mix(in oklab, ${f.accent} 15%, white)`,
                  border: `1.5px solid ${f.accent}`,
                  boxShadow: `2px 2px 0 var(--shadow)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{f.icon}</div>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: 6, color: 'var(--text)' }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        <div style={{
          background: 'var(--color-deep, #26323B)',
          borderRadius: 16, padding: '3rem 2.5rem',
          border: '2px solid var(--border)',
          boxShadow: '6px 6px 0 var(--color-teal)',
          display: 'flex', flexDirection: 'column', gap: 24,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Grid decoration */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: 'linear-gradient(var(--color-teal) 1px, transparent 1px), linear-gradient(90deg, var(--color-teal) 1px, transparent 1px)',
            backgroundSize: '24px 24px', pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: 10, fontFamily: 'monospace' }}>
              ◈ Ready to start
            </div>
            <h2 style={{ color: '#ffffff', marginBottom: 10, maxWidth: 480 }}>
              Start your search in under 2 minutes
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 440, lineHeight: 1.7, fontSize: 14 }}>
              No account. No credit card. No commitment.
              Just a passphrase, a few questions, and a listings page that already knows what you're looking for.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, position: 'relative' }}>
            <Link
              href="/onboard"
              className="btn btn-lg"
              style={{
                background: 'var(--color-rocket)', color: '#ffffff',
                border: '2px solid rgba(255,255,255,0.2)',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
              }}
            >
              Build my profile →
            </Link>
            <Link
              href="/listings"
              className="btn btn-lg"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.8)',
                border: '1.5px solid rgba(255,255,255,0.2)',
              }}
            >
              Browse listings first
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
