import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { AdminAnalytics } from '@/components/admin/AdminAnalytics'

export default async function AdminAnalyticsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const stats = await api.admin.stats().catch(() => ({ users: 0, quotations: 0, projects: 0, revenue: 0 }))

  return <AdminAnalytics stats={stats} />
}
