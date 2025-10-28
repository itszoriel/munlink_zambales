import React from 'react'

export type EmptyStateProps = { title: string; description?: string; action?: React.ReactNode; className?: string }

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action, className }) => {
  return (
    <div className={`rounded-xl border bg-[var(--color-card)] text-[var(--color-card-foreground)] p-6 text-center ${className || ''}`.trim()}>
      <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-gray-100" />
      <div className="font-semibold">{title}</div>
      {description && <div className="text-sm text-[color:var(--color-muted)] mt-1">{description}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}


