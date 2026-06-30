import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { QuotationsList } from '@/components/dashboard/QuotationsList'

export default async function QuotationsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const [quotations, services] = await Promise.all([
    api.quotations.list().catch(() => []),
    prisma.service.findMany({ orderBy: { name: 'asc' } }).catch(() => []),
  ])

  return <QuotationsList quotations={quotations} services={services} />
}
