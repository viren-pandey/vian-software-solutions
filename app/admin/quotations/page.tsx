import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { AdminQuotationsList } from '@/components/admin/AdminQuotationsList'
import type { Quotation } from '@/types/api'

export default async function AdminQuotationsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')

  const rows = await prisma.quotation.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      service: true,
      items: true,
    },
  })
  const quotations: Quotation[] = JSON.parse(JSON.stringify(rows))

  return <AdminQuotationsList quotations={quotations} />
}
