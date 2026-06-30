import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { QuotationsList } from '@/components/dashboard/QuotationsList'
import { DEFAULT_SERVICES } from '@/lib/default-services'

async function ensureServices(): Promise<void> {
  const count = await prisma.service.count()
  if (count > 0) return
  for (const svc of DEFAULT_SERVICES) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: { name: svc.name, description: svc.description, category: svc.category, active: true },
      create: { ...svc, active: true },
    })
  }
}

export default async function QuotationsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  await ensureServices()

  const [quotations, services] = await Promise.all([
    api.quotations.list().catch(() => []),
    prisma.service.findMany({ orderBy: { name: 'asc' } }),
  ])

  return <QuotationsList quotations={quotations} services={services} />
}
