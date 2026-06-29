'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface SidebarProps {
  title: string
  items: NavItem[]
  footer?: NavItem[]
  role?: string
}

export function Sidebar({ title, items, footer, role }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-48 border-r border-[var(--border)] p-4 flex-shrink-0 hidden md:block">
      <div className="text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-3 font-semibold">
        {title}
      </div>
      <nav className="space-y-0.5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
                ? 'bg-[var(--surface-hover)] text-[var(--text)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]',
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      {footer && (
        <>
          <hr className="border-[var(--border)] my-4" />
          <nav className="space-y-0.5">
            {footer.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-[var(--surface-hover)] text-[var(--text)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]',
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </aside>
  )
}
