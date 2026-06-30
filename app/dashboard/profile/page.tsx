import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { ProfilePage } from '@/components/dashboard/ProfilePage'

export default async function ProfileRoute() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)
  const notifications = await api.notifications.list().catch(() => ({ notifications: [], unread: 0 }))

  return <ProfilePage user={user} unreadCount={notifications.unread} />
}
