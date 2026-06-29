import type { Metadata } from 'next'
import { RegisterForm } from './RegisterForm'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your Vian Software Solutions account to request quotations and manage projects.',
}

export default function RegisterPage() {
  return (
    <section className="auth-page" style={{ minHeight: 'calc(100vh - var(--nav-height, 56px))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <div className="auth-card" style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
        <div className="card" style={{ padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <a className="brand" href="/" style={{ display: 'inline-flex' }}>
              <svg className="logo" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ width: 28, height: 28 }}>
                <rect width="32" height="32" rx="8" fill="currentColor" />
                <path d="M8 16L14 22L24 10" stroke="var(--bg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="brand-text">Vian</span>
            </a>
          </div>
          <h1 style={{ fontSize: 22, textAlign: 'center', marginBottom: 4, fontWeight: 600 }}>Create your account</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Join Vian to request quotations and manage your projects</p>
          <RegisterForm />
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
            By creating an account, you agree to our <a href="/legal/terms-and-conditions" style={{ color: 'var(--text)', fontWeight: 500 }}>Terms of Service</a> and <a href="/legal/privacy-policy" style={{ color: 'var(--text)', fontWeight: 500 }}>Privacy Policy</a>.
          </div>
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
            Already have an account? <a href="/login" style={{ fontWeight: 600, color: 'var(--text)' }}>Sign in</a>
          </div>
        </div>
      </div>
    </section>
  )
}
