import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ToastContainer } from '@/components/ui/Toast'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.viannn.online'),
  title: {
    default: 'Vian Software Solutions — Custom Software Development',
    template: '%s | Vian Software Solutions',
  },
  description: 'Custom software development, web applications, automation, and digital growth solutions. Based in Mumbai, serving clients worldwide since 2022.',
  keywords: [
    'software development company mumbai', 'web development', 'custom software', 'business automation',
    'AI integration services', 'SaaS development', 'API development', 'digital transformation',
    'enterprise software', 'custom web applications', 'mobile app development', 'cloud solutions',
    'software consultant mumbai', 'tech startup india', 'MVP development', 'full stack development',
  ],
  authors: [{ name: 'Vian Software Solutions', url: 'https://www.viannn.online' }],
  robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  alternates: { canonical: 'https://www.viannn.online' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.viannn.online',
    siteName: 'Vian Software Solutions',
    title: 'Vian Software Solutions — Custom Software Development',
    description: 'Custom software development, web applications, automation, and digital growth solutions. Based in Mumbai, serving clients worldwide since 2022.',
    images: [{ url: '/assets/logo/og-image.png', width: 1200, height: 630, alt: 'Vian Software Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vian Software Solutions',
    description: 'Custom software development, web applications, automation, and digital growth solutions. Based in Mumbai.',
    images: ['/assets/logo/og-image.png'],
  },
  icons: {
    icon: '/assets/logo/favicon.svg',
    shortcut: '/assets/logo/favicon.svg',
    apple: '/assets/logo/favicon.svg',
  },
  manifest: '/site.webmanifest',
  verification: { google: 'google-site-verification-code' },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Vian Software Solutions',
              url: 'https://www.viannn.online',
              logo: 'https://www.viannn.online/assets/logo/favicon.svg',
              description: 'Custom software development, web applications, automation, and digital growth solutions. Based in Mumbai, serving clients worldwide since 2022.',
              foundingDate: '2022',
              founder: { '@type': 'Person', name: 'Viren Pandey' },
              address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' },
              sameAs: ['https://github.com/viren-pandey', 'https://www.linkedin.com/company/vian-software-solutions'],
              contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: 'support@viannn.online', availableLanguage: ['English', 'Hindi'] },
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  )
}