import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="main-content">
        {children}
      </main>
      <Footer />
    </>
  )
}