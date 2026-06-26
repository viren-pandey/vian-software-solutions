import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me'

function generateTokens(userId: string, email: string, role: string) {
  const accessToken = jwt.sign({ userId, email, role }, ACCESS_SECRET, { expiresIn: '15m' })
  const refreshToken = jwt.sign({ userId, email, role }, REFRESH_SECRET, { expiresIn: '7d' })
  return { accessToken, refreshToken }
}

function getAuthUser(req: express.Request) {
  const token = req.cookies?.access_token
  if (!token) return null
  try {
    return jwt.verify(token, ACCESS_SECRET) as { userId: string; email: string; role: string }
  } catch {
    return null
  }
}

function requireAdmin(req: express.Request, res: express.Response): boolean {
  const auth = getAuthUser(req)
  if (!auth || (auth.role !== 'admin' && auth.role !== 'reviewer')) {
    res.status(404).json({ error: 'Not found' })
    return false
  }
  return true
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body
    if (!email || !password || !name) return res.status(400).json({ error: 'Email, password, and name are required' })
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'Email already registered' })
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { email, passwordHash, name, roles: { create: { role: 'client' } } },
      include: { roles: true }
    })
    const tokens = generateTokens(user.id, user.email, user.roles[0].role)
    res.cookie('access_token', tokens.accessToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 15 * 60 * 1000 })
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, role: user.roles[0].role } })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
    const user = await prisma.user.findUnique({ where: { email }, include: { roles: true } })
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' })
    const tokens = generateTokens(user.id, user.email, user.roles[0].role)
    res.cookie('access_token', tokens.accessToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 15 * 60 * 1000 })
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.roles[0].role } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
  res.json({ ok: true })
})

app.get('/api/auth/me', async (req, res) => {
  const auth = getAuthUser(req)
  if (!auth) return res.status(401).json({ error: 'Not authenticated' })
  const user = await prisma.user.findUnique({ where: { id: auth.userId }, include: { roles: true } })
  if (!user) return res.status(401).json({ error: 'User not found' })
  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.roles[0].role } })
})

app.get('/api/admin/stats', async (req, res) => {
  if (!requireAdmin(req, res)) return
  try {
    const [users, quotations, projects, payments] = await Promise.all([
      prisma.user.count(),
      prisma.quotation.count(),
      prisma.project.count(),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'success' } })
    ])
    res.json({ users, quotations, projects, revenue: payments._sum.amount ?? 0 })
  } catch { res.json({ users: 0, quotations: 0, projects: 0, revenue: 0 }) }
})

app.get('/api/admin/users', async (req, res) => {
  if (!requireAdmin(req, res)) return
  try {
    const users = await prisma.user.findMany({ include: { roles: true }, orderBy: { createdAt: 'desc' }, take: 50 })
    res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.roles[0]?.role || 'client', createdAt: u.createdAt })))
  } catch { res.json([]) }
})

const PORT = process.env.PORT || 3001

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

export default app
