export default function AdminLoading() {
  return (
    <div>
      <div className="h-8 w-48 bg-[var(--surface-hover)] rounded animate-pulse mb-1" />
      <div className="h-4 w-64 bg-[var(--surface-hover)] rounded animate-pulse mb-6" />
      <div className="grid grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 border border-[var(--border)] rounded-lg bg-[var(--surface)] animate-pulse" />
        ))}
      </div>
    </div>
  )
}
