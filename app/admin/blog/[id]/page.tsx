'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string | undefined

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tagsStr, setTagsStr] = useState('')
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) { router.replace('/admin/blog'); return }
    fetch(`/api/admin/blogs/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject('Failed to load post'))
      .then(data => {
        setTitle(data.title)
        setSlug(data.slug)
        setExcerpt(data.excerpt || '')
        setContent(data.content || '')
        setCategory(data.category || '')
        setTagsStr((data.tags || []).join(', '))
        setPublished(data.published)
        setLoading(false)
      })
      .catch(e => {
        setError(typeof e === 'string' ? e : 'Failed to load post')
        setLoading(false)
      })
  }, [id])

  function generateSlug(t: string) {
    setSlug(t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !slug) { setError('Title and slug are required'); return }
    setSaving(true); setError('')

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, slug, excerpt, content, category,
          tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
          published,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update post')
      }
      router.push('/admin/blog')
      router.refresh()
    } catch (e: any) {
      setError(e.message)
      setSaving(false)
    }
  }

  if (loading) return <div className="loading-state">Loading...</div>
  if (error && !title) return <div className="empty-state"><h3>Error</h3><p>{error}</p></div>

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Edit Blog Post</h1>
          <p className="subtitle">Update your article</p>
        </div>
        <a href="/admin/blog" className="btn btn-secondary">Cancel</a>
      </div>

      <form onSubmit={handleSubmit} className="dash-form" style={{ maxWidth: 800 }}>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>Title</label>
          <input type="text" value={title} onChange={e => { setTitle(e.target.value); generateSlug(e.target.value) }} placeholder="Post title" required />
        </div>

        <div className="form-group">
          <label>Slug</label>
          <input type="text" value={slug} onChange={e => setSlug(e.target.value)} placeholder="post-slug" required />
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>URL: /blog/{slug || 'post-slug'}</div>
        </div>

        <div className="form-group">
          <label>Excerpt</label>
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Brief summary for list pages" rows={3} />
        </div>

        <div className="form-group">
          <label>Content</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Category</label>
            <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Development, SEO" />
          </div>
          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input type="text" value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="react, nextjs, web" />
          </div>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="published" checked={published} onChange={e => setPublished(e.target.checked)} style={{ width: 'auto' }} />
          <label htmlFor="published" style={{ margin: 0 }}>Publish immediately</label>
        </div>

        <div className="quick-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
