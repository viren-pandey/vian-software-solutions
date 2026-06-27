import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const stats = await api.admin.stats().catch(() => ({ users: 0, quotations: 0, projects: 0, revenue: 0 }))
  const [users, quotations] = await Promise.all([
    api.admin.users().catch(() => []),
    api.admin.quotations.list().catch(() => []),
  ])

  return <AdminDashboard stats={stats} users={users} quotations={quotations} user={user} />
}
