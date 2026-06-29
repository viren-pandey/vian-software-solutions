import Link from 'next/link'

export function CTABanner() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-banner">
          <h2>Ready to build something?</h2>
          <p>
            Tell us about your project. We will provide a clear proposal within 1-2 business days.
          </p>
          <div className="cta-actions">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Start a Project
            </Link>
            <Link href="/faq" className="btn btn-secondary btn-lg">
              Frequently Asked Questions
            </Link>
          </div>
          <p className="cta-note muted">
            No commitment required. Free consultation and project scoping.
          </p>
        </div>
      </div>
    </section>
  )
}