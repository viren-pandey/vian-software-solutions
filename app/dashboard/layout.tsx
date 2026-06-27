import { TopBar } from '@/components/TopBar'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { NotificationProvider } from '@/components/notifications/NotificationProvider'
import { MobileBottomNav, DASHBOARD_BOTTOM_NAV } from '@/components/MobileBottomNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NotificationProvider>
      <TopBar />
      <div className="dash-layout">
        <DashboardSidebar />
        <main className="dash-main">{children}</main>
      </div>
      <MobileBottomNav items={DASHBOARD_BOTTOM_NAV} />
    </NotificationProvider>
  )
}
