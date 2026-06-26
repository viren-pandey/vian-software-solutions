import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const prisma = new PrismaClient()
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me'

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
  res.setHeader(
    'Set-Cookie',
    cookies.map(({ name, value, maxAge }) =>
      `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
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
  await prisma.notification.create({ data: { userId, type, payload } })
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

    if (path === '/api/auth/logout' && req.method === 'POST') {
      setCookies(res, [
        { name: 'access_token', value: '', maxAge: 0 },
        { name: 'refresh_token', value: '', maxAge: 0 },
      ])
      return res.json({ ok: true })
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
        include: {
          service: true,
          items: true,
          project: true,
          invoice: true,
          messages: { orderBy: { createdAt: 'asc' }, include: { sender: { select: { id: true, name: true } } } },
        },
      })
      if (!q) return res.status(404).json({ error: 'Quotation not found' })
      return res.json(q)
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
      const { serviceId, title, description, goals, budgetRange, timeline, preferredTechnologies, referenceLinks, notes } = body
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
      await notifyAdmins('new_quotation', { quotationId: quotation.id, title: quotation.title, userName: user.name })
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
          messages: { orderBy: { createdAt: 'asc' }, include: { sender: { select: { id: true, name: true } } } },
        },
      })
      if (!q) return res.status(404).json({ error: 'Quotation not found' })
      return res.json(q)
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

    // --- Notifications ---
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
        await prisma.payment.update({ where: { id: payment.id }, data: { status: 'success' } })
        await prisma.invoice.update({ where: { id: payment.invoiceId }, data: { status: 'paid' } })
        const invoice = await prisma.invoice.findUnique({ where: { id: payment.invoiceId } })
        if (invoice) {
          await prisma.quotation.update({ where: { id: invoice.quotationId }, data: { status: 'PAID' } })
          await createNotification(payment.userId, 'payment_success', {
            paymentId: payment.id, invoiceId: payment.invoiceId,
            message: `Payment of ₹${Number(payment.amount).toLocaleString()} for invoice ${invoice.invoiceNumber} was successful.`,
          })
          await notifyAdmins('payment_received', {
            paymentId: payment.id, invoiceId: payment.invoiceId, amount: payment.amount,
            message: `Payment of ₹${Number(payment.amount).toLocaleString()} received for invoice ${invoice.invoiceNumber}.`,
          })
        }
      } else if (status === 'TXN_FAILURE') {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: 'failed' } })
      }

      return res.json({ ok: true })
    }

    return res.status(404).json({ error: 'Not found' })
  } catch (err: any) {
    console.error('API Error:', err?.message || err)
    return res.status(500).json({ error: err?.message || 'Internal server error' })
  }
}
