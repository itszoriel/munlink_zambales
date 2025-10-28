import React, { useEffect } from 'react'

export type ModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({ open, onOpenChange, title, children, footer, className }) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={() => onOpenChange(false)}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className={`relative w-full max-w-none sm:max-w-2xl bg-[var(--color-card)] text-[var(--color-card-foreground)] border border-[var(--color-border)] shadow-xl rounded-none sm:rounded-2xl ${className || ''}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {(title !== undefined) && (
          <div className="p-4 border-b border-[var(--color-border)]"><h2 className="text-lg font-semibold">{title}</h2></div>
        )}
        <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">{children}</div>
        {footer !== undefined ? (
          <div className="p-4 border-t border-[var(--color-border)]">{footer}</div>
        ) : null}
      </div>
    </div>
  )
}


