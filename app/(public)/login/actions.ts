'use server'

import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me'

function validateCaptcha(formData: FormData): boolean {
  const a = parseInt(formData.get('ca') as string)
  const b = parseInt(formData.get('cb') as string)
  const expected = parseInt(formData.get('canswer') as string)
  const userAnswer = parseInt(formData.get('captcha') as string)
  if (isNaN(a) || isNaN(b) || isNaN(expected) || isNaN(userAnswer)) return false
  if (a + b !== expected) return false
  return userAnswer === expected
}

export async function loginAction(
  _prev: { error?: string; redirectTo?: string } | null,
  formData: FormData,
): Promise<{ error?: string; redirectTo?: string } | null> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Email and password are required' }
  if (!validateCaptcha(formData)) return { error: 'Security check failed. Please try again.' }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    })
    if (!user) return { error: 'Invalid email or password' }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return { error: 'Invalid email or password' }

    const role = user.roles[0]?.role || 'client'
    const accessToken = jwt.sign({ userId: user.id, role }, ACCESS_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ userId: user.id, role }, REFRESH_SECRET, { expiresIn: '7d' })

    const cookieStore = await cookies()
    cookieStore.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 900,
    })
    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 604800,
    })

    const redirectParam = formData.get('redirect') as string
    let redirectTo: string
    if (redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')) {
      redirectTo = redirectParam
    } else {
      redirectTo = role === 'admin' || role === 'reviewer' ? '/admin' : '/dashboard'
    }
    return { redirectTo }
  } catch (err) {
    console.error('Login error:', err)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
