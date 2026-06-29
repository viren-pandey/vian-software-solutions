import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Our pricing approach at Vian Software Solutions. Every project is scoped and quoted individually based on your specific requirements.',
}

export default function PricingPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Pricing</span>
          </div>
          <span className="eyebrow">Pricing</span>
          <h1>Transparent pricing for custom work.</h1>
          <p className="lead">Every project is different. We provide clear, fixed-price proposals so you know exactly what you are paying for.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720, marginInline: 'auto' }}>
          <div className="section-head" style={{ textAlign: 'left' }}>
            <span className="eyebrow">Approach</span>
            <h2>How we price projects.</h2>
          </div>
          <div className="prose">
            <p>We do not have a fixed price list because software projects vary significantly in scope, complexity, and requirements. Instead, we follow a transparent quotation process:</p>
          </div>

          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="service-card" style={{ cursor: 'default' }}>
              <div className="service-card-content">
                <h3>1. Discovery & Requirements</h3>
                <p>We discuss your project to understand the scope, goals, and constraints. Free of charge.</p>
              </div>
            </div>
            <div className="service-card" style={{ cursor: 'default' }}>
              <div className="service-card-content">
                <h3>2. Detailed Proposal</h3>
                <p>We prepare a fixed-price proposal with clear scope, deliverables, timeline, and milestones.</p>
              </div>
            </div>
            <div className="service-card" style={{ cursor: 'default' }}>
              <div className="service-card-content">
                <h3>3. Milestone-Based Payments</h3>
                <p>Payments are tied to completed milestones. You only pay for approved work.</p>
              </div>
            </div>
            <div className="service-card" style={{ cursor: 'default' }}>
              <div className="service-card-content">
                <h3>4. No Surprises</h3>
                <p>Any scope changes are discussed and approved before additional work begins.</p>
              </div>
            </div>
          </div>

          <div className="pricing-models" style={{ marginTop: 48 }}>
            <h3>Pricing Models</h3>
            <div className="about-cards" style={{ marginTop: 16 }}>
              <div className="about-card">
                <h4>Fixed Price</h4>
                <p>Best for well-defined projects with clear requirements. You get a fixed quote and predictable costs.</p>
              </div>
              <div className="about-card">
                <h4>Monthly Retainer</h4>
                <p>Ongoing development, maintenance, and support at a predictable monthly rate.</p>
              </div>
              <div className="about-card">
                <h4>Hourly / Sprint-Based</h4>
                <p>Flexible engagement for evolving projects or smaller, scoped tasks.</p>
              </div>
            </div>
          </div>

          <div className="pricing-note" style={{ marginTop: 48 }}>
            <div className="legal-note">
              <strong>Typical project ranges (indicative only):</strong><br />
              Simple website: ₹15,000 — ₹50,000<br />
              Complex web application: ₹50,000 — ₹3,00,000+<br />
              Custom software / API: ₹1,00,000 — ₹5,00,000+<br />
              Automation / AI integration: ₹50,000 — ₹2,00,000+<br />
              <span className="muted" style={{ fontSize: 13 }}>All prices are indicative. Contact us for a precise quote.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="cta-banner">
            <h2>Ready for a quote?</h2>
            <p>Tell us about your project and we will provide a clear proposal.</p>
            <a href="/contact" className="btn btn-primary btn-lg">Get a Free Quote</a>
          </div>
        </div>
      </section>
    </>
  )
}