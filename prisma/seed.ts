import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const BLOG_POSTS = [
  {
    title: 'Why Your Business Needs a Custom Web Application in 2026',
    slug: 'why-custom-web-app-2026',
    excerpt: 'Off-the-shelf software is reaching its limits. Here\'s why forward-thinking businesses are investing in custom web applications tailored to their exact needs.',
    category: 'Development',
    tags: ['web development', 'custom software', 'business growth'],
    published: true,
    content: `<h2>The One-Size-Fits-All Problem</h2>
<p>Most businesses start with off-the-shelf solutions. They are quick to deploy, relatively cheap, and well understood. But as your operation scales, the cracks begin to show. Workarounds pile up. Integrations become brittle. Your team spends more time fighting the tool than doing the work.</p>
<p>A custom web application solves this at the root. Built around your exact workflows, it grows with you instead of against you.</p>

<h2>Security & Compliance</h2>
<p>Off-the-shelf platforms are high-value targets. When a vulnerability is discovered, every instance of that software is exposed simultaneously. Custom applications benefit from <strong>security through obscurity</strong> and can be hardened to meet your specific compliance requirements — whether that's GDPR, HIPAA, or SOC 2.</p>

<h2>Long-Term Cost Efficiency</h2>
<p>The upfront investment in custom development pays for itself over time. No more per-seat licensing, forced upgrades, or paying for features you don't use. Your application does exactly what you need and nothing else.</p>

<h3>When should you go custom?</h3>
<ul>
<li>Your workflows are unique and existing tools require heavy modification</li>
<li>You handle sensitive data requiring strict compliance</li>
<li>You're paying for multiple tools that could be consolidated into one</li>
<li>Your team spends significant time on manual data entry between systems</li>
</ul>

<h2>The Bottom Line</h2>
<p>Custom web applications are no longer just for enterprise. With modern frameworks and cloud infrastructure, small and mid-size businesses can access the same advantages. The question isn't whether you can afford custom software — it's whether you can afford to keep fighting your tools.</p>`,
  },
  {
    title: 'Next.js 15: What\'s New and Why It Matters',
    slug: 'nextjs-15-whats-new',
    excerpt: 'The latest major release of Next.js brings significant performance improvements and developer experience enhancements. Here\'s our take.',
    category: 'Development',
    tags: ['nextjs', 'react', 'web development', 'frontend'],
    published: true,
    content: `<h2>A Brief Overview</h2>
<p>Next.js 15 marks a major milestone for the React framework. With improvements across the board — from compilation speed to runtime performance — it's the most compelling version yet for building production web applications.</p>

<h2>Key Highlights</h2>

<h3>Enhanced Partial Prerendering</h3>
<p>Partial Prerendering (PPR) moves from experimental to stable. This allows you to combine static and dynamic content on the same page without sacrificing performance. Static shells load instantly while dynamic content streams in — giving users the best of both worlds.</p>

<h3>Improved Server Components</h3>
<p>Server Components are now the default rendering model. This shifts expensive computations and data fetching to the server, reducing the JavaScript bundle sent to the browser. Pages load faster and users on slow connections benefit enormously.</p>

<h3>Simplified Data Fetching</h3>
<p>The new <code>use</code> hook and streamlined server-side data fetching patterns reduce boilerplate. Combined with React 19's concurrent features, your application feels more responsive with less code.</p>

<blockquote>"Next.js 15 isn't just an upgrade — it's a paradigm shift in how we build for the web."</blockquote>

<h2>Should You Upgrade?</h2>
<p>If you're starting a new project, absolutely. For existing projects, the migration path is well-documented and the performance gains are substantial. At Vian, we've already migrated several client projects and seen 30-50% improvements in Lighthouse scores.</p>

<p>The web moves fast. Next.js 15 ensures you can keep up without sacrificing developer experience or user experience.</p>`,
  },
  {
    title: 'Automating Your Business Workflows: A Practical Guide',
    slug: 'automating-business-workflows',
    excerpt: 'Learn how workflow automation can save your team hundreds of hours per month — and how to get started without disrupting operations.',
    category: 'Automation',
    tags: ['automation', 'workflow', 'productivity', 'business processes'],
    published: true,
    content: `<h2>Where Does the Time Go?</h2>
<p>Most organizations lose 20-30% of productive hours to repetitive manual tasks: data entry, report generation, email follow-ups, approval chains. These tasks are essential but don't require human judgment. That's where automation delivers its biggest impact.</p>

<h2>Identifying Automation Opportunities</h2>
<p>The best automation candidates share three characteristics:</p>
<ul>
<li><strong>Repetitive:</strong> Performed on a regular schedule or triggered by common events</li>
<li><strong>Rule-based:</strong> Decisions follow clear if-then logic</li>
<li><strong>High-volume:</strong> Even small time savings compound across hundreds of occurrences</li>
</ul>

<h3>Common Candidates</h3>
<ul>
<li>Invoice processing and payment reconciliation</li>
<li>Customer onboarding and welcome sequences</li>
<li>Report generation and distribution</li>
<li>Data synchronization between CRM, accounting, and project management tools</li>
<li>Support ticket triage and routing</li>
</ul>

<h2>Building vs. Buying</h2>
<p>Zapier and Make (formerly Integromat) are excellent for simple automations. But when your workflows involve custom logic, proprietary data sources, or complex conditional branching, a custom automation solution becomes necessary.</p>

<h2>Measuring Success</h2>
<p>Before automating, establish baseline metrics: time spent, error rates, and throughput. After implementation, track the same metrics. Organizations we've worked with typically see:</p>
<ul>
<li>60-80% reduction in processing time</li>
<li>Near-zero error rates for automated steps</li>
<li>ROI within 3-6 months of deployment</li>
</ul>

<h2>Getting Started</h2>
<p>Start small. Pick one manual process that frustrates your team, map it end-to-end, and automate a single step. Prove the value, then expand. Within a quarter, you'll wonder how you ever operated without automation.</p>`,
  },
  {
    title: 'Technical SEO: The Foundation of Organic Growth',
    slug: 'technical-seo-foundation',
    excerpt: 'Before you write another blog post or build another backlink, make sure your technical SEO fundamentals are solid. Here\'s what matters most in 2026.',
    category: 'SEO & Growth',
    tags: ['seo', 'technical seo', 'organic growth', 'web performance'],
    published: true,
    content: `<h2>Content Gets the Credit, Tech Does the Work</h2>
<p>Great content can't rank if search engines can't find, crawl, or understand it. Technical SEO is the infrastructure beneath every successful organic growth strategy. Without it, your best content is invisible.</p>

<h2>Core Web Vitals Still Matter</h2>
<p>Google's Core Web Vitals remain ranking factors, but the thresholds have tightened. In 2026, you need:</p>
<ul>
<li><strong>LCP:</strong> Under 2.0 seconds (down from 2.5)</li>
<li><strong>FID/INP:</strong> Under 100 milliseconds</li>
<li><strong>CLS:</strong> Under 0.05 (down from 0.1)</li>
</ul>
<p>If your site doesn't meet these benchmarks, every other SEO effort is fighting uphill.</p>

<h3>Audit Checklist</h3>
<ol>
<li>Run a full crawl with Screaming Frog or Sitebulb</li>
<li>Check for orphaned pages and broken internal links</li>
<li>Audit your XML sitemaps and robots.txt</li>
<li>Verify canonical tags are consistent</li>
<li>Test structured data with Google's Rich Results tool</li>
<li>Review server logs for crawl patterns</li>
</ol>

<h2>Indexing Efficiency</h2>
<p>Google has a crawl budget for your site. Make every request count. Block low-value pages in robots.txt, consolidate thin content, and use <code>noindex</code> tags strategically. The fewer pages Google has to crawl to find your important content, the better.</p>

<h2>Structured Data Is No Longer Optional</h2>
<p>Rich snippets drive significantly higher click-through rates. Implementing proper schema markup — Article, FAQ, HowTo, Product, LocalBusiness — helps search engines understand your content and present it attractively in SERPs.</p>

<h2>The Payoff</h2>
<p>Solid technical SEO doesn't just improve rankings. It improves user experience, conversion rates, and site maintainability. It's the gift that keeps giving — every content piece you publish afterward inherits a stronger foundation.</p>`,
  },
  {
    title: 'Building a Modern Brand: Strategy Beyond the Logo',
    slug: 'modern-brand-strategy',
    excerpt: 'A logo alone doesn\'t build a brand. Explore the comprehensive approach to brand building that resonates with today\'s discerning customers.',
    category: 'Business',
    tags: ['branding', 'business strategy', 'digital presence', 'marketing'],
    published: false,
    content: `<h2>Brand Is Not a Logo</h2>
<p>Too many businesses treat branding as a design project. You get a logo, pick some colors, and call it done. But a brand is the sum total of every interaction a customer has with your business — from your website to your support emails to the way your invoices look.</p>

<h2>The Four Pillars of Modern Branding</h2>

<h3>1. Clarity of Purpose</h3>
<p>Why does your company exist beyond making money? What problem do you solve that no one else solves quite the same way? Your purpose is the anchor of your brand. Every decision — product, pricing, marketing — should trace back to it.</p>

<h3>2. Consistent Voice</h3>
<p>Your brand voice should be recognizable whether someone reads your Twitter bio, a support ticket response, or a landing page headline. Consistency builds trust. Trust builds loyalty.</p>

<h3>3. Visual Identity Systems</h3>
<p>A modern visual identity goes beyond a logo. It includes typography, iconography, photography style, data visualization approach, and motion guidelines. These elements work together to create a cohesive experience across every touchpoint.</p>

<h3>4. Digital Presence Strategy</h3>
<p>In 2026, your website is your headquarters. Social media is your storefront. Email is your relationship channel. Each serves a distinct purpose and should be designed accordingly.</p>

<h2>Brand Audits: Why They Matter</h2>
<p>We recommend conducting a brand audit every 12-18 months. Review your digital presence, customer feedback, competitive positioning, and internal alignment. Markets shift. Customer expectations evolve. Your brand should evolve with them.</p>

<p><em>This post is a draft — check back for the full version.</em></p>`,
  },
]

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
  } else {
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

  // Seed blog posts
  const adminUser = await prisma.user.findUnique({ where: { email } })
  if (adminUser) {
    for (const post of BLOG_POSTS) {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: post.tags,
          published: post.published,
          publishedAt: post.published ? new Date() : null,
          authorId: adminUser.id,
        },
        create: {
          ...post,
          publishedAt: post.published ? new Date() : null,
          authorId: adminUser.id,
        },
      })
    }
    console.log(`Seeded ${BLOG_POSTS.length} blog posts.`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
