import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { QuotationDetail } from '@/components/dashboard/QuotationDetail'
import type { Quotation } from '@/types/api'

export default async function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getAuthUser()
  if (!user) redirect('/login')

  const { id } = await params
  const row = await prisma.quotation.findFirst({
    where: { id, userId: user.id },
    include: {
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

  return <QuotationDetail quotation={quotation} userId={user.id} />
}
