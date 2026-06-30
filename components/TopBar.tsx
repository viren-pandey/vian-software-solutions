'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'
import { useNotifications } from '@/components/notifications/NotificationProvider'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Bell, Sun, Moon, LogOut } from 'lucide-react'

export function TopBar() {
  const { theme, toggleTheme } = useTheme()
  const { unreadCount } = useNotifications()
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const isDashboard = pathname?.startsWith('/dashboard')
  const isAdmin = pathname?.startsWith('/admin')
  const notifHref = isAdmin ? '/admin/notifications' : '/dashboard/notifications'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/quotations?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="topbar">
      <nav className="nav">
        <Link className="brand" href="/">
          <span style={{ fontWeight: 800, fontSize: 16 }}>Vian</span>
        </Link>

        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 360, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
          <input
            type="search"
            placeholder={isAdmin ? 'Search users, quotations...' : 'Search quotations...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '7px 12px 7px 34px',
              border: '1px solid var(--border)', borderRadius: 6,
              background: 'var(--bg-secondary)', color: 'var(--text)',
              fontSize: 13, outline: 'none',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.background = 'var(--surface)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg-secondary)' }}
          />
        </form>

        <div className="nav-links" data-nav-links style={{ display: 'none' }}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="nav-actions">
          <Link
            href={notifHref}
            className="icon-btn"
            aria-label="Notifications"
            style={{ position: 'relative' }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -2, right: -2,
                background: 'var(--error)', color: '#fff',
                fontSize: 9, fontWeight: 700,
                width: 16, height: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', border: '2px solid var(--bg)',
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <button
            className="icon-btn"
            onClick={toggleTheme}
            type="button"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            href="/api/auth/logout"
            className="icon-btn"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={18} />
          </Link>
        </div>
      </nav>
    </header>
  )
}
