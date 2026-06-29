import Link from 'next/link'

const footerLinks = {
  company: [
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Team', href: '/team' },
    { name: 'Contact', href: '/contact' },
  ],
  services: [
    { name: 'Web Development', href: '/services' },
    { name: 'Software Development', href: '/services' },
    { name: 'Automation', href: '/services' },
    { name: 'AI & ML', href: '/services' },
    { name: 'Consulting', href: '/services' },
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Process', href: '/process' },
    { name: 'Technologies', href: '/technologies' },
    { name: 'Security', href: '/security' },
  ],
  legal: [
    { name: 'Terms & Conditions', href: '/legal/terms-and-conditions' },
    { name: 'Privacy Policy', href: '/legal/privacy-policy' },
    { name: 'Refund Policy', href: '/legal/refund-policy' },
    { name: 'Delivery Policy', href: '/legal/shipping-policy' },
    { name: 'Cookie Policy', href: '/legal/cookie-policy' },
    { name: 'Disclaimer', href: '/legal/disclaimer' },
    { name: 'Payment Policy', href: '/legal/payment-policy' },
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
          <p className="muted" style={{ marginTop: 14, maxWidth: 300, fontSize: 13, lineHeight: 1.6 }}>
            Custom software development, web applications, automation, and digital solutions. Based in Mumbai, serving clients worldwide.
          </p>
          <p className="muted" style={{ marginTop: 10, fontSize: 12 }}>
            Vian Software Solutions — Sole Proprietorship of Viren Pandey.
          </p>
          <p className="muted" style={{ fontSize: 12 }}>
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
        <span>&copy; {new Date().getFullYear()} Vian Software Solutions. All rights reserved.</span>
        <span className="footer-bottom-links">
          <Link href="/legal/privacy-policy">Privacy</Link>
          <Link href="/legal/terms-and-conditions">Terms</Link>
          <Link href="/legal/refund-policy">Refunds</Link>
          <Link href="/contact">Contact</Link>
        </span>
      </div>
    </footer>
  )
}