import React from 'react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref
) {
  const base = 'w-full rounded-md border px-3 py-2 bg-[var(--color-card)] text-[var(--color-card-foreground)] placeholder:text-[color:var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]'
  const border = invalid ? 'border-red-500' : 'border-[var(--color-border)]'
  return <input ref={ref} className={`${base} ${border} ${className || ''}`.trim()} {...props} />
})


