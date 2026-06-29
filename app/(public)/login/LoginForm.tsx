'use client'

import { useActionState, useEffect } from 'react'
import { loginAction } from './actions'

export function LoginForm({ redirectParam }: { redirectParam?: string | null }) {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  useEffect(() => {
    if (state?.redirectTo) {
      window.location.href = state.redirectTo
    }
  }, [state])

  return (
    <form action={formAction}>
      <input type="hidden" name="redirect" value={redirectParam || ''} />
      {state?.error && (
        <div className="alert alert-error">{state.error}</div>
      )}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="you@example.com" required autoComplete="email" />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="password-toggle">
          <input type="password" id="password" name="password" placeholder="Enter your password" required autoComplete="current-password" />
          <button type="button" className="toggle" onClick={togglePassword}>Show</button>
        </div>
      </div>
      <button type="submit" className="btn btn-primary auth-btn" disabled={isPending}>
        {isPending ? 'Signing in...' : 'Sign In'}
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
