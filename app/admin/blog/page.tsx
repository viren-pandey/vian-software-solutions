'use client'

import { useState, useEffect } from 'react'

interface BlogPost {
  id: string
  title: string
  slug: string
  category: string
  published: boolean
  publishedAt: string | null
  createdAt: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/blogs')
      .then(r => r.ok ? r.json() : Promise.reject('Failed to load'))
      .then(data => { setPosts(data); setLoading(false) })
      .catch(e => { setError(e); setLoading(false) })
  }, [])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch (e: any) {
      alert(e.message || 'Delete failed')
    }
  }

  if (loading) return <div className="loading-state">Loading...</div>
  if (error) return <div className="empty-state"><h3>Error</h3><p>{error}</p></div>

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Blog Posts</h1>
          <p className="subtitle">Manage your blog content</p>
        </div>
        <a href="/admin/blog/new" className="btn btn-primary">New Post</a>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: 64, border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <h3>No blog posts yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Create your first blog post to get started.</p>
          <a href="/admin/blog/new" className="btn btn-primary" style={{ marginTop: 20 }}>Create Post</a>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td><strong>{post.title}</strong><br /><span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>/blog/{post.slug}</span></td>
                <td>{post.category || '—'}</td>
                <td><span className={`badge badge-${post.published ? 'success' : 'warning'}`}>{post.published ? 'Published' : 'Draft'}</span></td>
                <td>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={`/admin/blog/${post.id}`} className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }}>Edit</a>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px', fontSize: 12, color: 'var(--error)' }}
                      onClick={() => handleDelete(post.id, post.title)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
