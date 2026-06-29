import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.viannn.online'
  const pages = [
    '', '/about', '/services', '/products', '/pricing', '/projects', '/process',
    '/technologies', '/team', '/security', '/blog', '/faq', '/contact',
    '/legal/privacy-policy', '/legal/terms-and-conditions',
    '/legal/refund-policy', '/legal/cookie-policy', '/legal/shipping-policy',
  ]

  return pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'monthly' : 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }))
}