'use client'

import { Sidebar } from '@/components/ui/Sidebar'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Quotations', href: '/dashboard/quotations' },
  { label: 'Projects', href: '/dashboard/projects' },
  { label: 'Invoices', href: '/dashboard/invoices' },
  { label: 'Payments', href: '/dashboard/payments' },
  { label: 'Support', href: '/dashboard/support' },
]

const footerItems = [
  { label: 'Notifications', href: '/dashboard/notifications' },
  { label: 'Sign Out', href: '/api/auth/logout' },
]

export function DashboardSidebar() {
  return (
    <Sidebar
      title="Dashboard"
      items={navItems}
      footer={footerItems}
    />
  )
}
