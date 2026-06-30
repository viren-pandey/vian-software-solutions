import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSettings } from '@/components/admin/AdminSettings'

export default async function AdminSettingsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')

  return <AdminSettings user={user} />
}
