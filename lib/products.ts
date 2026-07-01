export interface Milestone {
  week: string
  description: string
}

export interface Product {
  id: string
  name: string
  price: number
  desc: string
  icon: string
  category: string
  features: string[]
  milestones: Milestone[]
}

export const products: Product[] = [
  {
    id: 'full-website-script', name: 'Full Website Script', price: 2999,
    desc: 'A complete, production-ready website script with an integrated admin panel, authentication system, responsive frontend, and structured deployment workflow. Suitable for corporate sites, SaaS landing pages, and service-based businesses.',
    icon: 'Globe', category: 'Web',
    features: ['Role-based admin panel with dashboard', 'User registration and login with JWT', 'Responsive UI built with modern CSS', 'Database schema with migrations', 'Deployment guide with hosting setup'],
    milestones: [
      { week: 'Week 1 (33%)', description: 'Project scaffold initialised with framework boilerplate, database schema designed and migrated, admin panel layout with sidebar navigation, and JWT-based authentication system deployed to staging environment.' },
      { week: 'Week 2 (70%)', description: 'User-facing pages built with responsive design, content management system integrated into admin panel, REST API endpoints for all CRUD operations, and form validation on client and server sides.' },
      { week: 'Week 3 (100%)', description: 'End-to-end testing across browsers, production bug fixes and edge case handling, deployment to production server with SSL, complete source code handover, and deployment guide with environment variable documentation.' },
    ],
  },
  {
    id: 'automation-script', name: 'Automation Script', price: 1999,
    desc: 'A customisable Python-based automation script designed to eliminate repetitive manual tasks. Supports data scraping, report generation, email automation, batch file processing, and API-driven workflows with minimal configuration.',
    icon: 'Zap', category: 'Automation',
    features: ['Cron-based task scheduler with interval control', 'Graceful error handling with retry logic', 'Structured logging to file and console', 'YAML configuration file for environment settings', 'Comprehensive usage and deployment documentation'],
    milestones: [
      { week: 'Week 1 (33%)', description: 'Requirements documented and script architecture designed, core automation logic implemented for primary use case, error handling framework with try-catch blocks and fallback behaviours, and logging module configured with rotation.' },
      { week: 'Week 2 (70%)', description: 'Full automation flow operational across all supported tasks, structured logging with rotation and console output, YAML-based configuration file with environment variable overrides, and CLI argument parser for runtime options.' },
      { week: 'Week 3 (100%)', description: 'Tested across multiple scenarios including edge cases and failure modes, performance profiling and optimisation for faster execution, comprehensive README with setup instructions and examples, and final source code delivered with MIT license.' },
    ],
  },
  {
    id: 'n8n-workflow-bundle', name: 'n8n Workflow Bundle', price: 1499,
    desc: 'A collection of five production-ready n8n automation workflows covering CRM synchronisation, email campaign triggers, invoice generation, lead routing, and Slack notifications. Each workflow includes error handling, logging, and environment variable configuration.',
    icon: 'RefreshCw', category: 'Automation',
    features: ['Five pre-built n8n workflows', 'REST API and webhook integrations', 'Error handling nodes on every branch', 'Execution logging and monitoring', 'Step-by-step setup and configuration guide'],
    milestones: [
      { week: 'Week 1 (33%)', description: 'Workflow architecture documented and n8n environment configured with Docker, first two workflows built covering CRM sync and email campaign triggers, and each workflow tested individually with sample data.' },
      { week: 'Week 2 (70%)', description: 'Remaining three workflows completed for invoice generation, lead routing, and Slack notifications, API integrations configured with credential management, and error handling with retry nodes added to all branches.' },
      { week: 'Week 3 (100%)', description: 'End-to-end integration testing across all five workflows, performance optimisation for execution speed and memory usage, setup guide with screenshots and credential setup instructions, and final workflow JSON exports delivered.' },
    ],
  },
  {
    id: 'api-working-script', name: 'API Working Script', price: 2499,
    desc: 'A fully functional REST API server built with Node.js and Express, featuring JWT authentication, rate limiting, PostgreSQL integration, input validation, and auto-generated API documentation. Ready to deploy as a microservice or backend for web and mobile applications.',
    icon: 'Plug', category: 'Backend',
    features: ['RESTful endpoint architecture with versioning', 'JWT-based access and refresh token authentication', 'Sliding window rate limiter per IP and route', 'PostgreSQL integration with Prisma ORM', 'Auto-generated Swagger API documentation'],
    milestones: [
      { week: 'Week 3 (100%)', description: 'Tested across all channels with sample templates and scenarios, performance optimisation for bulk notification dispatch, reusable integration examples in JavaScript and Python, and complete source code delivered.' },
    ],
  },
  {
    id: 'sample-spacedebrisai', name: 'Sample SpaceDebrisAI', price: 10,
    desc: 'A sample product for SpaceDebrisAI — a lightweight demo to test AI-powered space debris tracking and orbital analytics. Includes a basic dashboard with simulated debris data, trajectory visualisation, and collision risk scoring.',
    icon: 'Globe', category: 'Space',
    features: ['Simulated space debris tracking dashboard', 'Orbital trajectory visualisation', 'Collision risk scoring algorithm', 'Sample dataset with 50 debris objects', 'API endpoint for debris data retrieval', 'Basic analytics and reporting'],
    milestones: [
      { week: 'Week 1 (100%)', description: 'Sample product delivered with SpaceDebrisAI demo dashboard, simulated debris tracking data, orbital trajectory visualisation, collision risk scoring, API endpoint for data retrieval, and setup instructions for local deployment and testing.' },
    ],
  },
]

export function getProduct(id: string): Product | undefined {
  return products.find(p => p.id === id)
}
