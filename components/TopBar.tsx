'use client'

import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'
import { useNotifications } from '@/components/notifications/NotificationProvider'
import { usePathname } from 'next/navigation'

export function TopBar() {
  const { theme, toggleTheme } = useTheme()
  const { unreadCount } = useNotifications()
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')
  const isAdmin = pathname?.startsWith('/admin')
  const notifHref = isAdmin ? '/admin' : '/dashboard/notifications'

  return (
    <header className="topbar">
      <nav className="nav">
        <Link className="brand" href="/">Vian</Link>
        <div className="nav-links" data-nav-links>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="nav-actions">
          <Link href={notifHref} className="icon-btn" aria-label="Notifications">
            {unreadCount > 0 ? (
              <span style={{ position: 'relative' }}>
                {'\uD83D\uDD14'}
                <span style={{
                  position: 'absolute', top: -6, right: -8,
                  background: 'var(--accent)', color: '#fff',
                  fontSize: 10, fontWeight: 700,
                  width: 16, height: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%',
                }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
              </span>
            ) : '\uD83D\uDD14'}
          </Link>
          <button
            className="icon-btn"
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '\u25D1' : '\u25D0'}
          </button>
        </div>
      </nav>
    </header>
  )
}
