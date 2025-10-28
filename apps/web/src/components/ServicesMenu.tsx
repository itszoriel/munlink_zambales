import { Link } from 'react-router-dom'
import { useRef } from 'react'

export default function ServicesMenu() {
  const ref = useRef<HTMLDetailsElement>(null)
  const close = () => { try { if (ref.current) ref.current.open = false } catch {} }
  return (
    <details ref={ref} className="relative group">
      <summary className="list-none cursor-pointer select-none hover:text-ocean-700 font-serif">Services ▾</summary>
      <div className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/50 p-2 z-50">
        <Link to="/documents" onClick={close} className="block px-3 py-2 rounded hover:bg-ocean-50">Documents</Link>
        <Link to="/issues" onClick={close} className="block px-3 py-2 rounded hover:bg-ocean-50">Issues</Link>
        <Link to="/benefits" onClick={close} className="block px-3 py-2 rounded hover:bg-ocean-50">Benefits</Link>
      </div>
    </details>
  )
}


