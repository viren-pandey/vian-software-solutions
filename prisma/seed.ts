import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'pandeyviren68@gmail.com'
  const password = process.env.ADMIN_PASSWORD || 'pandeyviren68'
  const name = process.env.ADMIN_NAME || 'Admin'

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    console.log('Admin user already exists, skipping creation.')
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
