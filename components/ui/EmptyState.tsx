interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6 border-2 border-dashed border-[var(--border)] rounded-lg">
      <h3 className="text-lg font-semibold text-[var(--text)] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--text-secondary)] mb-5">{description}</p>
      )}
      {action}
    </div>
  )
}
