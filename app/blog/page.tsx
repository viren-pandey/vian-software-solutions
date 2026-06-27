import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Vian Software Solutions',
  description: 'Read insights, guides, and thought leadership on software development, web development, automation, SEO, and digital growth.',
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  tags: string[]
  publishedAt: string
}

export default async function BlogPage() {
  let posts: BlogPost[] = []
  let error = false

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const res = await fetch(`${apiUrl}/api/blogs`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      posts = data.posts || []
    } else {
      error = true
    }
  } catch {
    error = true
  }

  if (error || posts.length === 0) {
    return (
      <>
        <header className="topbar">
          <nav className="nav">
            <a className="brand" href="/">Vian</a>
            <div className="nav-links" data-nav-links>
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/services">Services</a>
              <a href="/pricing">Pricing</a>
              <a href="/portfolio">Portfolio</a>
              <a href="/blog" className="active">Blog</a>
              <a href="/faq">FAQ</a>
              <a href="/contact">Contact</a>
            </div>
            <div className="nav-actions">
              <a href="/login" className="btn btn-secondary">Sign In</a>
              <a href="/register" className="btn btn-primary">Get Started</a>
            </div>
          </nav>
        </header>
        <main>
          <section className="page-hero">
            <div className="container reveal">
              <div className="breadcrumb"><a href="/">Home</a><span>/</span><span>Blog</span></div>
              <span className="eyebrow">Blog</span>
              <h1>Thoughts on technology and growth.</h1>
              <p className="lead">Guides, case studies, and perspective on software, web development, automation, SEO, and building for the long term.</p>
            </div>
          </section>
          <section className="section section-soft">
            <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
              <h3>No articles published yet</h3>
              <p className="muted" style={{ marginTop: 8 }}>Check back soon for new content.</p>
            </div>
          </section>
        </main>
        <footer className="site-footer">{/* footer content */}</footer>
      </>
    )
  }

  const categories = Array.from(new Set(posts.filter(p => p.category).map(p => p.category!)))

  return (
    <>
      <header className="topbar">
        <nav className="nav">
          <a className="brand" href="/">Vian</a>
          <div className="nav-links" data-nav-links>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/services">Services</a>
            <a href="/pricing">Pricing</a>
            <a href="/portfolio">Portfolio</a>
            <a href="/blog" className="active">Blog</a>
            <a href="/faq">FAQ</a>
            <a href="/contact">Contact</a>
          </div>
          <div className="nav-actions">
            <a href="/login" className="btn btn-secondary">Sign In</a>
            <a href="/register" className="btn btn-primary">Get Started</a>
          </div>
        </nav>
      </header>

      <main>
        <section className="page-hero">
          <div className="container reveal">
            <div className="breadcrumb"><a href="/">Home</a><span>/</span><span>Blog</span></div>
            <span className="eyebrow">Blog</span>
            <h1>Thoughts on technology and growth.</h1>
            <p className="lead">Guides, case studies, and perspective on software, web development, automation, SEO, and building for the long term.</p>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Featured</span>
              <h2>Latest from Vian.</h2>
            </div>
            <a href={`/blog/${posts[0].slug}`} className="card reveal" style={{ padding: 40, display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <span style={{ display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: 8 }}>{posts[0].category || 'Article'}</span>
              <h2 style={{ marginBottom: 12 }}>{posts[0].title}</h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 700 }}>{posts[0].excerpt}</p>
              <span style={{ display: 'inline-block', marginTop: 16, fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>Read article &rarr;</span>
            </a>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Articles</span>
              <h2>All articles.</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 48, alignItems: 'start' }}>
              <div>
                <div className="grid grid-3">
                  {posts.map(post => (
                    <article key={post.id} className="card article-card reveal">
                      <time>{post.category || 'Article'}</time>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <a href={`/blog/${post.slug}`}>Read article &rarr;</a>
                    </article>
                  ))}
                </div>
              </div>
              <aside>
                {categories.length > 0 && (
                  <div className="sidebar-card reveal">
                    <h3>Categories</h3>
                    {categories.map(cat => (
                      <a key={cat} href={`/blog?category=${encodeURIComponent(cat)}`}>{cat}</a>
                    ))}
                  </div>
                )}
                <div className="sidebar-card reveal">
                  <h3>Tags</h3>
                  <div className="pill-row">
                    {Array.from(new Set(posts.flatMap(p => p.tags || []))).slice(0, 15).map(tag => (
                      <span key={tag} className="pill">{tag}</span>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <a className="brand" href="/">Vian</a>
            <p style={{ marginTop: 12 }}>Software, web, automation, and digital growth services for modern organizations.</p>
          </div>
          <div>
            <h3>Company</h3>
            <a href="/about">About</a>
            <a href="/portfolio">Portfolio</a>
            <a href="/contact">Contact</a>
            <a href="/pricing">Pricing</a>
          </div>
          <div>
            <h3>Services</h3>
            <a href="/services">Websites</a>
            <a href="/services">Software</a>
            <a href="/services">Digital Growth</a>
            <a href="/support">Support</a>
          </div>
          <div>
            <h3>Resources</h3>
            <a href="/blog">Blog</a>
            <a href="/faq">FAQ</a>
            <a href="/case-studies">Case Studies</a>
            <a href="/technologies">Technologies</a>
          </div>
          <div>
            <h3>Legal</h3>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-and-conditions">Terms of Service</a>
            <a href="/refund-policy">Refund Policy</a>
            <a href="/cookie-policy">Cookie Policy</a>
            <a href="/shipping-policy">Delivery Policy</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>&copy; 2026 Vian Software Solutions. All rights reserved.</span>
          <span><a href="/privacy-policy" style={{ marginRight: 16 }}>Privacy</a><a href="/terms-and-conditions">Terms</a></span>
        </div>
      </footer>
    </>
  )
}
