import { StatCardsSkeleton } from '@/components/ui/LoadingSkeleton'

export default function DashboardLoading() {
  return (
    <div>
      <div className="h-8 w-48 bg-[var(--surface-hover)] rounded animate-pulse mb-1" />
      <div className="h-4 w-64 bg-[var(--surface-hover)] rounded animate-pulse mb-6" />
      <StatCardsSkeleton count={3} />
    </div>
  )
}
