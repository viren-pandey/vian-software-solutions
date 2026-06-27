// @ts-nocheck
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const prisma = new PrismaClient()
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me'

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

// Paytm config
const PAYTM_MID = process.env.PAYTM_MID || ''
const PAYTM_MKEY = process.env.PAYTM_MKEY || ''
const PAYTM_ENV = process.env.PAYTM_ENV || 'stage'
const PAYTM_HOST = PAYTM_ENV === 'prod' ? 'https://securegw.paytm.in' : 'https://securegw-stage.paytm.in'
const PAYTM_CALLBACK = (process.env.CALLBACK_URL || 'https://www.viannn.online') + '/api/payments/callback'

function paytmSignature(body: any): string {
  return crypto.createHmac('sha256', PAYTM_MKEY).update(JSON.stringify(body)).digest('hex')
}

function paytmVerify(body: any, signature: string): boolean {
  return paytmSignature(body) === signature
}

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
  for (const a of admins) {
    await createNotification(a.id, type, payload)
  }
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
        include: { service: true, items: true },
      })
      return res.json(quotations)
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
      await notifyAdmins('new_message', { quotationId: qId, title: q.title, userName: user.name, body: msgBody })
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
        const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        for (const att of attachments.slice(0, 5)) {
          if (att.size > MAX_FILE_SIZE) continue
          if (!ALLOWED_TYPES.includes(att.type) && !att.type.startsWith('image/')) continue
          const dataUrl = `data:${att.type};base64,${att.data}`
          await prisma.attachment.create({
            data: {
              ownerType: 'quotation',
              ownerId: quotation.id,
              fileUrl: dataUrl,
              fileName: att.name || 'untitled',
              mimeType: att.type || 'application/octet-stream',
              sizeBytes: att.size || 0,
              uploadedBy: user.id,
            },
          })
        }
      }
      await notifyAdmins('new_quotation', { quotationId: quotation.id, title: quotation.title, userName: user.name, message: `New quotation "${quotation.title}" submitted by ${user.name}.` })
      await createNotification(user.id, 'quotation_submitted', { quotationId: quotation.id, title: quotation.title, message: 'Your quotation request has been submitted successfully.' })
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
      const [users, quotations, projects, payments] = await Promise.all([
        prisma.user.count(),
        prisma.quotation.count(),
        prisma.project.count(),
        prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'success' } }),
      ])
      return res.json({ users, quotations, projects, revenue: payments._sum.amount ?? 0 })
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
      const validStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'QUOTED', 'REVISION_REQUESTED', 'ACCEPTED', 'INVOICED', 'PAID', 'REJECTED', 'CANCELLED']
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
      // If accepted, create invoice + project
      if (status === 'ACCEPTED') {
        const q = await prisma.quotation.findUnique({ where: { id }, include: { invoice: true, project: true } })
        if (q && !q.invoice) {
          const invoiceCount = await prisma.invoice.count()
          const invoice = await prisma.invoice.create({
            data: {
              quotationId: id,
              userId: q.userId,
              invoiceNumber: `INV-${String(invoiceCount + 1).padStart(4, '0')}`,
              amount: q.quotedAmount || 0,
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
      const services = await prisma.service.findMany({ where: { active: true }, orderBy: { name: 'asc' } })
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
      if (!PAYTM_MID || !PAYTM_MKEY) return res.status(500).json({ error: 'Payment gateway not configured' })

      const orderId = `ORD_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`
      const amount = Number(invoice.amount).toFixed(2)

      const paytmBody = {
        requestType: 'Payment',
        mid: PAYTM_MID,
        orderId,
        websiteName: 'WEBSTAGING',
        txnAmount: { value: amount, currency: 'INR' },
        userInfo: { custId: user.id },
        callbackUrl: PAYTM_CALLBACK,
      }

      const signature = paytmSignature(paytmBody)
      const paytmRes = await fetch(`${PAYTM_HOST}/v3/order/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: paytmBody, head: { signature } }),
      })
      const paytmData = await paytmRes.json()

      if (paytmData.body?.resultInfo?.resultStatus !== 'S') {
        return res.status(502).json({ error: paytmData.body?.resultInfo?.resultMsg || 'Failed to create Paytm order' })
      }

      await prisma.payment.create({
        data: { invoiceId, userId: user.id, paytmTransactionId: orderId, amount: invoice.amount, status: 'pending' },
      })

      return res.json({ orderId, txnToken: paytmData.body.txnToken, amount, mid: PAYTM_MID, env: PAYTM_ENV })
    }

    // --- Paytm: Callback (public, no auth) ---
    if (path === '/api/payments/callback' && req.method === 'POST') {
      const { body: cbBody, head } = body
      if (!cbBody || !head?.signature) {
        return res.status(400).json({ error: 'Invalid callback payload' })
      }
      if (!paytmVerify(cbBody, head.signature)) {
        await prisma.paymentLog.create({ data: { rawPayload: cbBody, signatureValid: false } })
        return res.status(400).json({ error: 'Invalid signature' })
      }

      const { orderId, status, txnId } = cbBody
      const payment = await prisma.payment.findUnique({ where: { paytmTransactionId: orderId } })
      if (!payment) return res.status(404).json({ error: 'Payment not found' })

      await prisma.paymentLog.create({ data: { paymentId: payment.id, rawPayload: cbBody, signatureValid: true } })

      if (payment.status === 'success') return res.json({ ok: true })

      if (status === 'TXN_SUCCESS') {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: 'pending' } })
        await notifyAdmins('payment_verification', {
          paymentId: payment.id, invoiceId: payment.invoiceId, amount: payment.amount,
          message: `Payment of ₹${Number(payment.amount).toLocaleString()} needs your verification.`,
        })
        await createNotification(payment.userId, 'payment_pending', {
          paymentId: payment.id, invoiceId: payment.invoiceId,
          message: `Your payment of ₹${Number(payment.amount).toLocaleString()} is being verified. We'll notify you once confirmed.`,
        })
      } else if (status === 'TXN_FAILURE') {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: 'failed' } })
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
          await prisma.quotation.update({ where: { id: invoice.quotationId }, data: { status: 'PAID' } })
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

    return res.status(404).json({ error: 'Not found' })
  } catch (err: any) {
    console.error('API Error:', err?.message || err)
    return res.status(500).json({ error: err?.message || 'Internal server error' })
  }
}
