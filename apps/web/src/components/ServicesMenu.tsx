import { Link } from 'react-router-dom'

export default function ServicesMenu() {
  return (
    <details className="relative group">
      <summary className="list-none cursor-pointer select-none hover:text-ocean-700 font-serif">Services ▾</summary>
      <div className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/50 p-2 z-50">
        <Link to="/documents" className="block px-3 py-2 rounded hover:bg-ocean-50">Documents</Link>
        <Link to="/issues" className="block px-3 py-2 rounded hover:bg-ocean-50">Issues</Link>
        <Link to="/benefits" className="block px-3 py-2 rounded hover:bg-ocean-50">Benefits</Link>
      </div>
    </details>
  )
}


