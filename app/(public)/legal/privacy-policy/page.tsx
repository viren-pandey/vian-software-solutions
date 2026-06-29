import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Vian Software Solutions collects, uses, stores, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Legal</span>
            <span>/</span>
            <span>Privacy Policy</span>
          </div>
          <span className="eyebrow">Legal</span>
          <h1>Privacy Policy</h1>
          <p className="lead">This policy explains how Vian Software Solutions (Sole Proprietorship of Viren Pandey) collects, uses, and protects your information.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-wrapper">
            <aside className="legal-sidebar">
              <h4>Contents</h4>
              <a href="#jurisdiction">Jurisdiction</a>
              <a href="#information">Information We Collect</a>
              <a href="#usage">How We Use Information</a>
              <a href="#cookies">Cookies</a>
              <a href="#sharing">Third Party Disclosure</a>
              <a href="#security">Data Security</a>
              <a href="#retention">Data Retention</a>
              <a href="#rights">Your Rights</a>
              <a href="#contact">Contact</a>
            </aside>
            <div className="legal-doc">
              <h2 id="jurisdiction">Jurisdiction & Governing Law</h2>
              <p>This Privacy Policy is governed by the laws of the Republic of India. Vian Software Solutions is a Sole Proprietorship based in Mumbai, Maharashtra, India.</p>
              <p>Personal information is subject to the Information Technology Act, 2000 and the IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</p>

              <h2 id="information">Information We Collect</h2>
              <p><strong>Information you provide:</strong> Name, email, phone, company, billing address, project requirements, and communication records.</p>
              <p><strong>Information collected automatically:</strong> Usage data, device information, IP address, browser type, and analytics data.</p>

              <h2 id="usage">How We Use Information</h2>
              <ul>
                <li>Service delivery and project management</li>
                <li>Communication and support</li>
                <li>Billing and payments</li>
                <li>Legal compliance</li>
                <li>Service improvement and analytics</li>
                <li>Security and fraud prevention</li>
              </ul>

              <h2 id="cookies">Cookies</h2>
              <p>We use essential cookies for website functionality, preference cookies for theme selection, and analytics cookies (with consent) for usage analysis. You can manage cookies through your browser settings. See our <a href="/legal/cookie-policy">Cookie Policy</a> for details.</p>

              <h2 id="sharing">Third Party Disclosure</h2>
              <p>We do not sell your personal information. We may share data with trusted service providers (hosting, payment processing, analytics) who are contractually obligated to protect it, or when required by law.</p>

              <h2 id="security">Data Security</h2>
              <p>We implement TLS/SSL encryption, secure server infrastructure, access controls, and regular security assessments. No method of transmission is 100% secure, but we take all reasonable precautions.</p>

              <h2 id="retention">Data Retention</h2>
              <p>Contact data: retained for 24 months after last communication. Project data: retained for 36 months post-project. Billing records: retained for 7 years (Indian tax law). Analytics data: retained in anonymized form for 26 months.</p>

              <h2 id="rights">Your Rights</h2>
              <p>Depending on your jurisdiction, you may have rights to access, rectify, erase, restrict processing, or port your data. To exercise these rights, contact us at virenpandey89@gmail.com.</p>
              <p><strong>Grievance Officer:</strong> Viren Pandey, Proprietor. virenpandey89@gmail.com. Grievances acknowledged within 24 hours, resolved within 15 days.</p>

              <h2 id="contact">Contact</h2>
              <p>Email: virenpandey89@gmail.com<br />Phone: +91 9598443203</p>
              <div className="legal-note"><strong>Last updated:</strong> June 25, 2026</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}