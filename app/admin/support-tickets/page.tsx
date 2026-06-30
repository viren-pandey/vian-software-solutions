import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { AdminSupportTickets } from '@/components/admin/AdminSupportTickets'
import type { SupportTicket } from '@/types/api'

export default async function AdminSupportTicketsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')

  const tickets = await prisma.supportTicket.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, name: true, email: true } } },
    take: 100,
  })

  return <AdminSupportTickets tickets={tickets as unknown as SupportTicket[]} />
}
