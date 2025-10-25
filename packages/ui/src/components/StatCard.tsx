import React from 'react'

export type StatCardProps = {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: { value: number; direction: 'up' | 'down' }
  href?: string
  onClick?: () => void
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, href, onClick, className }) => {
  const content = (
    <div className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)] p-4 shadow-sm ${className || ''}`.trim()}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[color:var(--color-muted)]">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {trend ? (
            <p className={`text-xs mt-1 ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend.direction === 'up' ? '▲' : '▼'} {Math.abs(trend.value)}%
            </p>
          ) : null}
        </div>
        {icon ? <div className="h-12 w-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">{icon}</div> : null}
      </div>
    </div>
  )

  if (href) {
    return <a href={href} onClick={onClick} className="block">{content}</a>
  }
  return <div onClick={onClick} className={onClick ? 'cursor-pointer' : undefined}>{content}</div>
}


