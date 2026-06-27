export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden animate-pulse">
      <div className="h-10 bg-[var(--surface-hover)]" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 border-t border-[var(--border-light)] bg-[var(--surface)]" />
      ))}
    </div>
  )
}

export function StatCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-24 border border-[var(--border)] rounded-lg bg-[var(--surface)] animate-pulse"
        />
      ))}
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-64 bg-[var(--surface-hover)] rounded" />
      <div className="h-4 w-48 bg-[var(--surface-hover)] rounded" />
      <div className="grid grid-cols-2 gap-4 mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 border border-[var(--border)] rounded-lg bg-[var(--surface)]" />
        ))}
      </div>
    </div>
  )
}
