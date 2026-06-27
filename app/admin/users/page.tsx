import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { AdminUsersList } from '@/components/admin/AdminUsersList'

export default async function AdminUsersPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const users = await api.admin.users().catch(() => [])

  return <AdminUsersList users={users} />
}
