'use client'

import { useState, useMemo, useEffect } from 'react'

type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'AUD' | 'CAD'

const currencies: Record<CurrencyCode, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: '$', rate: 1, label: 'US Dollar' },
  INR: { symbol: '₹', rate: 83, label: 'Indian Rupee' },
  EUR: { symbol: '€', rate: 0.92, label: 'Euro' },
  GBP: { symbol: '£', rate: 0.79, label: 'British Pound' },
  AUD: { symbol: 'A$', rate: 1.54, label: 'Australian Dollar' },
  CAD: { symbol: 'C$', rate: 1.37, label: 'Canadian Dollar' },
}

interface Product {
  id: string
  name: string
  category: string
  tagline: string
  description: string
  features: string[]
  priceUSD: number
  originalPriceUSD?: number
  demoUrl?: string
  popular?: boolean
  techStack: string[]
}

const products: Product[] = [
  // ── Admin Panels ──
  { id: 'admin-pro', name: 'VianAdmin Pro', category: 'Admin Panel', tagline: 'Complete admin panel solution', description: 'A production-ready admin panel with user management, RBAC, audit logging, payment tracking, project management, and real-time chat. Fully responsive with dark mode.', features: ['User CRUD with role management', 'Role-based access control (RBAC)', 'Audit log with activity tracking', 'Dashboard with key metrics', 'Payment & invoice management', 'Project & quotation management', 'Real-time chat system', 'Dark mode & responsive', 'Prisma ORM + PostgreSQL'], priceUSD: 49, originalPriceUSD: 79, demoUrl: '/admin', popular: true, techStack: ['Next.js 15', 'React 19', 'TypeScript', 'Prisma', 'PostgreSQL'] },
  { id: 'usermanager', name: 'UserManager Pro', category: 'Admin Panel', tagline: 'User management dashboard', description: 'A dedicated user management panel with advanced filtering, bulk actions, activity logs, and role management. Perfect for platforms with large user bases.', features: ['User listing with advanced filters', 'Bulk user actions', 'Activity & login logs', 'Role & permission management', 'Email verification flows', 'Password reset management', 'Account suspension tools', 'Export user data (CSV/PDF)', 'API for user operations'], priceUSD: 39, originalPriceUSD: 59, techStack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL'] },
  { id: 'payflow', name: 'PayFlow Admin', category: 'Admin Panel', tagline: 'Payment & invoice manager', description: 'A comprehensive payment administration panel for tracking transactions, generating invoices, managing refunds, and viewing revenue analytics.', features: ['Transaction history with filters', 'Invoice generation & management', 'Refund processing workflow', 'Revenue dashboard & charts', 'Payment gateway integration', 'Subscription management', 'Payout management', 'Tax calculation support', 'Multi-currency support'], priceUSD: 44, originalPriceUSD: 69, techStack: ['Next.js', 'TypeScript', 'Stripe', 'Chart.js', 'PostgreSQL'] },
  { id: 'contentpilot', name: 'ContentPilot', category: 'Admin Panel', tagline: 'Content management admin', description: 'A powerful content management admin panel for managing articles, media, categories, and user-generated content with a clean drag-and-drop interface.', features: ['Article & page management', 'Media library with uploads', 'Category & tag organization', 'Drag-and-drop page builder', 'Scheduled publishing', 'Content version history', 'User-generated content moderation', 'SEO meta management', 'Bulk content operations'], priceUSD: 34, originalPriceUSD: 54, techStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'AWS S3'] },
  { id: 'schooladmin', name: 'SchoolAdmin Pro', category: 'Admin Panel', tagline: 'Education management system', description: 'A complete school management admin panel for managing students, teachers, classes, attendance, grades, and fee collections.', features: ['Student & teacher management', 'Class & schedule management', 'Attendance tracking system', 'Grade book & report cards', 'Fee collection & receipts', 'Timetable generator', 'Exam management', 'Parent communication portal', 'Library management'], priceUSD: 59, originalPriceUSD: 89, popular: true, techStack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL'] },
  { id: 'hrmanager', name: 'HRManager Pro', category: 'Admin Panel', tagline: 'HR administration panel', description: 'A complete HR admin panel for managing employees, leaves, payroll, performance reviews, and recruitment workflows.', features: ['Employee database management', 'Leave & attendance tracking', 'Payroll processing', 'Performance review system', 'Recruitment & applicant tracking', 'Document management', 'Organization chart builder', 'Announcement board', 'Compliance reporting'], priceUSD: 54, originalPriceUSD: 84, techStack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL'] },
  { id: 'analyticsadmin', name: 'AnalyticsPanel', category: 'Admin Panel', tagline: 'Analytics & reporting admin', description: 'A data-driven admin panel focused on analytics, reporting, and business intelligence with customizable dashboards and automated report generation.', features: ['Customizable dashboard widgets', 'Automated report generation', 'Data export (PDF, CSV, Excel)', 'User behavior analytics', 'Conversion funnel tracking', 'Custom date range comparisons', 'Anomaly detection alerts', 'Scheduled email reports', 'Team usage analytics'], priceUSD: 44, originalPriceUSD: 64, techStack: ['Next.js', 'React', 'Chart.js', 'Python', 'PostgreSQL'] },

  // ── Dashboards ──
  { id: 'viandash', name: 'VianDash Analytics', category: 'Dashboard', tagline: 'Modern analytics dashboard', description: 'A sleek business dashboard with interactive charts, real-time data visualization, and comprehensive reporting tools. Perfect for SaaS platforms and agencies.', features: ['Interactive charts & graphs', 'Real-time metric tracking', 'Custom widget system', 'Data export (CSV/PDF)', 'User activity reports', 'Responsive grid layout', 'Multiple theme options', 'REST API integration'], priceUSD: 39, originalPriceUSD: 59, demoUrl: '/dashboard', techStack: ['Next.js', 'React', 'Chart.js', 'Prisma', 'PostgreSQL'] },
  { id: 'salesvue', name: 'SalesVue', category: 'Dashboard', tagline: 'Sales performance dashboard', description: 'A sales-focused dashboard with pipeline tracking, revenue forecasts, team performance metrics, and deal management visualizations.', features: ['Sales pipeline visualization', 'Revenue forecasting', 'Team performance leaderboard', 'Deal stage tracking', 'Monthly/quarterly comparisons', 'Goal progress tracking', 'Customer acquisition charts', 'Win/loss analysis', 'Exportable reports'], priceUSD: 34, originalPriceUSD: 54, techStack: ['Next.js', 'React', 'Chart.js', 'PostgreSQL'] },
  { id: 'marketpulse', name: 'MarketPulse', category: 'Dashboard', tagline: 'Marketing analytics dashboard', description: 'A marketing dashboard that aggregates data from multiple channels, tracks campaign performance, and provides actionable insights for optimization.', features: ['Multi-channel campaign tracking', 'Traffic source analytics', 'Conversion rate monitoring', 'ROI & cost per acquisition', 'Social media metrics', 'Email campaign stats', 'SEO performance tracking', 'Custom date comparisons', 'Automated weekly reports'], priceUSD: 37, originalPriceUSD: 57, techStack: ['Next.js', 'React', 'Chart.js', 'Google Analytics API'] },
  { id: 'financeflow', name: 'FinanceFlow', category: 'Dashboard', tagline: 'Financial dashboard & reports', description: 'A finance dashboard for tracking revenue, expenses, cash flow, and profitability with drill-down capabilities and forecast modeling.', features: ['Revenue & expense tracking', 'Cash flow visualization', 'Profit & loss statements', 'Budget vs actual comparisons', 'Forecast modeling', 'Account reconciliation', 'Tax summary reports', 'Multi-currency support', 'Audit trail logs'], priceUSD: 44, originalPriceUSD: 69, techStack: ['Next.js', 'React', 'Chart.js', 'PostgreSQL'] },
  { id: 'projecttrack', name: 'ProjectTrack', category: 'Dashboard', tagline: 'Project management dashboard', description: 'A project management dashboard with task tracking, timeline views, resource allocation, and team collaboration metrics.', features: ['Task & milestone tracking', 'Gantt chart timeline view', 'Resource allocation overview', 'Team workload balancing', 'Time tracking summaries', 'Project budget tracking', 'Client communication log', 'File & document sharing', 'Burndown charts'], priceUSD: 32, originalPriceUSD: 52, techStack: ['Next.js', 'React', 'TypeScript', 'D3.js', 'PostgreSQL'] },
  { id: 'socialpulse', name: 'SocialPulse', category: 'Dashboard', tagline: 'Social media analytics', description: 'A social media dashboard for monitoring brand mentions, engagement metrics, content performance, and competitor analysis across platforms.', features: ['Multi-platform engagement tracking', 'Brand mention monitoring', 'Content performance analytics', 'Competitor benchmarking', 'Hashtag performance tracking', 'Post scheduling calendar', 'Audience demographics', 'Sentiment analysis', 'Custom report builder'], priceUSD: 29, originalPriceUSD: 49, techStack: ['Next.js', 'React', 'Chart.js', 'Twitter API', 'Instagram API'] },
  { id: 'serverscope', name: 'ServerScope', category: 'Dashboard', tagline: 'Server monitoring dashboard', description: 'A server and infrastructure monitoring dashboard with real-time metrics, alerting, and uptime tracking for DevOps teams.', features: ['Real-time server metrics (CPU, RAM, Disk)', 'Uptime monitoring & history', 'Alert configuration & notifications', 'Service health checks', 'Network traffic graphs', 'Log viewer & search', 'Docker container monitoring', 'SSL certificate expiry tracking', 'incident response timeline'], priceUSD: 42, originalPriceUSD: 62, techStack: ['React', 'TypeScript', 'WebSockets', 'D3.js', 'Node.js'] },

  // ── Full Websites ──
  { id: 'corporatepro', name: 'CorporatePro', category: 'Full Website', tagline: 'Corporate business website', description: 'A professional corporate website template with service pages, team profiles, case studies, and a careers portal. Designed for established businesses.', features: ['Home, about, services pages', 'Team member profiles', 'Case studies section', 'Careers & job listings', 'News & press releases', 'Contact form with maps', 'Client testimonials', 'SEO-optimized structure', 'Multi-language ready'], priceUSD: 59, originalPriceUSD: 99, popular: true, techStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'] },
  { id: 'businesspro', name: 'BusinessPro', category: 'Full Website', tagline: 'Small business website', description: 'A complete small business website with service showcase, booking system, and customer management. Perfect for local service businesses.', features: ['Service & pricing pages', 'Online booking & scheduling', 'Customer management CRM', 'Google Maps integration', 'Business hours management', 'Special offers section', 'Photo gallery', 'Customer reviews system', 'Mobile-first design'], priceUSD: 44, originalPriceUSD: 74, techStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'] },
  { id: 'startuplaunch', name: 'StartupLaunch', category: 'Full Website', tagline: 'Startup website template', description: 'A modern startup website with product showcase, investor pitch sections, and growth-oriented landing pages designed to attract users and investors.', features: ['Product showcase sections', 'Investor pitch deck integration', 'Feature comparison table', 'Pricing & plans page', 'Blog & changelog', 'Waitlist signup flow', 'Press & media kit', 'Roadmap timeline', 'Analytics integration'], priceUSD: 49, originalPriceUSD: 79, techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind'] },
  { id: 'agencypro', name: 'AgencyPro', category: 'Full Website', tagline: 'Digital agency website', description: 'A portfolio-driven agency website with project showcases, client logos, service packages, and a team introduction page.', features: ['Portfolio & project gallery', 'Client logo showcase', 'Service package listings', 'Team member profiles', 'Testimonials carousel', 'Case study detail pages', 'Contact & quote forms', 'Process timeline', 'Blog & insights section'], priceUSD: 54, originalPriceUSD: 84, techStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'] },
  { id: 'nonprofithub', name: 'NonProfitHub', category: 'Full Website', tagline: 'Nonprofit organization website', description: 'A purpose-driven website for nonprofits with donation integration, volunteer management, and impact storytelling features.', features: ['Donation & fundraising integration', 'Volunteer registration portal', 'Impact & success stories', 'Event calendar & registration', 'Newsletter signup', 'Campaign progress tracking', 'Board member profiles', 'Financial transparency reports', 'Petition & advocacy tools'], priceUSD: 34, originalPriceUSD: 54, techStack: ['Next.js', 'React', 'TypeScript', 'Stripe', 'PostgreSQL'] },
  { id: 'realestatepro', name: 'RealEstatePro', category: 'Full Website', tagline: 'Real estate website', description: 'A property listing website with advanced search filters, interactive maps, virtual tours, and agent management features.', features: ['Property listing management', 'Advanced search with filters', 'Interactive map integration', 'Virtual tour embedding', 'Mortgage calculator', 'Agent profiles & listings', 'Favorite & compare properties', 'Appointment scheduling', 'Neighborhood guides'], priceUSD: 64, originalPriceUSD: 99, techStack: ['Next.js', 'React', 'TypeScript', 'Google Maps', 'PostgreSQL'] },
  { id: 'restaurantpro', name: 'RestaurantPro', category: 'Full Website', tagline: 'Restaurant & cafe website', description: 'A mouth-watering restaurant website with online menus, table reservations, food delivery ordering, and location finder.', features: ['Online menu with categories', 'Table reservation system', 'Food delivery ordering', 'Photo gallery', 'Chef & team profiles', 'Event booking', 'Location & hours', 'Customer reviews', 'Gift card purchases'], priceUSD: 39, originalPriceUSD: 59, techStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'] },

  // ── Blog Websites ──
  { id: 'vianblog', name: 'VianBlog CMS', category: 'Blog Website', tagline: 'Full-featured blog platform', description: 'A feature-rich blog platform with markdown editing, SEO optimization, category management, search, comments, and newsletter integration.', features: ['Markdown content editor', 'SEO meta tags & sitemap', 'Categories & tag management', 'Comment & discussion system', 'Full-text search', 'Newsletter integration', 'Social share buttons', 'AMP & PWA ready', 'Related posts suggestions'], priceUSD: 29, originalPriceUSD: 49, demoUrl: '/blog', popular: true, techStack: ['Next.js', 'React', 'TypeScript', 'Markdown', 'PostgreSQL'] },
  { id: 'mediumclone', name: 'MediumClone', category: 'Blog Website', tagline: 'Medium-style blogging platform', description: 'A clean, distraction-free blogging platform with a Medium-like reading experience, claps, highlights, and member-only content.', features: ['Clean reading experience', 'Clap & highlight system', 'Member-only content gating', 'Reading time estimates', 'Table of contents', 'Author profiles & following', 'Newsletter delivery', 'Import from Medium', 'Custom domain support'], priceUSD: 39, originalPriceUSD: 59, techStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'] },
  { id: 'techblogpro', name: 'TechBlog Pro', category: 'Blog Website', tagline: 'Technology blog template', description: 'A technology-focused blog with code syntax highlighting, technical documentation layout, and developer-friendly features.', features: ['Code syntax highlighting', 'Technical documentation layout', 'API reference pages', 'Interactive code examples', 'Tutorial series management', 'Downloadable code resources', 'Reader Q&A section', 'RSS feed generation', 'GitHub integration'], priceUSD: 34, originalPriceUSD: 54, techStack: ['Next.js', 'React', 'TypeScript', 'Prism.js', 'PostgreSQL'] },
  { id: 'personalblog', name: 'PersonalBlog', category: 'Blog Website', tagline: 'Personal blog & journal', description: 'A beautiful personal blog with journal-style entries, photo essays, a notes section, and a simple minimalist design.', features: ['Journal-style entries', 'Photo essay layout', 'Digital garden / notes section', 'Tags & collections', 'Monthly archive view', 'Reading statistics', 'Newsletter signup', 'Custom about page', 'Now page template'], priceUSD: 19, originalPriceUSD: 34, techStack: ['Next.js', 'React', 'TypeScript', 'Markdown'] },
  { id: 'magazinpro', name: 'MagazinPro', category: 'Blog Website', tagline: 'Online magazine template', description: 'A digital magazine layout with featured stories, category sections, author bylines, and advertisement placement ready for content publishers.', features: ['Featured stories carousel', 'Category-based sections', 'Author bylines & profiles', 'Ad placement zones', 'Sponsored content support', 'Trending stories widget', 'Newsletter promotions', 'Pagination & infinite scroll', 'Print-friendly layout'], priceUSD: 44, originalPriceUSD: 69, techStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'] },

  // ── E-commerce ──
  { id: 'shoppro', name: 'ShopPro', category: 'E-commerce', tagline: 'Full e-commerce platform', description: 'A complete e-commerce solution with product management, shopping cart, checkout, order tracking, and inventory management.', features: ['Product catalog with variants', 'Shopping cart & wishlist', 'Secure checkout process', 'Order management & tracking', 'Inventory management', 'Customer accounts', 'Discount & coupon system', 'Shipping calculator', 'Review & rating system'], priceUSD: 69, originalPriceUSD: 109, popular: true, techStack: ['Next.js', 'React', 'TypeScript', 'Stripe', 'PostgreSQL'] },
  { id: 'digitalgoods', name: 'DigitalGoods', category: 'E-commerce', tagline: 'Digital products store', description: 'A digital download store for selling software, templates, music, videos, and eBooks with automated delivery and license key management.', features: ['Digital file upload & delivery', 'License key generation', 'Download limit management', 'Customer download portal', 'Bundle & multi-item pricing', 'Automated email delivery', 'Fraud detection', 'Sales analytics dashboard', 'Affiliate tracking'], priceUSD: 49, originalPriceUSD: 79, techStack: ['Next.js', 'React', 'TypeScript', 'Stripe', 'AWS S3'] },
  { id: 'subscriptionpro', name: 'SubscriptionPro', category: 'E-commerce', tagline: 'Subscription-based store', description: 'A subscription commerce platform with recurring billing, plan management, member portals, and churn analytics.', features: ['Recurring billing management', 'Plan & tier configuration', 'Member portal & account', 'Free trial management', 'Upgrade/downgrade handling', 'Churn analytics dashboard', 'Invoice history', 'Payment method management', 'Proration calculations'], priceUSD: 59, originalPriceUSD: 89, techStack: ['Next.js', 'React', 'TypeScript', 'Stripe', 'PostgreSQL'] },
  { id: 'multivendor', name: 'MultiVendor', category: 'E-commerce', tagline: 'Multi-vendor marketplace', description: 'A marketplace platform where multiple vendors can list products, manage inventory, and process orders through a centralized system.', features: ['Vendor registration & onboarding', 'Vendor dashboard & analytics', 'Commission rate management', 'Product approval workflow', 'Order routing to vendors', 'Payout management', 'Vendor rating system', 'Dispute resolution system', 'Category management'], priceUSD: 89, originalPriceUSD: 139, techStack: ['Next.js', 'React', 'TypeScript', 'Stripe', 'PostgreSQL'] },
  { id: 'auctionpro', name: 'AuctionPro', category: 'E-commerce', tagline: 'Auction & bidding platform', description: 'An auction platform with real-time bidding, countdown timers, automatic bid increments, and seller management features.', features: ['Real-time bidding system', 'Countdown & auction timers', 'Automatic bid increments', 'Reserve price settings', 'Watchlist & notifications', 'Seller dashboard', 'Bid history & transparency', 'Payment & escrow system', 'Shipping coordination'], priceUSD: 74, originalPriceUSD: 114, techStack: ['Next.js', 'React', 'TypeScript', 'WebSockets', 'PostgreSQL'] },
  { id: 'printshop', name: 'PrintShop', category: 'E-commerce', tagline: 'Print-on-demand store', description: 'A print-on-demand e-commerce store with product mockup generators, custom design tools, and order fulfillment integration.', features: ['Product mockup generator', 'Custom design tool', 'Color & size variants', 'Print provider integration', 'Order fulfillment sync', 'Design upload & approval', 'Profit margin calculator', 'Bulk order discounts', 'Sample request system'], priceUSD: 54, originalPriceUSD: 84, techStack: ['Next.js', 'React', 'TypeScript', 'Stripe', 'PostgreSQL'] },

  // ── Landing Pages ──
  { id: 'leadgenpro', name: 'LeadGen Pro', category: 'Landing Page', tagline: 'Lead generation page', description: 'A high-converting landing page with A/B testing, form analytics, and CRM integration for capturing and nurturing leads.', features: ['Optimized lead capture forms', 'A/B testing variants', 'Form analytics & heatmaps', 'CRM integration (HubSpot, Salesforce)', 'Automated follow-up sequences', 'Thank-you page builder', 'Exit-intent popups', 'UTM tracking', 'GDPR consent management'], priceUSD: 24, originalPriceUSD: 39, techStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'] },
  { id: 'productlaunch', name: 'ProductLaunch', category: 'Landing Page', tagline: 'Product launch page', description: 'A high-impact product launch page with countdown timers, pre-order functionality, and social proof sections.', features: ['Launch countdown timer', 'Pre-order integration', 'Social proof notifications', 'Feature showcase sections', 'Pricing comparison table', 'Launch day schedule', 'Email capture flow', 'Share & referral system', 'Post-launch survey'], priceUSD: 29, originalPriceUSD: 44, techStack: ['Next.js', 'React', 'TypeScript'] },
  { id: 'apppromo', name: 'AppPromo', category: 'Landing Page', tagline: 'Mobile app promotion page', description: 'A stunning app promotion landing page with app store buttons, feature mockups, screenshots, and download analytics.', features: ['App store download buttons', 'Device mockup integration', 'Feature highlight sections', 'Screenshot carousel', 'Video demo embedding', 'Rating & review showcase', 'Press mentions section', 'FAQ accordion', 'Download analytics'], priceUSD: 22, originalPriceUSD: 37, techStack: ['Next.js', 'React', 'TypeScript'] },
  { id: 'webinarpro', name: 'WebinarPro', category: 'Landing Page', tagline: 'Webinar registration page', description: 'A webinar landing page with registration flow, calendar integration, reminder emails, and attendee management.', features: ['Registration & ticketing', 'Calendar integration (Google, Outlook)', 'Automated reminder emails', 'Attendee dashboard', 'Live countdown to event', 'Speaker introduction section', 'Q&A submission form', 'Replay access system', 'Post-webinar survey'], priceUSD: 27, originalPriceUSD: 42, techStack: ['Next.js', 'React', 'TypeScript', 'SendGrid'] },
  { id: 'waitlistpro', name: 'WaitlistPro', category: 'Landing Page', tagline: 'Coming soon & waitlist page', description: 'A sleek coming-soon page with waitlist signup, referral tracking, and launch announcement features for pre-launch buzz.', features: ['Waitlist signup flow', 'Referral tracking system', 'Position in line display', 'Social media integration', 'Launch announcement feature', 'Preview section for updates', 'Founder story section', 'Email validation', 'Spread analytics dashboard'], priceUSD: 17, originalPriceUSD: 29, techStack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'] },

  // ── SaaS Templates ──
  { id: 'crmsaas', name: 'CRMSaaS', category: 'SaaS Template', tagline: 'CRM software template', description: 'A customer relationship management SaaS template with contact management, deal tracking, activity logging, and team collaboration.', features: ['Contact & account management', 'Deal pipeline tracking', 'Activity & note logging', 'Task & reminder system', 'Email integration', 'Reporting dashboard', 'Team collaboration feed', 'Import/export tools', 'Custom field support'], priceUSD: 64, originalPriceUSD: 99, techStack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL'] },
  { id: 'taskflow', name: 'TaskFlow', category: 'SaaS Template', tagline: 'Task management SaaS', description: 'A task and project management SaaS with Kanban boards, time tracking, team collaboration, and productivity analytics.', features: ['Kanban board view', 'List & calendar views', 'Time tracking integration', 'Team collaboration', 'File attachments', 'Due date reminders', 'Workload overview', 'Productivity analytics', 'API & webhooks'], priceUSD: 49, originalPriceUSD: 79, techStack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL'] },
  { id: 'invoicely', name: 'Invoicely', category: 'SaaS Template', tagline: 'Invoicing SaaS platform', description: 'An invoicing and billing SaaS with professional invoice templates, recurring billing, expense tracking, and financial reporting.', features: ['Professional invoice templates', 'Recurring billing automation', 'Expense tracking', 'Financial reports', 'Client portal', 'Payment reminders', 'Multi-currency support', 'Tax rate management', 'Bank reconciliation'], priceUSD: 44, originalPriceUSD: 69, techStack: ['Next.js', 'React', 'TypeScript', 'Stripe', 'PostgreSQL'] },
  { id: 'timetracker', name: 'TimeTracker', category: 'SaaS Template', tagline: 'Time tracking SaaS', description: 'A time tracking and attendance SaaS with clock in/out, timesheets, project time billing, and team scheduling features.', features: ['Clock in/out system', 'Timesheet management', 'Project time billing', 'Team scheduling', 'Overtime calculation', 'Leave request workflow', 'GPS location check-in', 'Timesheet approval flow', 'Payroll integration'], priceUSD: 39, originalPriceUSD: 59, techStack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL'] },

  // ── API Backends ──
  { id: 'apistarter', name: 'APIStarter', category: 'API Backend', tagline: 'REST API starter kit', description: 'A production-ready REST API starter with authentication, rate limiting, caching, documentation, and comprehensive test coverage.', features: ['JWT authentication & refresh tokens', 'Role-based access middleware', 'Rate limiting & throttling', 'Redis caching layer', 'API documentation (Swagger)', 'Request validation', 'Error handling middleware', 'Comprehensive test suite', 'Docker compose setup'], priceUSD: 34, originalPriceUSD: 54, techStack: ['Node.js', 'Express', 'TypeScript', 'Redis', 'PostgreSQL', 'Docker'] },
  { id: 'graphqlpro', name: 'GraphQLPro', category: 'API Backend', tagline: 'GraphQL backend template', description: 'A GraphQL API backend with code-first schema generation, subscriptions, data loaders, and optimized query performance.', features: ['Code-first schema generation', 'GraphQL subscriptions (WebSockets)', 'DataLoader for N+1 prevention', 'Query complexity analysis', 'Authentication directives', 'File upload support', 'Apollo Studio integration', 'Batch & deduplication', 'Performance tracing'], priceUSD: 39, originalPriceUSD: 59, techStack: ['Node.js', 'GraphQL', 'Apollo', 'TypeScript', 'PostgreSQL'] },
  { id: 'authapi', name: 'AuthAPI', category: 'API Backend', tagline: 'Authentication API service', description: 'A dedicated authentication API with social login, MFA, session management, and user profile services ready to integrate.', features: ['Email/password authentication', 'Social login (Google, GitHub, Apple)', 'Multi-factor authentication (MFA)', 'Session & refresh token management', 'Passwordless magic links', 'OAuth 2.0 provider support', 'User profile CRUD APIs', 'Login attempt rate limiting', 'Audit event logging'], priceUSD: 29, originalPriceUSD: 49, techStack: ['Node.js', 'Express', 'TypeScript', 'Redis', 'PostgreSQL'] },
  { id: 'mediaapi', name: 'MediaAPI', category: 'API Backend', tagline: 'Media management backend', description: 'A media management API with upload processing, image optimization, video transcoding, CDN delivery, and digital asset management.', features: ['File upload & processing pipeline', 'Image optimization & resizing', 'Video transcoding support', 'CDN integration (CloudFront)', 'Digital asset management', 'Access control & permissions', 'EXIF data extraction', 'Bulk import/export', 'Usage analytics'], priceUSD: 44, originalPriceUSD: 69, techStack: ['Node.js', 'TypeScript', 'AWS S3', 'FFmpeg', 'PostgreSQL'] },

  // ── CMS Solutions ──
  { id: 'headlesscms', name: 'HeadlessCMS', category: 'CMS Solution', tagline: 'Headless CMS platform', description: 'A headless CMS with a rich text editor, media management, content versioning, and API-first content delivery for any frontend.', features: ['Rich text & block editor', 'Media library with optimization', 'Content versioning & rollback', 'REST & GraphQL content APIs', 'Role-based content permissions', 'Scheduled publishing', 'Content duplication & localization', 'Webhook event triggers', 'Custom content types'], priceUSD: 49, originalPriceUSD: 79, techStack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL'] },
  { id: 'portfoliocms', name: 'PortfolioCMS', category: 'CMS Solution', tagline: 'Portfolio CMS for creatives', description: 'A portfolio CMS for designers, photographers, and artists with project management, client proofing, and online store features.', features: ['Project & gallery management', 'Client proofing & approval', 'Online store integration', 'Blog & journal section', 'Service & pricing pages', 'Contact & inquiry forms', 'Analytics dashboard', 'Custom domain support', 'Password-protected projects'], priceUSD: 34, originalPriceUSD: 54, techStack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL'] },

  // ── Portfolios ──
  { id: 'devportfolio', name: 'DevPortfolio', category: 'Portfolio', tagline: 'Developer portfolio template', description: 'A developer portfolio with project showcases, GitHub integration, skill metrics, and a technical blog section.', features: ['Project showcase with live demos', 'GitHub contribution graph', 'Skills & technology radar', 'Technical blog integration', 'Resume/CV download', 'Code snippet display', 'Open source contributions', 'Speaking & talks section', 'Contact form'], priceUSD: 19, originalPriceUSD: 34, techStack: ['Next.js', 'React', 'TypeScript', 'GitHub API'] },
  { id: 'creativeportfolio', name: 'CreativePortfolio', category: 'Portfolio', tagline: 'Creative portfolio for artists', description: 'A visually stunning portfolio for creative professionals with full-screen galleries, lightbox viewing, and project storytelling.', features: ['Full-screen gallery layouts', 'Lightbox & zoom viewing', 'Project storytelling format', 'Video & motion reel', 'Client testimonials', 'Collaboration credits', 'Exhibition & awards section', 'Commission inquiry form', 'Print shop integration'], priceUSD: 24, originalPriceUSD: 39, techStack: ['Next.js', 'React', 'TypeScript'] },

  // ── Web Apps ──
  { id: 'chatapp', name: 'ChatApp Pro', category: 'Web App', tagline: 'Real-time chat application', description: 'A real-time chat application with direct messaging, group chats, file sharing, and message history search.', features: ['Direct & group messaging', 'Real-time message delivery', 'File & image sharing', 'Message search & history', 'Read receipts & typing indicators', 'Emoji & reactions', 'Message threading', 'Push notifications', 'End-to-end encryption'], priceUSD: 44, originalPriceUSD: 69, techStack: ['Next.js', 'React', 'WebSockets', 'Socket.io', 'PostgreSQL'] },
  { id: 'kanbanpro', name: 'KanbanPro', category: 'Web App', tagline: 'Kanban project management', description: 'A Kanban-style project management app with drag-and-drop boards, sprint planning, and team collaboration features.', features: ['Drag-and-drop Kanban boards', 'Sprint planning & management', 'Task cards with checklists', 'Time estimation & tracking', 'Team workload view', 'Board templates', 'Export & reporting', 'Calendar integration', 'Automation rules'], priceUSD: 39, originalPriceUSD: 59, techStack: ['Next.js', 'React', 'TypeScript', 'DnD Kit', 'PostgreSQL'] },
  { id: 'notetaking', name: 'NoteStack', category: 'Web App', tagline: 'Note-taking web application', description: 'A modern note-taking app with markdown support, notebooks, tags, real-time sync, and collaboration features.', features: ['Markdown note editor', 'Notebook & tag organization', 'Real-time collaboration', 'Search & full-text index', 'Version history', 'Code block highlighting', 'Drawing & sketch tool', 'Web clipper extension', 'Export (PDF, Markdown, HTML)'], priceUSD: 29, originalPriceUSD: 49, techStack: ['Next.js', 'React', 'TypeScript', 'TipTap', 'PostgreSQL'] },
]

const categories = Array.from(new Set(products.map(p => p.category)))

const faqs = [
  { q: 'What do I receive after purchase?', a: 'You receive the complete source code, setup documentation, database schema, and a deployment guide. All files are delivered via download link immediately after payment.' },
  { q: 'Can I use the script for multiple projects?', a: 'Each license covers one project or domain. For multiple projects, you need to purchase additional licenses or contact us for a custom enterprise license.' },
  { q: 'Do you offer customization services?', a: 'Yes. We can customize any script to match your specific requirements. Contact us with your needs and we will provide a quote.' },
  { q: 'Is technical support included?', a: 'Yes. Each purchase includes 30 days of email support for bug fixes and setup assistance. Extended support plans are available.' },
  { q: 'Can I get a refund?', a: 'We offer a 7-day refund policy if the script does not work as described and we are unable to resolve the issue. Custom development work is non-refundable.' },
]

function formatPrice(priceUSD: number, currency: CurrencyCode): string {
  const c = currencies[currency]
  const converted = priceUSD * c.rate
  if (currency === 'INR') return c.symbol + Math.round(converted).toLocaleString('en-IN')
  return c.symbol + converted.toFixed(2)
}

function DetailPanel({ product, currency, onClose }: { product: Product; currency: CurrencyCode; onClose: () => void }) {
  useEffect(() => {
    document.title = `${product.name} - Vian Software Solutions`
    return () => { document.title = 'Services - Vian Software Solutions' }
  }, [product.name])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="sv-overlay" onClick={onClose}>
      <div className="sv-panel" onClick={e => e.stopPropagation()}>
        <button className="sv-close" onClick={onClose}>&times;</button>

        <div className="sv-header">
          <div className="sv-meta">
            <span className="sv-category">{product.category}</span>
            {product.popular && <span className="sv-badge">Popular</span>}
          </div>
          <h2 className="sv-title">{product.name}</h2>
          <p className="sv-tagline">{product.tagline}</p>
        </div>

        <div className="sv-body">
          <p className="sv-desc">{product.description}</p>

          <div className="sv-section">
            <h3>Features</h3>
            <ul className="sv-features">
              {product.features.map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="sv-section">
            <h3>Technology Stack</h3>
            <div className="sv-stack">
              {product.techStack.map(t => (
                <span key={t} className="sv-pill">{t}</span>
              ))}
            </div>
          </div>

          <div className="sv-section">
            <h3>Pricing</h3>
            <div className="sv-pricing">
              {product.originalPriceUSD && (
                <span className="sv-price-old">{formatPrice(product.originalPriceUSD, currency)}</span>
              )}
              <span className="sv-price-current">{formatPrice(product.priceUSD, currency)}</span>
              <span className="sv-price-label">one-time payment</span>
            </div>
            {product.originalPriceUSD && (
              <p className="sv-save">Save {Math.round((1 - product.priceUSD / product.originalPriceUSD) * 100)}%</p>
            )}
          </div>
        </div>

        <div className="sv-actions">
          {product.demoUrl && (
            <a href={product.demoUrl} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
              Live Demo
            </a>
          )}
          <a href="/register" className="btn btn-primary">
            Create Account &amp; Buy
          </a>
          <a href={`/contact?product=${product.id}`} className="btn btn-ghost">
            Contact Us
          </a>
        </div>
      </div>

      <style>{`
        .sv-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: svFadeIn 0.2s ease;
        }
        .sv-panel {
          background: var(--surface, #fff);
          border-radius: 16px;
          max-width: 640px; width: 100%;
          max-height: 90vh; overflow-y: auto;
          padding: 40px;
          position: relative;
          animation: svSlideUp 0.25s ease;
          box-shadow: 0 25px 60px rgba(0,0,0,0.15);
        }
        [data-theme="dark"] .sv-panel {
          background: #1a1a2e;
        }
        .sv-close {
          position: absolute; top: 16px; right: 20px;
          background: none; border: none;
          font-size: 28px; line-height: 1;
          color: var(--text-tertiary, #999);
          cursor: pointer; padding: 4px;
          transition: color 0.15s;
        }
        .sv-close:hover { color: var(--text, #000); }
        .sv-header { margin-bottom: 28px; }
        .sv-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .sv-category {
          font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
          color: var(--text-tertiary, #999);
        }
        .sv-badge {
          font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;
          padding: 2px 8px; border-radius: 20px;
          background: var(--accent, #6366f1); color: #fff;
        }
        .sv-title { font-size: 28px; font-weight: 700; margin: 0 0 6px; line-height: 1.2; }
        .sv-tagline { font-size: 15px; color: var(--text-secondary, #666); margin: 0; }
        .sv-body { display: flex; flex-direction: column; gap: 24px; }
        .sv-desc { font-size: 14px; line-height: 1.7; color: var(--text-secondary, #555); margin: 0; }
        .sv-section h3 {
          font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
          color: var(--text-tertiary, #999); margin: 0 0 12px;
        }
        .sv-features {
          list-style: none; padding: 0; margin: 0;
          display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px;
        }
        .sv-features li {
          font-size: 13px; line-height: 1.5; color: var(--text, #333);
          padding: 4px 0 4px 16px;
          position: relative;
        }
        .sv-features li::before {
          content: ''; position: absolute; left: 0; top: 11px;
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--accent, #6366f1);
        }
        .sv-stack { display: flex; flex-wrap: wrap; gap: 6px; }
        .sv-pill {
          font-size: 12px; padding: 4px 10px;
          border: 1px solid var(--border, #e0e0e0); border-radius: 6px;
          color: var(--text-secondary, #666);
        }
        .sv-pricing { display: flex; align-items: baseline; gap: 10px; }
        .sv-price-old { font-size: 16px; color: var(--text-tertiary, #999); text-decoration: line-through; }
        .sv-price-current { font-size: 28px; font-weight: 700; color: var(--accent, #6366f1); }
        .sv-price-label { font-size: 12px; color: var(--text-tertiary, #999); }
        .sv-save { font-size: 13px; color: var(--success, #22c55e); margin: 4px 0 0; }
        .sv-actions { display: flex; gap: 10px; margin-top: 28px; padding-top: 24px; border-top: 1px solid var(--border, #eee); }
        .sv-actions .btn-ghost { background: none; border: 1px solid var(--border, #e0e0e0); color: var(--text-secondary, #666); }
        .sv-actions .btn-ghost:hover { background: var(--surface-hover, #f5f5f5); color: var(--text, #000); }

        @keyframes svFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes svSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 640px) {
          .sv-panel { padding: 28px 20px; }
          .sv-features { grid-template-columns: 1fr; }
          .sv-actions { flex-direction: column; }
          .sv-title { font-size: 22px; }
        }
      `}</style>
    </div>
  )
}

export default function ServicesPage() {
  const [currency, setCurrency] = useState<CurrencyCode>('USD')
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCategory = activeCategory === 'All' || p.category === activeCategory
      const q = searchQuery.toLowerCase()
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      return matchCategory && matchSearch
    })
  }, [activeCategory, searchQuery])

  const product = selectedProduct ? products.find(p => p.id === selectedProduct) : null

  return (
    <>
      <header className="topbar">
        <nav className="nav">
          <a className="brand" href="/">Vian</a>
          <div className="nav-links" data-nav-links>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/services" className="active">Services</a>
            <a href="/pricing">Pricing</a>
            <a href="/contact">Contact</a>
          </div>
          <div className="nav-actions">
            <button className="icon-btn menu-toggle" data-menu-toggle type="button" aria-label="Menu">{'\u2630'}</button>
            <a href="/login" className="btn btn-secondary">Sign In</a>
            <a href="/register" className="btn btn-primary">Get Started</a>
          </div>
        </nav>
      </header>

      <main>
        <section className="page-hero">
          <div className="container">
            <div className="breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <span>Services</span>
            </div>
            <div className="hero-top-row">
              <div>
                <span className="eyebrow">Digital Products</span>
                <h1>Ready-made scripts for your next project.</h1>
                <p className="lead" style={{ marginTop: 12 }}>
                  {products.length}+ production-ready scripts across {categories.length} categories. Full source code, documentation, and support included.
                </p>
              </div>
              <div className="currency-selector">
                <label className="currency-label">Currency</label>
                <select
                  className="currency-select"
                  value={currency}
                  onChange={e => setCurrency(e.target.value as CurrencyCode)}
                >
                  {Object.entries(currencies).map(([code, c]) => (
                    <option key={code} value={code}>{c.symbol} {code} &mdash; {c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container">
            <div className="filter-bar-wrapper">
              <div className="filter-search">
                <input
                  className="filter-input"
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filter-bar">
                <button
                  className={`filter-btn ${activeCategory === 'All' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('All')}
                >
                  All ({products.length})
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat} ({products.filter(p => p.category === cat).length})
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-products">
                <p>No products match your search. Try a different category or keyword.</p>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map(p => (
                  <div
                    key={p.id}
                    className={`product-card card ${p.popular ? 'product-card--popular' : ''}`}
                    onClick={() => setSelectedProduct(p.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {p.popular && <span className="product-badge">Most Popular</span>}
                    <span className="product-category-label">{p.category}</span>
                    <span className="eyebrow" style={{ marginTop: 8 }}>{p.tagline}</span>
                    <h3 style={{ marginTop: 4 }}>{p.name}</h3>
                    <p className="muted product-desc">{p.description}</p>

                    <div className="product-tech">
                      {p.techStack.slice(0, 4).map(t => (
                        <span key={t} className="pill">{t}</span>
                      ))}
                      {p.techStack.length > 4 && (
                        <span className="pill">+{p.techStack.length - 4}</span>
                      )}
                    </div>

                    <div className="product-price">
                      {p.originalPriceUSD && (
                        <span className="product-price--old">{formatPrice(p.originalPriceUSD, currency)}</span>
                      )}
                      <span className="product-price--current">{formatPrice(p.priceUSD, currency)}</span>
                      <span className="product-price--label">one-time payment</span>
                    </div>

                    <div className="product-actions">
                      {p.demoUrl && (
                        <a href={p.demoUrl} className="btn btn-secondary" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                          Live Demo
                        </a>
                      )}
                      <button className="btn btn-primary" onClick={e => { e.stopPropagation(); setSelectedProduct(p.id) }}>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Questions</span>
              <h2>Common questions about our products.</h2>
            </div>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                  <button
                    className="faq-question"
                    type="button"
                    aria-expanded={openFaq === i}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {faq.q}
                    <span>+</span>
                  </button>
                  <div className="faq-answer">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container">
            <div className="cta-band">
              <h2>Need something custom?</h2>
              <p className="lead">Tell us what you need and we will build it for you.</p>
              <div className="hero-actions">
                <a className="btn btn-primary btn-lg" href="/contact">Get in Touch</a>
                <a className="btn btn-secondary btn-lg" href="/portfolio">See Our Work</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {selectedProduct && product && (
        <DetailPanel product={product} currency={currency} onClose={() => setSelectedProduct(null)} />
      )}

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <a className="brand" href="/">Vian</a>
            <p style={{ marginTop: 12 }}>
              Software, web, automation, and digital growth services for modern organizations.
            </p>
          </div>
          <div>
            <h3>Company</h3>
            <a href="/about">About</a>
            <a href="/portfolio">Portfolio</a>
            <a href="/contact">Contact</a>
            <a href="/pricing">Pricing</a>
          </div>
          <div>
            <h3>Services</h3>
            <a href="/services">Websites</a>
            <a href="/services">Software</a>
            <a href="/services">Digital Growth</a>
            <a href="/support">Support</a>
          </div>
          <div>
            <h3>Resources</h3>
            <a href="/blog">Blog</a>
            <a href="/faq">FAQ</a>
          </div>
          <div>
            <h3>Legal</h3>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-and-conditions">Terms of Service</a>
            <a href="/refund-policy">Refund Policy</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>&copy; 2026 Vian Software Solutions. All rights reserved.</span>
        </div>
      </footer>
    </>
  )
}
