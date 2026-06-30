'use client'

import { Sidebar } from '@/components/ui/Sidebar'
import {
  LayoutDashboard, FileText, Users, FolderKanban, CreditCard,
  Newspaper, MessageSquare, ShieldAlert, LogOut, BarChart3,
  Bell, Settings,
} from 'lucide-react'

const sections = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
      { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={18} /> },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Quotations', href: '/admin/quotations', icon: <FileText size={18} /> },
      { label: 'Users', href: '/admin/users', icon: <Users size={18} /> },
      { label: 'Projects', href: '/admin/projects', icon: <FolderKanban size={18} /> },
      { label: 'Payments', href: '/admin/payments', icon: <CreditCard size={18} /> },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Blog', href: '/admin/blog', icon: <Newspaper size={18} /> },
      { label: 'Chats', href: '/admin/chats', icon: <MessageSquare size={18} /> },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Audit Log', href: '/admin/audit-log', icon: <ShieldAlert size={18} /> },
      { label: 'Notifications', href: '/admin/notifications', icon: <Bell size={18} /> },
      { label: 'Settings', href: '/admin/settings', icon: <Settings size={18} /> },
    ],
  },
]

const footerItems = [
  { label: 'Sign Out', href: '/api/auth/logout', icon: <LogOut size={18} /> },
]

export function AdminSidebar() {
  return (
    <Sidebar
      title="Admin"
      sections={sections}
      footer={footerItems}
    />
  )
}
