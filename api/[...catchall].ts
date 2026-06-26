import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me'

function parseBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body)
    let data = ''
    req.on('data', (chunk: string) => (data += chunk))
    req.on('end', () => {
      try {
        resolve(JSON.parse(data))
      } catch {
        resolve({})
      }
    })
  })
}

function parseCookies(req: any): Record<string, string> {
  const cookie = req.headers?.cookie
  if (!cookie) return {}
  return Object.fromEntries(
    cookie.split(';').map((c: string) => {
      const [k, ...v] = c.trim().split('=')
      return [k, v.join('=')]
    })
  )
}

function setCookies(
  res: any,
  cookies: { name: string; value: string; maxAge: number }[]
) {
  res.setHeader(
    'Set-Cookie',
    cookies.map(
      ({ name, value, maxAge }) =>
        `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
    )
  )
}

export default async function handler(req: any, res: any) {
  const origin = req.headers.origin || '*'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const path = (req.url || '').replace(/\/$/, '')
    const cookies = parseCookies(req)

    let body: any = {}
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      body = await parseBody(req)
    }

    if (path === '/api/health') {
      return res
        .status(200)
        .json({ status: 'ok', timestamp: new Date().toISOString() })
    }

    if (path === '/api/auth/register' && req.method === 'POST') {
      const { email, password, name } = body
      if (!email || !password || !name)
        return res
          .status(400)
          .json({ error: 'Email, password, and name are required' })
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing)
        return res.status(409).json({ error: 'Email already registered' })
      const passwordHash = await bcrypt.hash(password, 12)
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          roles: { create: { role: 'client' } },
        },
      })
      const role = 'client'
      const accessToken = jwt.sign({ userId: user.id, role }, ACCESS_SECRET, {
        expiresIn: '15m',
      })
      const refreshToken = jwt.sign(
        { userId: user.id, role },
        REFRESH_SECRET,
        { expiresIn: '7d' }
      )
      setCookies(res, [
        { name: 'access_token', value: accessToken, maxAge: 900 },
        { name: 'refresh_token', value: refreshToken, maxAge: 604800 },
      ])
      return res.status(201).json({
        user: { id: user.id, email: user.email, name: user.name, role },
      })
    }

    if (path === '/api/auth/login' && req.method === 'POST') {
      const { email, password } = body
      if (!email || !password)
        return res
          .status(400)
          .json({ error: 'Email and password are required' })
      const user = await prisma.user.findUnique({
        where: { email },
        include: { roles: true },
      })
      if (!user)
        return res.status(401).json({ error: 'Invalid email or password' })
      const valid = await bcrypt.compare(password, user.passwordHash)
      if (!valid)
        return res.status(401).json({ error: 'Invalid email or password' })
      const role = user.roles[0]?.role || 'client'
      const accessToken = jwt.sign({ userId: user.id, role }, ACCESS_SECRET, {
        expiresIn: '15m',
      })
      const refreshToken = jwt.sign(
        { userId: user.id, role },
        REFRESH_SECRET,
        { expiresIn: '7d' }
      )
      setCookies(res, [
        { name: 'access_token', value: accessToken, maxAge: 900 },
        { name: 'refresh_token', value: refreshToken, maxAge: 604800 },
      ])
      return res.status(200).json({
        user: { id: user.id, email: user.email, name: user.name, role },
      })
    }

    if (path === '/api/auth/me' && req.method === 'GET') {
      const token = cookies.access_token
      if (!token)
        return res.status(401).json({ error: 'Not authenticated' })
      try {
        const payload = jwt.verify(token, ACCESS_SECRET) as any
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          include: { roles: true },
        })
        if (!user)
          return res.status(401).json({ error: 'User not found' })
        return res.json({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.roles[0]?.role || 'client',
          },
        })
      } catch {
        return res.status(401).json({ error: 'Invalid token' })
      }
    }

    if (path === '/api/auth/logout' && req.method === 'POST') {
      setCookies(res, [
        { name: 'access_token', value: '', maxAge: 0 },
        { name: 'refresh_token', value: '', maxAge: 0 },
      ])
      return res.json({ ok: true })
    }

    if (path === '/api/admin/stats' && req.method === 'GET') {
      const token = cookies.access_token
      if (!token)
        return res.status(401).json({ error: 'Not authenticated' })
      try {
        const payload = jwt.verify(token, ACCESS_SECRET) as any
        if (payload.role !== 'admin' && payload.role !== 'reviewer')
          return res.status(404).json({ error: 'Not found' })
        const [users, quotations, projects, payments] = await Promise.all([
          prisma.user.count(),
          prisma.quotation.count(),
          prisma.project.count(),
          prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'success' },
          }),
        ])
        return res.json({
          users,
          quotations,
          projects,
          revenue: payments._sum.amount ?? 0,
        })
      } catch {
        return res.status(401).json({ error: 'Invalid token' })
      }
    }

    if (path === '/api/admin/users' && req.method === 'GET') {
      const token = cookies.access_token
      if (!token)
        return res.status(401).json({ error: 'Not authenticated' })
      try {
        const payload = jwt.verify(token, ACCESS_SECRET) as any
        if (payload.role !== 'admin' && payload.role !== 'reviewer')
          return res.status(404).json({ error: 'Not found' })
        const users = await prisma.user.findMany({
          include: { roles: true },
          orderBy: { createdAt: 'desc' },
          take: 50,
        })
        return res.json(
          users.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.roles[0]?.role || 'client',
            createdAt: u.createdAt,
          }))
        )
      } catch {
        return res.status(401).json({ error: 'Invalid token' })
      }
    }

    return res.status(404).json({ error: 'Not found' })
  } catch (err: any) {
    console.error('API Error:', err?.message || err)
    return res.status(500).json({ error: err?.message || 'Internal server error' })
  }
}
