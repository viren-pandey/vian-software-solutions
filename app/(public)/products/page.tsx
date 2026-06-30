import type { Metadata } from 'next'
import Link from 'next/link'
import { products } from '@/lib/products'
import { siteUrl, breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Ready-Made Products',
  description: 'Pre-built scripts, dashboards, APIs, and tools available for instant purchase from Vian Software Solutions.',
  keywords: ['pre-built scripts', 'digital products', 'ready-made software', 'scripts and tools', 'instant download software', 'software products india'],
  openGraph: {
    title: 'Products - Vian Software Solutions',
    description: 'Pre-built scripts, dashboards, APIs, and tools available for instant purchase from Vian Software Solutions.',
    images: [{ url: `${siteUrl}/assets/logo/og-image.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products - Vian Software Solutions',
    description: 'Pre-built scripts, dashboards, APIs, and tools available for instant purchase from Vian Software Solutions.',
  },
  alternates: {
    canonical: `${siteUrl}/products`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

const categories = [...new Set(products.map(p => p.category))]

export default function ProductsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Products</span>
          </div>
          <span className="eyebrow">Ready-Made Products</span>
          <h1>Production-ready code, instant delivery.</h1>
          <p className="lead">Each product includes complete source code, setup documentation, and a structured delivery over three weeks. No subscriptions, no hidden fees — you own everything.</p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="products-categories">
            {categories.map(cat => (
              <span key={cat} className="tech-tag">{cat}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="products-grid-page">
            {products.map(product => (
              <div key={product.id} className="product-page-card">
                <div className="product-page-header">
                  <span className="product-page-category">{product.category}</span>
                </div>
                <h3 className="product-page-title">{product.name}</h3>
                <p className="product-page-desc">{product.desc}</p>

                <div className="product-page-delivery">
                  <strong style={{ fontSize: 13, display: 'block', marginBottom: 8, color: 'var(--text)' }}>Delivery Milestones</strong>
                  {product.milestones.map((m, i) => (
                    <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, paddingLeft: 12, borderLeft: '2px solid var(--accent)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{m.week}</span>: {m.description}
                    </div>
                  ))}
                </div>

                <ul className="check-list product-page-features">
                  {product.features.map(f => <li key={f}>{f}</li>)}
                </ul>

                <div className="product-page-footer">
                  <div className="product-page-price">
                    <span className="product-page-currency">Rs.</span>
                    <span className="product-page-amount">{product.price.toLocaleString('en-IN')}</span>
                  </div>
                  <Link
                    href={`/products/${product.id}`}
                    className="btn btn-dark btn-block"
                  >
                    Buy Now
                  </Link>
                  <p className="muted" style={{ fontSize: 12, textAlign: 'center', marginTop: 6 }}>Full source code - Instant delivery</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', item: '/' }, { name: 'Products', item: '/products' }])) }}
      />
    </>
  )
}
