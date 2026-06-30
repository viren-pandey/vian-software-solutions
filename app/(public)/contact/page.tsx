import type { Metadata } from 'next'
import { siteUrl, breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Vian Software Solutions. Start a project, request a quotation, or ask a question.',
  keywords: ['contact vian', 'software consultation', 'get a quote', 'mumbai software company', 'start a project', 'software inquiry'],
  openGraph: {
    title: 'Contact - Vian Software Solutions',
    description: 'Get in touch with Vian Software Solutions. Start a project, request a quotation, or ask a question.',
    images: [{ url: `${siteUrl}/assets/logo/og-image.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact - Vian Software Solutions',
    description: 'Get in touch with Vian Software Solutions. Start a project, request a quotation, or ask a question.',
  },
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Contact</span>
          </div>
          <span className="eyebrow">Contact</span>
          <h1>Let us build something together.</h1>
          <p className="lead">Tell us about your project. We will review your requirements and respond with a detailed quotation within 24 hours.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-detail">
                <h3>Business Information</h3>
                <p><strong>Vian Software Solutions</strong></p>
                <p>Sole Proprietorship of Viren Pandey</p>
                <p>Mumbai, Maharashtra, India</p>
              </div>
              <div className="contact-detail">
                <h3>Email</h3>
                <p><a href="mailto:support@viannn.online" style={{ color: 'var(--text)' }}>support@viannn.online</a></p>
              </div>
              <div className="contact-detail">
                <h3>Phone</h3>
                <p>+91 9598443203</p>
              </div>
              <div className="contact-detail">
                <h3>Business Hours</h3>
                <p>Monday — Saturday: 10:00 AM — 7:00 PM IST</p>
                <p>Sunday: Closed</p>
              </div>
              <div className="contact-detail">
                <h3>Response Time</h3>
                <p>Project inquiries: within 24 hours</p>
                <p>Support requests: within 4 hours (business hours)</p>
                <p>Emergency support: within 1 hour (existing clients)</p>
              </div>
              <div className="contact-detail">
                <h3>Quick Links</h3>
                <p><a href="/legal/terms-and-conditions" style={{ color: 'var(--text)' }}>Terms & Conditions</a></p>
                <p><a href="/legal/privacy-policy" style={{ color: 'var(--text)' }}>Privacy Policy</a></p>
                <p><a href="/legal/refund-policy" style={{ color: 'var(--text)' }}>Refund Policy</a></p>
                <p><a href="/faq" style={{ color: 'var(--text)' }}>FAQ</a></p>
              </div>
            </div>

            <div>
              <form className="contact-form" action="mailto:support@viannn.online" method="POST" encType="text/plain">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" name="name" placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone (optional)</label>
                    <input type="tel" id="phone" name="phone" placeholder="+91 98765 43210" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Company (optional)</label>
                    <input type="text" id="company" name="company" placeholder="Your company" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="service">Service Needed</label>
                  <select id="service" name="service">
                    <option value="">Select a service...</option>
                    <option value="web-development">Web Development</option>
                    <option value="software-development">Software Development</option>
                    <option value="mobile-app">Mobile Application</option>
                    <option value="saas">SaaS Development</option>
                    <option value="ai-ml">AI & Machine Learning</option>
                    <option value="automation">Business Automation</option>
                    <option value="api">API Development</option>
                    <option value="cloud">Cloud Solutions</option>
                    <option value="ux-design">UI/UX Design</option>
                    <option value="consulting">Software Consulting</option>
                    <option value="enterprise">Enterprise Software</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="budget">Budget Range (optional)</label>
                  <select id="budget" name="budget">
                    <option value="">Select a range...</option>
                    <option value="under-50k">Below ₹50,000</option>
                    <option value="50k-1lac">₹50,000 — ₹1,00,000</option>
                    <option value="1lac-5lac">₹1,00,000 — ₹5,00,000</option>
                    <option value="5lac-10lac">₹5,00,000 — ₹10,00,000</option>
                    <option value="above-10lac">Above ₹10,00,000</option>
                    <option value="not-sure">Not sure yet</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Project Details</label>
                  <textarea id="message" name="message" placeholder="Describe your project, goals, timeline, and any specific requirements..." required></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-lg">Send Inquiry</button>
                <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>We will respond within 24 hours with a preliminary assessment.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{ maxWidth: 720, marginInline: 'auto' }}>
          <div className="section-head">
            <h2>Frequently asked.</h2>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <span>How do I start a project?</span>
              <span>+</span>
            </div>
            <div className="faq-answer">
              <p>Send us a message through the contact form or email us directly. We will schedule a call to understand your requirements, then provide a detailed quotation within 24 hours.</p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <span>What information do you need for a quotation?</span>
              <span>+</span>
            </div>
            <div className="faq-answer">
              <p>Tell us about your project goals, preferred technologies (if any), timeline expectations, and budget range. The more detail you provide, the more accurate your quotation will be.</p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <span>What happens after I accept a quotation?</span>
              <span>+</span>
            </div>
            <div className="faq-answer">
              <p>We will generate an invoice for the initial milestone. Once payment is confirmed, we begin work. You will receive access to your project dashboard where you can track progress, communicate with the team, and review deliverables.</p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <span>Can I make changes after the project starts?</span>
              <span>+</span>
            </div>
            <div className="faq-answer">
              <p>Yes. Minor changes are accommodated within the existing scope. Significant changes may require a change order with adjusted timeline and pricing. We discuss all changes upfront so there are no surprises.</p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <span>What payment methods do you accept?</span>
              <span>+</span>
            </div>
            <div className="faq-answer">
              <p>We accept bank transfers, UPI, credit/debit cards, Paytm, and Razorpay. All payments are processed through secure, PCI-compliant gateways.</p>
            </div>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', item: '/' }, { name: 'Contact', item: '/contact' }])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPoint',
            telephone: '+91-9598443203',
            contactType: 'sales',
            email: 'support@viannn.online',
            availableLanguage: ['English', 'Hindi'],
            areaServed: 'IN',
          }),
        }}
      />
    </>
  )
}
