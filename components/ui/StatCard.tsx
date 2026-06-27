interface StatCardProps {
  value: string | number
  label: string
  subtitle?: string
  className?: string
}

export function StatCard({ value, label, subtitle, className = '' }: StatCardProps) {
  return (
    <div className={`border border-[var(--border)] rounded-lg p-5 bg-[var(--surface)] ${className}`}>
      <div className="text-2xl font-bold text-[var(--text)]">{value}</div>
      <div className="text-sm text-[var(--text-secondary)] mt-1">{label}</div>
      {subtitle && (
        <div className="text-xs text-[var(--text-tertiary)] mt-1">{subtitle}</div>
      )}
    </div>
  )
}
