'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, ChevronRight, LayoutGrid, Phone, Users, Mail } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: string
}

interface MobileBottomNavProps {
  items: NavItem[]
}

const iconMap: Record<string, React.ReactNode> = {
  home: <Home size={18} />,
  quotes: <FileText size={18} />,
  invoices: <ChevronRight size={18} />,
  payments: <LayoutGrid size={18} />,
  support: <Phone size={18} />,
  users: <Users size={18} />,
  chats: <Mail size={18} />,
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
              <span style={{ fontSize: 18, lineHeight: 1 }}>{iconMap[item.icon]}</span>
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
  { label: 'Home', href: '/dashboard', icon: 'home' },
  { label: 'Quotes', href: '/dashboard/quotations', icon: 'quotes' },
  { label: 'Invoices', href: '/dashboard/invoices', icon: 'invoices' },
  { label: 'Payments', href: '/dashboard/payments', icon: 'payments' },
  { label: 'Support', href: '/dashboard/support', icon: 'support' },
]

export const ADMIN_BOTTOM_NAV = [
  { label: 'Home', href: '/admin', icon: 'home' },
  { label: 'Quotes', href: '/admin/quotations', icon: 'quotes' },
  { label: 'Users', href: '/admin/users', icon: 'users' },
  { label: 'Payments', href: '/admin/payments', icon: 'payments' },
  { label: 'Chats', href: '/admin/chats', icon: 'chats' },
]
