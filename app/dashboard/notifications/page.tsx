import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { NotificationsPage } from '@/components/dashboard/NotificationsPage'

export default async function NotificationsRoute() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const data = await api.notifications.list().catch(() => ({ notifications: [], unread: 0 }))

  return <NotificationsPage notifications={data.notifications} unread={data.unread} />
}
