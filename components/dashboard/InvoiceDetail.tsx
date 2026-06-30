'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { api, ApiError } from '@/lib/api'
import { showToast } from '@/components/ui/Toast'
import type { Invoice, User } from '@/types/api'

interface InvoiceDetailProps {
  invoice: Invoice
  user: User
}

export function InvoiceDetail({ invoice, user }: InvoiceDetailProps) {
  const router = useRouter()
  const inv = invoice
  const total = Number(inv.amount)

  // TODO(GST): If/when Vian Software Solutions obtains GST registration,
  // re-add GST line items here using the official GSTIN, applicable rate,
  // and updated entity type. Do NOT re-use the old placeholder GSTIN
  // (06ABCDE1234F1Z5) or the Pvt. Ltd. entity name — verify against
  // actual registration documents at that time.

  const dueDate = new Date(inv.issuedAt)
  dueDate.setDate(dueDate.getDate() + (inv.quotation?.quoteValidityDays || 15))

  const statusLabel = inv.status === 'paid'
    ? 'PAID'
    : inv.payments?.some((p) => p.status === 'pending')
      ? 'Payment Pending Verification'
      : 'UNPAID'
  const statusColor = inv.status === 'paid' ? '#16A34A' : '#DC2626'

  return (
    <>
      <div className="dash-header inv-no-print">
        <div>
          <h1>Invoice {inv.invoiceNumber}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={() => window.print()}>
            Print
          </button>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL || ''}/api/invoices/${inv.id}/pdf`}
            className="btn btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download PDF
          </a>
          <Link href="/dashboard/invoices" className="btn btn-secondary">
            Back
          </Link>
        </div>
      </div>

      <div
        className="invoice-print"
        style={{
          background: '#fff',
          color: '#000',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: 40,
          maxWidth: 800,
          margin: '0 auto',
          fontFamily: 'Arial, sans-serif',
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid #1e3a5f',
            paddingBottom: 24,
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#1e3a5f', letterSpacing: -0.5 }}>
              VIAN
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#1e3a5f',
                letterSpacing: 3,
                textTransform: 'uppercase',
                marginTop: 2,
              }}
            >
              Software Solutions
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
            <strong style={{ fontSize: 14, color: '#1e3a5f' }}>INVOICE</strong><br />
            <span>Vian Software Solutions</span><br />
            <span>(Sole Proprietorship of Viren Pandey)</span><br />
            <span>Email: finance@viannn.online</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <div style={{ fontSize: 12 }}>
            <strong style={{ color: '#1e3a5f' }}>Bill To:</strong><br />
            <span style={{ fontWeight: 700, color: '#111' }}>{user.name}</span><br />
            <span style={{ color: '#374151' }}>{user.email}</span>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12 }}>
            <table style={{ borderCollapse: 'collapse', fontSize: 12 }}>
              <tbody>
                <tr>
                  <td style={{ color: '#6b7280', padding: '2px 8px 2px 0' }}>Invoice No.</td>
                  <td style={{ fontWeight: 700, color: '#111' }}>{inv.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style={{ color: '#6b7280', padding: '2px 8px 2px 0' }}>Date</td>
                  <td style={{ color: '#111' }}>{formatDate(inv.issuedAt)}</td>
                </tr>
                <tr>
                  <td style={{ color: '#6b7280', padding: '2px 8px 2px 0' }}>Due Date</td>
                  <td style={{ color: '#111' }}>{formatDate(dueDate)}</td>
                </tr>
                <tr>
                  <td style={{ color: '#6b7280', padding: '2px 8px 2px 0' }}>Status</td>
                  <td style={{ fontWeight: 700, color: statusColor }}>{statusLabel}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24, fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#1e3a5f', color: '#fff' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>#</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>Description of Services</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: 12, textAlign: 'center', verticalAlign: 'top' }}>1</td>
              <td style={{ padding: 12, verticalAlign: 'top' }}>
                <strong style={{ color: '#111' }}>{inv.quotation?.title || 'Software Development Services'}</strong>
                {inv.quotation?.description && (
                  <><br /><span style={{ color: '#6b7280', fontSize: 11 }}>{inv.quotation.description}</span></>
                )}
                {inv.quotation?.goals && (
                  <><br /><span style={{ color: '#6b7280', fontSize: 11 }}>Goals: {inv.quotation.goals}</span></>
                )}
              </td>
              <td style={{ padding: 12, textAlign: 'right', verticalAlign: 'top', fontWeight: 600, color: '#111' }}>
                {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 13, minWidth: 280 }}>
            <tbody>
              <tr style={{ borderTop: '2px solid #1e3a5f' }}>
                <td style={{ padding: '8px 12px', fontWeight: 900, color: '#1e3a5f', fontSize: 15 }}>Total Amount</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 900, color: '#1e3a5f', fontSize: 15 }}>
                  ₹ {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            fontSize: 11,
            color: '#6b7280',
            paddingTop: 12,
            borderTop: '1px solid #e5e7eb',
            marginBottom: 16,
          }}
        >
          <strong style={{ color: '#374151' }}>Amount in Words:</strong><br />
          <span style={{ fontStyle: 'italic' }}>{numberToWords(total)}</span>
        </div>

        <div
          style={{
            fontSize: 11,
            color: '#6b7280',
            paddingTop: 12,
            borderTop: '1px solid #e5e7eb',
            marginBottom: 16,
          }}
        >
          <strong style={{ color: '#374151' }}>Terms & Conditions:</strong><br />
          1. Payment is due within {inv.quotation?.quoteValidityDays || 15} days from the invoice date.<br />
          2. Late payment may incur additional charges at 2% per month.<br />
          3. This is a computer-generated invoice and does not require a physical signature.
        </div>

        <div
          style={{
            textAlign: 'center',
            fontSize: 10,
            color: '#9ca3af',
            paddingTop: 16,
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <span style={{ fontWeight: 700, color: '#1e3a5f' }}>Vian Software Solutions</span>
          &bull; Sole Proprietorship of Viren Pandey &bull; Email: finance@viannn.online<br />
          <span>Thank you for your business!</span>
        </div>
      </div>

      <div className="inv-no-print" style={{ marginTop: 24 }}>
        {inv.payments?.some((p) => p.status === 'pending') ? (
          <div
            style={{
              textAlign: 'center',
              padding: 16,
              border: '1px solid #F59E0B',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(245,158,11,0.08)',
              marginBottom: 12,
            }}
          >
            <strong style={{ color: '#F59E0B' }}>Payment Submitted</strong>
            <p style={{ marginTop: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
              Your payment is being verified by the admin. Typically verified within 24 hours.
            </p>
          </div>
        ) : inv.status === 'issued' ? (
          <PayButton invoiceId={inv.id} amount={total} />
        ) : inv.status === 'paid' ? (
          <div
            style={{
              textAlign: 'center',
              padding: 16,
              border: '1px solid var(--success)',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(22,163,74,0.08)',
            }}
          >
            <strong style={{ color: 'var(--success)' }}>Payment Completed</strong>
            <p style={{ marginTop: 4, fontSize: 13, color: 'var(--text-secondary)' }}>
              This invoice has been paid successfully.
            </p>
          </div>
        ) : null}
      </div>
    </>
  )
}

function PayButton({ invoiceId, amount }: { invoiceId: string; amount: number }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Preload Paytm script
    if (!document.querySelector('script[src*="paytm"]')) {
      const s = document.createElement('script')
      s.src = 'https://assets.paytm.com/latest/merchant/js/checkoutJs.js'
      s.async = true
      document.head.appendChild(s)
    }
  }, [])

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      // Track payment initiation
      api.payments.initiate(invoiceId).catch(() => {})

      const data = await api.payments.createOrder(invoiceId)

      if (!(window as any).Paytm) {
        await new Promise<void>((resolve) => {
          const check = () => {
            if ((window as any).Paytm) resolve()
            else setTimeout(check, 100)
          }
          check()
        })
      }

      ;(window as any).Paytm.CheckoutJS.init({
        root: '',
        flow: 'DEFAULT',
        data: {
          orderId: data.orderId,
          token: data.txnToken,
          tokenType: 'TXN_TOKEN',
          amount: data.amount,
        },
        handler: {
          notifyMerchant: function (event: any) {
            if (event?.transactionStatus === 'TXN_SUCCESS') {
              showToast('Payment successful!', 'success')
              window.location.reload()
            } else if (event?.transactionStatus === 'TXN_FAILURE') {
              const reason = event.responseMsg || 'Payment failed. Please try again.'
              setError(reason)
              showToast(reason, 'error')
            } else {
              setError('Payment was cancelled.')
              showToast('Payment cancelled.', 'error')
            }
            setLoading(false)
          },
        },
      }).then(function () {
        ;(window as any).Paytm.CheckoutJS.open()
      })
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to initiate payment')
      showToast(e instanceof ApiError ? e.message : 'Payment error', 'error')
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        className="btn btn-primary"
        style={{ width: '100%', padding: 14, fontSize: 16, fontWeight: 700 }}
        onClick={handlePay}
        disabled={loading}
      >
        {loading ? 'Processing...' : `Pay ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} via Paytm`}
      </button>
      {error && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            border: '1px solid var(--error)',
            borderRadius: 'var(--radius)',
            background: 'rgba(220,38,38,0.06)',
            fontSize: 13,
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--error)', marginBottom: 8 }}>{error}</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePay}>
              Try Again
            </button>
            <a href="/dashboard/support" className="btn btn-secondary btn-sm">
              Contact Support
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function numberToWords(n: number): string {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen ']
  const b = ['', '', 'Twenty ', 'Thirty ', 'Forty ', 'Fifty ', 'Sixty ', 'Seventy ', 'Eighty ', 'Ninety ']
  if (n === 0) return 'Zero'
  const f = (num: number): string => {
    let s = ''
    if (num > 99) { s += a[Math.floor(num / 100)] + 'Hundred '; num %= 100 }
    if (num > 19) { s += b[Math.floor(num / 10)]; num %= 10 }
    if (num > 0) s += a[num]
    return s
  }
  let res = ''
  if (n >= 10000000) { res += f(Math.floor(n / 10000000)) + 'Crore '; n %= 10000000 }
  if (n >= 100000) { res += f(Math.floor(n / 100000)) + 'Lakh '; n %= 100000 }
  if (n >= 1000) { res += f(Math.floor(n / 1000)) + 'Thousand '; n %= 1000 }
  if (n >= 100) { res += f(Math.floor(n / 100)) + 'Hundred '; n %= 100 }
  if (n > 0) res += f(n)
  return res.trim() + ' Rupees Only'
}
