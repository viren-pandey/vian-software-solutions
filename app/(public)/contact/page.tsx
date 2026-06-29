import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Vian Software Solutions. Start a project, ask a question, or request a consultation.',
}

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Contact</span>
          </div>
          <span className="eyebrow">Contact</span>
          <h1>Let us build something together.</h1>
          <p className="lead">Tell us about your project. We will get back to you with a clear proposal within 1-2 business days.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-detail">
                <h3>Business Information</h3>
                <p className="muted">Vian Software Solutions<br />Sole Proprietorship of Viren Pandey<br />Mumbai, Maharashtra, India</p>
              </div>

              <div className="contact-detail">
                <h3>Email</h3>
                <p><strong>General Inquiries:</strong> virenpandey89@gmail.com</p>
                <p><strong>Support:</strong> virenpandey89@gmail.com</p>
                <p><strong>Security:</strong> virenpandey89@gmail.com</p>
              </div>

              <div className="contact-detail">
                <h3>Phone</h3>
                <p>+91 9598443203</p>
              </div>

              <div className="contact-detail">
                <h3>Working Hours</h3>
                <p className="muted">Monday — Saturday<br />10:00 AM — 7:00 PM IST</p>
              </div>

              <div className="contact-detail">
                <h3>Response Time</h3>
                <p className="muted">Inquiries: within 24 hours<br />Support requests: within 12 hours<br />Critical issues: within 2 hours</p>
              </div>
            </div>

            <form className="contact-form" action="https://web3forms.com/api/v1/submit" method="POST">
              <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_KEY" />
              <input type="hidden" name="subject" value="New contact form submission from viannn.online" />
              <input type="hidden" name="from_name" value="Vian Website Contact" />
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" required placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required placeholder="your@email.com" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone (optional)</label>
                <input type="tel" id="phone" name="phone" placeholder="+91 98765 43210" />
              </div>
              <div className="form-group">
                <label htmlFor="service">Service Needed</label>
                <select id="service" name="service">
                  <option value="">Select a service</option>
                  <option value="web-development">Web Development</option>
                  <option value="software-development">Software Development</option>
                  <option value="automation">Automation & AI</option>
                  <option value="digital-growth">Digital Growth & SEO</option>
                  <option value="consulting">Technology Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="budget">Budget Range (optional)</label>
                <select id="budget" name="budget">
                  <option value="">Select a range</option>
                  <option value="under-50k">Under ₹50,000</option>
                  <option value="50k-1lac">₹50,000 — ₹1,00,000</option>
                  <option value="1lac-3lac">₹1,00,000 — ₹3,00,000</option>
                  <option value="3lac-5lac">₹3,00,000 — ₹5,00,000</option>
                  <option value="above-5lac">Above ₹5,00,000</option>
                  <option value="not-sure">Not sure yet</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Project Details</label>
                <textarea id="message" name="message" rows={6} required placeholder="Tell us about your project, requirements, and timeline."></textarea>
              </div>
              <div className="form-group">
                <div className="h-captcha" data-captcha="true"></div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg btn-block">
                Send Message
              </button>
              <p className="muted" style={{ fontSize: 13, marginTop: 12, textAlign: 'center' }}>
                We respect your privacy. Your information will not be shared.
              </p>
            </form>
          </div>
        </div>
      </section>

      <script src="https://web3forms.com/client/script.js" async defer></script>
    </>
  )
}