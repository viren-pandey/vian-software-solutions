import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions governing the use of Vian Software Solutions website, services, and products.',
}

export default function TermsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Legal</span>
            <span>/</span>
            <span>Terms & Conditions</span>
          </div>
          <span className="eyebrow">Legal</span>
          <h1>Terms & Conditions</h1>
          <p className="lead">These terms govern your access to our website, services, software, platforms, and products.</p>
          <p className="small muted" style={{ marginTop: 8 }}>Last updated: June 25, 2026</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-wrapper">
            <aside className="legal-sidebar">
              <h4>Contents</h4>
              <a href="#acceptance">1. Acceptance</a>
              <a href="#services">2. Services</a>
              <a href="#ownership">3. Ownership</a>
              <a href="#payments">4. Payments</a>
              <a href="#refunds">5. Refunds</a>
              <a href="#confidentiality">6. Confidentiality</a>
              <a href="#liability">7. Liability</a>
              <a href="#jurisdiction">8. Jurisdiction</a>
              <a href="#contact">9. Contact</a>
            </aside>
            <div className="legal-doc">
              <h2 id="acceptance">1. Acceptance of Terms</h2>
              <p>By using our website or engaging our services, you agree to these Terms and Conditions. If you do not agree, please discontinue use immediately. These terms apply to all visitors, users, and clients worldwide.</p>

              <h2 id="services">2. Services</h2>
              <p>Vian Software Solutions provides custom software development, web development, automation, AI integration, digital growth services, and technology consulting. Specific scope, deliverables, and timelines are defined in individual project proposals or Statements of Work.</p>
              <p>We do not sell pre-made scripts or templates. Every solution is custom-built for the client's requirements.</p>

              <h2 id="ownership">3. Ownership & Intellectual Property</h2>
              <p><strong>Custom Development:</strong> After full payment, all agreed deliverables including source code are transferred to the client, subject to third-party licenses and open-source dependencies.</p>
              <p><strong>Pre-existing Materials:</strong> Our pre-existing code, tools, libraries, and methodologies remain our property. We grant a perpetual license to use them as part of your delivered solution.</p>

              <h2 id="payments">4. Payments & Invoicing</h2>
              <p>Fees are set forth in project proposals. Invoices are due within 15 days unless otherwise agreed. Late payments may incur interest at 1.5% per month. We accept bank transfers, UPI, and card payments through secure gateways.</p>

              <h2 id="refunds">5. Refunds & Cancellations</h2>
              <p>Our refund policy is detailed on the Refund Policy page. In summary, payments for completed milestones are non-refundable. Errors on our part are resolved through service credits. We strongly encourage contacting us before initiating chargebacks.</p>

              <h2 id="confidentiality">6. Confidentiality</h2>
              <p>Both parties agree to keep confidential information private during and after the engagement. This includes business plans, technical data, source code, and project materials.</p>

              <h2 id="liability">7. Limitation of Liability</h2>
              <p>Our liability is limited to the total fees paid for the specific project giving rise to the claim. We are not liable for indirect, incidental, or consequential damages. This limitation does not apply where prohibited by law.</p>

              <h2 id="jurisdiction">8. Jurisdiction & Dispute Resolution</h2>
              <p>These terms are governed by Indian law. Disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra, India. We encourage amicable resolution before formal proceedings.</p>

              <h2 id="contact">9. Contact Information</h2>
              <p><strong>Vian Software Solutions</strong><br />Sole Proprietorship of Viren Pandey<br />Mumbai, Maharashtra, India<br />Email: virenpandey89@gmail.com</p>
              <div className="legal-note"><strong>Last updated:</strong> June 25, 2026</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}