'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getProduct } from '@/lib/products'
import { Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const productId = (params?.id as string) || ''
  const product = getProduct(productId)

  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'error'>('form')
  const [errorMsg, setErrorMsg] = useState('')

  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  useEffect(() => {
    if (!document.querySelector('script[src*="paytm"]')) {
      const s = document.createElement('script')
      s.src = 'https://assets.paytm.com/latest/merchant/js/checkoutJs.js'
      s.async = true
      document.head.appendChild(s)
    }
  }, [])

  if (!product) {
    return (
      <section className="page-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1>Product not found</h1>
          <p className="lead">The product you are looking for does not exist.</p>
          <Link href="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </section>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim() || !customerEmail.trim()) return
    setStep('processing')
    setErrorMsg('')

    try {
      const res = await fetch('/api/products/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')

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
              setStep('success')
            } else if (event?.transactionStatus === 'TXN_FAILURE') {
              setStep('error')
              setErrorMsg(event.responseMsg || 'Payment failed. Please try again.')
            } else {
              setStep('error')
              setErrorMsg('Payment was cancelled.')
            }
          },
        },
      }).then(function () {
        ;(window as any).Paytm.CheckoutJS.open()
      })
    } catch (e: any) {
      setStep('error')
      setErrorMsg(e.message || 'Something went wrong. Please try again.')
    }
  }

  if (step === 'success') {
    return (
      <section className="page-hero">
        <div className="container" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
          <div style={{
            width: 72, height: 72, margin: '0 auto 20px',
            background: 'var(--success)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1>Payment Successful!</h1>
          <p className="lead">Thank you for your purchase, {customerName}. Your order for <strong>{product.name}</strong> has been received.</p>
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            padding: 24, marginTop: 24, textAlign: 'left'
          }}>
            <p style={{ marginBottom: 8 }}><strong>Product:</strong> {product.name}</p>
            <p style={{ marginBottom: 8 }}><strong>Amount:</strong> Rs.{product.price.toLocaleString('en-IN')}</p>
            <p style={{ marginBottom: 8 }}><strong>Email:</strong> {customerEmail}</p>
            <div className="checkout-delivery-schedule" style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <p style={{ fontWeight: 600, marginBottom: 10, fontSize: 14 }}>Delivery Schedule</p>
              {product.milestones.map((m, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < product.milestones.length - 1 ? '1px solid var(--border-light)' : 'none',
                  fontSize: 13, alignItems: 'flex-start'
                }}>
                  <div style={{
                    minWidth: 90, fontWeight: 600, color: 'var(--accent)', fontSize: 12, paddingTop: 1
                  }}>{m.week}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{m.description}</div>
                </div>
              ))}
            </div>
              <p className="muted" style={{ fontSize: 13, marginTop: 16 }}>
                Your product files will be delivered instantly to your email after successful payment. Two pages of modification are included free of charge. For any issues, contact us at <a href="mailto:support@viannn.online">support@viannn.online</a>.
              </p>
          </div>
          <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" className="btn btn-secondary">Browse More Products</Link>
            <Link href="/" className="btn btn-dark">Go Home</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <a href="/products">Products</a>
            <span>/</span>
            <span>{product.name}</span>
          </div>
          <span className="eyebrow">Checkout</span>
          <h1>{product.name}</h1>
          <p className="lead">{product.desc}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="checkout-grid">
            <div className="checkout-col">
              <h2 style={{ marginBottom: 24 }}>Order Summary</h2>
              <div className="checkout-card">

                <h3 style={{ marginBottom: 8 }}>{product.name}</h3>
                <p className="muted" style={{ marginBottom: 16, fontSize: 14 }}>{product.desc}</p>
                <ul className="check-list" style={{ marginBottom: 20 }}>
                  {product.features.map(f => <li key={f} style={{ fontSize: 14 }}>{f}</li>)}
                </ul>

                <div className="checkout-delivery-schedule">
                  <p style={{ fontWeight: 600, marginBottom: 10, fontSize: 14, color: 'var(--text)' }}>Delivery Schedule</p>
                  {product.milestones.map((m, i) => (
                    <div key={i} className="checkout-milestone">
                      <div className="checkout-milestone-label">{m.week}</div>
                      <div className="checkout-milestone-desc">{m.description}</div>
                    </div>
                  ))}
                </div>

                <div className="checkout-total">
                  <span style={{ fontWeight: 600 }}>Total</span>
                  <span className="checkout-total-amount">Rs.{product.price.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 4 }}>What you get:</strong>
                  Instant delivery to your email after payment &middot; 2 pages of free modifications &middot; Full source code ownership
                </div>
              </div>
            </div>

            <div className="checkout-col">
              <h2 style={{ marginBottom: 24 }}>Your Details</h2>
              {step === 'error' && (
                <div className="checkout-error">
                  {errorMsg}
                </div>
              )}
              <form onSubmit={handleSubmit} className="checkout-card">
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>
                    Full Name <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Your full name"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>
                    Email Address <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    required
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                  />
                  <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>Product delivery will be sent to this email.</p>
                </div>
                <div className="form-group" style={{ marginBottom: 24 }}>
                  <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>
                    Phone Number <span className="muted" style={{ fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-dark btn-block"
                  disabled={step === 'processing'}
                  style={{ padding: 14, fontSize: 16, fontWeight: 700 }}
                >
                  {step === 'processing' ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                      Processing...
                    </span>
                  ) : (
                    `Pay Rs.${product.price.toLocaleString('en-IN')} via Paytm`
                  )}
                </button>
                <p className="muted" style={{ fontSize: 12, textAlign: 'center', marginTop: 12 }}>
                  Secured by Paytm. Your payment information is encrypted.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
