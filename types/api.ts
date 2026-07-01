export type UserRole = 'admin' | 'reviewer' | 'client'

export type QuotationStatus =
  | 'SUBMITTED' | 'UNDER_REVIEW' | 'QUOTED'
  | 'REVISION_REQUESTED' | 'ACCEPTED' | 'PAYMENT_REQUESTED'
  | 'INVOICED' | 'PAID' | 'REJECTED' | 'CANCELLED'

export type ProjectStatus = 'active' | 'paused' | 'completed' | 'cancelled'

export type InvoiceStatus = 'issued' | 'paid' | 'void'

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded'

export type PaymentRequestStatus = 'pending' | 'paid' | 'cancelled'

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt?: string
}

export interface Service {
  id: string
  name: string
  slug: string
  description: string
  category: string
}

export interface Quotation {
  id: string
  userId: string
  serviceId: string
  status: QuotationStatus
  title: string
  description: string
  goals?: string | null
  budgetRange?: string | null
  timeline?: string | null
  preferredTechnologies: string[]
  referenceLinks: string[]
  notes?: string | null
  quotedAmount?: number | null
  quoteValidityDays?: number | null
  createdAt: string
  updatedAt: string
  user?: Pick<User, 'id' | 'name' | 'email'>
  service?: Service
  items?: QuotationItem[]
  messages?: Message[]
  attachments?: Attachment[]
  project?: Project | null
  invoice?: Invoice | null
}

export interface QuotationItem {
  id: string
  quotationId: string
  description: string
  amount: number
}

export interface Project {
  id: string
  quotationId: string
  userId: string
  status: ProjectStatus
  startDate?: string | null
  targetEndDate?: string | null
  internalNotes?: string | null
  createdAt: string
  quotation?: Pick<Quotation, 'title'>
  user?: Pick<User, 'id' | 'name' | 'email'>
}

export interface Invoice {
  id: string
  quotationId?: string | null
  userId: string
  invoiceNumber: string
  amount: number
  status: InvoiceStatus
  description?: string | null
  pdfUrl?: string | null
  issuedAt: string
  quotation?: Pick<Quotation, 'title' | 'description' | 'goals' | 'quoteValidityDays'>
  payments?: Payment[]
  user?: Pick<User, 'id' | 'name' | 'email'>
}

export interface Payment {
  id: string
  invoiceId: string
  userId: string
  paytmTransactionId: string
  amount: number
  status: PaymentStatus
  initiatedAt?: string | null
  createdAt: string
  invoice?: Invoice
  user?: Pick<User, 'id' | 'name' | 'email'>
}

export interface Message {
  id: string
  threadType: 'quotation' | 'project'
  threadId: string
  senderId: string
  body: string
  createdAt: string
  sender: Pick<User, 'id' | 'name'>
}

export interface Attachment {
  id: string
  ownerType: 'quotation' | 'message' | 'ticket'
  ownerId: string
  fileUrl: string
  fileName: string
  mimeType: string
  sizeBytes: number
}

export interface SupportTicket {
  id: string
  userId: string
  subject: string
  status: TicketStatus
  description?: string | null
  createdAt: string
  updatedAt: string
  user?: Pick<User, 'id' | 'name' | 'email'>
}

export interface Notification {
  id: string
  userId: string
  type: string
  payload: Record<string, unknown>
  readAt: string | null
  createdAt: string
}

export interface AdminStats {
  users: number
  quotations: number
  projects: number
  revenue: number
  blogPosts: number
  publishedPosts: number
  pendingPayments: number
  totalPayments: number
}

export interface ChatListItem {
  quotationId: string
  title: string
  status: QuotationStatus
  user: Pick<User, 'id' | 'name' | 'email'>
  lastMessage: Pick<Message, 'body' | 'createdAt'> | null
  updatedAt: string
}

export interface PaymentVerificationRequest {
  action: 'approve' | 'reject'
  rejectReason?: string
}

export const QUOTATION_TRANSITIONS: Record<QuotationStatus, QuotationStatus[]> = {
  SUBMITTED: ['UNDER_REVIEW', 'QUOTED', 'REVISION_REQUESTED', 'ACCEPTED', 'PAYMENT_REQUESTED', 'INVOICED', 'PAID', 'REJECTED', 'CANCELLED'],
  UNDER_REVIEW: ['QUOTED', 'REVISION_REQUESTED', 'ACCEPTED', 'PAYMENT_REQUESTED', 'INVOICED', 'PAID', 'REJECTED', 'CANCELLED'],
  QUOTED: ['ACCEPTED', 'REVISION_REQUESTED', 'PAYMENT_REQUESTED', 'INVOICED', 'PAID', 'REJECTED', 'CANCELLED'],
  REVISION_REQUESTED: ['UNDER_REVIEW', 'QUOTED', 'ACCEPTED', 'PAYMENT_REQUESTED', 'INVOICED', 'PAID', 'REJECTED', 'CANCELLED'],
  ACCEPTED: ['PAYMENT_REQUESTED', 'INVOICED', 'PAID', 'REJECTED', 'CANCELLED'],
  PAYMENT_REQUESTED: ['INVOICED', 'PAID', 'CANCELLED'],
  INVOICED: ['PAID', 'CANCELLED'],
  PAID: [],
  REJECTED: [],
  CANCELLED: [],
}

export interface AuditLogEntry {
  id: string
  actorId: string | null
  action: string
  entityType: string
  entityId: string
  previousState: Record<string, unknown> | null
  newState: Record<string, unknown> | null
  createdAt: string
  actor: Pick<User, 'id' | 'name' | 'email'> | null
}

export interface PaymentRequest {
  id: string
  userId: string
  amount: number
  description: string
  status: PaymentRequestStatus
  createdAt: string
  updatedAt: string
  user?: Pick<User, 'id' | 'name' | 'email'>
}

export interface PaymentLogEntry {
  id: string
  paymentId: string | null
  logType: string
  rawPayload: Record<string, unknown>
  signatureValid: boolean | null
  receivedAt: string
  payment?: Payment
}
