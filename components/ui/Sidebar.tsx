'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface NavSection {
  title?: string
  items: NavItem[]
}

interface SidebarProps {
  title: string
  sections: NavSection[]
  footer?: NavItem[]
}

export function Sidebar({ title, sections, footer }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string) => {
    if (href === '/admin' || href === '/dashboard') return pathname === href
    return pathname?.startsWith(href)
  }

  return (
    <aside className={`dash-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="dash-sidebar-header">
        <span className="brand-icon">V</span>
        {!collapsed && <span className="brand-text">{title}</span>}
        <button
          className="dash-sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="dash-sidebar-nav">
        {sections.map((section, i) => (
          <div key={i} className="dash-nav-section">
            {section.title && !collapsed && (
              <div className="dash-nav-section-title">{section.title}</div>
            )}
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'dash-nav-item',
                  isActive(item.href) && 'active',
                )}
                title={collapsed ? item.label : undefined}
              >
                {item.icon && <span className="nav-icon">{item.icon}</span>}
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {footer && footer.length > 0 && (
        <div className="dash-sidebar-footer">
          {footer.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'dash-nav-item',
                isActive(item.href) && 'active',
              )}
              title={collapsed ? item.label : undefined}
            >
              {item.icon && <span className="nav-icon">{item.icon}</span>}
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </div>
      )}
    </aside>
  )
}
