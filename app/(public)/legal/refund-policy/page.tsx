import type { Metadata } from 'next'
import { siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'Refund and cancellation policy for Vian Software Solutions services, projects, and digital products.',
  keywords: ['refund policy', 'cancellation policy', 'software refund', 'service cancellation', 'digital product refund', 'vian refund'],
  openGraph: {
    title: 'Refund & Cancellation Policy - Vian Software Solutions',
    description: 'Refund and cancellation policy for Vian Software Solutions services, projects, and digital products.',
    images: [{ url: `${siteUrl}/assets/logo/og-image.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Refund & Cancellation Policy - Vian Software Solutions',
    description: 'Refund and cancellation policy for Vian Software Solutions services, projects, and digital products.',
  },
  alternates: {
    canonical: `${siteUrl}/legal/refund-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
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
            <span>Refund & Cancellation Policy</span>
          </div>
          <span className="eyebrow">Legal</span>
          <h1>Refund & Cancellation Policy</h1>
          <p className="lead">This policy governs refunds, cancellations, and dispute resolution for all services, projects, and digital products offered by Vian Software Solutions.</p>
          <p className="small muted" style={{ marginTop: 8 }}>Last updated: June 25, 2026</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-wrapper">
            <aside className="legal-sidebar">
              <h4>Contents</h4>
              <a href="#overview">1. Overview</a>
              <a href="#cancellation">2. Project Cancellation</a>
              <a href="#quotation-expiry">3. Quotation Expiry & Validity</a>
              <a href="#advance-payments">4. Advance & Milestone Payments</a>
              <a href="#completed-work">5. Completed Work & Digital Deliverables</a>
              <a href="#custom-development">6. Custom Software Development</a>
              <a href="#maintenance">7. Maintenance & Support Services</a>
              <a href="#eligibility">8. Refund Eligibility Criteria</a>
              <a href="#no-refund">9. No Refund Policy</a>
              <a href="#our-mistake">10. If It Is Our Mistake</a>
              <a href="#non-refundable">11. Non-Refundable Items</a>
              <a href="#timeline">12. Refund Timeline & Method</a>
              <a href="#chargebacks">13. Chargebacks</a>
              <a href="#dispute-resolution">14. Dispute Resolution</a>
            </aside>
            <div className="legal-doc">
              <h2 id="overview">1. Overview</h2>
              <p>Vian Software Solutions (Sole Proprietorship of Viren Pandey) is committed to delivering high-quality custom software development, web development, mobile applications, SaaS platforms, AI/ML solutions, automation services, API integrations, cloud services, UX design, technology consulting, enterprise software, and digital products. This Refund & Cancellation Policy (the "Policy") is designed to provide clarity and fairness to both our clients and our business.</p>
              <p>This Policy is incorporated by reference into our <a href="/legal/terms-and-conditions">Terms & Conditions</a> and forms an integral part of the contractual relationship between Vian Software Solutions and the Client. All capitalized terms used but not defined herein shall have the meanings ascribed to them in the Terms & Conditions.</p>
              <p>Because our services are digital in nature and involve the allocation of significant time, expertise, and resources from the moment a project commences, our refund policy is necessarily restrictive. We encourage all prospective clients to carefully review this Policy before engaging our services, and to contact us with any questions or concerns at support@viannn.online.</p>

              <h2 id="cancellation">2. Project Cancellation</h2>
              <p><strong>2.1 Cancellation Before Work Commences:</strong> If a Client requests cancellation of a project before any work has commenced (i.e., before the project start date specified in the Quotation or Statement of Work, and before any development, design, or consulting work has been performed), the Client shall be entitled to a full refund of any advance payments made, less any administrative or processing fees as specified in Section 11. Cancellation requests must be submitted in writing to support@viannn.online.</p>
              <p><strong>2.2 Cancellation After Work Has Commenced:</strong> If a Client requests cancellation after work has commenced, including after the completion of any project Milestone, the Client shall not be entitled to any refund. All payments made up to the date of cancellation shall be retained by Vian Software Solutions as compensation for work performed, resources allocated, and opportunity cost incurred. The Client shall also be liable for payment of any work completed but not yet invoiced, calculated on a pro-rata basis.</p>
              <p><strong>2.3 Cancellation After Delivery:</strong> If a Client requests cancellation after delivery of the Work Product or Deliverables, whether or not formal acceptance has occurred, no refund shall be provided under any circumstances. The Client remains obligated to pay all outstanding Fees for the project.</p>
              <p><strong>2.4 Partial Project Completion:</strong> In the event of cancellation of a project that is partially complete, Vian Software Solutions shall deliver to the Client all work product completed up to the date of cancellation, subject to payment of all Fees due for work performed and any non-cancellable commitments made on the Client's behalf.</p>
              <p><strong>2.5 How to Cancel:</strong> To request cancellation, the Client must send a written cancellation request to support@viannn.online from the registered email address, clearly stating the project name, Quotation or SOW reference, and the reason for cancellation. Vian Software Solutions shall acknowledge receipt of the cancellation request within 3 business days.</p>

              <h2 id="quotation-expiry">3. Quotation Expiry & Validity</h2>
              <p><strong>3.1 Quotation Validity Period:</strong> All quotations issued by Vian Software Solutions are valid for the period stated on the quotation, typically 15 to 30 days from the date of issuance. Vian Software Solutions reserves the right to revise, withdraw, or cancel any quotation that has not been accepted within the validity period.</p>
              <p><strong>3.2 Expired Quotations:</strong> If a Client attempts to accept a quotation after its expiry date, Vian Software Solutions reserves the right to: (a) reject the acceptance; (b) issue a revised quotation with updated pricing and timelines; or (c) require重新-negotiation of terms. No refund or credit shall be provided for price differences between an expired quotation and a revised quotation.</p>
              <p><strong>3.3 Quotation Withdrawal:</strong> Vian Software Solutions reserves the right to withdraw a quotation at any time before acceptance, without liability or obligation to the prospective Client.</p>

              <h2 id="advance-payments">4. Advance Payments & Milestone Payments</h2>
              <p><strong>4.1 Advance Payments:</strong> Vian Software Solutions may require an advance payment (typically 30% to 50% of the total project Fees) before work commences. This advance payment secures the Client's place in our project queue, covers initial project setup costs, and compensates for the allocation of resources. Advance payments are non-refundable once work has commenced, except as provided in Section 2.1 (cancellation before work commences, subject to administrative fees).</p>
              <p><strong>4.2 Milestone Payments:</strong> Projects structured with milestone-based payments require payment upon the completion and delivery of each Milestone. Once a Milestone has been completed and delivered to the Client, the corresponding Milestone payment is earned and is non-refundable, regardless of whether the Client proceeds with subsequent Milestones.</p>
              <p><strong>4.3 Retainer Payments:</strong> For retainer-based engagements, payments are due in advance for the upcoming billing period. Retainer fees for a billing period that has commenced are non-refundable. Unused retainer hours do not carry over to subsequent billing periods unless expressly agreed in writing.</p>
              <p><strong>4.4 Subscription Payments:</strong> SaaS platform subscriptions and ongoing service subscriptions are billed in advance and are non-refundable for the current billing period. Clients may cancel subscriptions for future billing periods by providing notice as specified in the applicable subscription agreement.</p>

              <h2 id="completed-work">5. Completed Work & Digital Deliverables</h2>
              <p><strong>5.1 Digital Nature of Services:</strong> All services provided by Vian Software Solutions result in digital deliverables, including but not limited to source code, software applications, websites, designs, configurations, and documentation. Due to the intangible and non-returnable nature of digital goods, all completed work and digital deliverables are non-refundable once delivered to the Client.</p>
              <p><strong>5.2 Delivery Confirmation:</strong> Delivery is deemed to have occurred when: (a) the deliverable is transmitted to the Client via email, file transfer, repository access, or any other electronic means; (b) the Client is given access to a staging, test, or production environment containing the deliverable; or (c) the deliverable is deployed to a server or platform accessible by the Client, whichever occurs first.</p>
              <p><strong>5.3 Digital Products:</strong> Pre-built digital products, templates, components, and modules offered for license or sale are non-refundable once downloaded, accessed, or delivered, except in cases of material non-conformance as determined by Vian Software Solutions in its sole discretion.</p>

              <h2 id="custom-development">6. Custom Software Development</h2>
              <p><strong>6.1 No Refunds on Custom Work:</strong> Custom software development projects are inherently unique and tailored to the specific requirements of each Client. Once development has commenced, the code, architecture, and solutions developed are specific to the Client's project and cannot be resold or repurposed for other clients. Accordingly, all payments for custom software development are non-refundable once work has commenced.</p>
              <p><strong>6.2 Discovery and Planning Phase:</strong> The initial discovery, requirements analysis, and planning phase of a custom software project involves significant consultation, research, and design work. Fees for the discovery phase are non-refundable once the phase has commenced.</p>
              <p><strong>6.3 Scope Changes:</strong> If a Client requests scope changes that materially alter the project requirements, any additional Fees for such changes are subject to the same non-refundable terms as the original project.</p>
              <p><strong>6.4 Client-Initiated Changes:</strong> If a Client decides to change the project direction, technology stack, or requirements after work has commenced, Vian Software Solutions shall not be obligated to provide refunds for work already completed under the original scope. The Client shall pay for all work performed up to the date of the change, and new Fees shall apply for the revised scope.</p>

              <h2 id="maintenance">7. Maintenance & Support Services</h2>
              <p><strong>7.1 Maintenance Agreements:</strong> Ongoing maintenance and support services are billed on a subscription or retainer basis. Fees for maintenance services are non-refundable once the billing period has commenced. Clients may cancel maintenance services for future billing periods by providing 30 days' written notice.</p>
              <p><strong>7.2 Ad-Hoc Support:</strong> Ad-hoc support services provided on a time-and-materials basis are non-refundable once the work has been performed. Clients are encouraged to discuss estimated hours and costs before authorizing ad-hoc support work.</p>
              <p><strong>7.3 Emergency Support:</strong> Emergency support requests requiring immediate attention may be subject to premium rates. All emergency support fees are non-refundable once the support has been rendered.</p>

              <h2 id="eligibility">8. Refund Eligibility Criteria</h2>
              <p>Refunds shall only be considered under the following limited circumstances, and the determination of eligibility shall be at the sole discretion of Vian Software Solutions:</p>
              <ul>
                <li><strong>Cancellation before work commences:</strong> As described in Section 2.1, subject to deduction of administrative and processing fees.</li>
                <li><strong>Error attributable solely to Vian Software Solutions:</strong> As described in Section 10, subject to the limitations and conditions set forth therein.</li>
                <li><strong>Statutory requirement:</strong> If a refund is required by applicable Indian law, including but not limited to consumer protection regulations, Vian Software Solutions shall comply to the extent required by law.</li>
              </ul>
              <p>Refunds shall not be considered for any other reason, including but not limited to: change of mind, dissatisfaction with project direction (where the project is proceeding in accordance with the agreed specifications), discovery of alternative solutions, budget constraints, or internal organizational changes.</p>

              <h2 id="no-refund">9. No Refund Policy</h2>
              <p><strong>We do not offer refunds once work has commenced on a project.</strong> All milestone payments are non-refundable. By engaging Vian Software Solutions and accepting a quotation or Statement of Work, the Client acknowledges and agrees that:</p>
              <p><strong>9.1 Work Commencement:</strong> The commencement of work includes, but is not limited to: (a) the start of any development, design, or consulting activities; (b) the allocation of developer or designer resources to the project; (c) the setup of project infrastructure, repositories, or environments; (d) the conduct of discovery, research, or requirements analysis; or (e) the provision of any services as described in the Quotation or SOW.</p>
              <p><strong>9.2 Irreversible Allocation:</strong> Once resources are allocated to a Client's project, those resources cannot be reallocated to other projects without disruption. The time, effort, and expertise invested in a project from the moment of commencement represent value that has been delivered and cannot be recovered.</p>
              <p><strong>9.3 No Cooling-Off Period:</strong> Unless required by applicable law, there is no statutory cooling-off period for business-to-business software development services. Clients are encouraged to perform thorough due diligence before engaging our services.</p>
              <p><strong>9.4 Recommendation:</strong> We strongly recommend that Clients: (a) carefully review all quotations, SOWs, and project documentation before acceptance; (b) ensure that project requirements are clearly defined and documented; (c) maintain open communication throughout the project; and (d) raise any concerns or issues promptly so they can be addressed before they escalate.</p>

              <h2 id="our-mistake">10. If It Is Our Mistake</h2>
              <p><strong>10.1 Reporting Errors:</strong> If the Client believes that a deliverable contains an error, defect, or bug attributable solely to Vian Software Solutions, the Client shall promptly notify us in writing at support@viannn.online with a detailed description of the issue, including steps to reproduce, expected behavior, and actual behavior.</p>
              <p><strong>10.2 Investigation Process:</strong> Upon receipt of such notice, Vian Software Solutions shall initiate a thorough investigation of the reported issue. This investigation shall include: (a) internal security checks to rule out unauthorized access or tampering; (b) comprehensive code review by our development team; (c) quality verification against the agreed specifications; and (d) any other diagnostic procedures reasonably necessary to determine the root cause of the issue.</p>
              <p><strong>10.3 Error Determination:</strong> Vian Software Solutions shall determine, in its sole discretion exercised in good faith, whether the reported issue is attributable solely to an error on our part. Errors attributable to Vian Software Solutions include: (a) failure to implement a clearly specified requirement; (b) introduction of a defect through our code that was not present in any third-party or Client-provided components; and (c) failure to meet a material performance specification expressly stated in the SOW.</p>
              <p><strong>10.4 Remedies:</strong> If, after completing our security and quality assessment, we determine that the error is indeed attributable solely to Vian Software Solutions, we shall offer one of the following remedies at our sole discretion: (a) a full refund of the Fees paid for the specific deliverable containing the error; (b) a partial refund proportionate to the impact of the error; or (c) service credits equal to the value of the Fees paid for the affected deliverable, to be applied toward future services or ongoing support.</p>
              <p><strong>10.5 Limitation:</strong> Refunds under this Section 10 are subject to a maximum of the Fees paid for the specific deliverable containing the error. No refund shall exceed the total amount paid for the project as a whole. Service credits, if offered, must be used within 12 months of issuance and are non-transferable.</p>
              <p><strong>10.6 Exclusions:</strong> The following shall not be considered errors attributable to Vian Software Solutions: (a) issues arising from the Client's failure to provide accurate requirements or specifications; (b) issues arising from modifications made by the Client or third parties; (c) issues arising from third-party services, platforms, or dependencies; (d) issues arising from the Client's hardware, software, or network environment; (e) cosmetic or non-material issues that do not affect core functionality; (f) issues arising from the Client's failure to follow instructions or documentation; (g) issues arising from Force Majeure events; and (h) features or functionality not expressly specified in the SOW.</p>

              <h2 id="non-refundable">11. Non-Refundable Items</h2>
              <p>The following items and services are non-refundable under all circumstances, regardless of the stage of the project or the reason for cancellation:</p>
              <ul>
                <li><strong>Domain Name Registration and Renewal Fees:</strong> Domain names registered or renewed on behalf of the Client, including any associated transfer fees, premium domain costs, and ICANN fees.</li>
                <li><strong>SSL Certificate Purchases:</strong> SSL/TLS certificates purchased and installed on behalf of the Client, including any installation or configuration fees.</li>
                <li><strong>Third-Party Software Licenses:</strong> Licenses for third-party software, plugins, libraries, frameworks, or tools purchased or subscribed to on behalf of the Client.</li>
                <li><strong>Hosting Fees:</strong> Hosting, server, and cloud infrastructure fees paid to third-party providers on behalf of the Client.</li>
                <li><strong>Stock Assets:</strong> Stock images, icons, fonts, music, videos, and other digital assets purchased from third-party marketplaces on behalf of the Client.</li>
                <li><strong>Administrative and Processing Fees:</strong> Administrative charges, setup fees, processing fees, and convenience fees associated with project setup, payment processing, and account creation.</li>
                <li><strong>Retainer Fees:</strong> Retainer fees for the current billing period once the period has commenced, regardless of whether all retainer hours have been utilized.</li>
                <li><strong>Setup Fees:</strong> One-time setup, onboarding, and configuration fees, which are earned upon completion of the setup activities.</li>
                <li><strong>API Integration Fees:</strong> Fees for integrating with third-party APIs and services that have been configured and tested, as such integration work is specific to the Client's requirements.</li>
                <li><strong>Consulting and Advisory Fees:</strong> Fees for consulting, advisory, and strategy services provided during the engagement, as such services are delivered in real time and cannot be returned.</li>
                <li><strong>Data Migration Fees:</strong> Fees for data migration, data cleaning, data transformation, and data import services, once the migration has been performed.</li>
                <li><strong>Training Fees:</strong> Fees for training sessions, whether delivered in person, remotely, or through recorded materials, once the training has been provided or access has been granted.</li>
              </ul>

              <h2 id="timeline">12. Refund Timeline & Method</h2>
              <p><strong>12.1 Processing Time:</strong> If a refund is approved under this Policy, Vian Software Solutions shall process the refund within 15 to 30 business days from the date of approval, depending on the payment method and bank processing times.</p>
              <p><strong>12.2 Refund Method:</strong> Refunds shall be issued through the original payment method used by the Client, unless otherwise agreed. If the original payment method is unavailable or cannot accept refunds, Vian Software Solutions may issue the refund via bank transfer, UPI, or other mutually agreed method.</p>
              <p><strong>12.3 Deductions:</strong> Vian Software Solutions reserves the right to deduct from any refund: (a) any non-refundable items listed in Section 11; (b) any administrative or processing fees; (c) any transaction fees, gateway fees, or currency conversion charges incurred in processing the original payment; and (d) the value of any work performed up to the date of cancellation that has not yet been invoiced.</p>
              <p><strong>12.4 Foreign Currency Refunds:</strong> For payments made in foreign currencies, refunds shall be calculated at the exchange rate applicable on the date of refund. The Client shall bear any currency conversion losses or fees arising from fluctuations in exchange rates.</p>
              <p><strong>12.5 No Cash Refunds:</strong> All refunds shall be processed electronically to the original payment source. No cash refunds shall be provided under any circumstances.</p>

              <h2 id="chargebacks">13. Chargebacks</h2>
              <p><strong>13.1 Definition:</strong> A chargeback occurs when a Client disputes a payment directly with their bank or payment provider and requests a reversal of the transaction, without first attempting to resolve the dispute with Vian Software Solutions.</p>
              <p><strong>13.2 Policy on Chargebacks:</strong> Vian Software Solutions considers chargebacks to be an extreme measure that should only be used in cases of genuine fraud or unauthorized transactions. Chargebacks initiated for the purpose of avoiding legitimate payment obligations constitute a material breach of these Terms and the underlying engagement agreement.</p>
              <p><strong>13.3 Service Suspension:</strong> If a Client initiates a chargeback, Vian Software Solutions shall immediately suspend all Services, revoke all access to Deliverables, platforms, and systems, and withhold delivery of any work product until the chargeback is resolved. The Client shall lose access to all work product, source code, and Deliverables during the suspension period.</p>
              <p><strong>13.4 Dispute with Documentation:</strong> Vian Software Solutions reserves the right to contest any chargeback by providing the payment provider with all relevant documentation, including but not limited to: (a) the accepted Quotation or SOW; (b) correspondence and communications with the Client; (c) evidence of work performed and Deliverables delivered; (d) invoices and payment records; and (e) these Terms and the Refund & Cancellation Policy.</p>
              <p><strong>13.5 Legal Remedies:</strong> Vian Software Solutions reserves the right to pursue all available legal remedies for fraudulent or abusive chargebacks, including but not limited to: (a) filing a claim in the courts of Mumbai, Maharashtra, India; (b) initiating arbitration proceedings under Section 26 of the Terms & Conditions; (c) referring the matter to debt collection agencies; (d) reporting the chargeback to credit reporting agencies; and (e) seeking recovery of all associated costs, including legal fees, chargeback fees, administrative costs, and interest.</p>
              <p><strong>13.6 Encouragement to Communicate:</strong> We strongly encourage all Clients to contact us at support@viannn.online before initiating a chargeback. Most disputes can be resolved amicably through communication. Initiating a chargeback without prior communication may result in unnecessary service disruption and additional costs for both parties.</p>
              <p><strong>13.7 Reversal of Chargeback:</strong> If a chargeback is resolved in Vian Software Solutions' favor, the Client's access to Services and Deliverables may be restored, subject to payment of any outstanding Fees and chargeback-related costs.</p>

              <h2 id="dispute-resolution">14. Dispute Resolution</h2>
              <p><strong>14.1 Initial Contact:</strong> In the event of any dispute regarding refunds, cancellations, or payments, the Client shall first contact Vian Software Solutions in writing at support@viannn.online with a detailed description of the dispute.</p>
              <p><strong>14.2 Resolution Attempt:</strong> Vian Software Solutions shall acknowledge receipt of the dispute within 3 business days and shall use reasonable efforts to resolve the dispute within 15 business days through good-faith discussions with the Client.</p>
              <p><strong>14.3 Escalation:</strong> If the dispute cannot be resolved through direct discussions, the matter shall be escalated to senior management of both parties for resolution.</p>
              <p><strong>14.4 Mediation and Arbitration:</strong> If the dispute remains unresolved after escalation, the dispute resolution process set forth in Section 26 of the <a href="/legal/terms-and-conditions">Terms & Conditions</a> shall apply, including mediation followed by binding arbitration in Mumbai, Maharashtra, India, in accordance with the Arbitration and Conciliation Act, 1996.</p>
              <p><strong>14.5 Governing Law:</strong> This Refund & Cancellation Policy shall be governed by and construed in accordance with the laws of the Republic of India. All disputes arising out of or in connection with this Policy shall be subject to the exclusive jurisdiction of the courts situated in Mumbai, Maharashtra, India.</p>
              <p><strong>14.6 Contact for Disputes:</strong> All dispute-related communications shall be directed to:</p>
              <p>Email: support@viannn.online<br />Phone: +91 9598443203<br />Attn: Viren Pandey, Proprietor</p>
              <div className="legal-note"><strong>Last updated:</strong> June 25, 2026</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
