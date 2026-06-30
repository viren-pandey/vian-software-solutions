import type { Metadata } from 'next'
import { siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Delivery Policy',
  description: 'Delivery policy for Vian Software Solutions digital services, project deliverables, and electronic transfers.',
  keywords: ['delivery policy', 'digital delivery', 'software delivery', 'project deliverables', 'electronic transfer', 'vian delivery'],
  openGraph: {
    title: 'Delivery Policy - Vian Software Solutions',
    description: 'Delivery policy for Vian Software Solutions digital services, project deliverables, and electronic transfers.',
    images: [{ url: `${siteUrl}/assets/logo/og-image.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Delivery Policy - Vian Software Solutions',
    description: 'Delivery policy for Vian Software Solutions digital services, project deliverables, and electronic transfers.',
  },
  alternates: {
    canonical: `${siteUrl}/legal/shipping-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
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
          <p className="lead">This policy explains how Vian Software Solutions delivers digital services, project deliverables, and manages delivery timelines.</p>
          <p className="small muted" style={{ marginTop: 8 }}>Last updated: June 25, 2026</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-wrapper">
            <aside className="legal-sidebar">
              <h4>Contents</h4>
              <a href="#overview">1. Overview</a>
              <a href="#digital-delivery">2. Digital Delivery Methods</a>
              <a href="#timelines">3. Delivery Timelines</a>
              <a href="#milestones">4. Milestone Deliveries</a>
              <a href="#client-responsibilities">5. Client Responsibilities</a>
              <a href="#access-period">6. Download Access Period</a>
              <a href="#failed-delivery">7. Failed Delivery Resolution</a>
              <a href="#contact">8. Contact</a>
            </aside>
            <div className="legal-doc">
              <h2 id="overview">1. Overview</h2>
              <p>Vian Software Solutions (Sole Proprietorship of Viren Pandey) provides custom software development, web development, mobile applications, SaaS platforms, AI/ML solutions, automation services, API integrations, cloud services, UX design, technology consulting, enterprise software, and digital products. All services provided by Vian Software Solutions are digital in nature.</p>
              <p><strong>No Physical Goods:</strong> Vian Software Solutions does not ship, sell, or deliver any physical goods, products, or tangible items. All project deliverables, work product, and digital products are transmitted electronically. No shipping, freight, courier, or logistics services are used in connection with our deliverables.</p>
              <p>This Delivery Policy is incorporated by reference into our <a href="/legal/terms-and-conditions">Terms & Conditions</a> and forms an integral part of the contractual relationship between Vian Software Solutions and the Client.</p>

              <h2 id="digital-delivery">2. Digital Delivery Methods</h2>
              <p>Project deliverables, work product, and digital assets are delivered through the following electronic methods, as specified in the applicable Quotation or Statement of Work:</p>
              <p><strong>Secure File Transfer:</strong> Deliverables may be transmitted via secure file transfer services, encrypted file sharing platforms, or direct download links with access controls. Recipients will receive a secure link via email to access and download the deliverables.</p>
              <p><strong>Email Delivery:</strong> Smaller deliverables, documentation, reports, and communication materials may be delivered via email as file attachments, subject to file size limitations. Email delivery is considered effective upon transmission to the Client's registered email address.</p>
              <p><strong>Client Dashboard Access:</strong> Clients may be provided with secure access to a project dashboard, portal, or platform where deliverables can be viewed, downloaded, and managed. Access credentials will be provided to authorized Client personnel only.</p>
              <p><strong>GitHub/GitLab Repository Access:</strong> Source code and development assets are typically delivered through private Git repositories (GitHub, GitLab, or Bitbucket). The Client will be granted access to the repository as a collaborator or through a dedicated account. Repository access includes the full version history, documentation, and configuration files.</p>
              <p><strong>Cloud Storage:</strong> Large files, media assets, databases, and archival materials may be delivered via cloud storage services (Google Drive, Dropbox, AWS S3, or equivalent) with controlled access permissions.</p>
              <p><strong>Deployment to Production:</strong> Where applicable, deliverables may be deployed directly to a staging or production environment specified by the Client. Deployment details, including server access, URLs, and credentials, will be provided to the Client upon successful deployment.</p>
              <p>The specific delivery method(s) for each project shall be defined in the Quotation or Statement of Work. Vian Software Solutions reserves the right to select the most appropriate delivery method based on the nature, size, and security requirements of the deliverables.</p>

              <h2 id="timelines">3. Delivery Timelines</h2>
              <p>Delivery timelines for project deliverables are defined in the applicable Quotation, Statement of Work, or project schedule agreed upon by both parties.</p>
              <p><strong>Project Proposals:</strong> Each Quotation or project proposal includes estimated delivery timelines based on the scope of work, complexity, resource availability, and project dependencies. These timelines are estimates made in good faith and are not guaranteed delivery dates unless expressly stated as firm commitments in writing.</p>
              <p><strong>Timeline Estimates:</strong> All timelines are calculated from the project commencement date, which is the later of: (a) the date of acceptance of the Quotation or SOW; (b) the date of receipt of any required advance payment; or (c) the date of receipt of all necessary Client inputs, materials, and information.</p>
              <p><strong>Dependency on Client Input:</strong> Delivery timelines are inherently dependent on the timely provision of Client inputs, feedback, approvals, and decisions. Any delay by the Client in providing required inputs, feedback, or approvals shall result in a corresponding extension of delivery timelines. Vian Software Solutions shall not be liable for delays caused by the Client.</p>
              <p><strong>Notification of Changes:</strong> If Vian Software Solutions anticipates a material delay in any delivery timeline, we will notify the Client promptly in writing, providing an updated expected delivery date and an explanation of the reason for the delay.</p>
              <p><strong>No Liquidated Damages:</strong> Unless expressly agreed otherwise in writing, Vian Software Solutions shall not be liable for any delay in delivery, and the Client shall not be entitled to any liquidated damages, penalty, or fee reduction as a result of such delay.</p>

              <h2 id="milestones">4. Milestone Deliveries</h2>
              <p>For projects structured with milestone-based delivery schedules, the following provisions apply:</p>
              <p><strong>Milestone Definition:</strong> Each Milestone represents a predefined stage or phase of the project, with specific deliverables, acceptance criteria, and delivery dates as set forth in the Quotation or Statement of Work.</p>
              <p><strong>Milestone Delivery:</strong> Upon completion of a Milestone, Vian Software Solutions shall deliver the corresponding work product to the Client using the delivery method specified in the project agreement. Delivery is deemed effective when the deliverable is transmitted or made accessible to the Client.</p>
              <p><strong>Milestone Review Period:</strong> The Client shall have a review period of 5 business days (or as specified in the SOW) from the date of Milestone delivery to review, test, and provide feedback or acceptance. If the Client fails to provide feedback or acceptance within the review period, the Milestone shall be deemed accepted.</p>
              <p><strong>Milestone Payments:</strong> Milestone payments become due upon delivery of the corresponding Milestone deliverables, regardless of whether the Client has completed its review within the review period. Milestone payments are non-refundable as per our <a href="/legal/refund-policy">Refund & Cancellation Policy</a>.</p>
              <p><strong>Sequential Milestones:</strong> Unless otherwise agreed, subsequent Milestones will commence only upon acceptance of the preceding Milestone and receipt of any associated Milestone payment. Delays in Client acceptance or payment may result in delays in subsequent Milestones.</p>

              <h2 id="client-responsibilities">5. Client Responsibilities for Receiving Delivery</h2>
              <p>The Client acknowledges and agrees to the following responsibilities for receiving digital deliveries:</p>
              <p><strong>Contact Information:</strong> The Client shall provide and maintain accurate, current contact information, including a valid email address for receiving delivery notifications and access links. Vian Software Solutions shall not be liable for failed delivery due to incorrect or outdated Client contact information.</p>
              <p><strong>System Compatibility:</strong> The Client is responsible for ensuring that its systems, hardware, software, network infrastructure, and security configurations are compatible with and capable of receiving the delivered files in the specified format.</p>
              <p><strong>Access Credentials:</strong> If delivery requires access credentials (repository access, dashboard login, cloud storage access), the Client shall safeguard such credentials and ensure that only authorized personnel have access. Vian Software Solutions shall not be liable for unauthorized access resulting from Client's failure to protect credentials.</p>
              <p><strong>Timely Download:</strong> The Client shall download and archive delivered materials within the access period specified in Section 6. Vian Software Solutions is not obligated to retain deliverables beyond the access period unless otherwise agreed.</p>
              <p><strong>Confirmation of Receipt:</strong> The Client is encouraged to confirm receipt of deliverables promptly. If the Client does not notify Vian Software Solutions of any delivery failure or issue within 3 business days of transmission, the deliverable shall be deemed successfully delivered.</p>

              <h2 id="access-period">6. Download Access Period</h2>
              <p>Deliverables made available through secure file transfer, cloud storage, or download links are accessible for the following periods:</p>
              <p><strong>Standard Access Period:</strong> Unless otherwise specified, download links and access to delivered files shall remain active for a period of 30 calendar days from the date of initial delivery or notification.</p>
              <p><strong>Repository Access:</strong> Access to Git repositories (GitHub, GitLab, Bitbucket) shall be maintained for the duration of the project and for a period of 90 days after project completion or termination, unless otherwise agreed.</p>
              <p><strong>Dashboard Access:</strong> Client dashboard access shall be maintained for the duration of the engagement and for a period of 30 days after project completion or termination, after which access may be revoked.</p>
              <p><strong>Extension Requests:</strong> The Client may request an extension of the access period by contacting Vian Software Solutions at support@viannn.online. Extension requests may be granted at our sole discretion and may be subject to additional fees for data retrieval and hosting.</p>
              <p><strong>Archival Requests:</strong> After the access period expires, the Client may request archival copies of deliverables. Such requests will be fulfilled subject to reasonable retrieval fees based on the volume of data and effort required.</p>
              <p><strong>Client Responsibility:</strong> It is the Client's sole responsibility to download, backup, and archive all delivered materials within the applicable access period. Vian Software Solutions shall not be liable for any loss of data or deliverables resulting from the Client's failure to download within the access period.</p>

              <h2 id="failed-delivery">7. Failed Delivery Resolution</h2>
              <p>In the event of a failed or incomplete delivery, the following resolution process shall apply:</p>
              <p><strong>Notification:</strong> The Client shall notify Vian Software Solutions in writing at support@viannn.online within 3 business days of the expected delivery date if the deliverables have not been received or are incomplete or corrupted.</p>
              <p><strong>Investigation:</strong> Vian Software Solutions shall promptly investigate the cause of the delivery failure. Common causes include incorrect contact information, email spam filters, file size restrictions, network issues, or technical problems with the delivery platform.</p>
              <p><strong>Re-delivery:</strong> Upon identifying and resolving the cause of the failure, Vian Software Solutions shall re-attempt delivery using the same or an alternative method, as mutually agreed. Re-delivery shall be completed within 3 business days of the Client's notification, subject to the nature of the issue.</p>
              <p><strong>Alternative Method:</strong> If the original delivery method continues to fail, Vian Software Solutions shall propose an alternative delivery method acceptable to both parties. The Client may be required to provide updated contact information, whitelist our domains, or adjust system settings to facilitate successful delivery.</p>
              <p><strong>Delivery Confirmation:</strong> Delivery shall be deemed successful when: (a) the Client confirms receipt in writing; (b) the access credentials are used to access the deliverables; (c) the deliverable is deployed to a production environment; or (d) 5 business days have elapsed since transmission without the Client reporting a failure, whichever occurs first.</p>
              <p><strong>Limitation of Liability:</strong> Vian Software Solutions' liability for failed delivery shall be limited to re-delivery of the affected deliverables using an alternative method. In no event shall Vian Software Solutions be liable for any consequential damages arising from delivery failure, including but not limited to project delays, business interruption, or loss of opportunity.</p>

              <h2 id="contact">8. Contact</h2>
              <p>If you have any questions, concerns, or issues regarding delivery of your project deliverables, please contact us:</p>
              <p><strong>Vian Software Solutions</strong><br />Sole Proprietorship of Viren Pandey<br />Mumbai, Maharashtra, India<br />Email: support@viannn.online<br />Phone: +91 9598443203</p>
              <p>For delivery-related matters, please include your project name or Quotation reference number in the subject line of your email to help us assist you promptly.</p>
              <div className="legal-note"><strong>Last updated:</strong> June 25, 2026</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
