import Link from 'next/link'

const services = [
  {
    title: 'Web Development',
    description: 'Custom websites, web applications, portals, and e-commerce platforms.',
    href: '/services',
    icon: '🌐',
  },
  {
    title: 'Software Development',
    description: 'Custom applications, SaaS platforms, APIs, and enterprise solutions.',
    href: '/services',
    icon: '⚙️',
  },
  {
    title: 'Automation & AI',
    description: 'Workflow automation, AI integration, and intelligent process optimization.',
    href: '/services',
    icon: '🤖',
  },
  {
    title: 'Digital Growth',
    description: 'Technical SEO, performance optimization, analytics, and conversion rate improvement.',
    href: '/services',
    icon: '📈',
  },
  {
    title: 'Technology Consulting',
    description: 'Architecture planning, stack selection, code review, and digital strategy.',
    href: '/services',
    icon: '💡',
  },
]

export function ServicesOverview() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">What We Build</span>
          <h2>Software services for modern organizations.</h2>
          <p className="section-description">
            From startups to enterprises, we help businesses build, automate, and scale.
          </p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <Link key={service.title} href={service.href} className="service-card">
              <div className="service-card-content">
                <span className="service-card-icon">{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <span className="service-card-arrow" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}