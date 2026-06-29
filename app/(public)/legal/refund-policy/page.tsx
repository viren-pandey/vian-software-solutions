import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund and cancellation policy for Vian Software Solutions services and projects.',
}

export default function RefundPolicyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Legal</span>
            <span>/</span>
            <span>Refund Policy</span>
          </div>
          <span className="eyebrow">Legal</span>
          <h1>Refund Policy</h1>
          <p className="lead">Terms for refunds, cancellations, and dispute resolution for our services and project-based engagements.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720, marginInline: 'auto' }}>
          <div className="legal-doc">
            <h2 id="overview">Overview</h2>
            <p>We are committed to delivering high-quality work. This policy is designed to protect both our clients and our business while ensuring clarity and fairness. It applies to all services offered by Vian Software Solutions.</p>

            <h2 id="no-refund">No Refund Policy</h2>
            <p><strong>We do not offer refunds until our service is fully completed.</strong> Once a project is accepted and work has commenced, all payments made are considered earned and are non-refundable. This is because our services are digital in nature and involve significant allocation of time, resources, and effort.</p>

            <h2 id="our-mistake">If It Is Our Mistake</h2>
            <p>In the rare event of an error entirely on our part, we will issue <strong>service credits</strong> (not cash refunds) back to your original payment source. Credits must be used within 12 months of issuance. To request a credit, contact us with details of the issue.</p>

            <h2 id="non-refundable">Non-Refundable Items</h2>
            <ul>
              <li>Domain name registration and renewal fees</li>
              <li>SSL certificate purchases and installation fees</li>
              <li>Third-party software licenses</li>
              <li>Hosting fees paid to third-party providers</li>
              <li>Stock asset purchases</li>
              <li>Administrative and processing fees</li>
              <li>Retainer fees for the current billing period once commenced</li>
            </ul>

            <h2 id="chargebacks">Chargebacks</h2>
            <p>If you initiate a chargeback without first attempting to resolve the dispute directly with us, we reserve the right to suspend services, revoke access, dispute the chargeback with documentation, and pursue legal remedies for fraudulent or abusive chargebacks.</p>
            <p>We strongly encourage contacting us at virenpandey89@gmail.com before initiating a chargeback.</p>

            <h2 id="contact">Contact</h2>
            <p>Email: virenpandey89@gmail.com<br />Phone: +91 9598443203</p>
            <div className="legal-note"><strong>Last updated:</strong> June 25, 2026</div>
          </div>
        </div>
      </section>
    </>
  )
}