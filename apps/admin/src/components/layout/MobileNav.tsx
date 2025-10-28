import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, ShoppingBag, User as UserIcon } from 'lucide-react'

const items = [
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { icon: 'residents', label: 'Residents', path: '/residents' },
  { icon: 'requests', label: 'Requests', path: '/requests' },
  { icon: 'market', label: 'Market', path: '/marketplace' },
  { icon: 'profile', label: 'Profile', path: '/profile' },
]

function IconFor(code: string, className = 'w-5 h-5') {
  switch (code) {
    case 'dashboard': return <LayoutDashboard className={className} aria-hidden="true" />
    case 'residents': return <Users className={className} aria-hidden="true" />
    case 'requests': return <FileText className={className} aria-hidden="true" />
    case 'market': return <ShoppingBag className={className} aria-hidden="true" />
    case 'profile': return <UserIcon className={className} aria-hidden="true" />
    default: return <LayoutDashboard className={className} aria-hidden="true" />
  }
}

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
            <span className="text-xl">{IconFor(item.icon, 'w-5 h-5')}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}


