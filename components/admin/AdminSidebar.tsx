'use client'

import { Sidebar } from '@/components/ui/Sidebar'

const adminItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Quotations', href: '/admin/quotations' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Projects', href: '/admin/projects' },
  { label: 'Payments', href: '/admin/payments' },
  { label: 'Blog', href: '/admin/blog' },
  { label: 'Chats', href: '/admin/chats' },
  { label: 'Audit Log', href: '/admin/audit-log' },
]

const footerItems = [
  { label: 'Sign Out', href: '/api/auth/logout' },
]

export function AdminSidebar() {
  return (
    <Sidebar
      title="Admin"
      items={adminItems}
      footer={footerItems}
    />
  )
}
