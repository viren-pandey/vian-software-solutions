import {
  Globe, Zap, RefreshCw, Plug, BarChart3, Users, Database,
  TrendingUp, CreditCard, MessageSquare, FileText, Bell,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Globe, Zap, RefreshCw, Plug, BarChart3, Users, Database,
  TrendingUp, CreditCard, MessageSquare, FileText, Bell,
}

export function ProductIcon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  const Icon = iconMap[name]
  if (!Icon) return null
  return <Icon size={size} className={className} />
}
