import type { Metadata } from 'next'
import { siteUrl, breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Security',
  description: 'Security practices and policies at Vian Software Solutions. How we protect your data and applications.',
  keywords: ['software security', 'data protection', 'secure development', 'application security', 'cybersecurity practices', 'secure software india'],
  openGraph: {
    title: 'Security - Vian Software Solutions',
    description: 'Security practices and policies at Vian Software Solutions. How we protect your data and applications.',
    images: [{ url: `${siteUrl}/assets/logo/og-image.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Security - Vian Software Solutions',
    description: 'Security practices and policies at Vian Software Solutions. How we protect your data and applications.',
  },
  alternates: {
    canonical: `${siteUrl}/security`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function SecurityPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Security</span>
          </div>
          <span className="eyebrow">Security</span>
          <h1>Security is built in, not bolted on.</h1>
          <p className="lead">We integrate security into every stage of development. Here is how we protect your data, your users, and your applications.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800, marginInline: 'auto' }}>
          <div className="section-head">
            <span className="eyebrow">Practices</span>
            <h2>Our security approach.</h2>
          </div>

          <div className="security-grid">
            <div className="security-item">
              <h3>Secure Authentication</h3>
              <p>Passwords are hashed using bcrypt with unique salts. Sessions use httpOnly, secure cookies with JWT tokens. API endpoints require valid authentication by default.</p>
            </div>
            <div className="security-item">
              <h3>HTTPS Everywhere</h3>
              <p>All traffic is encrypted in transit using TLS. HTTP requests are redirected to HTTPS. HSTS headers are set to prevent protocol downgrade attacks.</p>
            </div>
            <div className="security-item">
              <h3>Input Validation</h3>
              <p>All user inputs are validated and sanitized using Zod schemas. SQL injection is prevented through Prisma parameterized queries. XSS protection is applied on all rendered output.</p>
            </div>
            <div className="security-item">
              <h3>Access Controls</h3>
              <p>Role-based access control (RBAC) is enforced on all server-side operations. Users can only access their own data. Admin functionality is strictly separated from client interfaces.</p>
            </div>
            <div className="security-item">
              <h3>Audit Logging</h3>
              <p>All sensitive operations are logged with actor identity, action type, timestamp, and state changes. Logs are immutable and retained for compliance purposes.</p>
            </div>
            <div className="security-item">
              <h3>Regular Updates</h3>
              <p>Dependencies are monitored for vulnerabilities using automated tooling. Security patches are applied promptly. Major versions are evaluated and updated as part of maintenance.</p>
            </div>
            <div className="security-item">
              <h3>Data Protection</h3>
              <p>Sensitive data is encrypted at rest. Payment card details are never stored on our servers — all payment processing is handled by PCI-compliant third-party gateways.</p>
            </div>
            <div className="security-item">
              <h3>Privacy by Design</h3>
              <p>We collect only the data necessary to provide our services. Privacy considerations are integrated into architecture decisions, not added as an afterthought.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{ maxWidth: 800, marginInline: 'auto' }}>
          <div className="section-head">
            <span className="eyebrow">Disclosure</span>
            <h2>Responsible disclosure.</h2>
          </div>
          <div className="prose">
            <p>We take security seriously. If you believe you have found a security vulnerability in any of our systems, please report it to us immediately.</p>
            <div className="security-disclosure">
              <p><strong>Email:</strong> support@viannn.online</p>
              <p><strong>Response time:</strong> Within 24 hours</p>
            </div>
            <p className="muted" style={{ marginTop: 16, fontSize: 14 }}>
              We do not currently maintain a bug bounty program, but we gratefully acknowledge responsible
              disclosures in our security changelog. Please refrain from publicly disclosing vulnerabilities
              before we have had a reasonable opportunity to address them.
            </p>
          </div>
          <div className="legal-notice" style={{ marginTop: 32, padding: 20, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)' }}>
            <p className="muted" style={{ fontSize: 13 }}>
              <strong>No certifications statement:</strong> Vian Software Solutions is a growing company and does not currently hold formal security certifications
              (SOC 2, ISO 27001, PCI DSS, etc.). We follow industry best practices and are happy to discuss our security measures in detail during the onboarding process.
              We are working toward formal certification as the business scales.
            </p>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', item: '/' }, { name: 'Security', item: '/security' }])) }}
      />
    </>
  )
}