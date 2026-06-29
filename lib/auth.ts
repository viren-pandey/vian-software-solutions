'use server'

import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import type { User } from '@/types/api'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me'

export async function getAuthUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    if (!accessToken) return null

    const payload = jwt.verify(accessToken, ACCESS_SECRET) as { userId: string; role: string }
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { roles: true },
    })
    if (!user) return null
    return { id: user.id, name: user.name, email: user.email, role: user.roles[0]?.role || 'client' }
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
