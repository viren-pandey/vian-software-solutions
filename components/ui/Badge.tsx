'use client'

import { cn, STATUS_COLORS } from '@/lib/utils'

interface BadgeProps {
  variant: string
  className?: string
  children: React.ReactNode
}

export function Badge({ variant, className, children }: BadgeProps) {
  return (
    <span className={cn('inline-block px-2 py-0.5 rounded-full text-xs font-semibold', STATUS_COLORS[variant], className)}>
      {children}
    </span>
  )
}
