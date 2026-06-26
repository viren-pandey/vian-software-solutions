import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const SERVICES = [
  {
    name: 'Website Development',
    slug: 'website-development',
    description: 'Corporate websites, landing pages, portals, and e-commerce platforms built for performance and clarity.',
    category: 'web',
  },
  {
    name: 'Software Development',
    slug: 'software-development',
    description: 'Custom applications, CRM, ERP, APIs, cloud systems, and database architecture for growing organizations.',
    category: 'software',
  },
  {
    name: 'Automation & AI',
    slug: 'automation-ai',
    description: 'Workflow automation, AI integrations, process optimization, and intelligent reporting systems.',
    category: 'automation',
  },
  {
    name: 'SEO & Digital Growth',
    slug: 'seo-digital-growth',
    description: 'Technical SEO, content strategy, analytics, conversion optimization, and social media consultation.',
    category: 'growth',
  },
  {
    name: 'Technology Consulting',
    slug: 'technology-consulting',
    description: 'Architecture review, platform selection, infrastructure planning, and technology strategy for teams.',
    category: 'consulting',
  },
]

async function main() {
  // Seed services
  for (const svc of SERVICES) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: { name: svc.name, description: svc.description, category: svc.category, active: true },
      create: svc,
    })
  }
  console.log(`Seeded ${SERVICES.length} services.`)

  // Seed admin user
  const email = process.env.ADMIN_EMAIL || 'pandeyviren68@gmail.com'
  const password = process.env.ADMIN_PASSWORD || 'pandeyviren688'
  const name = process.env.ADMIN_NAME || 'Admin'

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    const passwordHash = await bcrypt.hash(password, 12)
    await prisma.user.update({ where: { email }, data: { passwordHash, name } })
    console.log(`Admin user updated: ${email}`)
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      emailVerifiedAt: new Date(),
      roles: {
        create: { role: 'admin' }
      }
    }
  })

  console.log(`Admin user created: ${user.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
