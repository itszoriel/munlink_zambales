import { useState, ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopHeader from './TopHeader'
import MobileNav from './MobileNav'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const location = useLocation()

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-ocean-50/30 to-forest-50/20">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((v) => !v)}
        className="hidden md:block"
      />

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-50 md:hidden ${isMobileSidebarOpen ? 'block' : 'hidden'}`}>
        <div
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
        <Sidebar collapsed={false} onToggle={() => setIsMobileSidebarOpen(false)} className="admin-sidebar mobile-open" />
      </div>

      {/* Top header */}
      <TopHeader
        sidebarCollapsed={isSidebarCollapsed}
        onOpenMobile={() => setIsMobileSidebarOpen(true)}
      />

      {/* Main content */}
      <main
        className={`admin-main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-open'} pt-16 pb-24 md:pb-28 overflow-x-hidden max-w-full transition-all duration-300`}
      >
        <div className="p-6 md:p-8 container-responsive">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  )
}


