import type { Metadata } from 'next'
import { siteUrl, breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Our Process',
  description: 'Learn how Vian Software Solutions delivers projects — from discovery to deployment and ongoing support.',
  keywords: ['software development process', 'project delivery', 'development lifecycle', 'software methodology', 'project management process', 'custom development workflow'],
  openGraph: {
    title: 'Our Process - Vian Software Solutions',
    description: 'Learn how Vian Software Solutions delivers projects — from discovery to deployment and ongoing support.',
    images: [{ url: `${siteUrl}/assets/logo/og-image.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Process - Vian Software Solutions',
    description: 'Learn how Vian Software Solutions delivers projects — from discovery to deployment and ongoing support.',
  },
  alternates: {
    canonical: `${siteUrl}/process`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

const steps = [
  {
    number: '01',
    title: 'Discovery Call',
    subtitle: '1 — 2 days',
    description: 'We learn about your business, challenges, and goals. This helps us understand whether we are a good fit and what approach makes sense.',
    deliverables: 'Meeting notes, initial assessment',
  },
  {
    number: '02',
    title: 'Requirement Analysis',
    subtitle: '2 — 5 days',
    description: 'We dive deep into technical requirements, user needs, constraints, and success criteria. All requirements are documented and shared with you.',
    deliverables: 'Requirements document',
  },
  {
    number: '03',
    title: 'Proposal & Quotation',
    subtitle: '2 — 3 days',
    description: 'Based on the requirements, we prepare a detailed proposal including scope, tech stack, timeline, milestones, and fixed-price quotation.',
    deliverables: 'Project proposal, cost breakdown',
  },
  {
    number: '04',
    title: 'Client Discussion & Approval',
    subtitle: '3 — 7 days',
    description: 'We review the proposal together, answer questions, adjust scope if needed, and finalize the agreement. No pressure, no hidden terms.',
    deliverables: 'Signed agreement, project schedule',
  },
  {
    number: '05',
    title: 'Development Sprints',
    subtitle: '2 — 12 weeks',
    description: 'We work in weekly or bi-weekly sprints with regular progress updates, demo sessions, and milestone deliveries. You always know where the project stands.',
    deliverables: 'Incremental builds, progress reports',
  },
  {
    number: '06',
    title: 'Testing & QA',
    subtitle: '1 — 2 weeks',
    description: 'Comprehensive testing including functionality, performance, security, cross-browser compatibility, and user acceptance testing with your team.',
    deliverables: 'Test reports, bug fixes',
  },
  {
    number: '07',
    title: 'Deployment & Launch',
    subtitle: '3 — 5 days',
    description: 'Production deployment, DNS configuration, SSL setup, CDN configuration, and final verification. We stay on standby during launch.',
    deliverables: 'Live deployment, launch checklist',
  },
  {
    number: '08',
    title: 'Maintenance & Support',
    subtitle: 'Ongoing',
    description: 'Post-launch support includes bug fixes, security updates, performance monitoring, content updates, and feature enhancements as needed.',
    deliverables: 'Support agreement, SLA',
  },
]

export default function ProcessPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Process</span>
          </div>
          <span className="eyebrow">Process</span>
          <h1>How we deliver projects.</h1>
          <p className="lead">Every project follows a clear, documented process. You always know what is happening, what is coming next, and what to expect.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="process-timeline">
            {steps.map((step, index) => (
              <div key={step.number} className="timeline-item">
                <div className="timeline-number">{step.number}</div>
                {index < steps.length - 1 && <div className="timeline-line" aria-hidden="true" />}
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h3>{step.title}</h3>
                    <span className="timeline-subtitle">{step.subtitle}</span>
                  </div>
                  <p>{step.description}</p>
                  <div className="timeline-deliverables">
                    <strong>Deliverables:</strong> {step.deliverables}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="cta-banner">
            <h2>Ready to get started?</h2>
            <p>The first step is a no-obligation conversation about your project.</p>
            <a href="/contact" className="btn btn-primary btn-lg">Schedule a Discovery Call</a>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', item: '/' }, { name: 'Process', item: '/process' }])) }}
      />
    </>
  )
}