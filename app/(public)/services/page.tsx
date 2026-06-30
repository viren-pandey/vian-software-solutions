import type { Metadata } from 'next'
import Link from 'next/link'
import { products } from '@/lib/products'
import { siteUrl, breadcrumbJsonLd, serviceJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Custom software development, web development, automation, AI integration, and digital growth services from Vian Software Solutions.',
  keywords: ['web development', 'software development', 'automation services', 'ai integration', 'technology consulting', 'digital growth', 'custom software services'],
  openGraph: {
    title: 'Services - Vian Software Solutions',
    description: 'Custom software development, web development, automation, AI integration, and digital growth services from Vian Software Solutions.',
    images: [{ url: `${siteUrl}/assets/logo/og-image.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services - Vian Software Solutions',
    description: 'Custom software development, web development, automation, AI integration, and digital growth services from Vian Software Solutions.',
  },
  alternates: {
    canonical: `${siteUrl}/services`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

function GlobeIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
}

function SettingsIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
}

function BotIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
}

function TrendingUpIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
}

function LightbulbIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
}

const serviceIcons: Record<string, React.ReactNode> = {
  websites: <GlobeIcon />,
  software: <SettingsIcon />,
  automation: <BotIcon />,
  growth: <TrendingUpIcon />,
  consulting: <LightbulbIcon />,
}

const serviceCategories = [
  {
    id: 'websites',
    title: 'Web Development',
    description: 'Custom websites, web applications, portals, and e-commerce platforms.',
    problems: 'Outdated websites, slow performance, poor user experience, lack of mobile responsiveness, and difficulty managing content.',
    features: [
      'Custom design and development',
      'Content management systems',
      'E-commerce platforms',
      'Client portals and dashboards',
      'API integrations',
      'Performance optimization',
      'SEO-ready architecture',
    ],
    tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    timeline: '4 — 10 weeks depending on scope',
    deliverables: ['Fully functional website', 'Source code ownership', 'Admin documentation', 'Deployment guide', '30 days post-launch support'],
  },
  {
    id: 'software',
    title: 'Software Development',
    description: 'Custom applications, SaaS platforms, APIs, and enterprise solutions.',
    problems: 'Off-the-shelf software that does not fit your workflow, scaling issues, integration challenges, and high licensing costs.',
    features: [
      'Custom web applications',
      'SaaS platforms',
      'REST & GraphQL APIs',
      'Database design and optimization',
      'Third-party integrations',
      'Cloud-native architecture',
      'Scalable infrastructure',
    ],
    tech: ['Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS'],
    timeline: '6 — 16 weeks depending on complexity',
    deliverables: ['Complete application', 'Source code ownership', 'API documentation', 'Deployment setup', '60 days post-launch support'],
  },
  {
    id: 'automation',
    title: 'Automation & AI',
    description: 'Workflow automation, AI integration, and intelligent process optimization.',
    problems: 'Manual repetitive tasks, data processing bottlenecks, human error in routine operations, and missed opportunities from lack of automation.',
    features: [
      'Workflow automation',
      'AI model integration',
      'Data processing pipelines',
      'Chatbot and assistant development',
      'Computer vision solutions',
      'Natural language processing',
      'Business process automation',
    ],
    tech: ['Python', 'FastAPI', 'OpenAI', 'LangChain', 'YOLO', 'Google ADK'],
    timeline: '4 — 12 weeks depending on scope',
    deliverables: ['Automation system', 'Source code', 'Technical documentation', 'User guide', '30 days support'],
  },
  {
    id: 'growth',
    title: 'Digital Growth',
    description: 'Technical SEO, performance optimization, analytics, and conversion rate improvement.',
    problems: 'Low search rankings, slow page loads, poor conversion rates, and lack of data-driven decision making.',
    features: [
      'Technical SEO audit and fixes',
      'Performance optimization',
      'Core Web Vitals improvement',
      'Analytics setup and tracking',
      'Conversion rate optimization',
      'Content strategy',
      'Monthly reporting',
    ],
    tech: ['Google Analytics', 'Search Console', 'PageSpeed Insights', 'Schema.org'],
    timeline: 'Ongoing or project-based (6 — 8 weeks for audit + fixes)',
    deliverables: ['Audit report', 'Implementation plan', 'Performance improvements', 'Monthly reports'],
  },
  {
    id: 'consulting',
    title: 'Technology Consulting',
    description: 'Architecture planning, stack selection, code review, and digital strategy.',
    problems: 'Uncertainty about technology choices, legacy system challenges, scalability concerns, and lack of technical roadmap.',
    features: [
      'Architecture review and planning',
      'Technology stack evaluation',
      'Code quality audits',
      'Security assessments',
      'Digital transformation strategy',
      'Build vs. buy analysis',
      'Team augmentation guidance',
    ],
    tech: ['Multiple', 'selected based on client needs'],
    timeline: '1 — 4 weeks for assessment',
    deliverables: ['Assessment report', 'Recommendations', 'Roadmap', 'Implementation guide'],
  },
]

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Services</span>
          </div>
          <span className="eyebrow">Services</span>
          <h1>Built to solve real problems.</h1>
          <p className="lead">We do not sell templates or one-size-fits-all solutions. Every engagement starts with understanding your specific challenges.</p>
        </div>
      </section>

      {serviceCategories.map((service, index) => (
        <section key={service.id} id={service.id} className={`section ${index % 2 === 1 ? 'section-alt' : ''}`}>
          <div className="container">
            <div className="service-detail">
              <div className="service-detail-header">
                <span className="service-icon">{serviceIcons[service.id]}</span>
                <div>
                  <span className="eyebrow">{service.title}</span>
                  <h2>{service.description}</h2>
                </div>
              </div>

              <div className="service-problems">
                <h3>Business Problems We Solve</h3>
                <p>{service.problems}</p>
              </div>

              <div className="service-grid">
                <div>
                  <h3>Features</h3>
                  <ul className="check-list">
                    {service.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3>Technology</h3>
                  <div className="tech-tags">
                    {service.tech.map((t) => (
                      <span key={t} className="tech-tag">{t}</span>
                    ))}
                  </div>

                  <h3 style={{ marginTop: 24 }}>Typical Timeline</h3>
                  <p className="muted">{service.timeline}</p>

                  <h3 style={{ marginTop: 24 }}>Deliverables</h3>
                  <ul className="check-list">
                    {service.deliverables.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="section section-alt">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="eyebrow">Ready-Made Products</span>
            <h2>Need something quick?</h2>
            <p className="lead" style={{ maxWidth: 600, margin: '0 auto' }}>
              Pre-built scripts, dashboards, and tools for instant purchase. Full source code included.
            </p>
          </div>
          <div className="products-grid-page">
            {products.slice(0, 6).map(product => (
              <div key={product.id} className="product-page-card">
                <div className="product-page-header">
                  <span className="product-page-category">{product.category}</span>
                </div>
                <h3 className="product-page-title">{product.name}</h3>
                <p className="product-page-desc">{product.desc}</p>
                <div className="product-page-footer">
                  <div className="product-page-price">
                    <span className="product-page-currency">Rs.</span>
                    <span className="product-page-amount">{product.price.toLocaleString('en-IN')}</span>
                  </div>
                  <Link href={`/products/${product.id}`} className="btn btn-dark btn-block">Buy Now</Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/products" className="btn btn-secondary">All Products</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Not sure what you need?</h2>
            <p>We offer free initial consultations to help you scope your project.</p>
            <a href="/contact" className="btn btn-primary btn-lg">Schedule a Consultation</a>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', item: '/' }, { name: 'Services', item: '/services' }])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd([
            { name: 'Web Development', description: 'Custom websites, web applications, portals, and e-commerce platforms.', url: '/services#websites' },
            { name: 'Software Development', description: 'Custom applications, SaaS platforms, APIs, and enterprise solutions.', url: '/services#software' },
            { name: 'Automation & AI', description: 'Workflow automation, AI integration, and intelligent process optimization.', url: '/services#automation' },
            { name: 'Digital Growth', description: 'Technical SEO, performance optimization, analytics, and conversion rate improvement.', url: '/services#growth' },
            { name: 'Technology Consulting', description: 'Architecture planning, stack selection, code review, and digital strategy.', url: '/services#consulting' },
          ])),
        }}
      />
    </>
  )
}