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
    <aside className="w-36 border-r border-[var(--border)] p-3 flex-shrink-0 hidden md:block">
      <div className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-2 font-semibold">
        {title}
      </div>
      <nav className="space-y-0.5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium transition-colors',
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
          <hr className="border-[var(--border)] my-2" />
          <nav className="space-y-0.5">
            {footer.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium transition-colors',
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
