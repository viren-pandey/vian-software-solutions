import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { AdminPaymentsList } from '@/components/admin/AdminPaymentsList'
import type { Payment, PaymentRequest, PaymentLogEntry, User } from '@/types/api'

export default async function AdminPaymentsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  let payments: Payment[] = await api.admin.payments.list().catch(() => [])
  if (payments.length === 0) {
    const dbPayments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        invoice: { include: { quotation: true } },
      },
      take: 50,
    })
    payments = dbPayments as unknown as Payment[]
  }

  let requests: PaymentRequest[] = await api.admin.paymentRequests.list().catch(() => [])
  if (requests.length === 0) {
    const dbRequests = await prisma.paymentRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
      take: 50,
    })
    requests = dbRequests as unknown as PaymentRequest[]
  }

  let logs: PaymentLogEntry[] = await api.admin.paymentLogs.list().catch(() => [])
  if (logs.length === 0) {
    const dbLogs = await prisma.paymentLog.findMany({
      orderBy: { receivedAt: 'desc' },
      take: 200,
      include: { payment: { include: { user: { select: { id: true, name: true, email: true } } } } },
    })
    logs = dbLogs as unknown as PaymentLogEntry[]
  }

  let users: User[] = await api.admin.users().catch(() => [])
  if (users.length === 0) {
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

  return <AdminPaymentsList payments={payments} requests={requests} logs={logs} users={users} />
}
