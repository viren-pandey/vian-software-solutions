import type { Metadata } from 'next'
import Link from 'next/link'
import { siteUrl, breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Vian Software Solutions — our mission, values, business model, and development process.',
  keywords: ['about vian software', 'mumbai software company', 'software development team', 'custom software solutions', 'technology partner mumbai'],
  openGraph: {
    title: 'About - Vian Software Solutions',
    description: 'Learn about Vian Software Solutions — our mission, values, business model, and development process.',
    images: [{ url: `${siteUrl}/assets/logo/og-image.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About - Vian Software Solutions',
    description: 'Learn about Vian Software Solutions — our mission, values, business model, and development process.',
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>About</span>
          </div>
          <span className="eyebrow">About</span>
          <h1>Built to deliver software that works.</h1>
          <p className="lead">Vian Software Solutions is a Mumbai-based software company founded to help businesses build reliable, scalable digital solutions — without the overhead of large agencies or the risk of unreliable freelancers.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720, marginInline: 'auto' }}>
          <div className="prose">
            <p>Every business needs technology that works. But most organizations face the same challenge: large agencies are expensive and slow, freelancers are inconsistent, and do-it-yourself platforms cannot handle complex requirements.</p>
            <p>We started Vian to fill that gap. We deliver professional-grade software development with the agility and transparency of a focused, founder-led team. We do not sell templates. We do not use stock code. Every solution is designed and built for the specific problem at hand.</p>
            <p>Since 2022, we have worked with startups, established businesses, and digital agencies across India and internationally — building web applications, automation systems, APIs, and digital infrastructure that actually moves the needle.</p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{ maxWidth: 720, marginInline: 'auto' }}>
          <div className="section-head">
            <h2>Our mission & vision.</h2>
          </div>
          <div className="about-cards">
            <div className="about-card">
              <h3>Mission</h3>
              <p>To deliver reliable, well-engineered software that helps businesses operate more effectively and grow without being limited by technology.</p>
            </div>
            <div className="about-card">
              <h3>Vision</h3>
              <p>To be the trusted technology partner for organizations that value quality, transparency, and long-term relationships over quick fixes and empty promises.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720, marginInline: 'auto' }}>
          <div className="section-head">
            <h2>Core values.</h2>
          </div>
          <div className="about-cards">
            <div className="about-card">
              <h4>Quality over speed</h4>
              <p>We write clean, maintainable code. We test thoroughly. We document clearly. We never cut corners to meet an arbitrary deadline.</p>
            </div>
            <div className="about-card">
              <h4>Honest communication</h4>
              <p>We tell you what is possible, what is not, and what it will really take. No overpromising. No hiding problems. No surprises.</p>
            </div>
            <div className="about-card">
              <h4>Transparency</h4>
              <p>You see everything — our progress, our code, our costs. We use shared task tracking, version control, and regular updates.</p>
            </div>
            <div className="about-card">
              <h4>Long-term thinking</h4>
              <p>We build software that is maintainable, scalable, and well-architected. Quick and dirty is not in our vocabulary.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{ maxWidth: 720, marginInline: 'auto' }}>
          <div className="section-head">
            <h2>How we work.</h2>
          </div>
          <div className="prose">
            <p>We follow a quotation-based business model. Every project starts with understanding your requirements, followed by a detailed proposal and fixed-price or milestone-based quotation. This approach ensures clarity from day one.</p>
            <p>Our development process is structured yet flexible. We break projects into phases, deliver incrementally, and keep you involved throughout. Communication happens through a shared dashboard where you can track progress, review deliverables, and exchange feedback in real time.</p>
            <p>We serve a wide range of industries including e-commerce, healthcare, education, logistics, finance, real estate, media, and professional services. Our technology stack spans the modern development ecosystem — from Next.js and React to Node.js, Python, cloud infrastructure, and AI/ML frameworks.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720, marginInline: 'auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: 16 }}>Want to work together?</h2>
          <p className="lead" style={{ margin: '0 auto 24px', maxWidth: 480 }}>Tell us about your project. We will respond within 24 hours with a clear outline and estimated timeline.</p>
          <Link href="/contact" className="btn btn-primary btn-lg">Start a Project</Link>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', item: '/' }, { name: 'About', item: '/about' }])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Vian Software Solutions',
            url: siteUrl,
            description: 'Vian Software Solutions is a Mumbai-based software company founded to help businesses build reliable, scalable digital solutions.',
            foundingDate: '2022',
            founder: { '@type': 'Person', name: 'Viren Pandey' },
            address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressRegion: 'Maharashtra', addressCountry: 'IN' },
          }),
        }}
      />
    </>
  )
}