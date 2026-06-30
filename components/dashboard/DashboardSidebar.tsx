'use client'

import { Sidebar } from '@/components/ui/Sidebar'
import {
  LayoutDashboard, FileText, FolderKanban, Receipt,
  CreditCard, LifeBuoy, Bell, LogOut, User,
} from 'lucide-react'

const sections = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    title: 'Business',
    items: [
      { label: 'Quotations', href: '/dashboard/quotations', icon: <FileText size={18} /> },
      { label: 'Projects', href: '/dashboard/projects', icon: <FolderKanban size={18} /> },
      { label: 'Invoices', href: '/dashboard/invoices', icon: <Receipt size={18} /> },
      { label: 'Payments', href: '/dashboard/payments', icon: <CreditCard size={18} /> },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Support', href: '/dashboard/support', icon: <LifeBuoy size={18} /> },
      { label: 'Profile', href: '/dashboard/profile', icon: <User size={18} /> },
    ],
  },
]

const footerItems = [
  { label: 'Notifications', href: '/dashboard/notifications', icon: <Bell size={18} /> },
  { label: 'Sign Out', href: '/api/auth/logout', icon: <LogOut size={18} /> },
]

export function DashboardSidebar() {
  return (
    <Sidebar
      title="Dashboard"
      sections={sections}
      footer={footerItems}
    />
  )
}
