'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { api, ApiError } from '@/lib/api'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { showToast } from '@/components/ui/Toast'
import type { ChatListItem, Quotation, Message } from '@/types/api'

interface AdminChatsProps {
  chats: ChatListItem[]
  userId: string
}

export function AdminChats({ chats, userId }: AdminChatsProps) {
  const router = useRouter()
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [activeChatData, setActiveChatData] = useState<Quotation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(false)
  const msgEndRef = useRef<HTMLDivElement>(null)

  const loadChat = async (quotationId: string) => {
    setActiveChatId(quotationId)
    setLoading(true)
    try {
      const q = await api.admin.quotations.get(quotationId)
      setActiveChatData(q)
      setMessages(q.messages || [])
    } catch {
      showToast('Failed to load chat', 'error')
    }
    setLoading(false)
  }

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !activeChatId) return
    setSending(true)
    try {
      await api.admin.quotations.sendMessage(activeChatId, message.trim())
      setMessage('')
      await loadChat(activeChatId)
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Failed to send', 'error')
    }
    setSending(false)
  }

  return (
    <>
      <div className="admin-header" style={{ marginBottom: 0 }}>
        <div><h1>Chats</h1></div>
      </div>
      <div className="chat-layout">
        <div className="chat-list">
          {chats.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
              No conversations yet
            </div>
          ) : (
            chats.map((c) => {
              const initial = (c.user?.name || '?')[0].toUpperCase()
              const lastMsg = c.lastMessage?.body?.substring(0, 50) || 'No messages yet'
              const time = c.lastMessage
                ? new Date(c.lastMessage.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit' })
                : ''
              return (
                <div
                  key={c.quotationId}
                  className={`chat-list-item ${c.quotationId === activeChatId ? 'active' : ''}`}
                  onClick={() => loadChat(c.quotationId)}
                >
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0,
                      background: 'var(--accent-light)', color: 'var(--accent)',
                    }}
                  >
                    {initial}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.user?.name || 'Unknown'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                      {c.title} &middot; {lastMsg}
                    </div>
                    <Badge variant={c.status} className="mt-0.5">{c.status.replace(/_/g, ' ')}</Badge>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, fontSize: 11, color: 'var(--text-tertiary)' }}>
                    {time}
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="chat-area">
          {!activeChatId ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>
              Select a conversation to start chatting
            </div>
          ) : loading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
              Loading...
            </div>
          ) : activeChatData ? (
            <>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  {(activeChatData.user?.name || '?')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{activeChatData.user?.name || 'Unknown'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                    {activeChatData.title} &middot; <Badge variant={activeChatData.status}>{activeChatData.status.replace(/_/g, ' ')}</Badge>
                  </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => router.push(`/admin/quotations/${activeChatId}`)}>
                    Full Details
                  </button>
                </div>
              </div>

              <div className="chat-msgs" id="chatMsgBox">
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-tertiary)', fontSize: 13 }}>
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`chat-bubble ${m.senderId === userId ? 'admin' : 'client'}`}
                      style={{
                        maxWidth: '75%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: 13,
                        lineHeight: 1.5,
                        alignSelf: m.senderId === userId ? 'flex-end' : 'flex-start',
                        background: m.senderId === userId ? 'var(--accent)' : 'var(--surface-hover)',
                        color: m.senderId === userId ? '#fff' : 'var(--text)',
                      }}
                    >
                      <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 4 }}>{m.sender?.name || ''}</div>
                      <div>{m.body}</div>
                      <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: 'right' }}>
                        {formatDateTime(m.createdAt)}
                      </div>
                    </div>
                  ))
                )}
                <div ref={msgEndRef} />
              </div>

              <form className="chat-input" onSubmit={handleSend}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1, padding: '10px 14px', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)',
                    color: 'var(--text)', fontSize: 13, outline: 'none',
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px', borderRadius: 999 }} disabled={sending}>
                  {sending ? '...' : 'Send'}
                </button>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}
