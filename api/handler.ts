// @ts-nocheck
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { products } from '../lib/products'
import { DEFAULT_SERVICES } from '../lib/default-services'
import { generateAndStoreInvoicePdf } from '../lib/invoice-pdf'
import {
  createOrder as paytmCreateOrder,
  createProductOrder as paytmCreateProductOrder,
  getTransactionStatus,
  generateSignature as paytmSign,
  verifySignature as paytmVerify,
  isConfigured as paytmConfigured,
  getMid,
  getEnv,
  getCallbackUrl,
  PaytmError,
} from '../lib/paytm'

const prisma = new PrismaClient()
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me'

// Validate Paytm configuration at startup
try {
  if (paytmConfigured()) {
    console.log('[Paytm] Configuration validated:', {
      env: getEnv(),
      mid: getMid().substring(0, 6) + '***',
      callbackUrl: getCallbackUrl()
    })
  } else {
    console.warn('[Paytm] WARNING: Payment gateway not configured - missing environment variables')
  }
} catch (err: any) {
  console.error('[Paytm] Configuration error:', err.message)
}

// Rate limiter (in-memory sliding window)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(key)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= max) return false
  entry.count++
  return true
}
// Periodic cleanup to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of rateLimitMap) {
    if (now > v.resetAt) rateLimitMap.delete(k)
  }
}, 60000)

// Allowed origins for CSRF check
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://www.viannn.online',
  'https://viannn.online',
]

// Paytm callback URLs
const CALLBACK_BASE = process.env.CALLBACK_URL || 'https://www.viannn.online'
const PAYTM_CALLBACK = process.env.PAYTM_CALLBACK_URL || (CALLBACK_BASE + '/api/payments/callback')
const PROD_CALLBACK = CALLBACK_BASE + '/api/products/callback'

function parseBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body)
    let data = ''
    req.on('data', (chunk: string) => (data += chunk))
    req.on('end', () => {
      try { resolve(JSON.parse(data)) } catch { resolve({}) }
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

function setCookies(res: any, cookies: { name: string; value: string; maxAge: number }[]) {
  const secure = process.env.NODE_ENV === 'production'
  res.setHeader(
    'Set-Cookie',
    cookies.map(({ name, value, maxAge }) =>
      `${name}=${value}; Path=/; HttpOnly;${secure ? ' Secure;' : ''} SameSite=Strict; Max-Age=${maxAge}`
    )
  )
}

async function getUserFromToken(cookies: any) {
  const token = cookies.access_token
  if (!token) return null
  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as any
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

function requireAuth(user: any, res: any) {
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' })
    return false
  }
  return true
}

function requireAdmin(user: any, res: any) {
  if (!user) {
    res.status(401).json({ error: 'Not authenticated' })
    return false
  }
  if (user.role !== 'admin' && user.role !== 'reviewer') {
    res.status(404).json({ error: 'Not found' })
    return false
  }
  return true
}

async function createNotification(userId: string, type: string, payload: any) {
  const notification = await prisma.notification.create({ data: { userId, type, payload } })
  const sseClients = sseConnections.get(userId)
  if (sseClients) {
    const data = JSON.stringify({ notification, type, payload })
    for (const res of sseClients) {
      try { res.write(`event: notification\ndata: ${data}\n\n`) } catch {}
    }
  }
}

const sseConnections = new Map<string, Set<any>>()

async function auditLog(actorId: string | undefined | null, action: string, entityType: string, entityId: string, previousState?: any, newState?: any) {
  try {
    await prisma.auditLog.create({
      data: { actorId, action, entityType, entityId, previousState, newState },
    })
  } catch {}
}

async function notifyAdmins(type: string, payload: any) {
  const admins = await prisma.user.findMany({
    where: { roles: { some: { role: { in: ['admin', 'reviewer'] } } } },
  })
  await Promise.all(admins.map((a) => createNotification(a.id, type, payload)))
}

export default async function handler(req: any, res: any) {
  const origin = req.headers.origin || '*'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const cookies = parseCookies(req)
    const path = (req.url || '').split('?')[0].replace(/\/$/, '')
    const user = await getUserFromToken(cookies)

    // CSRF protection for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const origin = req.headers.origin || ''
      const referer = req.headers.referer || ''
      const isSameOrigin = origin
        ? ALLOWED_ORIGINS.some((o) => origin.startsWith(o))
        : ALLOWED_ORIGINS.some((o) => referer.startsWith(o))
      if (!isSameOrigin && origin) {
        return res.status(403).json({ error: 'Cross-origin request rejected' })
      }
    }

    // Rate limiting on auth endpoints
    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
    if (path === '/api/auth/login' && req.method === 'POST') {
      if (!rateLimit(`login:${clientIp}`, 5, 60000)) {
        return res.status(429).json({ error: 'Too many login attempts. Try again later.' })
      }
    }
    if (path === '/api/auth/register' && req.method === 'POST') {
      if (!rateLimit(`register:${clientIp}`, 3, 60000)) {
        return res.status(429).json({ error: 'Too many registration attempts. Try again later.' })
      }
    }
    // Global mutation rate limit
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && user) {
      if (!rateLimit(`mutate:${user.id}`, 60, 60000)) {
        return res.status(429).json({ error: 'Too many requests. Try again later.' })
      }
    }

    let body: any = {}
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      body = await parseBody(req)
    }

    // Health
    if (path === '/api/health') {
      return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
    }

    // Auth routes
    if (path === '/api/auth/register' && req.method === 'POST') {
      const { email, password, name } = body
      if (!email || !password || !name) return res.status(400).json({ error: 'Email, password, and name are required' })
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) return res.status(409).json({ error: 'Email already registered' })
      const passwordHash = await bcrypt.hash(password, 12)
      const u = await prisma.user.create({
        data: { email, passwordHash, name, roles: { create: { role: 'client' } } },
      })
      const role = 'client'
      const accessToken = jwt.sign({ userId: u.id, role }, ACCESS_SECRET, { expiresIn: '15m' })
      const refreshToken = jwt.sign({ userId: u.id, role }, REFRESH_SECRET, { expiresIn: '7d' })
      setCookies(res, [
        { name: 'access_token', value: accessToken, maxAge: 900 },
        { name: 'refresh_token', value: refreshToken, maxAge: 604800 },
      ])
      return res.status(201).json({ user: { id: u.id, email: u.email, name: u.name, role } })
    }

    if (path === '/api/auth/login' && req.method === 'POST') {
      const { email, password } = body
      if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
      const u = await prisma.user.findUnique({ where: { email }, include: { roles: true } })
      if (!u) return res.status(401).json({ error: 'Invalid email or password' })
      const valid = await bcrypt.compare(password, u.passwordHash)
      if (!valid) return res.status(401).json({ error: 'Invalid email or password' })
      const role = u.roles[0]?.role || 'client'
      const accessToken = jwt.sign({ userId: u.id, role }, ACCESS_SECRET, { expiresIn: '15m' })
      const refreshToken = jwt.sign({ userId: u.id, role }, REFRESH_SECRET, { expiresIn: '7d' })
      setCookies(res, [
        { name: 'access_token', value: accessToken, maxAge: 900 },
        { name: 'refresh_token', value: refreshToken, maxAge: 604800 },
      ])
      return res.status(200).json({ user: { id: u.id, email: u.email, name: u.name, role } })
    }

    if (path === '/api/auth/me' && req.method === 'GET') {
      if (!user) return res.status(401).json({ error: 'Not authenticated' })
      return res.json({ user })
    }

    if (path === '/api/auth/update' && req.method === 'PUT') {
      if (!requireAuth(user, res)) return
      const { name: newName, email: newEmail, currentPassword, newPassword: newPass } = body
      const updates: any = {}
      if (newName) updates.name = newName
      if (newEmail) {
        const existing = await prisma.user.findUnique({ where: { email: newEmail } })
        if (existing && existing.id !== user.id) return res.status(409).json({ error: 'Email already in use' })
        updates.email = newEmail
      }
      if (newPass) {
        if (!currentPassword) return res.status(400).json({ error: 'Current password is required to set a new password' })
        if (newPass.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })
        const u = await prisma.user.findUnique({ where: { id: user.id } })
        if (!u) return res.status(404).json({ error: 'User not found' })
        const valid = await bcrypt.compare(currentPassword, u.passwordHash)
        if (!valid) return res.status(400).json({ error: 'Current password is incorrect' })
        updates.passwordHash = await bcrypt.hash(newPass, 12)
      }
      if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No fields to update' })
      await prisma.user.update({ where: { id: user.id }, data: updates })
      return res.json({ ok: true })
    }

    if (path === '/api/auth/logout' && (req.method === 'POST' || req.method === 'GET')) {
      setCookies(res, [
        { name: 'access_token', value: '', maxAge: 0 },
        { name: 'refresh_token', value: '', maxAge: 0 },
      ])
      if (req.method === 'GET') {
        res.writeHead(302, { Location: '/login' })
        return res.end()
      }
      return res.json({ ok: true })
    }

    if (path === '/api/auth/refresh' && req.method === 'POST') {
      const refreshToken = cookies.refresh_token
      if (!refreshToken) return res.status(401).json({ error: 'No refresh token' })
      try {
        const payload = jwt.verify(refreshToken, REFRESH_SECRET) as any
        const u = await prisma.user.findUnique({ where: { id: payload.userId }, include: { roles: true } })
        if (!u) return res.status(401).json({ error: 'User not found' })
        const role = u.roles[0]?.role || 'client'
        const newAccess = jwt.sign({ userId: u.id, role }, ACCESS_SECRET, { expiresIn: '15m' })
        const newRefresh = jwt.sign({ userId: u.id, role }, REFRESH_SECRET, { expiresIn: '7d' })
        setCookies(res, [
          { name: 'access_token', value: newAccess, maxAge: 900 },
          { name: 'refresh_token', value: newRefresh, maxAge: 604800 },
        ])
        return res.json({ user: { id: u.id, email: u.email, name: u.name, role } })
      } catch {
        return res.status(401).json({ error: 'Invalid refresh token' })
      }
    }

    // --- Client Quotations ---
    if (path === '/api/quotations' && req.method === 'GET') {
      if (!requireAuth(user, res)) return
      const quotations = await prisma.quotation.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: { service: true, items: true, invoice: true, project: true },
      })
      return res.json(quotations)
    }

    const quotationAcceptMatch = path.match(/^\/api\/quotations\/([^/]+)\/accept$/)
    if (quotationAcceptMatch && req.method === 'POST') {
      if (!requireAuth(user, res)) return
      const qId = quotationAcceptMatch[1]
      const q = await prisma.quotation.findFirst({ where: { id: qId, userId: user.id } })
      if (!q) return res.status(404).json({ error: 'Quotation not found' })
      if (q.status !== 'QUOTED') return res.status(400).json({ error: 'Quotation must be in QUOTED status to accept' })
      if (!q.quotedAmount) return res.status(400).json({ error: 'No quoted amount set' })
      const updated = await prisma.quotation.update({
        where: { id: qId },
        data: { status: 'ACCEPTED' },
      })
      const invoiceCount = await prisma.invoice.count()
      const invoice = await prisma.invoice.create({
        data: {
          quotationId: qId,
          userId: user.id,
          invoiceNumber: `INV-${String(invoiceCount + 1).padStart(4, '0')}`,
          amount: q.quotedAmount,
        },
      })
      const project = await prisma.project.create({
        data: {
          quotationId: qId,
          userId: user.id,
          status: 'active',
          startDate: new Date(),
          targetEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
      notifyAdmins('quotation_accepted', {
        quotationId: qId, title: q.title, userName: user.name,
        message: `Quotation "${q.title}" has been accepted by ${user.name}. Invoice ${invoice.invoiceNumber} and project have been created.`,
      }).catch(() => {})
      createNotification(user.id, 'quotation_accepted', {
        quotationId: qId, title: q.title, invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber, projectId: project.id,
        message: `You have accepted the quote for "${q.title}". Invoice ${invoice.invoiceNumber} and project timeline have been generated.`,
      }).catch(() => {})
      return res.json({ ...updated, invoice, project })
    }

    const quotationMatch = path.match(/^\/api\/quotations\/([^/]+)$/)
    if (quotationMatch && req.method === 'GET') {
      if (!requireAuth(user, res)) return
      const q = await prisma.quotation.findFirst({
        where: { id: quotationMatch[1], userId: user.id },
        include: { service: true, items: true, project: true, invoice: true },
      })
      if (!q) return res.status(404).json({ error: 'Quotation not found' })
      const messages = await prisma.message.findMany({
        where: { threadType: 'quotation', threadId: q.id },
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, name: true } } },
      })
      const attachments = await prisma.attachment.findMany({
        where: { ownerType: 'quotation', ownerId: q.id },
      })
      return res.json({ ...q, messages, attachments })
    }

    const quotationMsgMatch = path.match(/^\/api\/quotations\/([^/]+)\/messages$/)
    if (quotationMsgMatch && req.method === 'POST') {
      if (!requireAuth(user, res)) return
      const qId = quotationMsgMatch[1]
      const q = await prisma.quotation.findFirst({ where: { id: qId, userId: user.id } })
      if (!q) return res.status(404).json({ error: 'Quotation not found' })
      const { body: msgBody } = body
      if (!msgBody) return res.status(400).json({ error: 'Message body is required' })
      const message = await prisma.message.create({
        data: { threadType: 'quotation', threadId: qId, senderId: user.id, body: msgBody },
        include: { sender: { select: { id: true, name: true } } },
      })
      notifyAdmins('new_message', { quotationId: qId, title: q.title, userName: user.name, body: msgBody }).catch(() => {})
      return res.status(201).json(message)
    }

    if (path === '/api/quotations' && req.method === 'POST') {
      if (!requireAuth(user, res)) return
      const { serviceId, title, description, goals, budgetRange, timeline, preferredTechnologies, referenceLinks, notes, attachments } = body
      if (!serviceId || !title || !description) return res.status(400).json({ error: 'serviceId, title, and description are required' })
      const quotation = await prisma.quotation.create({
        data: {
          userId: user.id,
          serviceId,
          title,
          description,
          goals,
          budgetRange,
          timeline,
          preferredTechnologies: preferredTechnologies || [],
          referenceLinks: referenceLinks || [],
          notes,
        },
      })
      if (attachments && Array.isArray(attachments)) {
        const MAX_FILE_SIZE = 10 * 1024 * 1024
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        const valid = attachments.slice(0, 5).filter(
          (att) => att.size <= MAX_FILE_SIZE && (ALLOWED_TYPES.includes(att.type) || att.type.startsWith('image/'))
        )
        await Promise.all(valid.map((att) => {
          const dataUrl = `data:${att.type};base64,${att.data}`
          return prisma.attachment.create({
            data: {
              ownerType: 'quotation', ownerId: quotation.id, fileUrl: dataUrl,
              fileName: att.name || 'untitled', mimeType: att.type || 'application/octet-stream',
              sizeBytes: att.size || 0, uploadedBy: user.id,
            },
          })
        }))
      }
      notifyAdmins('new_quotation', { quotationId: quotation.id, title: quotation.title, userName: user.name, message: `New quotation "${quotation.title}" submitted by ${user.name}.` }).catch(() => {})
      createNotification(user.id, 'quotation_submitted', { quotationId: quotation.id, title: quotation.title, message: 'Your quotation request has been submitted successfully.' }).catch(() => {})
      return res.status(201).json(quotation)
    }

    // --- Client Projects ---
    if (path === '/api/projects' && req.method === 'GET') {
      if (!requireAuth(user, res)) return
      const projects = await prisma.project.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: { quotation: true },
      })
      return res.json(projects)
    }

    // --- Client Invoices ---
    if (path === '/api/invoices' && req.method === 'GET') {
      if (!requireAuth(user, res)) return
      const invoices = await prisma.invoice.findMany({
        where: { userId: user.id },
        orderBy: { issuedAt: 'desc' },
        include: { quotation: true, payments: true },
      })
      return res.json(invoices)
    }

    // --- Client Invoice Detail ---
    const invoiceDetailMatch = path.match(/^\/api\/invoices\/([^/]+)$/)
    if (invoiceDetailMatch && req.method === 'GET') {
      if (!requireAuth(user, res)) return
      const inv = await prisma.invoice.findFirst({
        where: { id: invoiceDetailMatch[1], userId: user.id },
        include: { quotation: true, payments: true },
      })
      if (!inv) return res.status(404).json({ error: 'Invoice not found' })
      return res.json(inv)
    }

    // --- Client Invoice PDF ---
    const invoicePdfMatch = path.match(/^\/api\/invoices\/([^/]+)\/pdf$/)
    if (invoicePdfMatch && req.method === 'GET') {
      if (!requireAuth(user, res)) return
      const inv = await prisma.invoice.findFirst({
        where: { id: invoicePdfMatch[1], userId: user.id },
        include: { quotation: true, payments: true },
      })
      if (!inv) return res.status(404).json({ error: 'Invoice not found' })

      const PDFDocument = require('pdfkit')
      const doc = new PDFDocument({ margin: 50, size: 'A4' })
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${inv.invoiceNumber}.pdf"`)
      doc.pipe(res)

      doc.fontSize(20).font('Helvetica-Bold').text('INVOICE', { align: 'center' })
      doc.moveDown(0.5)
      doc.fontSize(10).font('Helvetica').fillColor('#666').text('VIAN SOFTWARE SOLUTIONS', { align: 'center' })
      doc.text('(Sole Proprietorship of Viren Pandey)', { align: 'center', fontSize: 8 })
      doc.moveDown(1.5)

      doc.fillColor('#000').fontSize(11)
      doc.text(`Invoice #: ${inv.invoiceNumber}`)
      doc.text(`Date: ${new Date(inv.issuedAt).toLocaleDateString('en-IN')}`)
      doc.text(`Status: ${inv.status.toUpperCase()}`)
      doc.moveDown(1)

      if (inv.quotation) {
        doc.text(`Project: ${inv.quotation.title}`)
        doc.moveDown(0.5)
      } else if (inv.description) {
        doc.text(`Description: ${inv.description}`)
        doc.moveDown(0.5)
      }

      doc.moveDown(0.5)
      doc.font('Helvetica-Bold').fontSize(12)
      doc.text('Amount Due')
      doc.font('Helvetica').fontSize(24).fillColor('#059669')
      doc.text(`\u20B9${Number(inv.amount).toLocaleString('en-IN')}`)
      doc.fillColor('#000').fontSize(10)

      doc.moveDown(3)
      doc.fontSize(8).fillColor('#999')
      doc.text('Vian Software Solutions', { align: 'center' })
      doc.text('Sole Proprietorship of Viren Pandey', { align: 'center', fontSize: 7 })
      doc.text('Payment is due within 15 days of invoice date.', { align: 'center' })

      doc.end()
      return
    }

    // --- Client Payments ---
    if (path === '/api/payments' && req.method === 'GET') {
      if (!requireAuth(user, res)) return
      const payments = await prisma.payment.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: { invoice: { include: { quotation: true } } },
      })
      return res.json(payments)
    }

    // --- Client Payment Initiate (click tracking) ---
    if (path === '/api/payments/initiate' && req.method === 'POST') {
      if (!requireAuth(user, res)) return
      const { invoiceId } = body
      if (!invoiceId) return res.status(400).json({ error: 'invoiceId is required' })
      const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } })
      if (!invoice) return res.status(404).json({ error: 'Invoice not found' })
      if (invoice.userId !== user.id) return res.status(403).json({ error: 'Forbidden' })
      await prisma.paymentLog.create({
        data: {
          logType: 'initiation',
          rawPayload: { invoiceId, userId: user.id, timestamp: new Date().toISOString() },
        },
      })
      return res.json({ ok: true })
    }

    // --- Client Support Tickets ---
    if (path === '/api/support/tickets' && req.method === 'GET') {
      if (!requireAuth(user, res)) return
      const tickets = await prisma.supportTicket.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      })
      return res.json(tickets)
    }

    if (path === '/api/support/tickets' && req.method === 'POST') {
      if (!requireAuth(user, res)) return
      const { subject } = body
      if (!subject) return res.status(400).json({ error: 'Subject is required' })
      const ticket = await prisma.supportTicket.create({
        data: { userId: user.id, subject },
      })
      return res.status(201).json(ticket)
    }

    // --- Admin Stats ---
    if (path === '/api/admin/stats' && req.method === 'GET') {
      if (!requireAdmin(user, res)) return
      const [users, quotations, projects, payments, blogPosts] = await Promise.all([
        prisma.user.count(),
        prisma.quotation.count(),
        prisma.project.count(),
        prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'success' } }),
        prisma.blogPost.count(),
      ])
      const publishedPosts = await prisma.blogPost.count({ where: { published: true } })
      return res.json({ users, quotations, projects, revenue: payments._sum.amount ?? 0, blogPosts, publishedPosts })
    }

    // --- Admin Users ---
    if (path === '/api/admin/users' && req.method === 'GET') {
      if (!requireAdmin(user, res)) return
      const users = await prisma.user.findMany({
        include: { roles: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      })
      return res.json(users.map((u: any) => ({
        id: u.id, name: u.name, email: u.email,
        role: u.roles[0]?.role || 'client', createdAt: u.createdAt,
      })))
    }

    // --- Admin Quotations ---
    if (path === '/api/admin/quotations' && req.method === 'GET') {
      if (!requireAdmin(user, res)) return
      const quotations = await prisma.quotation.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } }, service: true, items: true },
      })
      return res.json(quotations)
    }

    const adminQuotationMatch = path.match(/^\/api\/admin\/quotations\/([^/]+)$/)
    if (adminQuotationMatch && req.method === 'GET') {
      if (!requireAdmin(user, res)) return
      const q = await prisma.quotation.findUnique({
        where: { id: adminQuotationMatch[1] },
        include: {
          user: { select: { id: true, name: true, email: true } },
          service: true,
          items: true,
          project: true,
          invoice: true,
        },
      })
      if (!q) return res.status(404).json({ error: 'Quotation not found' })
      const messages = await prisma.message.findMany({
        where: { threadType: 'quotation', threadId: q.id },
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, name: true } } },
      })
      const attachments = await prisma.attachment.findMany({
        where: { ownerType: 'quotation', ownerId: q.id },
      })
      return res.json({ ...q, messages, attachments })
    }

    const adminQuotationMsgMatch = path.match(/^\/api\/admin\/quotations\/([^/]+)\/messages$/)
    if (adminQuotationMsgMatch && req.method === 'POST') {
      if (!requireAdmin(user, res)) return
      const qId = adminQuotationMsgMatch[1]
      const q = await prisma.quotation.findUnique({ where: { id: qId } })
      if (!q) return res.status(404).json({ error: 'Quotation not found' })
      const { body: msgBody } = body
      if (!msgBody) return res.status(400).json({ error: 'Message body is required' })
      const message = await prisma.message.create({
        data: { threadType: 'quotation', threadId: qId, senderId: user.id, body: msgBody },
        include: { sender: { select: { id: true, name: true } } },
      })
      await createNotification(q.userId, 'new_message', {
        quotationId: qId, title: q.title, senderName: user.name, body: msgBody,
        message: `New message from ${user.name} regarding "${q.title}".`,
      })
      return res.status(201).json(message)
    }

    const adminQuotationPutMatch = path.match(/^\/api\/admin\/quotations\/([^/]+)$/)
    if (adminQuotationPutMatch && req.method === 'PUT') {
      if (!requireAdmin(user, res)) return
      const id = adminQuotationPutMatch[1]
      const { status, quotedAmount, quoteValidityDays, notes } = body
      const validStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'QUOTED', 'REVISION_REQUESTED', 'ACCEPTED', 'PAYMENT_REQUESTED', 'INVOICED', 'PAID', 'REJECTED', 'CANCELLED']
      if (status && !validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' })
      const updateData: any = {}
      if (status) updateData.status = status
      if (quotedAmount !== undefined) updateData.quotedAmount = quotedAmount
      if (quoteValidityDays !== undefined) updateData.quoteValidityDays = quoteValidityDays
      if (notes !== undefined) updateData.notes = notes
      const quotation = await prisma.quotation.update({ where: { id }, data: updateData })
      await auditLog(user.id, `status:${status || 'updated'}`, 'quotation', id, { status: body.status }, { ...updateData })
      await createNotification(quotation.userId, 'quotation_updated', {
        quotationId: id, title: quotation.title, status: status || quotation.status,
        message: `Your quotation "${quotation.title}" has been updated to ${(status || quotation.status).replace(/_/g, ' ')}.`,
      })
      // If accepted or payment requested, create invoice + project
      if (status === 'ACCEPTED' || status === 'PAYMENT_REQUESTED') {
        const q = await prisma.quotation.findUnique({ where: { id }, include: { invoice: true, project: true } })
        if (q && !q.invoice) {
          if (!q.quotedAmount) {
            return res.status(400).json({ error: 'Quoted amount must be set before requesting payment' })
          }
          const invoiceCount = await prisma.invoice.count()
          const invoice = await prisma.invoice.create({
            data: {
              quotationId: id,
              userId: q.userId,
              invoiceNumber: `INV-${String(invoiceCount + 1).padStart(4, '0')}`,
              amount: q.quotedAmount,
            },
          })
          await createNotification(q.userId, 'invoice_created', {
            invoiceId: invoice.id, quotationId: id, title: q.title, invoiceNumber: invoice.invoiceNumber,
            message: `Invoice ${invoice.invoiceNumber} has been generated for "${q.title}".`,
          })
        }
        if (q && !q.project) {
          await prisma.project.create({
            data: { quotationId: id, userId: q.userId, status: 'active' },
          })
        }
      }
      return res.json(quotation)
    }

    // --- Admin Projects ---
    if (path === '/api/admin/projects' && req.method === 'GET') {
      if (!requireAdmin(user, res)) return
      const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } }, quotation: { select: { title: true } } },
      })
      return res.json(projects)
    }

    if (path.startsWith('/api/admin/projects/') && req.method === 'PUT') {
      if (!requireAdmin(user, res)) return
      const id = path.replace('/api/admin/projects/', '')
      const { status, internalNotes } = body
      const validStatuses = ['active', 'paused', 'completed', 'cancelled']
      if (status && !validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' })
      const updateData: any = {}
      if (status) updateData.status = status
      if (internalNotes !== undefined) updateData.internalNotes = internalNotes
      const project = await prisma.project.update({ where: { id }, data: updateData })
      await auditLog(user.id, `status:${status || 'updated'}`, 'project', id, {}, updateData)
      return res.json(project)
    }

    // --- Admin: Re-seed admin user (for production env) ---
    if (path === '/api/admin/seed-admin' && req.method === 'POST') {
      if (!requireAdmin(user, res)) return
      const email = process.env.ADMIN_EMAIL || 'pandeyviren68@gmail.com'
      const password = process.env.ADMIN_PASSWORD || 'pandeyviren688'
      const name = process.env.ADMIN_NAME || 'Admin'
      const passwordHash = await bcrypt.hash(password, 12)
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        await prisma.user.update({ where: { email }, data: { passwordHash, name } })
        return res.json({ message: 'Admin user updated' })
      }
      await prisma.user.create({
        data: { email, passwordHash, name, emailVerifiedAt: new Date(), roles: { create: { role: 'admin' } } },
      })
      return res.json({ message: 'Admin user created' })
    }

    // --- Admin Payments ---
    if (path === '/api/admin/payments' && req.method === 'GET') {
      if (!requireAdmin(user, res)) return
      const payments = await prisma.payment.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } }, invoice: { include: { quotation: true } } },
      })
      return res.json(payments)
    }

    // --- Admin Chats ---
    if (path === '/api/admin/chats' && req.method === 'GET') {
      if (!requireAdmin(user, res)) return
      const quotations = await prisma.quotation.findMany({
        orderBy: { updatedAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
      })
      const chats = quotations.map(q => ({
        quotationId: q.id,
        title: q.title,
        status: q.status,
        user: q.user,
        lastMessage: q.messages[0] || null,
        updatedAt: q.updatedAt,
      }))
      return res.json(chats)
    }

    // --- Admin Start Direct Chat ---
    if (path === '/api/admin/chats/start' && req.method === 'POST') {
      if (!requireAdmin(user, res)) return
      const { userId: targetUserId, title } = body
      if (!targetUserId || !title) return res.status(400).json({ error: 'userId and title are required' })
      const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } })
      if (!targetUser) return res.status(404).json({ error: 'User not found' })
      let service = await prisma.service.findFirst({ where: { active: true }, orderBy: { name: 'asc' } })
      if (!service) {
        for (const svc of DEFAULT_SERVICES) {
          await prisma.service.upsert({
            where: { slug: svc.slug },
            update: { name: svc.name, description: svc.description, category: svc.category, active: true },
            create: { ...svc, active: true },
          })
        }
        service = await prisma.service.findFirst({ where: { active: true }, orderBy: { name: 'asc' } })
        if (!service) return res.status(500).json({ error: 'No active service found' })
      }
      const quotation = await prisma.quotation.create({
        data: {
          userId: targetUserId,
          serviceId: service.id,
          title,
          description: `Direct chat started by admin ${user.name}`,
          status: 'SUBMITTED',
        },
      })
      await auditLog(user.id, 'chat:start', 'quotation', quotation.id, null, { title, targetUserId })
      return res.status(201).json(quotation)
    }

    // --- Notifications ---
    if (path === '/api/notifications/stream' && req.method === 'GET') {
      const user = await getUserFromToken(req.cookies || {})
      if (!user) return res.status(401).json({ error: 'Not authenticated' })

      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      res.setHeader('X-Accel-Buffering', 'no')
      res.flushHeaders()

      res.write(`event: connected\ndata: {}\n\n`)

      if (!sseConnections.has(user.id)) sseConnections.set(user.id, new Set())
      sseConnections.get(user.id)!.add(res)

      const keepAlive = setInterval(() => {
        try { res.write(`:keepalive\n\n`) } catch { clearInterval(keepAlive) }
      }, 30000)

      req.on('close', () => {
        clearInterval(keepAlive)
        const clients = sseConnections.get(user.id)
        if (clients) {
          clients.delete(res)
          if (clients.size === 0) sseConnections.delete(user.id)
        }
      })
      return
    }

    if (path === '/api/notifications' && req.method === 'GET') {
      if (!requireAuth(user, res)) return
      const notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      })
      const unread = await prisma.notification.count({ where: { userId: user.id, readAt: null } })
      return res.json({ notifications, unread })
    }

    if (path === '/api/notifications/read' && req.method === 'POST') {
      if (!requireAuth(user, res)) return
      const { ids } = body
      if (ids && Array.isArray(ids)) {
        await prisma.notification.updateMany({
          where: { id: { in: ids }, userId: user.id },
          data: { readAt: new Date() },
        })
      } else {
        await prisma.notification.updateMany({
          where: { userId: user.id, readAt: null },
          data: { readAt: new Date() },
        })
      }
      return res.json({ ok: true })
    }

    // --- Services (public) ---
    if (path === '/api/services' && req.method === 'GET') {
      let services = await prisma.service.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
      if (services.length === 0) {
        for (const svc of DEFAULT_SERVICES) {
          await prisma.service.upsert({
            where: { slug: svc.slug },
            update: { name: svc.name, description: svc.description, category: svc.category, active: true },
            create: { ...svc, active: true },
          })
        }
        services = await prisma.service.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
      }
      return res.json(services)
    }

    // --- Paytm: Create Order ---
    if (path === '/api/payments/create-order' && req.method === 'POST') {
      if (!requireAuth(user, res)) return
      const { invoiceId } = body
      if (!invoiceId) return res.status(400).json({ error: 'invoiceId is required' })
      const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } })
      if (!invoice) return res.status(404).json({ error: 'Invoice not found' })
      if (invoice.userId !== user.id) return res.status(403).json({ error: 'Forbidden' })
      if (invoice.status === 'paid') return res.status(400).json({ error: 'Invoice already paid' })
      if (!paytmConfigured()) return res.status(500).json({ error: 'Payment gateway not configured' })

      const result = await paytmCreateOrder({
        amount: invoice.amount,
        custId: user.id,
        callbackUrl: PAYTM_CALLBACK,
      })

      await prisma.paymentLog.create({
        data: {
          logType: 'initiate_request',
          rawPayload: { ...result.paytmResponse, invoiceId, orderId: result.orderId },
        },
      })

      await prisma.payment.create({
        data: {
          invoiceId,
          userId: user.id,
          paytmTransactionId: result.orderId,
          amount: invoice.amount,
          status: 'pending',
          initiatedAt: new Date(),
        },
      })

      return res.json({
        orderId: result.orderId,
        txnToken: result.txnToken,
        amount: result.amount,
        mid: result.mid,
        env: result.env,
      })
    }

    // --- Paytm: Callback (public, no auth) ---
    if (path === '/api/payments/callback' && req.method === 'POST') {
      const { body: cbBody, head } = body
      if (!cbBody || !head?.signature) {
        await prisma.paymentLog.create({
          data: { logType: 'callback_invalid', rawPayload: { error: 'Missing body or signature' } },
        })
        return res.status(400).json({ error: 'Invalid callback payload' })
      }

      const sigValid = await paytmVerify(cbBody, head.signature).catch(() => false)
      if (!sigValid) {
        await prisma.paymentLog.create({
          data: { logType: 'callback_signature_failed', rawPayload: cbBody, signatureValid: false },
        })
        return res.status(400).json({ error: 'Invalid signature' })
      }

      const { orderId, status: txnStatus, txnId } = cbBody
      const payment = await prisma.payment.findUnique({ where: { paytmTransactionId: orderId } })
      if (!payment) {
        await prisma.paymentLog.create({
          data: { logType: 'callback_order_not_found', rawPayload: cbBody, signatureValid: true },
        })
        return res.status(404).json({ error: 'Payment not found' })
      }

      await prisma.paymentLog.create({
        data: { paymentId: payment.id, logType: 'callback_received', rawPayload: cbBody, signatureValid: true },
      })

      if (payment.status === 'success') return res.json({ ok: true })

      // Verify with Paytm Transaction Status API
      let verified = false
      let verifiedTxnId = txnId
      let verifiedStatus = txnStatus
      try {
        const txnStatusResult = await getTransactionStatus({ orderId })
        verified = true
        verifiedStatus = txnStatusResult.status
        verifiedTxnId = txnStatusResult.txnId || txnId

        await prisma.paymentLog.create({
          data: {
            paymentId: payment.id,
            logType: 'status_verification',
            rawPayload: { ...txnStatusResult.rawResponse, verifiedStatus, verifiedTxnId },
            signatureValid: true,
          },
        })
      } catch (err: any) {
        await prisma.paymentLog.create({
          data: {
            paymentId: payment.id,
            logType: 'status_verification_failed',
            rawPayload: { error: err?.message || 'Verification failed', orderId },
            signatureValid: true,
          },
        })
      }

      if (verifiedStatus === 'TXN_SUCCESS') {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: 'success' } })
        await prisma.invoice.update({ where: { id: payment.invoiceId }, data: { status: 'paid' } })

        const invoice = await prisma.invoice.findUnique({ where: { id: payment.invoiceId } })
        if (invoice && invoice.quotationId) {
          await prisma.quotation.update({ where: { id: invoice.quotationId }, data: { status: 'PAID' } })
        }

        await prisma.paymentLog.create({
          data: { paymentId: payment.id, logType: 'payment_marked_success', rawPayload: { txnId: verifiedTxnId }, signatureValid: true },
        })

        await createNotification(payment.userId, 'payment_success', {
          paymentId: payment.id, invoiceId: payment.invoiceId,
          message: `Your payment of ₹${Number(payment.amount).toLocaleString()} has been confirmed. Invoice ${invoice?.invoiceNumber || ''} is now paid.`,
        })

        await notifyAdmins('payment_completed', {
          paymentId: payment.id, invoiceId: payment.invoiceId, amount: payment.amount,
          message: `Payment of ₹${Number(payment.amount).toLocaleString()} completed by ${payment.userId}.`,
        })

        if (invoice) {
          await import('@/lib/invoice-pdf').then(m => m.generateAndStoreInvoicePdf(invoice.id)).catch(() => {})
        }
      } else if (verifiedStatus === 'TXN_FAILURE') {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: 'failed' } })
        await prisma.paymentLog.create({
          data: { paymentId: payment.id, logType: 'payment_marked_failed', rawPayload: { txnStatus: verifiedStatus }, signatureValid: true },
        })
        await createNotification(payment.userId, 'payment_failed', {
          paymentId: payment.id, invoiceId: payment.invoiceId,
          message: `Your payment of ₹${Number(payment.amount).toLocaleString()} has failed. Please try again.`,
        })
      }

      return res.json({ ok: true })
    }

    // --- Admin: Verify Payment ---
    const adminPaymentVerifyMatch = path.match(/^\/api\/admin\/payments\/([^/]+)\/verify$/)
    if (adminPaymentVerifyMatch && req.method === 'POST') {
      if (!requireAdmin(user, res)) return
      const paymentId = adminPaymentVerifyMatch[1]
      const { action } = body
      if (!action || !['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'Invalid action. Use "approve" or "reject".' })
      const payment = await prisma.payment.findUnique({ where: { id: paymentId } })
      if (!payment) return res.status(404).json({ error: 'Payment not found' })
      if (payment.status !== 'pending') return res.status(400).json({ error: 'Payment is not in pending state' })
      if (action === 'approve') {
        await prisma.payment.update({ where: { id: paymentId }, data: { status: 'success' } })
        await prisma.invoice.update({ where: { id: payment.invoiceId }, data: { status: 'paid' } })
        await auditLog(user.id, 'payment:approve', 'payment', paymentId, { status: 'pending' }, { status: 'success' })
        const invoice = await prisma.invoice.findUnique({ where: { id: payment.invoiceId } })
        if (invoice) {
          if (invoice.quotationId) {
            await prisma.quotation.update({ where: { id: invoice.quotationId }, data: { status: 'PAID' } })
          }
          await createNotification(payment.userId, 'payment_verified', {
            paymentId, invoiceId: payment.invoiceId,
            message: `Your payment of ₹${Number(payment.amount).toLocaleString()} has been verified and confirmed.`,
          })
        }
      } else {
        await prisma.payment.update({ where: { id: paymentId }, data: { status: 'failed' } })
        await auditLog(user.id, 'payment:reject', 'payment', paymentId, { status: 'pending' }, { status: 'failed', reason: body.rejectReason })
        await createNotification(payment.userId, 'payment_rejected', {
          paymentId, invoiceId: payment.invoiceId,
          message: `Your payment of ₹${Number(payment.amount).toLocaleString()} could not be verified. Please contact support.`,
        })
      }
      return res.json({ ok: true })
    }

    // --- Admin: Create Invoice Directly ---
    if (path === '/api/admin/invoices' && req.method === 'POST') {
      if (!requireAdmin(user, res)) return
      const { userId: targetUserId, amount, description } = body
      if (!targetUserId || amount === undefined) {
        return res.status(400).json({ error: 'userId and amount are required' })
      }
      const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } })
      if (!targetUser) return res.status(404).json({ error: 'User not found' })
      const invoiceCount = await prisma.invoice.count()
      const invoice = await prisma.invoice.create({
        data: {
          userId: targetUserId,
          invoiceNumber: `INV-${String(invoiceCount + 1).padStart(4, '0')}`,
          amount,
          description: description || null,
        },
      })
      await createNotification(targetUserId, 'invoice_created', {
        invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber, amount: Number(amount),
        message: `Invoice ${invoice.invoiceNumber} for ₹${Number(amount).toLocaleString()} has been created for you.`,
      })
      await auditLog(user.id, 'invoice:create', 'invoice', invoice.id, null, { userId: targetUserId, amount, description })
      return res.status(201).json(invoice)
    }

    // --- Admin Payment Requests ---
    if (path === '/api/admin/payment-requests' && req.method === 'GET') {
      if (!requireAdmin(user, res)) return
      const requests = await prisma.paymentRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      })
      return res.json(requests)
    }

    if (path === '/api/admin/payment-requests' && req.method === 'POST') {
      if (!requireAdmin(user, res)) return
      const { userId: targetUserId, amount, description } = body
      if (!targetUserId || amount === undefined || !description) {
        return res.status(400).json({ error: 'userId, amount, and description are required' })
      }
      const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } })
      if (!targetUser) return res.status(404).json({ error: 'User not found' })
      const request = await prisma.paymentRequest.create({
        data: { userId: targetUserId, amount, description, status: 'pending' },
        include: { user: { select: { id: true, name: true, email: true } } },
      })
      notifyAdmins('payment_request_created', {
        requestId: request.id, userId: targetUserId, amount: Number(amount), description,
        message: `Payment request of ₹${Number(amount).toLocaleString()} created for ${targetUser.name}.`,
      }).catch(() => {})
      createNotification(targetUserId, 'payment_request', {
        requestId: request.id, amount: Number(amount), description,
        message: `A payment request of ₹${Number(amount).toLocaleString()} has been created for you.`,
      }).catch(() => {})
      auditLog(user.id, 'payment_request:create', 'payment_request', request.id, null, { userId: targetUserId, amount, description }).catch(() => {})
      return res.status(201).json(request)
    }

    const paymentRequestCancelMatch = path.match(/^\/api\/admin\/payment-requests\/([^/]+)\/cancel$/)
    if (paymentRequestCancelMatch && req.method === 'POST') {
      if (!requireAdmin(user, res)) return
      const id = paymentRequestCancelMatch[1]
      const existing = await prisma.paymentRequest.findUnique({ where: { id } })
      if (!existing) return res.status(404).json({ error: 'Payment request not found' })
      const updated = await prisma.paymentRequest.update({
        where: { id },
        data: { status: 'cancelled' },
        include: { user: { select: { id: true, name: true, email: true } } },
      })
      await auditLog(user.id, 'payment_request:cancel', 'payment_request', id, { status: existing.status }, { status: 'cancelled' })
      return res.json(updated)
    }

    // --- Admin Payment Logs ---
    if (path === '/api/admin/payment-logs' && req.method === 'GET') {
      if (!requireAdmin(user, res)) return
      const logs = await prisma.paymentLog.findMany({
        orderBy: { receivedAt: 'desc' },
        take: 200,
        include: { payment: { include: { user: { select: { id: true, name: true, email: true } } } } },
      })
      return res.json(logs)
    }

    // --- Admin Support Tickets ---
    if (path === '/api/admin/support/tickets' && req.method === 'GET') {
      if (!requireAdmin(user, res)) return
      const tickets = await prisma.supportTicket.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      })
      return res.json(tickets)
    }

    const adminTicketUpdateMatch = path.match(/^\/api\/admin\/support\/tickets\/([^/]+)$/)
    if (adminTicketUpdateMatch && req.method === 'PUT') {
      if (!requireAdmin(user, res)) return
      const id = adminTicketUpdateMatch[1]
      const { status } = body
      if (!status || !['open', 'pending', 'resolved', 'closed'].includes(status)) {
        return res.status(400).json({ error: 'Valid status is required (open, pending, resolved, closed)' })
      }
      const ticket = await prisma.supportTicket.update({
        where: { id },
        data: { status },
        include: { user: { select: { id: true, name: true, email: true } } },
      })
      await createNotification(ticket.userId, 'ticket_updated', {
        ticketId: id, subject: ticket.subject, status,
        message: `Your support ticket "${ticket.subject}" has been updated to ${status}.`,
      })
      return res.json(ticket)
    }

    // --- Admin Audit Log ---
    if (path === '/api/admin/audit-log' && req.method === 'GET') {
      if (!requireAdmin(user, res)) return
      const limit = Math.min(parseInt(req.query?.limit as string) || 100, 500)
      const offset = parseInt(req.query?.offset as string) || 0
      const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: { actor: { select: { id: true, name: true, email: true } } },
      })
      const total = await prisma.auditLog.count()
      return res.json({ logs, total })
    }

    // --- Public Blog Routes ---
    if (path === '/api/blogs' && req.method === 'GET') {
      const limit = Math.min(parseInt(req.query?.limit as string) || 20, 50)
      const offset = parseInt(req.query?.offset as string) || 0
      const posts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
        take: limit, skip: offset,
        select: { id: true, title: true, slug: true, excerpt: true, category: true, tags: true, publishedAt: true },
      })
      const total = await prisma.blogPost.count({ where: { published: true } })
      return res.json({ posts, total })
    }

    const blogSlugMatch = path.match(/^\/api\/blogs\/([^/]+)$/)
    if (blogSlugMatch && req.method === 'GET') {
      const post = await prisma.blogPost.findUnique({
        where: { slug: blogSlugMatch[1], published: true },
        include: { author: { select: { id: true, name: true } } },
      })
      if (!post) return res.status(404).json({ error: 'Blog post not found' })
      return res.json(post)
    }

    // --- Admin Blog Routes ---
    if (path === '/api/admin/blogs' && req.method === 'GET') {
      if (!requireAdmin(user, res)) return
      const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
      return res.json(posts)
    }

    if (path === '/api/admin/blogs' && req.method === 'POST') {
      if (!requireAdmin(user, res)) return
      const { title, slug, excerpt, content, category, tags, published } = body
      if (!title || !slug) return res.status(400).json({ error: 'Title and slug are required' })
      const existing = await prisma.blogPost.findUnique({ where: { slug } })
      if (existing) return res.status(409).json({ error: 'A post with this slug already exists' })
      const post = await prisma.blogPost.create({
        data: {
          title, slug, excerpt, content, category,
          tags: tags || [],
          published: published || false,
          authorId: user.id,
          publishedAt: published ? new Date() : null,
        },
      })
      await auditLog(user.id, 'blog:create', 'blog_post', post.id, null, { title, slug })
      return res.status(201).json(post)
    }

    const blogIdMatch = path.match(/^\/api\/admin\/blogs\/([^/]+)$/)
    if (blogIdMatch) {
      const blogId = blogIdMatch[1]
      if (!requireAdmin(user, res)) return

      if (req.method === 'GET') {
        const post = await prisma.blogPost.findUnique({ where: { id: blogId } })
        if (!post) return res.status(404).json({ error: 'Blog post not found' })
        return res.json(post)
      }

      if (req.method === 'PUT') {
        const { title, slug, excerpt, content, category, tags, published } = body
        const existing = await prisma.blogPost.findUnique({ where: { id: blogId } })
        if (!existing) return res.status(404).json({ error: 'Blog post not found' })
        if (slug && slug !== existing.slug) {
          const slugConflict = await prisma.blogPost.findUnique({ where: { slug } })
          if (slugConflict) return res.status(409).json({ error: 'A post with this slug already exists' })
        }
        const prev = { title: existing.title, slug: existing.slug, published: existing.published }
        const post = await prisma.blogPost.update({
          where: { id: blogId },
          data: {
            title: title ?? existing.title,
            slug: slug ?? existing.slug,
            excerpt: excerpt ?? existing.excerpt,
            content: content ?? existing.content,
            category: category ?? existing.category,
            tags: tags ?? existing.tags,
            published: published ?? existing.published,
            publishedAt: published && !existing.publishedAt ? new Date() : existing.publishedAt,
          },
        })
        await auditLog(user.id, 'blog:update', 'blog_post', blogId, prev, { title: post.title, slug: post.slug, published: post.published })
        return res.json(post)
      }

      if (req.method === 'DELETE') {
        const existing = await prisma.blogPost.findUnique({ where: { id: blogId } })
        if (!existing) return res.status(404).json({ error: 'Blog post not found' })
        await prisma.blogPost.delete({ where: { id: blogId } })
        await auditLog(user.id, 'blog:delete', 'blog_post', blogId, { title: existing.title }, null)
        return res.json({ ok: true })
      }
    }

    // --- Products: Create Order (public, no auth) ---
    if (path === '/api/products/create-order' && req.method === 'POST') {
      const { productId, customerName, customerEmail, customerPhone } = body
      if (!productId || !customerName || !customerEmail) {
        return res.status(400).json({ error: 'productId, customerName, and customerEmail are required' })
      }
      const product = products.find((p: any) => p.id === productId)
      if (!product) return res.status(404).json({ error: 'Product not found' })
      if (!paytmConfigured()) return res.status(500).json({ error: 'Payment gateway not configured' })
      if (!rateLimit(`create-order:${customerEmail}`, 5, 60000)) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' })
      }

      const result = await paytmCreateProductOrder({
        amount: product.price,
        custId: customerEmail,
        callbackUrl: PROD_CALLBACK,
        productId,
      })

      const purchase = await prisma.productPurchase.create({
        data: {
          productId,
          productName: product.name,
          customerName,
          customerEmail,
          customerPhone: customerPhone || null,
          amount: product.price,
          status: 'pending',
          paytmOrderId: result.orderId,
        },
      })

      await prisma.paymentLog.create({
        data: {
          logType: 'product_initiate',
          rawPayload: { ...result.paytmResponse, productId, orderId: result.orderId },
        },
      })

      await notifyAdmins('product_purchase', {
        purchaseId: purchase.id,
        productName: product.name,
        amount: product.price,
        customerName,
        customerEmail,
        message: `New purchase: ${product.name} by ${customerName} (${customerEmail}) — ₹${Number(product.price).toLocaleString()}`,
      })

      return res.json({
        orderId: result.orderId,
        txnToken: result.txnToken,
        amount: result.amount,
        mid: result.mid,
        env: result.env,
      })
    }

    // --- Products: Paytm Callback (public, no auth) ---
    if (path === '/api/products/callback' && req.method === 'POST') {
      const { body: cbBody, head } = body
      if (!cbBody || !head?.signature) {
        await prisma.paymentLog.create({
          data: { logType: 'product_callback_invalid', rawPayload: { error: 'Missing body or signature' } },
        })
        return res.status(400).json({ error: 'Invalid callback payload' })
      }

      const sigValid = await paytmVerify(cbBody, head.signature).catch(() => false)
      if (!sigValid) {
        await prisma.paymentLog.create({
          data: { logType: 'product_callback_signature_failed', rawPayload: cbBody, signatureValid: false },
        })
        return res.status(400).json({ error: 'Invalid signature' })
      }

      const { orderId, status: txnStatus, txnId } = cbBody
      const purchase = await prisma.productPurchase.findUnique({ where: { paytmOrderId: orderId } })
      if (!purchase) {
        await prisma.paymentLog.create({
          data: { logType: 'product_callback_order_not_found', rawPayload: cbBody, signatureValid: true },
        })
        return res.status(404).json({ error: 'Purchase not found' })
      }

      await prisma.paymentLog.create({
        data: { logType: 'product_callback_received', rawPayload: cbBody, signatureValid: true },
      })

      if (purchase.status === 'success') return res.json({ ok: true })

      // Verify with Paytm Transaction Status API
      let verifiedStatus = txnStatus
      let verifiedTxnId = txnId
      try {
        const txnStatusResult = await getTransactionStatus({ orderId })
        verifiedStatus = txnStatusResult.status
        verifiedTxnId = txnStatusResult.txnId || txnId

        await prisma.paymentLog.create({
          data: {
            logType: 'product_status_verification',
            rawPayload: { ...txnStatusResult.rawResponse, verifiedStatus, verifiedTxnId },
            signatureValid: true,
          },
        })
      } catch (err: any) {
        await prisma.paymentLog.create({
          data: {
            logType: 'product_status_verification_failed',
            rawPayload: { error: err?.message || 'Verification failed', orderId },
            signatureValid: true,
          },
        })
      }

      if (verifiedStatus === 'TXN_SUCCESS') {
        await prisma.productPurchase.update({
          where: { id: purchase.id },
          data: { status: 'success', paytmTxnId: verifiedTxnId },
        })
        await prisma.paymentLog.create({
          data: { logType: 'product_marked_success', rawPayload: { txnId: verifiedTxnId }, signatureValid: true },
        })
        await notifyAdmins('product_purchase_success', {
          purchaseId: purchase.id, productName: purchase.productName, amount: purchase.amount,
          customerName: purchase.customerName, customerEmail: purchase.customerEmail,
          message: `Product payment completed: ${purchase.productName} by ${purchase.customerName} — ₹${Number(purchase.amount).toLocaleString()}.`,
        })
      } else if (verifiedStatus === 'TXN_FAILURE') {
        await prisma.productPurchase.update({
          where: { id: purchase.id },
          data: { status: 'failed' },
        })
        await prisma.paymentLog.create({
          data: { logType: 'product_marked_failed', rawPayload: { txnStatus: verifiedStatus }, signatureValid: true },
        })
      }

return res.json({ ok: true })
  }

  // --- Client: Verify Payment Status ---
  if (path === '/api/payments/verify' && req.method === 'POST') {
    if (!requireAuth(user, res)) return
    const { paymentId } = body
    if (!paymentId) return res.status(400).json({ error: 'paymentId is required' })
    const payment = await prisma.payment.findUnique({ where: { id: paymentId, userId: user.id } })
    if (!payment) return res.status(404).json({ error: 'Payment not found' })
    if (!payment.paytmTransactionId) return res.status(400).json({ error: 'No transaction ID to verify' })

    try {
      const txnStatusResult = await getTransactionStatus({ orderId: payment.paytmTransactionId })
      if (txnStatusResult.status === 'TXN_SUCCESS') {
        await prisma.payment.update({ where: { id: paymentId }, data: { status: 'success' } })
        await prisma.invoice.update({ where: { id: payment.invoiceId }, data: { status: 'paid' } })
        await createNotification(user.id, 'payment_verified', {
          paymentId, invoiceId: payment.invoiceId,
          message: `Your payment of ₹${Number(payment.amount).toLocaleString()} has been verified and confirmed.`,
        })
        const invoice = await prisma.invoice.findUnique({ where: { id: payment.invoiceId } })
        if (invoice?.quotationId) {
          await prisma.quotation.update({ where: { id: invoice.quotationId }, data: { status: 'PAID' } })
        }
        await import('@/lib/invoice-pdf').then(m => m.generateAndStoreInvoicePdf(payment.invoiceId)).catch(() => {})
        return res.json({ status: 'success', message: 'Payment verified successfully' })
      } else if (txnStatusResult.status === 'TXN_FAILURE') {
        await prisma.payment.update({ where: { id: paymentId }, data: { status: 'failed' } })
        await createNotification(user.id, 'payment_failed', {
          paymentId, invoiceId: payment.invoiceId,
          message: `Your payment of ₹${Number(payment.amount).toLocaleString()} has failed. Please try again.`,
        })
        return res.json({ status: 'failed', message: 'Payment failed' })
      }
      return res.json({ status: 'pending', message: 'Payment still pending' })
    } catch (err: any) {
      console.error('[Payments] Verify error:', err?.message || err)
      return res.status(502).json({ error: 'Failed to verify payment with Paytm' })
    }
  }

  // --- Client: Get Single Payment ---
  const paymentDetailMatch = path.match(/^\/api\/payments\/([^/]+)$/)
  if (paymentDetailMatch && req.method === 'GET') {
    if (!requireAuth(user, res)) return
    const paymentId = paymentDetailMatch[1]
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId, userId: user.id },
      include: { invoice: { include: { quotation: true, payments: true } } },
    })
    if (!payment) return res.status(404).json({ error: 'Payment not found' })
    return res.json(payment)
  }

  // --- Client: Retry Failed Payment ---
  if (path === '/api/payments/retry' && req.method === 'POST') {
    if (!requireAuth(user, res)) return
    const { paymentId } = body
    if (!paymentId) return res.status(400).json({ error: 'paymentId is required' })
    const payment = await prisma.payment.findUnique({ where: { id: paymentId, userId: user.id } })
    if (!payment) return res.status(404).json({ error: 'Payment not found' })
    if (payment.status === 'success') return res.status(400).json({ error: 'Payment already successful' })
    if (!paytmConfigured()) return res.status(500).json({ error: 'Payment gateway not configured' })

    const invoice = await prisma.invoice.findUnique({ where: { id: payment.invoiceId } })
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' })
    if (invoice.status === 'paid') return res.status(400).json({ error: 'Invoice already paid' })

    const result = await paytmCreateOrder({
      amount: invoice.amount,
      custId: user.id,
      callbackUrl: PAYTM_CALLBACK,
    })

    await prisma.paymentLog.create({
      data: { logType: 'retry_initiate', rawPayload: { ...result.paytmResponse, invoiceId: invoice.id, orderId: result.orderId } },
    })

    await prisma.payment.update({
      where: { id: paymentId },
      data: { paytmTransactionId: result.orderId, status: 'pending', initiatedAt: new Date() },
    })

    return res.json({
      orderId: result.orderId,
      txnToken: result.txnToken,
      amount: result.amount,
      mid: result.mid,
      env: result.env,
    })
  }

  // --- Client: Get Invoice PDF ---
  const paymentPdfMatch = path.match(/^\/api\/payments\/([^/]+)\/pdf$/)
  if (paymentPdfMatch && req.method === 'GET') {
    if (!requireAuth(user, res)) return
    const paymentId = paymentPdfMatch[1]
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId, userId: user.id },
      include: { invoice: true },
    })
    if (!payment) return res.status(404).json({ error: 'Payment not found' })
    if (!payment.invoice) return res.status(404).json({ error: 'Invoice not found' })

    const pdfUrl = await import('@/lib/invoice-pdf').then(m => m.generateAndStoreInvoicePdf(payment.invoice.id)).catch(() => null)
    if (!pdfUrl) return res.status(500).json({ error: 'Failed to generate PDF' })

    const fs = await import('fs/promises')
    const pathMod = await import('path')
    const filePath = pathMod.join(process.cwd(), 'public', pdfUrl)
    try {
      const file = await fs.readFile(filePath)
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${payment.invoice.invoiceNumber}.pdf"`)
      return res.send(file)
    } catch {
      return res.status(404).json({ error: 'PDF file not found' })
    }
  }

  return res.status(404).json({ error: 'Not found' })
  } catch (err: any) {
    console.error('API Error:', err?.message || err)
    if (err instanceof PaytmError) {
      return res.status(err.code === 'PAYTM_NOT_CONFIGURED' ? 500 : 502).json(err.toJSON())
    }
    return res.status(500).json({ error: err?.message || 'Internal server error' })
  }
}
