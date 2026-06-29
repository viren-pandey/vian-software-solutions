import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles and insights from Vian Software Solutions on software development, technology, and business.',
}

const posts = [
  {
    title: 'Why custom software beats off-the-shelf solutions',
    excerpt: 'Most businesses eventually hit a wall with off-the-shelf software. Here is when it makes sense to build custom.',
    date: 'Coming soon',
    category: 'Software Development',
  },
  {
    title: 'How we structure our development process',
    excerpt: 'A transparent look at how we take a project from idea to deployment.',
    date: 'Coming soon',
    category: 'Process',
  },
  {
    title: 'Choosing the right tech stack for your project',
    excerpt: 'A practical guide to making technology decisions that won not lock you in.',
    date: 'Coming soon',
    category: 'Technology',
  },
]

export default function BlogPage() {
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
                <article key={post.title} className="project-card" style={{ cursor: 'default' }}>
                  <div className="project-card-header">
                    <span className="project-type">{post.category}</span>
                    <span className="muted" style={{ fontSize: '0.85rem' }}>{post.date}</span>
                  </div>
                  <h2 className="project-title">{post.title}</h2>
                  <p className="project-description">{post.excerpt}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}