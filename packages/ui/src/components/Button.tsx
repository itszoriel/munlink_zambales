import React from 'react'

export type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  isLoading?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm md:text-base',
  lg: 'h-12 px-5 text-base',
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:brightness-95',
  secondary: 'bg-[var(--color-card)] text-[var(--color-card-foreground)] border border-[var(--color-border)] hover:bg-[var(--color-surface)]',
  ghost: 'bg-transparent text-[var(--color-surface-foreground)] hover:bg-[var(--color-card)]',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth,
  isLoading,
  onClick,
  className,
  disabled,
  type = 'button',
  leadingIcon,
  trailingIcon,
}) => {
  const widthClass = fullWidth ? 'w-full' : ''
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className || ''}`.trim()}
    >
      {leadingIcon ? <span className="mr-2 inline-flex items-center">{leadingIcon}</span> : null}
      <span>{isLoading ? 'Processing…' : children}</span>
      {trailingIcon ? <span className="ml-2 inline-flex items-center">{trailingIcon}</span> : null}
    </button>
  )
}


