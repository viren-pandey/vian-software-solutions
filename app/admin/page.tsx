import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import type { AdminStats, Quotation } from '@/types/api'

export default async function AdminPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  let stats: AdminStats | null = await api.admin.stats().catch(() => null)
  if (!stats) {
    const [users, projects, payments] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'success' } }),
    ])
    const quotations = await prisma.quotation.count()
    stats = { users, quotations, projects, revenue: Number(payments._sum.amount ?? 0) }
  }

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

  let quotations: Quotation[] = await api.admin.quotations.list().catch(() => [])
  if (quotations.length === 0) {
    const dbQuotations = await prisma.quotation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } }, service: true, items: true },
      take: 50,
    })
    quotations = dbQuotations as unknown as Quotation[]
  }

  return <AdminDashboard stats={stats} users={users} quotations={quotations} user={user} />
}
