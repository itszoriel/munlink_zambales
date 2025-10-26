import { ReactNode } from 'react'
import { X } from 'lucide-react'

type Props = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export default function Modal({ isOpen, onClose, title, children, footer }: Props) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="relative bg-ocean-gradient text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center" aria-label="Close">
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">{children}</div>
        {footer && <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">{footer}</div>}
      </div>
    </div>
  )
}


