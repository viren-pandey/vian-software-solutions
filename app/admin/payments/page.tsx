import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { AdminPaymentsList } from '@/components/admin/AdminPaymentsList'
import type { Payment, PaymentRequest, PaymentLogEntry, Invoice, User } from '@/types/api'
import type { Prisma } from '@prisma/client'

export default async function AdminPaymentsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')

  const [payments, requests, directInvoices, logs, rawUsers] = await Promise.all([
    prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        invoice: { include: { quotation: true } },
      },
      take: 50,
    }),
    prisma.paymentRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
      take: 50,
    }),
    (prisma.invoice as any).findMany({
      where: { quotationId: null },
      orderBy: { issuedAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
      take: 50,
    }),
    prisma.paymentLog.findMany({
      orderBy: { receivedAt: 'desc' },
      take: 200,
      include: { payment: { include: { user: { select: { id: true, name: true, email: true } } } } },
    }),
    prisma.user.findMany({
      include: { roles: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ])

  const users: User[] = rawUsers.map((u: { id: string; name: string; email: string; createdAt: Date; roles: { role: string }[] }) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: (u.roles[0]?.role || 'client') as 'admin' | 'reviewer' | 'client',
    createdAt: u.createdAt.toISOString(),
  }))

  return <AdminPaymentsList payments={payments as unknown as Payment[]} requests={requests as unknown as PaymentRequest[]} invoices={directInvoices as unknown as Invoice[]} logs={logs as unknown as PaymentLogEntry[]} users={users} />
}
