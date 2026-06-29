import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Technologies',
  description: 'The technology stack used by Vian Software Solutions — modern, battle-tested tools for building reliable software.',
}

const techCategories = [
  {
    category: 'Frontend',
    description: 'Modern, responsive, and accessible user interfaces.',
    techs: [
      { name: 'React', why: 'Component-based architecture for building reusable, maintainable UIs.' },
      { name: 'Next.js', why: 'React framework with SSR, SSG, and excellent developer experience.' },
      { name: 'TypeScript', why: 'Type safety reduces bugs and improves code quality at scale.' },
      { name: 'Tailwind CSS', why: 'Utility-first CSS for rapid, consistent design without fighting specificity.' },
    ],
  },
  {
    category: 'Backend',
    description: 'Scalable, secure, and performant server-side systems.',
    techs: [
      { name: 'Node.js', why: 'JavaScript runtime for building fast, scalable network applications.' },
      { name: 'Express', why: 'Minimalist web framework for Node.js with a rich ecosystem.' },
      { name: 'Python', why: 'Versatile language for backend, AI, automation, and data processing.' },
      { name: 'FastAPI', why: 'High-performance Python framework with automatic OpenAPI docs.' },
    ],
  },
  {
    category: 'Database',
    description: 'Reliable data storage with strong consistency and performance.',
    techs: [
      { name: 'PostgreSQL', why: 'Battle-tested relational database with ACID compliance and extensibility.' },
      { name: 'Neon', why: 'Serverless PostgreSQL with branching, auto-scaling, and instant provisioning.' },
      { name: 'Prisma ORM', why: 'Type-safe database access with auto-generated queries and migrations.' },
    ],
  },
  {
    category: 'Infrastructure',
    description: 'Cloud-native deployment and DevOps tooling.',
    techs: [
      { name: 'Docker', why: 'Containerized deployments for consistency across environments.' },
      { name: 'Vercel', why: 'Edge-optimized hosting with automatic CI/CD and preview deployments.' },
      { name: 'GitHub Actions', why: 'Automated testing, linting, and deployment pipelines.' },
      { name: 'Cloudflare', why: 'CDN, DDoS protection, and DNS management for global performance.' },
    ],
  },
  {
    category: 'AI & Machine Learning',
    description: 'Intelligent systems for automation and analysis.',
    techs: [
      { name: 'OpenAI API', why: 'Access to GPT models for natural language understanding and generation.' },
      { name: 'Google ADK', why: 'Agent Development Kit for building AI assistants and automation agents.' },
      { name: 'LangChain', why: 'Framework for developing applications powered by language models.' },
      { name: 'YOLO', why: 'Real-time object detection for computer vision applications.' },
    ],
  },
  {
    category: 'Security',
    description: 'Tools and practices for building secure applications.',
    techs: [
      { name: 'JWT', why: 'Stateless authentication tokens for secure API access.' },
      { name: 'bcrypt', why: 'Industry-standard password hashing with built-in salting.' },
      { name: 'Helmet', why: 'Express middleware for security headers (CSP, HSTS, XSS, etc.).' },
      { name: 'Zod', why: 'TypeScript-first schema validation to catch invalid data early.' },
    ],
  },
]

export default function TechnologiesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Technologies</span>
          </div>
          <span className="eyebrow">Technology</span>
          <h1>The tools we use.</h1>
          <p className="lead">We choose technologies based on what is best for the project — not what is trending. Here is our current stack and why we use it.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {techCategories.map((cat, index) => (
            <div key={cat.category} className={`tech-section ${index > 0 ? 'section-divider' : ''}`}>
              <div className="section-head" style={{ textAlign: 'left' }}>
                <span className="eyebrow">{cat.category}</span>
                <h2>{cat.description}</h2>
              </div>
              <div className="tech-detail-grid">
                {cat.techs.map((tech) => (
                  <div key={tech.name} className="tech-detail-card">
                    <h3>{tech.name}</h3>
                    <p className="muted">{tech.why}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}