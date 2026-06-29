'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'
import { Menu, X, Sun, Moon } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Products', href: '/products' },
  { name: 'Projects', href: '/projects' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Process', href: '/process' },
  { name: 'About', href: '/about' },
  { name: 'Technologies', href: '/technologies' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="header" role="banner">
      <nav className="nav container" aria-label="Main navigation">
        <Link href="/" className="brand" aria-label="Vian Software Solutions - Home">
          <svg className="logo" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" className="logo-bg" />
            <path d="M8 16L14 22L24 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="brand-text">Vian</span>
        </Link>

        <div className="nav-links desktop-nav" role="navigation" aria-label="Primary">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <button
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link href="/login" className="btn btn-secondary hidden-mobile">
            Sign In
          </Link>
          <Link href="/contact" className="btn btn-primary hidden-mobile">
            Start a Project
          </Link>

          <button
            className="icon-btn mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-menu" id="mobile-menu" role="dialog" aria-label="Navigation menu">
          <nav className="container">
            <ul className="mobile-nav-list">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={pathname === item.href ? 'active' : ''}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="mobile-nav-divider" />
              <li>
                <Link href="/login" className="btn btn-secondary btn-block" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/contact" className="btn btn-primary btn-block" onClick={() => setMobileMenuOpen(false)}>
                  Start a Project
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}