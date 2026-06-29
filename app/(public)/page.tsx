import Link from 'next/link'
import type { Metadata } from 'next'
import { HomeHero } from './HomeHero'
import { ServicesOverview } from './ServicesOverview'
import { ProcessPreview } from './ProcessPreview'
import { TechStackShowcase } from './TechStackShowcase'
import { CTABanner } from './CTABanner'

export const metadata: Metadata = {
  title: 'Vian Software Solutions — Custom Software Development',
  description: 'Custom software development, web applications, automation, and digital growth solutions. Based in Mumbai, serving clients worldwide since 2022.',
  openGraph: {
    title: 'Vian Software Solutions — Custom Software Development',
    description: 'Custom software development, web applications, automation, and digital growth solutions.',
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
    </>
  )
}