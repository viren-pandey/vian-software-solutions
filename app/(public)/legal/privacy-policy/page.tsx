import type { Metadata } from 'next'
import { siteUrl, breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Vian Software Solutions collects, uses, stores, and protects your personal information.',
  keywords: ['privacy policy', 'data protection', 'personal information', 'vian privacy', 'data privacy', 'privacy policy india'],
  openGraph: {
    title: 'Privacy Policy - Vian Software Solutions',
    description: 'How Vian Software Solutions collects, uses, stores, and protects your personal information.',
    images: [{ url: `${siteUrl}/assets/logo/og-image.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - Vian Software Solutions',
    description: 'How Vian Software Solutions collects, uses, stores, and protects your personal information.',
  },
  alternates: {
    canonical: `${siteUrl}/legal/privacy-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
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
          <p className="lead">This Privacy Policy explains how Vian Software Solutions (Sole Proprietorship of Viren Pandey) collects, uses, stores, processes, and protects your personal information in compliance with applicable Indian laws.</p>
          <p className="small muted" style={{ marginTop: 8 }}>Last updated: June 25, 2026</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-wrapper">
            <aside className="legal-sidebar">
              <h4>Contents</h4>
              <a href="#introduction">1. Introduction & Scope</a>
              <a href="#jurisdiction">2. Jurisdiction & Governing Law</a>
              <a href="#information">3. Information We Collect</a>
              <a href="#usage">4. How We Use Information</a>
              <a href="#lawful-basis">5. Lawful Basis for Processing</a>
              <a href="#third-party">6. Third-Party Services & Disclosure</a>
              <a href="#security">7. Data Storage & Security</a>
              <a href="#retention">8. Data Retention Periods</a>
              <a href="#transfers">9. International Transfers</a>
              <a href="#rights">10. User Rights</a>
              <a href="#deletion">11. Account Deletion Process</a>
              <a href="#children">12. Children's Privacy</a>
              <a href="#grievance">13. Grievance Officer</a>
              <a href="#updates">14. Policy Updates</a>
              <a href="#contact">15. Contact Information</a>
            </aside>
            <div className="legal-doc">
              <h2 id="introduction">1. Introduction & Scope</h2>
              <p>Vian Software Solutions (Sole Proprietorship of Viren Pandey) respects your privacy and is committed to protecting your personal data. This Privacy Policy describes how we collect, use, process, store, and disclose your information when you visit our website, engage our services, or communicate with us.</p>
              <p>This policy applies to all visitors, clients, prospective clients, and users of our website, services, and platforms. It covers information collected through our website, email communications, project management tools, quotation processes, service delivery, billing, and support interactions.</p>
              <p>By using our website or engaging our services, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with this policy, please do not use our website or services. This policy is incorporated by reference into our <a href="/legal/terms-and-conditions">Terms & Conditions</a>.</p>

              <h2 id="jurisdiction">2. Jurisdiction & Governing Law</h2>
              <p>This Privacy Policy is governed by the laws of the Republic of India. Vian Software Solutions is a Sole Proprietorship based in Mumbai, Maharashtra, India. All personal information collected is subject to the provisions of the Information Technology Act, 2000 (IT Act 2000) and the IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</p>
              <p>By providing your personal information to us, you consent to the collection, storage, processing, and transfer of your information in accordance with this Privacy Policy and Indian law. Any disputes arising out of or relating to this Privacy Policy shall be subject to the exclusive jurisdiction of the courts situated in Mumbai, Maharashtra, India.</p>

              <h2 id="information">3. Information We Collect</h2>
              <p>We collect information that you provide to us directly, information collected automatically when you use our website or services, and information from third-party sources.</p>
              <p><strong>Personal Information:</strong> When you inquire about our services, request a quotation, or engage us for a project, we may collect your full name, email address, phone number, company name, job title, billing address, GST number, and any other information you choose to provide.</p>
              <p><strong>Business Information:</strong> We may collect information about your business, project requirements, technical specifications, design preferences, budget parameters, and any documentation or materials you share with us for the purpose of project scoping and delivery.</p>
              <p><strong>Payment Information:</strong> When you make payments, we collect billing information, invoice details, transaction identifiers, and payment method details. Payment card information is processed directly by our payment gateway partners and is not stored on our servers.</p>
              <p><strong>Usage Information:</strong> We automatically collect certain information when you visit our website, including your IP address, browser type and version, operating system, device type, referral source, pages visited, time and duration of visits, and other usage patterns.</p>
              <p><strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user behaviour. Please see our <a href="/legal/cookie-policy">Cookie Policy</a> for detailed information about the cookies we use and how you can manage them.</p>
              <p><strong>Analytics Data:</strong> We use analytics tools to collect aggregated, anonymized data about website usage, user interactions, and traffic patterns. This data helps us improve our website and services.</p>
              <p><strong>Communication Records:</strong> We may record and retain email correspondence, chat messages, call notes, and other communications related to project discussions, support requests, and business interactions.</p>

              <h2 id="usage">4. How We Use Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul>
                <li><strong>Service Delivery:</strong> To provide, manage, and deliver the services you have engaged us for, including project management, development, design, consulting, and support.</li>
                <li><strong>Communication:</strong> To respond to your inquiries, provide quotations, send project updates, communicate about milestones and deliverables, and provide customer support.</li>
                <li><strong>Billing and Payments:</strong> To generate invoices, process payments, send payment reminders, manage accounts, and maintain financial records in compliance with Indian tax laws.</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, legal processes, and governmental requests, including tax reporting, data protection obligations, and anti-fraud measures.</li>
                <li><strong>Service Improvement:</strong> To analyse usage patterns, identify trends, and improve our website, services, and user experience.</li>
                <li><strong>Security and Fraud Prevention:</strong> To protect our website, systems, and data against unauthorized access, fraud, misuse, cyber-attacks, and other security threats.</li>
                <li><strong>Marketing:</strong> To send you information about our services, industry insights, and promotional communications, where you have consented to receive such communications. You may opt out at any time.</li>
              </ul>

              <h2 id="lawful-basis">5. Lawful Basis for Processing</h2>
              <p>We process your personal information based on the following lawful grounds:</p>
              <p><strong>Contractual Necessity:</strong> Processing is necessary for the performance of a contract with you or to take steps at your request before entering into a contract, such as providing quotations, delivering services, and processing payments.</p>
              <p><strong>Legal Obligation:</strong> Processing is necessary for compliance with legal obligations, including tax laws, data protection regulations, and regulatory requirements.</p>
              <p><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate interests, including improving our services, securing our systems, and managing our business operations, provided such interests do not override your fundamental rights and freedoms.</p>
              <p><strong>Consent:</strong> Where required by applicable law, we process your information based on your freely given, specific, informed, and unambiguous consent. You have the right to withdraw your consent at any time.</p>

              <h2 id="third-party">6. Third-Party Services & Disclosure</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted third-party service providers who assist us in operating our business, delivering services, and serving our clients, subject to contractual obligations to protect your information.</p>
              <p><strong>Categories of Third Parties:</strong></p>
              <ul>
                <li><strong>Hosting Providers:</strong> Cloud infrastructure and web hosting services that store and process data on our behalf.</li>
                <li><strong>Payment Processors:</strong> Payment gateway providers, including Razorpay, Paytm, and banking partners, for processing transactions securely.</li>
                <li><strong>Analytics Providers:</strong> Tools and platforms used to analyse website usage and improve user experience.</li>
                <li><strong>Communication Tools:</strong> Email services, project management platforms, and communication tools used to manage client interactions.</li>
                <li><strong>Professional Advisors:</strong> Legal, accounting, and professional advisors who provide services to us, subject to confidentiality obligations.</li>
              </ul>
              <p><strong>Legal Disclosures:</strong> We may disclose your information if required to do so by law, regulation, legal process, or governmental request, or if we believe such disclosure is necessary to protect our rights, property, or safety, or the rights, property, or safety of others.</p>
              <p><strong>Business Transfers:</strong> In the event of a merger, acquisition, reorganization, or sale of all or substantially all of our assets, your information may be transferred to the acquiring entity, subject to this Privacy Policy.</p>

              <h2 id="security">7. Data Storage & Security</h2>
              <p>We implement reasonable and appropriate technical, physical, and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, destruction, or loss.</p>
              <p><strong>Security Measures:</strong></p>
              <ul>
                <li><strong>TLS/SSL Encryption:</strong> All data transmitted between your browser and our website is encrypted using Transport Layer Security (TLS) protocols.</li>
                <li><strong>Data Encryption:</strong> Sensitive data is encrypted at rest using industry-standard encryption algorithms.</li>
                <li><strong>Access Controls:</strong> Access to personal information is restricted to authorized personnel on a need-to-know basis, with role-based access controls and authentication requirements.</li>
                <li><strong>Secure Infrastructure:</strong> Our systems are hosted on secure, reputable cloud infrastructure providers with robust physical and network security.</li>
                <li><strong>Regular Assessments:</strong> We conduct periodic security assessments, vulnerability scans, and code reviews to identify and address potential security risks.</li>
                <li><strong>Employee Training:</strong> Our personnel receive training on data protection, privacy practices, and security protocols.</li>
              </ul>
              <p>While we take all reasonable precautions to protect your data, no method of transmission or storage is 100% secure. We cannot guarantee absolute security but will promptly notify you in the event of a data breach affecting your personal information as required by applicable law.</p>

              <h2 id="retention">8. Data Retention Periods</h2>
              <p>We retain your personal information only for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable law.</p>
              <p><strong>Retention Schedules:</strong></p>
              <ul>
                <li><strong>Contact and Communication Data:</strong> Retained for 24 months after the last communication or interaction, unless a longer retention period is required for ongoing business relationships.</li>
                <li><strong>Project Data:</strong> Retained for 36 months after project completion or termination, to address any post-delivery issues, warranty claims, or future service needs.</li>
                <li><strong>Billing and Financial Records:</strong> Retained for 7 years as required by Indian tax laws, including the Income Tax Act, 1961 and GST regulations.</li>
                <li><strong>Analytics Data:</strong> Retained in anonymized or aggregated form for up to 26 months for trend analysis and service improvement.</li>
                <li><strong>Legal and Compliance Records:</strong> Retained for the duration required by applicable legal or regulatory obligations.</li>
              </ul>
              <p>When the retention period expires, your personal information will be securely deleted, destroyed, or anonymized so that it can no longer be associated with you.</p>

              <h2 id="transfers">9. International Transfers</h2>
              <p>Your personal information may be transferred to and processed in countries other than your country of residence, including India, where our servers and service providers are located. These countries may have data protection laws that differ from those in your jurisdiction.</p>
              <p>When we transfer your information to third-party service providers in other countries, we ensure that appropriate safeguards are in place, including contractual clauses that require the recipient to protect your information in accordance with applicable data protection laws.</p>
              <p>By providing your information to us, you consent to the transfer, storage, and processing of your information in India and other jurisdictions as described in this Privacy Policy.</p>

              <h2 id="rights">10. User Rights</h2>
              <p>Depending on your jurisdiction, you may have the following rights regarding your personal information:</p>
              <p><strong>Right of Access:</strong> You have the right to request confirmation of whether we hold your personal information and to request a copy of such information.</p>
              <p><strong>Right to Rectification:</strong> You have the right to request correction of any inaccurate or incomplete personal information we hold about you.</p>
              <p><strong>Right to Erasure:</strong> You have the right to request deletion of your personal information where there is no compelling reason for its continued processing, subject to legal obligations.</p>
              <p><strong>Right to Restriction:</strong> You have the right to request restriction of processing of your personal information in certain circumstances, such as contesting accuracy or objecting to processing.</p>
              <p><strong>Right to Data Portability:</strong> You have the right to receive your personal information in a structured, commonly used, machine-readable format and to transmit that data to another controller.</p>
              <p><strong>Right to Object:</strong> You have the right to object to processing of your personal information for direct marketing purposes or on grounds relating to your particular situation.</p>
              <p><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you have the right to withdraw your consent at any time without affecting the lawfulness of processing based on consent before its withdrawal.</p>
              <p>To exercise any of these rights, please contact us at support@viannn.online. We will respond to your request within the timeframe required by applicable law. We may need to verify your identity before processing your request.</p>

              <h2 id="deletion">11. Account Deletion Process</h2>
              <p>If you wish to request deletion of your personal information and account data held by us, you may submit a deletion request by emailing support@viannn.online from your registered email address.</p>
              <p><strong>Deletion Process:</strong></p>
              <ol>
                <li>Submit your deletion request in writing, clearly stating your full name, registered email address, and the nature of data you wish to have deleted.</li>
                <li>We will acknowledge receipt of your request within 3 business days.</li>
                <li>We will verify your identity to ensure the request is legitimate and authorized.</li>
                <li>We will process the deletion within 30 calendar days, subject to any legal or contractual retention obligations.</li>
                <li>You will receive a confirmation once the deletion is complete.</li>
              </ol>
              <p><strong>Exceptions:</strong> We may be unable to delete certain information if retention is required by law, for legitimate business purposes (such as billing records), or for the establishment, exercise, or defence of legal claims. In such cases, we will inform you of the reason for the exception.</p>

              <h2 id="children">12. Children's Privacy</h2>
              <p>Our website and services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child under 18 has provided us with personal information without parental consent, we will take steps to delete such information promptly.</p>
              <p>If you believe that we may have collected personal information from a child under 18, please contact us immediately at support@viannn.online so that we can investigate and take appropriate action.</p>

              <h2 id="grievance">13. Grievance Officer</h2>
              <p>In compliance with the Information Technology Act, 2000 and the IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, we have appointed a Grievance Officer to address any concerns, complaints, or queries regarding the processing of your personal information.</p>
              <p><strong>Grievance Officer:</strong> Viren Pandey, Proprietor</p>
              <p><strong>Email:</strong> support@viannn.online</p>
              <p><strong>Response Time:</strong> Grievances will be acknowledged within 24 hours of receipt. We will use our best efforts to resolve the grievance within 15 business days from the date of receipt.</p>
              <p>When submitting a grievance, please provide your full name, contact information, a detailed description of the issue, and any relevant supporting documentation. We may request additional information to assist in our investigation.</p>

              <h2 id="updates">14. Policy Updates</h2>
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or industry standards. When we make material changes, we will update the "Last updated" date at the top of this policy and notify you via email or through a prominent notice on our website.</p>
              <p>We encourage you to review this Privacy Policy periodically for any changes. Your continued use of our website or services after the effective date of any changes constitutes your acceptance of the updated policy. If you do not agree with the changes, you should discontinue use of our services and contact us to exercise your data protection rights.</p>

              <h2 id="contact">15. Contact Information</h2>
              <p>If you have any questions, concerns, requests, or complaints regarding this Privacy Policy or our data practices, please contact us:</p>
              <p><strong>Vian Software Solutions</strong><br />Sole Proprietorship of Viren Pandey<br />Mumbai, Maharashtra, India<br />Email: support@viannn.online<br />Phone: +91 9598443203</p>
              <p>For project inquiries and quotations, please reach out via email with a description of your requirements. For privacy-related matters, please mention "Privacy Request" in the subject line of your email.</p>
              <div className="legal-note"><strong>Last updated:</strong> June 25, 2026</div>
            </div>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', item: '/' }, { name: 'Legal', item: '/legal' }, { name: 'Privacy Policy', item: '/legal/privacy-policy' }])) }}
      />
    </>
  )
}
