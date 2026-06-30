'use client'

import { useActionState, useEffect, useState } from 'react'
import { registerAction } from './actions'
import { Eye, EyeOff, RefreshCw } from 'lucide-react'

function generateChallenge() {
  const a = Math.floor(Math.random() * 15) + 3
  const b = Math.floor(Math.random() * 15) + 3
  return { a, b, answer: a + b }
}

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null)
  const [pwVisible, setPwVisible] = useState(false)
  const [challenge, setChallenge] = useState(generateChallenge)

  useEffect(() => {
    if (state?.redirectTo) {
      window.location.href = state.redirectTo
    }
  }, [state])

  const resetChallenge = () => setChallenge(generateChallenge())

  return (
    <form action={formAction}>
      <input type="hidden" name="ca" value={challenge.a} />
      <input type="hidden" name="cb" value={challenge.b} />
      <input type="hidden" name="canswer" value={challenge.answer} />
      {state?.error && (
        <div className="alert alert-error">{state.error}</div>
      )}
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input type="text" id="name" name="name" placeholder="Your full name" required autoComplete="name" />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="you@example.com" required autoComplete="email" />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="password-toggle">
          <input type={pwVisible ? 'text' : 'password'} id="password" name="password" placeholder="Create a password" required autoComplete="new-password" minLength={8} />
          <button type="button" className="toggle" onClick={() => setPwVisible(!pwVisible)} aria-label={pwVisible ? 'Hide password' : 'Show password'}>
            {pwVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <div className="form-group">
        <label>Security Check</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 14, whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>What is {challenge.a} + {challenge.b}?</span>
          <input
            type="number"
            name="captcha"
            required
            style={{ width: 80, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14 }}
            onFocus={(e) => e.target.select()}
          />
          <button type="button" onClick={resetChallenge} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-tertiary)', padding: 4 }} title="New question" aria-label="New question"><RefreshCw size={16} /></button>
        </div>
      </div>
      <button type="submit" className="btn btn-primary auth-btn" disabled={isPending}>
        {isPending ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  )
}
