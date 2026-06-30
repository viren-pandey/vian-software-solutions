import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog - Software Development Insights & Guides',
  description: 'Read expert insights, guides, and thought leadership on software development, web applications, automation, SEO, and digital growth from Vian Software Solutions.',
  keywords: ['software development blog', 'web development tips', 'business automation guide', 'tech insights mumbai', 'custom software guide', 'digital transformation blog'],
  openGraph: {
    title: 'Blog - Vian Software Solutions',
    description: 'Expert insights on software development, automation, and digital growth from the Vian team.',
  },
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string | null
  tags: string[]
  publishedAt: string | null
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || ''
    const res = await fetch(`${base}/api/blogs?limit=50`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.posts || []
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Blog</span>
          </div>
          <span className="eyebrow">Blog</span>
          <h1>Insights and articles.</h1>
          <p className="lead">Thoughts on software development, technology decisions, and building digital products that last.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720, marginInline: 'auto' }}>
          {posts.length === 0 ? (
            <div className="empty-state">
              <h3>No posts yet</h3>
              <p>We are working on our first articles. Check back soon.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="project-card" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                  <div className="project-card-header">
                    <span className="project-type">{post.category || 'General'}</span>
                    <span className="muted" style={{ fontSize: '0.85rem' }}>
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                    </span>
                  </div>
                  <h2 className="project-title">{post.title}</h2>
                  <p className="project-description">{post.excerpt || ''}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                      {post.tags.map((tag) => (
                        <span key={tag} className="pill">{tag}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
