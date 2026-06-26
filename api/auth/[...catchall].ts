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

    return res.status(404).json({ error: 'Not found' })
  } catch (err: any) {
    console.error('API Error:', err?.message || err)
    return res.status(500).json({ error: err?.message || 'Internal server error' })
  }
}
