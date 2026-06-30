import type { Metadata } from 'next'
import { siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How Vian Software Solutions uses cookies and similar tracking technologies on its website.',
  keywords: ['cookie policy', 'cookies', 'tracking technologies', 'website cookies', 'cookie consent', 'browser cookies'],
  openGraph: {
    title: 'Cookie Policy - Vian Software Solutions',
    description: 'How Vian Software Solutions uses cookies and similar tracking technologies on its website.',
    images: [{ url: `${siteUrl}/assets/logo/og-image.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy - Vian Software Solutions',
    description: 'How Vian Software Solutions uses cookies and similar tracking technologies on its website.',
  },
  alternates: {
    canonical: `${siteUrl}/legal/cookie-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CookiePolicyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Legal</span>
            <span>/</span>
            <span>Cookie Policy</span>
          </div>
          <span className="eyebrow">Legal</span>
          <h1>Cookie Policy</h1>
          <p className="lead">This policy explains what cookies are, how we use them on our website, and how you can manage your cookie preferences.</p>
          <p className="small muted" style={{ marginTop: 8 }}>Last updated: June 25, 2026</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-wrapper">
            <aside className="legal-sidebar">
              <h4>Contents</h4>
              <a href="#what-are-cookies">1. What Are Cookies</a>
              <a href="#types">2. Types of Cookies We Use</a>
              <a href="#specific-cookies">3. Specific Cookies Table</a>
              <a href="#third-party">4. Third-Party Cookies</a>
              <a href="#managing">5. Managing Cookies</a>
              <a href="#consent">6. Consent Management</a>
              <a href="#updates">7. Policy Updates</a>
              <a href="#contact">8. Contact</a>
            </aside>
            <div className="legal-doc">
              <h2 id="what-are-cookies">1. What Are Cookies</h2>
              <p>Cookies are small text files that are placed on your computer, smartphone, or other device when you visit a website. They are widely used to make websites work more efficiently, enhance user experience, provide analytics information, and deliver personalized content.</p>
              <p>Cookies may be "session cookies" (which expire when you close your browser) or "persistent cookies" (which remain on your device for a set period or until you delete them). Cookies can be set by the website you visit (first-party cookies) or by third parties such as analytics services or advertising networks (third-party cookies).</p>
              <p>This Cookie Policy explains the types of cookies we use on the Vian Software Solutions website, why we use them, and how you can control your cookie preferences.</p>

              <h2 id="types">2. Types of Cookies We Use</h2>
              <p>We use the following categories of cookies on our website:</p>
              <p><strong>Essential Cookies (Strictly Necessary):</strong> These cookies are required for the basic operation of our website. They enable core functionality such as page navigation, session management, security, and access to secure areas of the website. Without these cookies, certain features of the website may not function properly. Essential cookies do not require your consent.</p>
              <p><strong>Preference Cookies (Functionality):</strong> These cookies allow our website to remember choices you make, such as your preferred theme (light or dark mode), language preferences, and other customizable settings. They enhance your user experience by providing personalized features. These cookies may collect anonymized data and cannot track your browsing activity on other websites.</p>
              <p><strong>Analytics Cookies (Performance):</strong> These cookies collect information about how visitors use our website, including which pages are visited most often, how users navigate the site, and whether they encounter any errors. This data is aggregated and anonymized. We use this information to improve our website's performance, content, and user experience.</p>
              <p><strong>Performance Cookies:</strong> These cookies help us understand how our website performs under different conditions and user loads. They help us identify technical issues, optimize loading times, and ensure a smooth browsing experience for all visitors.</p>

              <h2 id="specific-cookies">3. Specific Cookies Table</h2>
              <p>The following table lists the specific cookies that may be set on your device when you visit our website:</p>
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Cookie Name</th>
                    <th>Purpose</th>
                    <th>Type</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>session_id</code></td>
                    <td>Maintains your session state during website navigation and prevents request forgery.</td>
                    <td>Essential</td>
                    <td>Session</td>
                  </tr>
                  <tr>
                    <td><code>csrf_token</code></td>
                    <td>Provides cross-site request forgery protection for form submissions.</td>
                    <td>Essential</td>
                    <td>Session</td>
                  </tr>
                  <tr>
                    <td><code>theme_preference</code></td>
                    <td>Remembers your selected theme (light or dark mode) across visits.</td>
                    <td>Preference</td>
                    <td>1 year</td>
                  </tr>
                  <tr>
                    <td><code>cookie_consent</code></td>
                    <td>Stores your cookie consent preferences to avoid repeated prompts.</td>
                    <td>Essential</td>
                    <td>6 months</td>
                  </tr>
                  <tr>
                    <td><code>_ga</code></td>
                    <td>Used by Google Analytics to distinguish unique users and track usage statistics.</td>
                    <td>Analytics</td>
                    <td>2 years</td>
                  </tr>
                  <tr>
                    <td><code>_gid</code></td>
                    <td>Used by Google Analytics to group user behaviour data for a single day.</td>
                    <td>Analytics</td>
                    <td>24 hours</td>
                  </tr>
                  <tr>
                    <td><code>_gat</code></td>
                    <td>Used by Google Analytics to throttle request rate and limit data collection.</td>
                    <td>Analytics</td>
                    <td>1 minute</td>
                  </tr>
                </tbody>
              </table>
              <p>Note: The cookies listed above are indicative of the types of cookies we may use. The actual cookies set may vary depending on your browser, device, and the specific pages you visit. We update this list periodically to reflect any changes in our cookie usage.</p>

              <h2 id="third-party">4. Third-Party Cookies</h2>
              <p>In addition to our own cookies, we may use third-party cookies from trusted service providers to help us analyse website usage, improve our services, and process transactions.</p>
              <p><strong>Analytics Cookies:</strong> We use Google Analytics to collect anonymized information about how visitors use our website. Google Analytics sets cookies to track user interactions, generate reports, and provide insights about website traffic. The data collected includes pages visited, time spent on the site, referral sources, and device information. Google may process this data in accordance with its privacy policy. You can learn more about Google Analytics cookies and opt-out options at <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/cookies</a>.</p>
              <p><strong>Payment Gateway Cookies:</strong> When you interact with our payment processing partners (including Razorpay, Paytm, and other gateways), those services may set their own cookies for transaction processing, fraud prevention, and session management. These cookies are controlled by the respective payment gateway providers and are subject to their own privacy and cookie policies.</p>
              <p>We do not control the setting of third-party cookies. We recommend that you review the cookie and privacy policies of any third-party services whose cookies may be set when you use our website.</p>

              <h2 id="managing">5. Managing Cookies</h2>
              <p>You have the right to choose whether to accept or reject cookies. You can manage your cookie preferences in the following ways:</p>
              <p><strong>Cookie Consent Banner:</strong> When you first visit our website, a cookie consent banner will appear, allowing you to choose which categories of cookies to accept. You can accept all cookies, reject non-essential cookies, or customize your preferences. Your choice will be remembered for future visits.</p>
              <p><strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings. You can typically:</p>
              <ul>
                <li>View and delete cookies that have been set on your device</li>
                <li>Block cookies from specific websites or all websites</li>
                <li>Clear all cookies when you close your browser</li>
                <li>Set preferences for third-party cookies</li>
                <li>Enable "Do Not Track" signals</li>
              </ul>
              <p>The method for managing cookies varies by browser. Below are links to instructions for common browsers:</p>
              <ul>
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/en-in/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/view-and-delete-browser-history-in-microsoft-edge" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                <li><a href="https://support.opera.com/en/security-privacy/" target="_blank" rel="noopener noreferrer">Opera</a></li>
              </ul>
              <p><strong>Important Note:</strong> Please note that if you choose to disable essential cookies, certain features of our website may not function properly or may become unavailable. Disabling cookies may affect your browsing experience and limit your ability to use certain services.</p>

              <h2 id="consent">6. Consent Management</h2>
              <p>We are committed to obtaining and managing your cookie preferences in a transparent and compliant manner. Our cookie consent mechanism allows you to:</p>
              <ul>
                <li>Provide or withhold consent for each category of non-essential cookies</li>
                <li>Change your preferences at any time by clicking the "Cookie Settings" link in the website footer</li>
                <li>View information about each cookie category before making a decision</li>
              </ul>
              <p>Your consent preferences are stored using an essential cookie, so your choices will be remembered on subsequent visits. If you clear your browser cache or cookies, you will be prompted to set your preferences again.</p>
              <p>Consent for analytics cookies allows us to collect anonymized usage data to improve our website. You may withdraw your consent at any time by updating your cookie preferences through the website footer link.</p>

              <h2 id="updates">7. Policy Updates</h2>
              <p>We may update this Cookie Policy from time to time to reflect changes in our use of cookies, technological developments, or applicable legal and regulatory requirements. When we make material changes, we will update the "Last updated" date at the top of this policy and may notify you via a prominent notice on our website.</p>
              <p>We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies and similar technologies. Your continued use of our website after any changes constitutes your acceptance of the updated policy.</p>

              <h2 id="contact">8. Contact</h2>
              <p>If you have any questions, concerns, or requests regarding this Cookie Policy or our use of cookies, please contact us:</p>
              <p><strong>Vian Software Solutions</strong><br />Sole Proprietorship of Viren Pandey<br />Mumbai, Maharashtra, India<br />Email: support@viannn.online<br />Phone: +91 9598443203</p>
              <p>You may also refer to our <a href="/legal/privacy-policy">Privacy Policy</a> for more information about how we handle your personal data.</p>
              <div className="legal-note"><strong>Last updated:</strong> June 25, 2026</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
