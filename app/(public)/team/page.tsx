import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Team',
  description: 'Meet the founder of Vian Software Solutions. Small team, big expertise.',
}

export default function TeamPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Team</span>
          </div>
          <span className="eyebrow">Team</span>
          <h1>Meet the founder.</h1>
          <p className="lead">Vian is a founder-led company. Every project receives direct attention from an experienced engineer who cares about the outcome.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800, marginInline: 'auto' }}>
          <div className="team-profile">
            <div className="team-avatar-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <h2>Viren Pandey</h2>
              <p className="muted" style={{ marginBottom: 16 }}>Founder & Lead Engineer</p>
              <p style={{ lineHeight: 1.7 }}>
                Viren founded Vian Software Solutions in 2022 with a simple belief: businesses deserve
                software that actually works, delivered by someone who takes full responsibility for the outcome.
              </p>
              <p style={{ lineHeight: 1.7, marginTop: 12 }}>
                With hands-on experience across the full stack — React, TypeScript, Node.js, Python,
                PostgreSQL, AI/ML, and cloud infrastructure — Viren leads every project from architecture
                to deployment. For specialized needs, a trusted network of contractors is engaged under
                direct supervision.
              </p>
            </div>
          </div>

          <div className="team-values" style={{ marginTop: 48 }}>
            <h3>How we work</h3>
            <div className="about-cards" style={{ marginTop: 20 }}>
              <div className="about-card">
                <h4>Founder-led</h4>
                <p>Every project is personally overseen by the founder. No account managers, no hand-offs, no communication gaps.</p>
              </div>
              <div className="about-card">
                <h4>Quality over volume</h4>
                <p>We take on a limited number of projects at a time to ensure each one receives the attention it deserves.</p>
              </div>
              <div className="about-card">
                <h4>Transparent communication</h4>
                <p>Weekly updates, milestone demos, and direct access to the person building your software.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}