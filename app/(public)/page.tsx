import Link from 'next/link'
import type { Metadata } from 'next'
import { HomeHero } from './HomeHero'
import { siteUrl, breadcrumbJsonLd, websiteJsonLd } from '@/lib/seo'
import { ServicesOverview } from './ServicesOverview'
import { ProcessPreview } from './ProcessPreview'
import { TechStackShowcase } from './TechStackShowcase'
import { CTABanner } from './CTABanner'

export const metadata: Metadata = {
  title: 'Vian Software Solutions — Custom Software Development',
  description: 'Custom software development, web applications, automation, and digital growth solutions. Based in Mumbai, serving clients worldwide since 2022.',
  keywords: ['custom software development', 'web application development', 'mumbai software company', 'automation services', 'digital growth solutions'],
  openGraph: {
    title: 'Vian Software Solutions — Custom Software Development',
    description: 'Custom software development, web applications, automation, and digital growth solutions.',
    images: [{ url: `${siteUrl}/assets/logo/og-image.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vian Software Solutions — Custom Software Development',
    description: 'Custom software development, web applications, automation, and digital growth solutions.',
  },
  alternates: {
    canonical: `${siteUrl}/`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ServicesOverview />
      <ProcessPreview />
      <TechStackShowcase />
      <CTABanner />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Vian Software Solutions',
            url: siteUrl,
            description: 'Custom software development, web applications, automation, and digital growth solutions.',
            foundingDate: '2022',
            founder: { '@type': 'Person', name: 'Viren Pandey' },
            address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressRegion: 'Maharashtra', addressCountry: 'IN' },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Home', item: '/' }])) }}
      />
    </>
  )
}