import type { ReactNode } from 'react'

type Props = {
  variant?: 'default' | 'glass' | 'gradient' | 'elevated'
  hover?: boolean
  className?: string
  children: ReactNode
}

export default function Card({ variant = 'default', hover = false, className = '', children }: Props) {
  const variants: Record<string, string> = {
    default: 'bg-white shadow-md',
    glass: 'bg-white/70 backdrop-blur-xl shadow-xl border border-white/50',
    gradient: 'bg-ocean-gradient text-white shadow-2xl',
    elevated: 'bg-white shadow-2xl',
  }
  return (
    <div className={`${variants[variant]} rounded-2xl ${hover ? 'hover:scale-[1.02] transition-transform' : ''} ${className}`}>
      {children}
    </div>
  )
}


