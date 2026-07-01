import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getPost(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug, published: true },
      include: { author: { select: { id: true, name: true } } },
    })
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.title,
    description: post.excerpt || `Read about ${post.title} on Vian Software Solutions blog.`,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.publishedAt?.toISOString() || undefined,
      authors: post.author ? [post.author.name] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ maxWidth: 720, marginInline: 'auto' }}>
          <div className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <a href="/blog">Blog</a>
            <span>/</span>
            <span>{post.title}</span>
          </div>
          <span className="eyebrow">{post.category || 'Article'}</span>
          <h1>{post.title}</h1>
          <p className="muted" style={{ marginTop: 12 }}>
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            {post.author ? ` · By ${post.author.name}` : ''}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              {post.tags.map((tag) => (
                <span key={tag} className="pill">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 720, marginInline: 'auto' }}>
          <div className="card" style={{ padding: '40px 48px', lineHeight: 1.8, fontSize: 16 }}>
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p className="muted">No content available.</p>
            )}
          </div>
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Link href="/blog" className="btn btn-secondary">&larr; Back to Blog</Link>
          </div>
        </div>
      </section>
    </>
  )
}