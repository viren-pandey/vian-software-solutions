import type { Metadata } from 'next'
import { TopBar } from '@/components/TopBar'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { NotificationProvider } from '@/components/notifications/NotificationProvider'
import { MobileBottomNav, DASHBOARD_BOTTOM_NAV } from '@/components/MobileBottomNav'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NotificationProvider>
      <TopBar />
      <div className="dash-shell">
        <DashboardSidebar />
        <div className="dash-main-area">
          <main className="dash-content">{children}</main>
        </div>
      </div>
      <MobileBottomNav items={DASHBOARD_BOTTOM_NAV} />
    </NotificationProvider>
  )
}
