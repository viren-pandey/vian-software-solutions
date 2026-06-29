import Link from 'next/link'

const techCategories = [
  {
    category: 'Frontend',
    techs: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    category: 'Backend',
    techs: ['Node.js', 'Python', 'FastAPI', 'Express'],
  },
  {
    category: 'Database',
    techs: ['PostgreSQL', 'Neon', 'Prisma ORM'],
  },
  {
    category: 'Infrastructure',
    techs: ['Docker', 'Vercel', 'GitHub Actions', 'Cloudflare'],
  },
  {
    category: 'AI & ML',
    techs: ['OpenAI', 'Google ADK', 'YOLO', 'LangChain'],
  },
  {
    category: 'Security',
    techs: ['JWT', 'bcrypt', 'Helmet', 'Zod'],
  },
]

export function TechStackShowcase() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Technology Stack</span>
          <h2>Modern tools for modern solutions.</h2>
          <p className="section-description">
            We select technologies based on project requirements, not trends.
          </p>
        </div>
        <div className="tech-grid">
          {techCategories.map((cat) => (
            <div key={cat.category} className="tech-category-card">
              <h3 className="tech-category-title">{cat.category}</h3>
              <ul className="tech-list">
                {cat.techs.map((tech) => (
                  <li key={tech} className="tech-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tech-check"><polyline points="20 6 9 17 4 12"/></svg>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="tech-cta">
          <Link href="/technologies" className="btn btn-secondary">
            View detailed technology stack
          </Link>
        </div>
      </div>
    </section>
  )
}