import { useEffect } from 'react'

type Props = {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose: () => void
}

export default function Toast({ type, message, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const colors: Record<string, string> = {
    success: 'from-forest-500 to-forest-600',
    error: 'from-red-500 to-red-600',
    warning: 'from-sunset-500 to-sunset-600',
    info: 'from-ocean-500 to-ocean-600',
  }

  return (
    <div className="fixed top-20 right-6 z-50 animate-slide-in-right">
      <div className={`flex items-center gap-3 bg-gradient-to-r ${colors[type]} text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl`}>
        <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
          {type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ'}
        </div>
        <p className="font-medium">{message}</p>
        <button onClick={onClose} className="ml-2 hover:bg-white/20 p-1 rounded-lg">✕</button>
      </div>
    </div>
  )
}


