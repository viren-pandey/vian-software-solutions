import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { AdminQuotationDetail } from '@/components/admin/AdminQuotationDetail'
import type { Quotation } from '@/types/api'

export default async function AdminQuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')

  const { id } = await params
  const row = await prisma.quotation.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      service: true,
      items: true,
      project: true,
      invoice: true,
    },
  })
  if (!row) notFound()
  const [messages, attachments] = await Promise.all([
    prisma.message.findMany({
      where: { threadType: 'quotation', threadId: id },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, name: true } } },
    }),
    prisma.attachment.findMany({ where: { ownerType: 'quotation', ownerId: id } }),
  ])
  const quotation: Quotation = JSON.parse(JSON.stringify({ ...row, messages, attachments }))

  return <AdminQuotationDetail quotation={quotation} userId={user.id} />
}
