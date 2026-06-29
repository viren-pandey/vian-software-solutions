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
  keywords: ['software development', 'web development', 'custom applications', 'automation', 'AI integration', 'SaaS development', 'API development', 'digital transformation'],
  authors: [{ name: 'Vian Software Solutions' }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.viannn.online',
    siteName: 'Vian Software Solutions',
    title: 'Vian Software Solutions — Custom Software Development',
    description: 'Custom software development, web applications, automation, and digital growth solutions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vian Software Solutions',
    description: 'Custom software development, web applications, automation, and digital growth solutions.',
  },
  icons: {
    icon: '/assets/logo/favicon.svg',
    shortcut: '/assets/logo/favicon.svg',
    apple: '/assets/logo/favicon.svg',
  },
  manifest: '/site.webmanifest',
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