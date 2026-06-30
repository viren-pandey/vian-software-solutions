import { getAuthUser, getAuthCookie } from '@/lib/auth'
import { createServerApi } from '@/lib/api'
import { redirect } from 'next/navigation'
import { AdminChats } from '@/components/admin/AdminChats'

export default async function AdminChatsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin' && user.role !== 'reviewer') redirect('/dashboard')
  const cookie = await getAuthCookie()
  const api = createServerApi(cookie)

  const [chats, users] = await Promise.all([
    api.admin.chats.list().catch(() => []),
    api.admin.users().catch(() => []),
  ])

  return <AdminChats chats={chats} users={users} userId={user.id} />
}
