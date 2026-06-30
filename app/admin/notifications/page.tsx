import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { AdminNotifications } from '@/components/admin/AdminNotifications'

export default async function AdminNotificationsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const { notifications, unread } = await api.notifications.list().catch(() => ({ notifications: [], unread: 0 }))

  return <AdminNotifications notifications={notifications} unread={unread} />
}
