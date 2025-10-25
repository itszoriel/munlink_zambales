import { NavLink } from 'react-router-dom'

const items = [
  { icon: '📊', label: 'Dashboard', path: '/dashboard' },
  { icon: '👥', label: 'Residents', path: '/residents' },
  { icon: '📄', label: 'Requests', path: '/requests' },
  { icon: '🛍️', label: 'Market', path: '/marketplace' },
  { icon: '👤', label: 'Profile', path: '/profile' },
]

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-neutral-200 px-4 py-3 md:hidden z-50">
      <div className="flex items-center justify-around">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-ocean-600' : 'text-neutral-600'}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}


