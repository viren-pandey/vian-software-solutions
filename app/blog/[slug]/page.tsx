import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const res = await fetch(`${apiUrl}/api/blogs/${slug}`, { cache: 'no-store' })
    if (!res.ok) return { title: 'Blog | Vian Software Solutions' }
    const post = await res.json()
    return {
      title: `${post.title} | Vian Software Solutions`,
      description: post.excerpt || post.title,
      openGraph: { title: post.title, description: post.excerpt },
    }
  } catch {
    return { title: 'Blog | Vian Software Solutions' }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  let post: any
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const res = await fetch(`${apiUrl}/api/blogs/${slug}`, { cache: 'no-store' })
    if (!res.ok) notFound()
    post = await res.json()
  } catch {
    notFound()
  }

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

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
            <a href="/blog">Blog</a>
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
        <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 80px' }}>
          <div className="breadcrumb" style={{ marginBottom: 32 }}>
            <a href="/">Home</a>
            <span>/</span>
            <a href="/blog">Blog</a>
            <span>/</span>
            <span>{post.title}</span>
          </div>

          {post.category && (
            <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: 12 }}>
              {post.category}
            </span>
          )}
          <h1 style={{ fontSize: 36, lineHeight: 1.2, marginBottom: 12 }}>{post.title}</h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 8 }}>
            {publishedDate}{post.author?.name ? ` by ${post.author.name}` : ''}
          </p>

          {post.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 32, flexWrap: 'wrap' }}>
              {post.tags.map((tag: string) => (
                <span key={tag} className="pill">{tag}</span>
              ))}
            </div>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 40 }} />

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{ lineHeight: 1.8, fontSize: 16 }}
          />

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginTop: 48, marginBottom: 32 }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/blog" className="btn btn-secondary">&larr; Back to Blog</a>
          </div>
        </article>
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

      <style>{`
        .blog-content h2 { font-size: 24px; margin: 32px 0 12px; }
        .blog-content h3 { font-size: 20px; margin: 28px 0 10px; }
        .blog-content p { margin-bottom: 16px; color: var(--text-secondary); }
        .blog-content ul, .blog-content ol { margin-bottom: 16px; padding-left: 24px; color: var(--text-secondary); }
        .blog-content li { margin-bottom: 6px; }
        .blog-content a { color: var(--accent); text-decoration: underline; }
        .blog-content blockquote {
          border-left: 3px solid var(--accent); padding: 12px 20px; margin: 20px 0;
          background: var(--surface-hover); border-radius: 0 var(--radius) var(--radius) 0;
          color: var(--text-secondary); font-style: italic;
        }
        .blog-content pre {
          background: #1a1a2e; color: #e2e8f0; padding: 20px; border-radius: var(--radius);
          overflow-x: auto; font-size: 14px; line-height: 1.6; margin-bottom: 16px;
        }
        .blog-content code { font-size: 14px; }
        .blog-content pre code { background: none; padding: 0; }
        .blog-content :not(pre) > code {
          background: var(--surface-hover); padding: 2px 6px; border-radius: 4px; font-size: 14px;
        }
        .blog-content img { max-width: 100%; border-radius: var(--radius); margin: 24px 0; }
      `}</style>
    </>
  )
}
