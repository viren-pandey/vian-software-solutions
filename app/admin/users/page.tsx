import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { AdminUsersList } from '@/components/admin/AdminUsersList'

export default async function AdminUsersPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  let users = await api.admin.users().catch(() => null)
  if (!users) {
    const dbUsers = await prisma.user.findMany({
      include: { roles: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    users = dbUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: (u.roles[0]?.role || 'client') as 'admin' | 'reviewer' | 'client',
      createdAt: u.createdAt.toISOString(),
    }))
  }

  return <AdminUsersList users={users} />
}
