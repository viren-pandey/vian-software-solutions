import Link from 'next/link'

const footerLinks = {
  company: [
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Team', href: '/team' },
    { name: 'Contact', href: '/contact' },
  ],
  services: [
    { name: 'Web Development', href: '/services#websites' },
    { name: 'Software Development', href: '/services#software' },
    { name: 'Automation', href: '/services#automation' },
    { name: 'Digital Growth', href: '/services#growth' },
    { name: 'Consulting', href: '/services#consulting' },
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Process', href: '/process' },
    { name: 'Technologies', href: '/technologies' },
    { name: 'Security', href: '/security' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/legal/privacy-policy' },
    { name: 'Terms & Conditions', href: '/legal/terms-and-conditions' },
    { name: 'Refund Policy', href: '/legal/refund-policy' },
    { name: 'Cookie Policy', href: '/legal/cookie-policy' },
    { name: 'Delivery Policy', href: '/legal/shipping-policy' },
  ],
}

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <svg className="logo" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" className="logo-bg" />
              <path d="M8 16L14 22L24 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="brand-text">Vian</span>
          </Link>
          <p className="muted" style={{ marginTop: 16, maxWidth: 300, fontSize: 14, lineHeight: 1.6 }}>
            Custom software, web development, automation, and digital growth solutions.
          </p>
          <p className="muted" style={{ marginTop: 8, fontSize: 13 }}>
            <strong>Vian Software Solutions</strong> — Sole Proprietorship of Viren Pandey.
          </p>
          <p className="muted" style={{ fontSize: 13 }}>
            Mumbai, Maharashtra, India.
          </p>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            {footerLinks.company.map((link) => (
              <li key={link.name}><Link href={link.href}>{link.name}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            {footerLinks.services.map((link) => (
              <li key={link.name}><Link href={link.href}>{link.name}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            {footerLinks.resources.map((link) => (
              <li key={link.name}><Link href={link.href}>{link.name}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            {footerLinks.legal.map((link) => (
              <li key={link.name}><Link href={link.href}>{link.name}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span className="muted">&copy; {new Date().getFullYear()} Vian Software Solutions. All rights reserved.</span>
        <span className="footer-bottom-links">
          <Link href="/legal/privacy-policy">Privacy</Link>
          <Link href="/legal/terms-and-conditions">Terms</Link>
          <Link href="/contact">Contact</Link>
        </span>
      </div>
    </footer>
  )
}