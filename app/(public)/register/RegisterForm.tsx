'use client'

import { useActionState, useEffect } from 'react'
import { registerAction } from './actions'

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null)

  useEffect(() => {
    if (state?.redirectTo) {
      window.location.href = state.redirectTo
    }
  }, [state])

  return (
    <form action={formAction}>
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
          <input type="password" id="password" name="password" placeholder="Create a password" required autoComplete="new-password" minLength={8} />
          <button type="button" className="toggle" onClick={togglePassword}>Show</button>
        </div>
      </div>
      <button type="submit" className="btn btn-primary auth-btn" disabled={isPending}>
        {isPending ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  )
}

function togglePassword() {
  const pwd = document.getElementById('password') as HTMLInputElement
  const btn = (event as any).target as HTMLElement
  if (!pwd || !btn) return
  if (pwd.type === 'password') {
    pwd.type = 'text'
    btn.textContent = 'Hide'
  } else {
    pwd.type = 'password'
    btn.textContent = 'Show'
  }
}
