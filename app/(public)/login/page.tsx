import type { Metadata } from 'next'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Vian Software Solutions account.',
}

export default async function LoginPage(props: { searchParams?: Promise<{ redirect?: string }> }) {
  const searchParams = await props.searchParams
  const redirectTo = searchParams?.redirect || null

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
          <h1 style={{ fontSize: 22, textAlign: 'center', marginBottom: 4, fontWeight: 600 }}>Welcome back</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Sign in to your account</p>
          <LoginForm redirectParam={redirectTo} />
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
            Don&apos;t have an account? <a href="/register" style={{ fontWeight: 600, color: 'var(--text)' }}>Create one</a>
          </div>
        </div>
      </div>
    </section>
  )
}
