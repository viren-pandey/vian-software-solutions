interface Column<T> {
  header: string
  accessor: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  emptyState?: React.ReactNode
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  emptyState,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return emptyState || (
      <div className="text-center py-16 border-2 border-dashed border-[var(--border)] rounded-lg">
        <p className="text-[var(--text-secondary)]">No data available</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {columns.map((col, i) => (
              <th
                key={i}
                className="text-left px-3 py-2.5 font-semibold text-[var(--text-secondary)] text-xs uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={cn(
                'border-b border-[var(--border-light)]',
                onRowClick && 'cursor-pointer',
              )}
            >
              {columns.map((col, i) => (
                <td key={i} className={cn('px-3 py-3', col.className)}>
                  {col.accessor(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
