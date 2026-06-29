export interface Product {
  id: string
  name: string
  price: number
  desc: string
  icon: string
  category: string
  features: string[]
}

export const products: Product[] = [
  { id: 'full-website-script', name: 'Full Website Script', price: 2999, desc: 'Complete, ready-to-deploy website script with admin panel, authentication, responsive design, and deployment guide.', icon: '🌐', category: 'Web', features: ['Admin panel', 'User auth', 'Responsive UI', 'Database setup', 'Deployment guide'] },
  { id: 'automation-script', name: 'Automation Script', price: 1999, desc: 'Custom automation script for repetitive tasks — data scraping, report generation, email automation, or file processing.', icon: '⚡', category: 'Automation', features: ['Task scheduler', 'Error handling', 'Logging system', 'Config file', 'Documentation'] },
  { id: 'n8n-workflow-bundle', name: 'n8n Workflow Bundle', price: 1499, desc: 'Pre-built n8n automation workflows for common business processes — CRM sync, email campaigns, invoice generation, and more.', icon: '🔄', category: 'Automation', features: ['5 ready workflows', 'API integrations', 'Error handling', 'Logging', 'Setup guide'] },
  { id: 'api-working-script', name: 'API Working Script', price: 2499, desc: 'Fully functional API script with authentication, rate limiting, database integration, and comprehensive documentation.', icon: '🔌', category: 'Backend', features: ['REST endpoints', 'JWT auth', 'Rate limiting', 'DB integration', 'API docs'] },
  { id: 'admin-dashboard', name: 'Admin Dashboard', price: 3999, desc: 'Professional admin dashboard with user management, analytics, settings, role-based access, and responsive design.', icon: '📊', category: 'Dashboard', features: ['User CRUD', 'Analytics', 'Role-based access', 'Settings page', 'Responsive'] },
  { id: 'user-management-system', name: 'User Management System', price: 1999, desc: 'Complete user authentication and management system — registration, login, password reset, profile management, and admin controls.', icon: '👥', category: 'Backend', features: ['Register/Login', 'Password reset', 'Profile mgmt', 'Admin panel', 'Email templates'] },
  { id: 'db-management-tool', name: 'DB Management Tool', price: 1499, desc: 'Web-based database management interface with query builder, table viewer, export/import, and backup functionality.', icon: '🗄️', category: 'Tool', features: ['Query builder', 'Table viewer', 'Export CSV/JSON', 'Import data', 'Backup'] },
  { id: 'seo-toolkit-script', name: 'SEO Toolkit Script', price: 999, desc: 'SEO analysis and reporting script — meta tag checker, keyword analyzer, sitemap generator, and performance suggestions.', icon: '📈', category: 'Tool', features: ['Meta checker', 'Keyword analysis', 'Sitemap generator', 'SEO report', 'Best practices'] },
  { id: 'payment-gateway-integration', name: 'Payment Gateway Integration', price: 3499, desc: 'Ready-to-integrate payment gateway module supporting Paytm, Razorpay, and UPI with webhook handling and receipt generation.', icon: '💳', category: 'Backend', features: ['Paytm support', 'Razorpay support', 'UPI support', 'Webhook handler', 'Receipts'] },
  { id: 'chat-system-script', name: 'Chat System Script', price: 2499, desc: 'Real-time chat system with WebSocket support, message history, typing indicators, file sharing, and admin dashboard.', icon: '💬', category: 'Feature', features: ['Real-time chat', 'Message history', 'File sharing', 'Admin dashboard', 'Notifications'] },
  { id: 'invoice-generator', name: 'Invoice Generator', price: 1499, desc: 'Auto invoice generation system with PDF export, email delivery, GST compliance, payment tracking, and client portal.', icon: '📄', category: 'Tool', features: ['PDF generation', 'Email delivery', 'GST compliant', 'Payment tracking', 'Client portal'] },
  { id: 'notification-system', name: 'Notification System', price: 999, desc: 'Multi-channel notification system — email, SMS, and in-app notifications with templates, scheduling, and delivery tracking.', icon: '🔔', category: 'Feature', features: ['Email/SMS', 'In-app alerts', 'Templates', 'Scheduling', 'Delivery tracking'] },
]

export function getProduct(id: string): Product | undefined {
  return products.find(p => p.id === id)
}
