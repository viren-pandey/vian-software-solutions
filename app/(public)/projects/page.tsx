import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects and research by Vian Software Solutions — internal products, AI research, and client work.',
}

const projects = [
  {
    name: 'Vian Platform',
    type: 'Internal SaaS',
    status: 'In Development',
    statusClass: 'development',
    description: 'A comprehensive platform for requesting quotations, managing projects, tracking invoices, processing payments, and monitoring progress through a centralized client dashboard.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'Neon PostgreSQL', 'Prisma'],
    year: '2024 — Present',
    detail: 'React, TypeScript, Tailwind CSS, Node.js, Express, Neon PostgreSQL, Prisma ORM',
  },
  {
    name: 'SmartCrowd',
    type: 'Research / Hackathon',
    status: 'Prototype',
    statusClass: 'prototype',
    description: 'An AI-powered crowd monitoring system that analyzes surveillance footage to estimate crowd density, identify overcrowding risks, and improve public safety.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'Python', 'Computer Vision'],
    year: '2024',
    detail: 'React, Vite, Tailwind CSS, Python, Computer Vision',
  },
  {
    name: 'DualityAI',
    type: 'Internal AI',
    status: 'Prototype',
    statusClass: 'prototype',
    description: 'A computer vision safety detection system using object detection models (YOLO) to identify workplace safety violations and improve monitoring.',
    tech: ['Python', 'YOLO', 'OpenCV'],
    year: '2024',
    detail: 'Python, YOLO, OpenCV',
  },
  {
    name: 'AURA',
    type: 'Internal AI',
    status: 'Active Development',
    statusClass: 'development',
    description: 'An intelligent AI assistant designed to reason about user requests, automate workflows, maintain contextual understanding, and support advanced conversational interactions.',
    tech: ['Python', 'Google ADK', 'LLM APIs'],
    year: '2025 — Present',
    detail: 'Python, Google ADK, LLM APIs',
  },
  {
    name: 'Space Debris Collision AI',
    type: 'Research',
    status: 'R&D',
    statusClass: 'research',
    description: 'An AI-assisted system that analyzes orbital data to help identify potential satellite collision risks using orbital mechanics and machine learning techniques.',
    tech: ['FastAPI', 'Python', 'React', 'SGP4'],
    year: '2024',
    detail: 'FastAPI, Python, React, SGP4',
  },
  {
    name: 'Vian Website',
    type: 'Internal',
    status: 'Production',
    statusClass: 'production',
    description: 'The official website of Vian Software Solutions — showcasing services, client portal, quotation workflow, and business information.',
    tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    year: '2024 — Present',
    detail: 'React, Next.js, TypeScript, Tailwind CSS',
  },
  {
    name: 'Enterprise Client Portal',
    type: 'Internal SaaS',
    status: 'Planning',
    statusClass: 'planning',
    description: 'A secure client management portal providing authentication, quotation management, payment history, invoices, notifications, messaging, and project tracking.',
    tech: ['React', 'Express', 'Prisma', 'Neon PostgreSQL'],
    year: 'Planning Phase',
    detail: 'React, Express, Prisma, Neon PostgreSQL',
  },
  {
    name: 'AI Business Automation Platform',
    type: 'Concept',
    status: 'Concept Phase',
    statusClass: 'planning',
    description: 'A planned automation platform integrating AI assistants, workflow automation, CRM features, document management, and API integrations to streamline business operations.',
    tech: ['React', 'Node.js', 'Python', 'AI APIs', 'PostgreSQL'],
    year: 'Concept Phase',
    detail: 'React, Node.js, Python, AI APIs, PostgreSQL',
  },
]

export default function ProjectsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Projects</span>
          </div>
          <span className="eyebrow">Projects & Research</span>
          <h1>What we are building.</h1>
          <p className="lead">A selection of internal products, research projects, and tools we have developed. This page grows as we build.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="projects-grid">
            {projects.map((project) => (
              <article key={project.name} className="project-card">
                <div className="project-card-header">
                  <span className="project-type">{project.type}</span>
                  <span className={`project-status status-${project.statusClass}`}>{project.status}</span>
                </div>
                <h2 className="project-title">{project.name}</h2>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((t) => (
                    <span key={t} className="tech-tag">{t}</span>
                  ))}
                </div>
                <div className="project-footer">
                  <span className="project-year muted">{project.year}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="projects-note">
            <p className="muted" style={{ textAlign: 'center', marginTop: 48 }}>
              Some of these projects are internal tools or research prototypes.
              Client-specific work is showcased with permission on a case-by-case basis.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="cta-banner">
            <h2>Have a project in mind?</h2>
            <p>We are always open to new challenges. Tell us about your idea.</p>
            <a href="/contact" className="btn btn-primary btn-lg">Start a Conversation</a>
          </div>
        </div>
      </section>
    </>
  )
}