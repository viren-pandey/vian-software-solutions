export function HomeHero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <span className="eyebrow">Since 2022 — Mumbai, India</span>
          <h1 className="hero-title">
            Custom Software.
            <br />
            <span className="gradient-text">Built for Business.</span>
          </h1>
          <p className="hero-description">
            We design, develop, and maintain web applications, automation systems, and digital infrastructure
            for companies that need reliable execution — not templates.
          </p>
          <div className="hero-actions">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Start a Project
            </Link>
            <Link href="/projects" className="btn btn-secondary btn-lg">
              View Our Work
            </Link>
          </div>
          <div className="hero-trust">
            <span className="hero-trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Secure Development
            </span>
            <span className="hero-trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              Transparent Process
            </span>
            <span className="hero-trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Enterprise Standards
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'