import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Delivery Policy',
  description: 'Delivery and shipping policy for Vian Software Solutions digital services and products.',
}

export default function ShippingPolicyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Legal</span>
            <span>/</span>
            <span>Delivery Policy</span>
          </div>
          <span className="eyebrow">Legal</span>
          <h1>Delivery Policy</h1>
          <p className="lead">How we deliver our digital services and manage project timelines.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720, marginInline: 'auto' }}>
          <div className="legal-doc">
            <h2 id="overview">Overview</h2>
            <p>Vian Software Solutions provides digital services. Deliverables are transmitted electronically. No physical goods are shipped.</p>

            <h2 id="delivery">Delivery Process</h2>
            <p>Project deliverables (source code, documentation, assets) are delivered through secure file transfer, email, or client dashboard access as specified in the project agreement. Delivery timelines are defined in the project proposal or Statement of Work.</p>

            <h2 id="timeline">Timelines</h2>
            <p>Project timelines are estimates provided in good faith. We keep clients informed of progress through regular updates and milestone reviews. Delays caused by client feedback cycles, third-party dependencies, or scope changes may affect delivery dates.</p>

            <h2 id="contact">Contact</h2>
            <p>Email: virenpandey89@gmail.com</p>
            <div className="legal-note"><strong>Last updated:</strong> June 25, 2026</div>
          </div>
        </div>
      </section>
    </>
  )
}