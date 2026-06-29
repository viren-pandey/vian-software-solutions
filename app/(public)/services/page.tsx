import type { Metadata } from 'next'
import Link from 'next/link'
import { products } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Custom software development, web development, automation, AI integration, and digital growth services from Vian Software Solutions.',
}

const serviceCategories = [
  {
    id: 'websites',
    title: 'Web Development',
    description: 'Custom websites, web applications, portals, and e-commerce platforms.',
    icon: '🌐',
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
    icon: '⚙️',
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
    icon: '🤖',
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
    icon: '📈',
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
    icon: '💡',
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
                <span className="service-icon">{service.icon}</span>
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
                  <span className="product-page-icon">{product.icon}</span>
                  <span className="product-page-category">{product.category}</span>
                </div>
                <h3 className="product-page-title">{product.name}</h3>
                <p className="product-page-desc">{product.desc}</p>
                <div className="product-page-footer">
                  <div className="product-page-price">
                    <span className="product-page-currency">₹</span>
                    <span className="product-page-amount">{product.price.toLocaleString('en-IN')}</span>
                  </div>
                  <Link href={`/products/${product.id}`} className="btn btn-primary btn-block">Buy Now</Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/products" className="btn btn-secondary">View All Products →</Link>
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
    </>
  )
}