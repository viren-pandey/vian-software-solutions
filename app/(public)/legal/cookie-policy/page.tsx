import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How Vian Software Solutions uses cookies on its website.',
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
          <p className="lead">How we use cookies on our website and how you can manage them.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720, marginInline: 'auto' }}>
          <div className="legal-doc">
            <h2 id="what-are-cookies">What Are Cookies</h2>
            <p>Cookies are small text files placed on your device when you visit a website. They help websites function properly, enhance user experience, and provide information to site owners.</p>

            <h2 id="how-we-use">How We Use Cookies</h2>
            <ul>
              <li><strong>Essential:</strong> Required for basic website operation (session management, security)</li>
              <li><strong>Preference:</strong> Remember your settings (theme, language)</li>
              <li><strong>Analytics:</strong> Understand usage patterns (with consent)</li>
            </ul>

            <h2 id="your-choices">Your Choices</h2>
            <p>When you first visit our website, you can choose which cookies to accept. You can also manage cookies through your browser settings. Essential cookies cannot be disabled without affecting functionality.</p>

            <h2 id="contact">Contact</h2>
            <p>Email: virenpandey89@gmail.com</p>
            <div className="legal-note"><strong>Last updated:</strong> June 25, 2026</div>
          </div>
        </div>
      </section>
    </>
  )
}