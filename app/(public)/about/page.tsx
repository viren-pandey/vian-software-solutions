import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Vian Software Solutions — our mission, values, and engineering philosophy.',
}

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>About</span>
          </div>
          <span className="eyebrow">About</span>
          <h1>Building software that matters.</h1>
          <p className="lead">Vian Software Solutions is a Mumbai-based software company founded to help businesses build reliable, scalable digital solutions — without the overhead of large agencies or the risk of unreliable freelancers.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720, marginInline: 'auto' }}>
          <div className="section-head">
            <h2>Why Vian exists.</h2>
          </div>
          <div className="prose">
            <p>
              Every business needs technology that works. But most organizations face the same challenge:
              large agencies are expensive and slow, freelancers are inconsistent, and do-it-yourself
              platforms can not handle complex requirements.
            </p>
            <p>
              We started Vian to fill that gap. We deliver professional-grade software development
              with the agility and transparency of a focused, founder-led team.
            </p>
            <p>
              We do not sell templates. We do not use stock code. Every solution is designed and
              built for the specific problem at hand.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{ maxWidth: 720, marginInline: 'auto' }}>
          <div className="section-head">
            <span className="eyebrow">Mission</span>
            <h2>What drives us.</h2>
          </div>
          <div className="about-cards">
            <div className="about-card">
              <h3>Mission</h3>
              <p>To deliver reliable, well-engineered software that helps businesses operate more effectively.</p>
            </div>
            <div className="about-card">
              <h3>Vision</h3>
              <p>To be the trusted technology partner for organizations that value quality, transparency, and long-term relationships.</p>
            </div>
            <div className="about-card">
              <h3>Engineering Philosophy</h3>
              <p>We believe in clean architecture, thorough testing, clear documentation, and honest communication. Every project is treated as a partnership, not a transaction.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}