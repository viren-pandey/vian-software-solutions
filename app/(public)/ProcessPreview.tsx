import Link from 'next/link'

const steps = [
  { number: '01', title: 'Discovery', description: 'Understanding your goals, challenges, and requirements.' },
  { number: '02', title: 'Planning', description: 'Architecture, tech stack, timeline, and cost estimation.' },
  { number: '03', title: 'Design', description: 'User experience, interface design, and prototyping.' },
  { number: '04', title: 'Development', description: 'Agile sprints with regular updates and milestone reviews.' },
  { number: '05', title: 'Testing', description: 'Quality assurance, security review, and performance testing.' },
  { number: '06', title: 'Deployment', description: 'Launch, configuration, and go-live support.' },
  { number: '07', title: 'Support', description: 'Ongoing maintenance, updates, and priority support.' },
]

export function ProcessPreview() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">How We Work</span>
          <h2>Transparent development process.</h2>
          <p className="section-description">
            Every project follows a structured, documented workflow from discovery to deployment and beyond.
          </p>
        </div>
        <div className="process-steps">
          {steps.map((step) => (
            <div key={step.number} className="process-step">
              <span className="process-step-number">{step.number}</span>
              <div className="process-step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="process-cta">
          <Link href="/process" className="btn btn-secondary">
            Learn more about our process
          </Link>
        </div>
      </div>
    </section>
  )
}