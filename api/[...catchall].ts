import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default async function handler(req: any, res: any) {
  const origin = req.headers.origin || '*'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const path = (req.url || '').replace(/\/$/, '')

    if (path === '/api/health') {
      return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
    }

    if (path === '/api/auth/register' && req.method === 'POST') {
      const { email, password, name } = req.body
      if (!email || !password || !name) return res.status(400).json({ error: 'Email, password, and name are required' })
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) return res.status(409).json({ error: 'Email already registered' })
      const passwordHash = await bcrypt.hash(password, 12)
      const user = await prisma.user.create({
        data: { email, passwordHash, name, roles: { create: { role: 'client' } } }
      })
      return res.status(201).json({ user: { id: user.id, email: user.email, name: user.name } })
    }

    if (path === '/api/auth/login' && req.method === 'POST') {
      const { email, password } = req.body
      if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
      const user = await prisma.user.findUnique({ where: { email }, include: { roles: true } })
      if (!user) return res.status(401).json({ error: 'Invalid email or password' })
      const valid = await bcrypt.compare(password, user.passwordHash)
      if (!valid) return res.status(401).json({ error: 'Invalid email or password' })
      return res.status(200).json({ user: { id: user.id, email: user.email, name: user.name, role: user.roles[0].role } })
    }

    if (path === '/api/auth/me' && req.method === 'GET') {
      const token = req.cookies?.access_token
      if (!token) return res.status(401).json({ error: 'Not authenticated' })
      const jwt = require('jsonwebtoken')
      try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me')
        const user = await prisma.user.findUnique({ where: { id: payload.userId }, include: { roles: true } })
        if (!user) return res.status(401).json({ error: 'User not found' })
        return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.roles[0].role } })
      } catch { return res.status(401).json({ error: 'Invalid token' }) }
    }

    if (path === '/api/auth/logout' && req.method === 'POST') {
      res.setHeader('Set-Cookie', 'access_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
      return res.json({ ok: true })
    }

    if (path === '/api/admin/stats' && req.method === 'GET') {
      const token = req.cookies?.access_token
      if (!token) return res.status(401).json({ error: 'Not authenticated' })
      const jwt = require('jsonwebtoken')
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me')
      if (payload.role !== 'admin' && payload.role !== 'reviewer') return res.status(404).json({ error: 'Not found' })
      const [users, quotations, projects, payments] = await Promise.all([
        prisma.user.count(),
        prisma.quotation.count(),
        prisma.project.count(),
        prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'success' } })
      ])
      return res.json({ users, quotations, projects, revenue: payments._sum.amount ?? 0 })
    }

    if (path === '/api/admin/users' && req.method === 'GET') {
      const token = req.cookies?.access_token
      if (!token) return res.status(401).json({ error: 'Not authenticated' })
      const jwt = require('jsonwebtoken')
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me')
      if (payload.role !== 'admin' && payload.role !== 'reviewer') return res.status(404).json({ error: 'Not found' })
      const users = await prisma.user.findMany({ include: { roles: true }, orderBy: { createdAt: 'desc' }, take: 50 })
      return res.json(users.map((u: any) => ({ id: u.id, name: u.name, email: u.email, role: u.roles[0]?.role || 'client', createdAt: u.createdAt })))
    }

    return res.status(404).json({ error: 'Not found' })
  } catch (err: any) {
    console.error('API Error:', err?.message || err)
    return res.status(500).json({ error: err?.message || 'Internal server error' })
  }
}
