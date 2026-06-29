import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Vian Software Solutions — services, process, pricing, and support.',
}

const faqSections = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is Vian Software Solutions?',
        a: 'Vian Software Solutions is a Mumbai-based software company that provides custom software development, web development, automation, and technology consulting services. We work with startups, businesses, and organizations to build reliable digital solutions.',
      },
      {
        q: 'Where is Vian located?',
        a: 'We are based in Mumbai, Maharashtra, India. We serve clients worldwide through remote collaboration, with scheduled calls at key milestones and documented asynchronous communication.',
      },
      {
        q: 'Who is behind Vian?',
        a: 'Vian is a sole proprietorship founded and led by Viren Pandey. Every project is personally overseen by the founder, ensuring direct communication and accountability. For specialized needs, trusted contractors are engaged under direct supervision.',
      },
      {
        q: 'What industries do you work with?',
        a: 'We work across industries including technology, finance, healthcare, e-commerce, education, and professional services. Each engagement begins with a discovery phase to understand domain-specific requirements.',
      },
    ],
  },
  {
    category: 'Services & Projects',
    questions: [
      {
        q: 'What services do you offer?',
        a: 'We offer web development, custom software development, automation and AI integration, digital growth and SEO services, and technology consulting. See our Services page for detailed information on each.',
      },
      {
        q: 'Do you sell pre-made scripts or templates?',
        a: 'No. Every solution we deliver is custom-built for the specific requirements of the project. We do not sell templates, pre-made scripts, or one-size-fits-all products.',
      },
      {
        q: 'What is your development process?',
        a: 'Our process follows eight stages: Discovery, Requirement Analysis, Proposal & Quotation, Client Discussion & Approval, Development Sprints, Testing & QA, Deployment & Launch, and Maintenance & Support. See our Process page for full details.',
      },
      {
        q: 'How long does a typical project take?',
        a: 'Timelines depend on scope and complexity. A standard business website typically takes 4—8 weeks. Custom software applications range from 6—16 weeks. We provide a timeline estimate during the proposal phase.',
      },
    ],
  },
  {
    category: 'Pricing & Payments',
    questions: [
      {
        q: 'How much does a project cost?',
        a: 'Cost depends on scope, complexity, and requirements. We provide fixed-price proposals with milestone-based payments. Contact us with your requirements for a detailed quote — there is no charge for initial consultations.',
      },
      {
        q: 'What pricing models do you offer?',
        a: 'We offer fixed-price project proposals (most common), milestone-based payments, monthly retainers for ongoing work, and hourly rates for smaller scoped tasks. The appropriate model is discussed during the proposal phase.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept bank transfers, UPI, and payments through our integrated payment gateway. All payment processing is handled securely by third-party providers.',
      },
      {
        q: 'Do you issue invoices?',
        a: 'Yes. We issue professional invoices for all payments, including GST-compliant invoices where applicable. Invoices include project details, payment terms, and transaction references.',
      },
      {
        q: 'What is your refund policy?',
        a: 'Our refund policy is detailed on our Refund Policy page. In summary, milestone payments for completed work are non-refundable. If we make an error on our part, we resolve it through service credits. We encourage you to review the full policy.',
      },
    ],
  },
  {
    category: 'Support & Maintenance',
    questions: [
      {
        q: 'What support do you provide after launch?',
        a: 'Our standard support includes bug fixes, security updates, performance monitoring, and content updates for a period agreed upon in the project agreement. Extended maintenance packages are available.',
      },
      {
        q: 'What is your response time for support?',
        a: 'Standard support requests are acknowledged within 24 hours on business days. Critical issues (site downtime, security concerns) are prioritized and addressed within a few hours.',
      },
      {
        q: 'What support channels are available?',
        a: 'Support is provided through email, the client dashboard ticketing system, and scheduled video calls depending on the support package. Emergency contact information is provided for critical issues.',
      },
    ],
  },
  {
    category: 'Technology & Ownership',
    questions: [
      {
        q: 'Who owns the source code?',
        a: 'After full payment, all agreed deliverables including source code, documentation, and assets are transferred to the client, subject to third-party licenses and open-source dependencies. Full ownership terms are defined in the project agreement.',
      },
      {
        q: 'What technologies do you use?',
        a: 'We use modern, widely-supported technologies: React, Next.js, TypeScript for frontend; Node.js, Python, FastAPI for backend; PostgreSQL for databases; and Docker, Vercel, and Cloudflare for infrastructure. The exact stack is selected based on project requirements.',
      },
      {
        q: 'Do you use AI in your development process?',
        a: 'We use AI tools to assist with code completion, testing, and research, just as most modern development teams do. However, every line of code is reviewed, tested, and owned by our team. We do not deliver AI-generated code without human review and validation.',
      },
      {
        q: 'How do you handle security?',
        a: 'Security is integrated into our development process — secure authentication, HTTPS, input validation, RBAC, audit logging, and regular dependency updates. See our Security page for full details.',
      },
    ],
  },
  {
    category: 'Communication',
    questions: [
      {
        q: 'How do you communicate with clients during a project?',
        a: 'We provide weekly progress updates, milestone demo sessions, and direct access through email and our client dashboard. Communication is documented so nothing is lost.',
      },
      {
        q: 'Can I see the progress of my project?',
        a: 'Yes. Clients have access to our client dashboard where they can view project status, milestones, invoices, and communicate with the team.',
      },
      {
        q: 'What if I need changes during the project?',
        a: 'Scope changes are handled through a formal change-order process. Changes that affect timeline or cost are discussed and approved before any additional work begins.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>FAQ</span>
          </div>
          <span className="eyebrow">FAQ</span>
          <h1>Frequently asked questions.</h1>
          <p className="lead">Clear answers about how we work, what we build, and what you can expect when you work with Vian.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800, marginInline: 'auto' }}>
          {faqSections.map((section) => (
            <details key={section.category} className="faq-section">
              <summary className="faq-category">
                <span className="eyebrow">{section.category}</span>
                <span className="faq-toggle" aria-hidden="true">+</span>
              </summary>
              <div className="faq-items">
                {section.questions.map((item, i) => (
                  <details key={i} className="faq-item">
                    <summary className="faq-question">
                      {item.q}
                      <span className="faq-toggle" aria-hidden="true">+</span>
                    </summary>
                    <div className="faq-answer">
                      <p>{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="cta-banner">
            <h2>Still have questions?</h2>
            <p>We are happy to answer any questions about your specific project.</p>
            <a href="/contact" className="btn btn-primary btn-lg">Contact Us</a>
          </div>
        </div>
      </section>
    </>
  )
}