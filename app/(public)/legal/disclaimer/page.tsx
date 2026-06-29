import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer and limitation of liability for Vian Software Solutions website, services, and digital products.',
}

export default function DisclaimerPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Legal</span>
            <span>/</span>
            <span>Disclaimer</span>
          </div>
          <span className="eyebrow">Legal</span>
          <h1>Disclaimer</h1>
          <p className="lead">This disclaimer governs your use of our website, services, and digital products. Please read it carefully.</p>
          <p className="small muted" style={{ marginTop: 8 }}>Last updated: June 25, 2026</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-wrapper">
            <aside className="legal-sidebar">
              <h4>Contents</h4>
              <a href="#general">1. General Disclaimer</a>
              <a href="#no-guarantee">2. No Guaranteed Results</a>
              <a href="#technology-risks">3. Technology Risks & Limitations</a>
              <a href="#third-party">4. Third-Party Integrations Disclaimer</a>
              <a href="#external-links">5. External Links Disclaimer</a>
              <a href="#availability">6. Availability & Uptime</a>
              <a href="#professional-advice">7. No Professional Advice</a>
              <a href="#forward-looking">8. Forward-Looking Statements</a>
              <a href="#jurisdiction">9. Jurisdiction</a>
              <a href="#contact">10. Contact</a>
            </aside>
            <div className="legal-doc">
              <h2 id="general">1. General Disclaimer</h2>
              <p>The information, content, materials, and services provided by Vian Software Solutions (Sole Proprietorship of Viren Pandey) on its website, platforms, and through its service engagements are provided for general informational and business purposes only. While we strive to ensure that all information presented is accurate, current, and reliable, we make no representations or warranties of any kind, express or implied, regarding the accuracy, completeness, suitability, availability, or reliability of any information, content, software, products, services, or related graphics contained on or provided through our website or services.</p>
              <p>Any reliance you place on such information is strictly at your own risk. Vian Software Solutions hereby disclaims all liability for any loss, damage, or inconvenience arising from the use of or reliance on any information provided on our website or through our services.</p>
              <p>This Disclaimer is incorporated by reference into our <a href="/legal/terms-and-conditions">Terms & Conditions</a> and should be read in conjunction with our <a href="/legal/privacy-policy">Privacy Policy</a> and <a href="/legal/refund-policy">Refund & Cancellation Policy</a>.</p>

              <h2 id="no-guarantee">2. No Guaranteed Results</h2>
              <p>Vian Software Solutions does not guarantee, warrant, or represent that:</p>
              <ul>
                <li>The use of our services, software, platforms, or digital products will achieve any specific business results, revenue targets, cost savings, operational efficiencies, or performance outcomes.</li>
                <li>Our software, applications, or solutions will meet your specific business objectives, expectations, or requirements beyond the specifications expressly set forth in the applicable Statement of Work or Quotation.</li>
                <li>Any particular level of traffic, user engagement, conversion rates, search engine rankings, or other performance metrics will be achieved as a result of our services.</li>
                <li>Our solutions will be compatible with all third-party platforms, systems, or environments not expressly specified in the project documentation.</li>
              </ul>
              <p>Project outcomes depend on numerous factors beyond our control, including but not limited to market conditions, user adoption, competitive landscape, Client's business execution, and other variables. We encourage all Clients to perform their own due diligence and assessment before engaging our services.</p>

              <h2 id="technology-risks">3. Technology Risks & Limitations</h2>
              <p>Software development, technology services, and digital products are inherently subject to certain risks and limitations that cannot be eliminated entirely. By engaging our services, you acknowledge and accept the following:</p>
              <p><strong>Software Bugs and Defects:</strong> Despite rigorous testing and quality assurance processes, software applications may contain bugs, errors, or defects that could affect performance, functionality, or security. Vian Software Solutions will use reasonable efforts to identify and correct reported defects during the warranty period as set forth in the applicable engagement agreement.</p>
              <p><strong>Security Vulnerabilities:</strong> No software system is completely immune to security threats, vulnerabilities, or attacks. While we implement industry-standard security measures, we cannot guarantee that our solutions will be invulnerable to all security breaches, unauthorized access, or cyber-attacks.</p>
              <p><strong>Third-Party Dependencies:</strong> Our solutions may depend on third-party services, platforms, APIs, libraries, and infrastructure that are outside our control. Changes, disruptions, or discontinuation of such third-party services may affect the functionality, performance, or availability of our solutions.</p>
              <p><strong>Technology Evolution:</strong> Technology evolves rapidly. Frameworks, platforms, and tools that are current and supported at the time of development may become outdated, deprecated, or unsupported over time. Vian Software Solutions does not guarantee indefinite compatibility with future technology versions.</p>

              <h2 id="third-party">4. Third-Party Integrations Disclaimer</h2>
              <p>Our services, software, and digital products may integrate with, incorporate, or rely upon third-party services, platforms, APIs, payment gateways, hosting providers, analytics tools, and other external systems (collectively, "Third-Party Services").</p>
              <p>Vian Software Solutions does not control, operate, endorse, or assume any responsibility for:</p>
              <ul>
                <li>The availability, reliability, performance, or security of any Third-Party Services.</li>
                <li>The terms of service, privacy practices, or data handling policies of Third-Party Service providers.</li>
                <li>Any changes, modifications, discontinuation, or deprecation of Third-Party Service features or APIs.</li>
                <li>Any loss, damage, or disruption caused by Third-Party Services, including data loss, service outages, or security breaches.</li>
              </ul>
              <p>The Client is responsible for reviewing and accepting the terms of service and privacy policies of any Third-Party Services used in connection with our deliverables. Any issues arising from Third-Party Services shall be addressed directly between the Client and the third-party provider.</p>

              <h2 id="external-links">5. External Links Disclaimer</h2>
              <p>Our website, communications, and project documentation may contain links to external websites, platforms, or resources that are not owned or controlled by Vian Software Solutions. These links are provided for your convenience and reference only.</p>
              <p>We have no control over the content, privacy practices, terms of use, or availability of any external websites or resources. The inclusion of any external link does not imply endorsement, approval, or association by Vian Software Solutions. We encourage you to review the privacy policies and terms of use of any external websites you visit.</p>
              <p>Vian Software Solutions shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any content, goods, or services available on or through any external websites or resources.</p>

              <h2 id="availability">6. Availability & Uptime</h2>
              <p>While we strive to ensure that our website, platforms, and hosted solutions are available 24/7, we do not guarantee uninterrupted or error-free availability. Our services may be temporarily unavailable due to:</p>
              <ul>
                <li>Scheduled maintenance, upgrades, or updates, for which we will provide reasonable advance notice where practicable.</li>
                <li>Emergency maintenance required to address security vulnerabilities, critical bugs, or infrastructure issues.</li>
                <li>Hardware or software failures, network outages, or power interruptions.</li>
                <li>Force Majeure events as defined in our Terms & Conditions.</li>
                <li>Third-party service disruptions affecting our hosting providers, DNS services, CDN providers, or other infrastructure dependencies.</li>
              </ul>
              <p>Vian Software Solutions shall make reasonable commercial efforts to minimize downtime and restore services promptly in the event of an interruption. However, we shall not be liable for any loss, damage, or inconvenience arising from service unavailability or downtime.</p>
              <p>Service level agreements (SLAs) regarding uptime and availability, if any, shall be separately defined in the applicable Statement of Work or Support Agreement. In the absence of a specific SLA, no uptime guarantee is provided.</p>

              <h2 id="professional-advice">7. No Professional Advice</h2>
              <p>The information, content, and materials provided on our website, in our communications, and through our services are for general informational and business purposes only and do not constitute professional advice.</p>
              <p><strong>Not Legal Advice:</strong> Our services and communications do not constitute legal advice. We are not a law firm, and our personnel are not licensed legal professionals. You should consult with a qualified legal professional for advice regarding your specific legal situation, including but not limited to contract review, regulatory compliance, intellectual property protection, and data privacy matters.</p>
              <p><strong>Not Financial Advice:</strong> Our services and communications do not constitute financial, accounting, or tax advice. We are not financial advisors, accountants, or tax professionals. You should consult with a qualified financial or tax professional for advice regarding your specific financial situation, including but not limited to tax obligations, investment decisions, and financial planning.</p>
              <p><strong>Not Medical Advice:</strong> Our services and communications do not constitute medical, health, or therapeutic advice. If you require medical advice, diagnosis, or treatment, please consult a qualified healthcare professional.</p>
              <p><strong>Technology Consulting:</strong> While we provide technology consulting services, any recommendations, suggestions, or opinions offered are based on our professional experience and should be evaluated in the context of your specific circumstances. We encourage you to seek independent opinions and conduct your own research before making technology decisions.</p>

              <h2 id="forward-looking">8. Forward-Looking Statements</h2>
              <p>Our website, proposals, presentations, and communications may contain forward-looking statements regarding our services, capabilities, project timelines, market position, or industry trends. These statements are based on current expectations, estimates, and projections and are subject to risks, uncertainties, and assumptions that could cause actual results to differ materially.</p>
              <p>Forward-looking statements include, but are not limited to, statements containing words such as "anticipate," "believe," "estimate," "expect," "forecast," "intend," "may," "plan," "project," "target," "will," or similar expressions. These statements are not guarantees of future performance or outcomes.</p>
              <p>Vian Software Solutions undertakes no obligation to update or revise any forward-looking statements, whether as a result of new information, future events, or otherwise, except as required by applicable law. You are cautioned not to place undue reliance on forward-looking statements.</p>

              <h2 id="jurisdiction">9. Jurisdiction</h2>
              <p>This Disclaimer shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or relating to this Disclaimer shall be subject to the exclusive jurisdiction of the courts situated in Mumbai, Maharashtra, India.</p>
              <p>If any provision of this Disclaimer is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it enforceable or shall be severed, and the remaining provisions shall continue in full force and effect.</p>

              <h2 id="contact">10. Contact</h2>
              <p>If you have any questions, concerns, or requests regarding this Disclaimer, please contact us:</p>
              <p><strong>Vian Software Solutions</strong><br />Sole Proprietorship of Viren Pandey<br />Mumbai, Maharashtra, India<br />Email: support@viannn.online<br />Phone: +91 9598443203</p>
              <div className="legal-note"><strong>Last updated:</strong> June 25, 2026</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
