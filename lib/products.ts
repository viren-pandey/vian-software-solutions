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
      { week: 'Week 1 (33%)', description: 'API architecture designed with route versioning strategy, PostgreSQL database schema created with Prisma migrations, JWT authentication system implemented with access and refresh token rotation, and base route structure with middleware pipeline.' },
      { week: 'Week 2 (70%)', description: 'All REST endpoints implemented with consistent response format, rate limiting applied per endpoint group with configurable thresholds, request validation using Zod schemas, and database query optimisation for common access patterns.' },
      { week: 'Week 3 (100%)', description: 'Security audit covering SQL injection, XSS, and CSRF vectors, error handling refined with structured error responses, Swagger/OpenAPI documentation auto-generated from route definitions, and production-ready source code delivered with environment templates.' },
    ],
  },
  {
    id: 'admin-dashboard', name: 'Admin Dashboard', price: 3999,
    desc: 'A professional-grade admin dashboard built with React and a modern stack. Includes user management, analytics visualisation, role-based access control, settings management, and a fully responsive layout optimised for desktop and tablet use.',
    icon: 'BarChart3', category: 'Dashboard',
    features: ['User CRUD with search, filter, and pagination', 'Interactive analytics charts and data tables', 'Role-based access control for admin and reviewer', 'Application settings page with persistable config', 'Responsive design for desktop, tablet, and mobile'],
    milestones: [
      { week: 'Week 1 (33%)', description: 'Dashboard scaffold initialised with React and routing, sidebar navigation with collapsible menu groups, JWT authentication integrated with protected routes, and user management CRUD with server-side pagination and search.' },
      { week: 'Week 2 (70%)', description: 'Analytics dashboard with Chart.js widgets and date range filtering, role-based access control restricting pages by permission level, settings page with form validation and local persistence, and responsive layout tested at three breakpoints.' },
      { week: 'Week 3 (100%)', description: 'UI polish with loading skeletons and empty states, data visualisation refined for clarity and accessibility, cross-device and cross-browser testing completed, documentation written for deployment and configuration, and final source code delivered.' },
    ],
  },
  {
    id: 'user-management-system', name: 'User Management System', price: 1999,
    desc: 'A complete authentication and user management backend and frontend system. Covers registration, login, password reset, email verification, profile management, and an admin panel for user oversight. Built with security best practices including bcrypt password hashing and CSRF protection.',
    icon: 'Users', category: 'Backend',
    features: ['User registration with email verification', 'Login with session management and remember-me', 'Password reset flow with expiry tokens', 'Profile management with avatar upload', 'Admin panel with user listing and role assignment', 'Email notification templates for all auth events'],
    milestones: [
      { week: 'Week 1 (33%)', description: 'User model designed with Prisma schema including profile fields, registration and login API endpoints built with bcrypt password hashing, JWT token management with configurable expiry, and email verification flow with one-time tokens.' },
      { week: 'Week 2 (70%)', description: 'Password reset flow with time-limited tokens and email delivery, profile management page with avatar upload to cloud storage, admin user management panel with search, filtering, and role assignment, and HTML email template system for all auth events.' },
      { week: 'Week 3 (100%)', description: 'Security testing covering OWASP top 10 for authentication systems, email delivery configured with SMTP provider, comprehensive documentation for frontend and admin users, and full source code with environment configuration delivered.' },
    ],
  },
  {
    id: 'db-management-tool', name: 'DB Management Tool', price: 1499,
    desc: 'A web-based database administration tool that provides a graphical interface for running queries, browsing tables, exporting and importing data, and managing backups. Supports PostgreSQL and MySQL databases with a clean, intuitive interface.',
    icon: 'Database', category: 'Tool',
    features: ['SQL query builder with syntax highlighting', 'Table viewer with sort, filter, and pagination', 'Data export to CSV and JSON formats', 'Data import from CSV with column mapping', 'Automated database backup and restore'],
    milestones: [
      { week: 'Week 1 (33%)', description: 'Database connection manager supporting multiple simultaneous connections, table listing with schema viewer showing columns, indexes, and constraints, and basic query runner with results displayed in a paginated table.' },
      { week: 'Week 2 (70%)', description: 'Advanced query builder with Monaco editor syntax highlighting, export functionality to CSV and JSON with formatting options, data import from CSV with automatic column type detection and mapping interface.' },
      { week: 'Week 3 (100%)', description: 'Backup and restore features with compression and scheduling, SQL injection prevention and query timeout enforcement, performance optimisation for large datasets, and user documentation with examples delivered.' },
    ],
  },
  {
    id: 'seo-toolkit-script', name: 'SEO Toolkit Script', price: 999,
    desc: 'An SEO analysis and reporting toolkit that audits meta tags, analyses keyword density, generates XML sitemaps, scores pages against SEO best practices, and produces professional PDF reports. Designed for digital agencies and content teams.',
    icon: 'TrendingUp', category: 'Tool',
    features: ['Meta tag checker with recommendations', 'Keyword density and frequency analysis', 'XML sitemap generator with auto-discovery', 'SEO score with actionable recommendations', 'Best practices guide with checklist'],
    milestones: [
      { week: 'Week 1 (33%)', description: 'SEO analysis engine architecture designed for extensibility, meta tag checker validating title, description, og tags, and robots directives, and keyword density analyser with TF-IDF scoring implemented.' },
      { week: 'Week 2 (70%)', description: 'XML sitemap generator supporting multiple sitemap indexes and lastmod timestamps, SEO scoring algorithm evaluating 15+ ranking factors, performance suggestion engine analysing page speed metrics, and PDF report generation.' },
      { week: 'Week 3 (100%)', description: 'Tested against real websites of varying complexity, report templates refined for readability and branding, best practices guide written with actionable recommendations organised by priority, and final script delivered.' },
    ],
  },
  {
    id: 'payment-gateway-integration', name: 'Payment Gateway Integration', price: 3499,
    desc: 'A modular payment gateway integration module supporting Paytm, Razorpay, and UPI. Includes order creation, callback verification, webhook handling, receipt generation, and transaction logging. Built as a drop-in module for existing Node.js applications.',
    icon: 'CreditCard', category: 'Backend',
    features: ['Paytm order creation and callback verification', 'Razorpay payment gateway integration', 'UPI payment collection with QR code', 'Webhook handler with signature validation', 'Receipt and invoice generation in PDF'],
    milestones: [
      { week: 'Week 1 (33%)', description: 'Payment gateway architecture designed with provider abstraction layer, Paytm integration with order creation API, checksum signature generation, and callback verification flow completed and tested in staging.' },
      { week: 'Week 2 (70%)', description: 'Razorpay integration with order creation, payment capture, and refund support, UPI payment collection with static and dynamic QR code generation, webhook handler for asynchronous payment events with signature validation.' },
      { week: 'Week 3 (100%)', description: 'Cross-gateway testing covering success, failure, and timeout scenarios, error handling for network failures and invalid responses, security audit for PCI compliance considerations, integration guide with usage examples, and source code delivered.' },
    ],
  },
  {
    id: 'chat-system-script', name: 'Chat System Script', price: 2499,
    desc: 'A real-time chat system with WebSocket-based messaging, message history with search, typing indicators, file sharing with preview, user presence tracking, and an admin dashboard for conversation monitoring. Suitable for customer support or team communication platforms.',
    icon: 'MessageSquare', category: 'Feature',
    features: ['Real-time bidirectional messaging via WebSocket', 'Persistent message history with full-text search', 'File sharing with image preview and download', 'Admin dashboard with conversation monitoring', 'Push notifications for offline users'],
    milestones: [
      { week: 'Week 1 (33%)', description: 'WebSocket server built with Socket.IO with horizontal scaling support, real-time message delivery with acknowledgment and delivery receipts, user presence system tracking online, offline, and away statuses, and message persistence layer with indexed queries.' },
      { week: 'Week 2 (70%)', description: 'Typing indicators with debounced broadcasting, file sharing with drag-and-drop upload and thumbnail generation, message history UI with infinite scroll and full-text search, and push notification system for offline message delivery.' },
      { week: 'Week 3 (100%)', description: 'Admin dashboard for monitoring active conversations and user activity, load testing with simulated concurrent users, security review for WebSocket authentication and message validation, documentation with deployment architecture, and final source code.' },
    ],
  },
  {
    id: 'invoice-generator', name: 'Invoice Generator', price: 1499,
    desc: 'An automated invoice generation system with professional PDF templates, email delivery with attachments, GST-compliant fields, payment tracking with status updates, and a client portal for viewing and downloading invoices.',
    icon: 'FileText', category: 'Tool',
    features: ['Professional PDF invoice generation', 'Email delivery with PDF attachment', 'GST-compliant invoice fields', 'Payment status tracking with history', 'Client portal for invoice access'],
    milestones: [
      { week: 'Week 1 (33%)', description: 'Invoice data model designed with line items, taxes, and discount fields, PDF generation engine using a professional template with company branding, and auto-incrementing invoice numbering system with prefix configuration.' },
      { week: 'Week 2 (70%)', description: 'Email delivery pipeline with SMTP integration and PDF attachment, GST-compliant fields including HSN/SAC codes, CGST/SGST/IGST breakdown, and place of supply, and payment tracking dashboard with status history and notifications.' },
      { week: 'Week 3 (100%)', description: 'Client portal with secure login for viewing and downloading invoices, tested with multiple billing scenarios including partial payments and credit notes, user guide with setup instructions for GST configuration, and complete source code delivered.' },
    ],
  },
  {
    id: 'notification-system', name: 'Notification System', price: 999,
    desc: 'A multi-channel notification delivery system supporting email, SMS, and in-app notifications. Features a template engine with variables, scheduling for delayed delivery, delivery tracking with open and click rates, and channel fallback logic.',
    icon: 'Bell', category: 'Feature',
    features: ['Email delivery via SMTP or transactional API', 'SMS integration with Twilio or equivalent', 'In-app notification with read tracking', 'Template engine with variable substitution', 'Delivery scheduling and retry logic'],
    milestones: [
      { week: 'Week 1 (33%)', description: 'Notification engine architecture with provider abstraction pattern, email channel implemented with SMTP and template rendering, template engine supporting variables, conditionals, and loops, and in-app notification system with database persistence.' },
      { week: 'Week 2 (70%)', description: 'SMS channel integrated with provider, scheduling queue for delayed notifications with database-backed persistence, delivery tracking with status webhooks, and channel fallback logic for redundancy.' },
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