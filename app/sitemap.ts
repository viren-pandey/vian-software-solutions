import type { MetadataRoute } from 'next'

async function getPublishedSlugs(): Promise<string[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || ''
    const res = await fetch(`${base}/api/blogs?limit=100`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data.posts || []).map((p: { slug: string }) => p.slug)
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.viannn.online'
  const pages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/process`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/technologies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/security`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/legal/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/legal/terms-and-conditions`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/legal/refund-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/legal/cookie-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/shipping-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/payment-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/legal/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const slugs = await getPublishedSlugs()
  slugs.forEach((slug) => {
    pages.push({
      url: `${base}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  })

  return pages
}
