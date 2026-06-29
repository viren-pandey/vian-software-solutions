'use server'

import { cookies } from 'next/headers'
import type { User } from '@/types/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export async function getAuthUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    if (!accessToken) return null

    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Cookie: `access_token=${accessToken}` },
      cache: 'no-store',
    })

    if (!res.ok) return null
    const data = await res.json()
    return data.user as User
  } catch {
    return null
  }
}

export async function getAuthCookie(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  return token ? `access_token=${token}` : ''
}

export async function requireAuth(): Promise<User> {
  const user = await getAuthUser()
  if (!user) throw new Error('Not authenticated')
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== 'admin' && user.role !== 'reviewer') {
    throw new Error('Not authorized')
  }
  return user
}
