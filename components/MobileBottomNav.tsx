'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  icon: string
}

interface MobileBottomNavProps {
  items: NavItem[]
}

export function MobileBottomNav({ items }: MobileBottomNavProps) {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="flex justify-around items-center h-14 px-2">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-md transition-colors min-w-0 ${
                active
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: 10, lineHeight: 1 }} className="truncate max-w-full">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export const DASHBOARD_BOTTOM_NAV = [
  { label: 'Home', href: '/dashboard', icon: '\u2302' },
  { label: 'Quotes', href: '/dashboard/quotations', icon: '\u2630' },
  { label: 'Invoices', href: '/dashboard/invoices', icon: '\u25B8' },
  { label: 'Payments', href: '/dashboard/payments', icon: '\u25C8' },
  { label: 'Support', href: '/dashboard/support', icon: '\u260E' },
]

export const ADMIN_BOTTOM_NAV = [
  { label: 'Home', href: '/admin', icon: '\u2302' },
  { label: 'Quotes', href: '/admin/quotations', icon: '\u2630' },
  { label: 'Users', href: '/admin/users', icon: '\u263A' },
  { label: 'Payments', href: '/admin/payments', icon: '\u25C8' },
  { label: 'Chats', href: '/admin/chats', icon: '\u2709' },
]
