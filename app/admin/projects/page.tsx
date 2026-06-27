import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { AdminProjectsList } from '@/components/admin/AdminProjectsList'

export default async function AdminProjectsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const projects = await api.admin.projects.list().catch(() => [])

  return <AdminProjectsList projects={projects} />
}
