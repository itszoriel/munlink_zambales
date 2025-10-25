import React from 'react'

export type CardProps = {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ title, subtitle, actions, children, className }) => {
  return (
    <div className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)] shadow-sm ${className || ''}`.trim()}>
      {(title || actions || subtitle) && (
        <div className="p-4 border-b border-[var(--color-border)] flex items-start justify-between gap-3">
          <div>
            {title ? <h3 className="text-base font-semibold">{title}</h3> : null}
            {subtitle ? <p className="text-sm text-[color:var(--color-muted)] mt-0.5">{subtitle}</p> : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}


