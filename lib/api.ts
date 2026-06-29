import type {
  User, Service, Quotation, Project, Invoice, Payment,
  Message, Attachment, SupportTicket, Notification,
  AdminStats, ChatListItem, AuditLogEntry,
} from '@/types/api'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function getBaseUrl(): string {
  if (typeof window !== 'undefined') return ''
  return process.env.NEXT_PUBLIC_API_URL || ''
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${getBaseUrl()}${path}`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const res = await fetch(url, {
      credentials: 'include',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await res.json()

    if (!res.ok) {
      throw new ApiError(
        res.status,
        data.error || `Request failed with status ${res.status}`,
      )
    }

    return data as T
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(0, 'Request timed out')
    }
    throw new ApiError(0, err instanceof Error ? err.message : 'Network error')
  } finally {
    clearTimeout(timeout)
  }
}

function createApi(extraHeaders: Record<string, string> = {}) {
  const h = (options?: RequestInit) => ({
    ...options,
    headers: { ...extraHeaders, ...((options?.headers as Record<string, string>) || {}) },
  })
  return {
    auth: {
      me: () => request<{ user: User }>('/api/auth/me', h()),
      login: (email: string, password: string) =>
        request<{ user: User }>('/api/auth/login', h({ method: 'POST', body: JSON.stringify({ email, password }) })),
      register: (email: string, password: string, name: string) =>
        request<{ user: User }>('/api/auth/register', h({ method: 'POST', body: JSON.stringify({ email, password, name }) })),
      logout: () => request<{ ok: boolean }>('/api/auth/logout', h({ method: 'POST' })),
    },
    services: {
      list: () => request<Service[]>('/api/services', h()),
    },
    quotations: {
      list: () => request<Quotation[]>('/api/quotations', h()),
      get: (id: string) => request<Quotation>(`/api/quotations/${id}`, h()),
      create: (data: {
        serviceId: string; title: string; description: string;
        goals?: string; budgetRange?: string; timeline?: string;
        preferredTechnologies?: string[]; referenceLinks?: string[];
        notes?: string; attachments?: { name: string; type: string; size: number; data: string }[]
      }) => request<Quotation>('/api/quotations', h({ method: 'POST', body: JSON.stringify(data) })),
      sendMessage: (id: string, body: string) =>
        request<Message>(`/api/quotations/${id}/messages`, h({ method: 'POST', body: JSON.stringify({ body }) })),
    },
    projects: {
      list: () => request<Project[]>('/api/projects', h()),
    },
    invoices: {
      list: () => request<Invoice[]>('/api/invoices', h()),
      get: (id: string) => request<Invoice>(`/api/invoices/${id}`, h()),
    },
    payments: {
      list: () => request<Payment[]>('/api/payments', h()),
      createOrder: (invoiceId: string) =>
        request<{ orderId: string; txnToken: string; amount: string; mid: string; env: string }>(
          '/api/payments/create-order', h({ method: 'POST', body: JSON.stringify({ invoiceId }) })),
    },
    support: {
      list: () => request<SupportTicket[]>('/api/support/tickets', h()),
      create: (subject: string) =>
        request<SupportTicket>('/api/support/tickets', h({ method: 'POST', body: JSON.stringify({ subject }) })),
    },
    notifications: {
      list: () => request<{ notifications: Notification[]; unread: number }>('/api/notifications', h()),
      markRead: (ids?: string[]) =>
        request<{ ok: boolean }>('/api/notifications/read', h({ method: 'POST', body: JSON.stringify({ ids }) })),
    },
    admin: {
      stats: () => request<AdminStats>('/api/admin/stats', h()),
      users: () => request<User[]>('/api/admin/users', h()),
      quotations: {
        list: () => request<Quotation[]>('/api/admin/quotations', h()),
        get: (id: string) => request<Quotation>(`/api/admin/quotations/${id}`, h()),
        update: (id: string, data: { status?: string; quotedAmount?: number; quoteValidityDays?: number; notes?: string }) =>
          request<Quotation>(`/api/admin/quotations/${id}`, h({ method: 'PUT', body: JSON.stringify(data) })),
        sendMessage: (id: string, body: string) =>
          request<Message>(`/api/admin/quotations/${id}/messages`, h({ method: 'POST', body: JSON.stringify({ body }) })),
      },
      projects: {
        list: () => request<Project[]>('/api/admin/projects', h()),
        update: (id: string, data: { status?: string; internalNotes?: string }) =>
          request<Project>(`/api/admin/projects/${id}`, h({ method: 'PUT', body: JSON.stringify(data) })),
      },
      payments: {
        list: () => request<Payment[]>('/api/admin/payments', h()),
        verify: (id: string, action: 'approve' | 'reject', rejectReason?: string) =>
          request<{ ok: boolean }>(`/api/admin/payments/${id}/verify`, h({ method: 'POST', body: JSON.stringify({ action, rejectReason }) })),
      },
      chats: {
        list: () => request<ChatListItem[]>('/api/admin/chats', h()),
      },
      auditLog: {
        list: (limit = 100, offset = 0) =>
          request<{ logs: AuditLogEntry[]; total: number }>(`/api/admin/audit-log?limit=${limit}&offset=${offset}`, h()),
      },
    },
  }
}

export const api = createApi()

export function createServerApi(cookie: string) {
  return createApi({ Cookie: cookie })
}
