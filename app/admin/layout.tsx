import type { Metadata } from 'next'
import { TopBar } from '@/components/TopBar'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { NotificationProvider } from '@/components/notifications/NotificationProvider'
import { MobileBottomNav, ADMIN_BOTTOM_NAV } from '@/components/MobileBottomNav'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NotificationProvider>
      <TopBar />
      <div className="dash-shell">
        <AdminSidebar />
        <div className="dash-main-area">
          <main className="dash-content">{children}</main>
        </div>
      </div>
      <MobileBottomNav items={ADMIN_BOTTOM_NAV} />
    </NotificationProvider>
  )
}
