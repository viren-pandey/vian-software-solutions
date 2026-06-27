import { TopBar } from '@/components/TopBar'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { NotificationProvider } from '@/components/notifications/NotificationProvider'
import { MobileBottomNav, ADMIN_BOTTOM_NAV } from '@/components/MobileBottomNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NotificationProvider>
      <TopBar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">{children}</main>
      </div>
      <MobileBottomNav items={ADMIN_BOTTOM_NAV} />
    </NotificationProvider>
  )
}
