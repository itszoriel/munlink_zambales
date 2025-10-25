# MunicipLink Zambales - Modern Admin Dashboard Design Guide

## 🎨 ADMIN DESIGN PHILOSOPHY

**"Professional Control Meets Modern Elegance"**

This admin interface extends the MunicipLink Zambales design system with authority, clarity, and efficiency. Every element is designed for quick decision-making while maintaining the beautiful, modern aesthetic of the public site.

---

## 🏗️ LAYOUT ARCHITECTURE

### Collapsible Sidebar Navigation (Desktop)
```tsx
// When Sidebar is OPEN (260px width)
<aside className="fixed left-0 top-0 h-screen w-[260px] bg-white/90 backdrop-blur-xl border-r border-neutral-200 z-50 transition-all duration-300">
  {/* Header */}
  <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
    <div className="flex items-center gap-3">
      <img src="/Zambales Logo/64px-Seal_of_Province_of_Zambales.svg.png" className="w-10 h-10" />
      <div>
        <p className="font-bold text-sm text-neutral-900">MunicipLink</p>
        <p className="text-xs text-neutral-600">Admin Portal</p>
      </div>
    </div>
    <button className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center transition-colors">
      <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
    </button>
  </div>
  
  {/* Navigation */}
  <nav className="px-4 py-6 space-y-2">
    {[
      { icon: '📊', label: 'Dashboard', path: '/admin/dashboard', badge: null },
      { icon: '👥', label: 'Residents', path: '/admin/residents', badge: '12' },
      { icon: '🎁', label: 'Benefits', path: '/admin/benefits', badge: null },
      { icon: '📄', label: 'Requests', path: '/admin/requests', badge: '5' },
      { icon: '🛍️', label: 'Marketplace', path: '/admin/marketplace', badge: '3' },
      { icon: '👨‍💼', label: 'Admins', path: '/admin/admins', badge: null },
      { icon: '📈', label: 'Reports', path: '/admin/reports', badge: null }
    ].map(item => (
      <a
        key={item.path}
        href={item.path}
        className={`
          group flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all
          ${isActive(item.path) 
            ? 'bg-ocean-gradient text-white shadow-lg' 
            : 'text-neutral-700 hover:bg-ocean-50 hover:text-ocean-700'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{item.icon}</span>
          <span className="text-sm">{item.label}</span>
        </div>
        {item.badge && (
          <span className={`
            px-2 py-0.5 rounded-full text-xs font-bold
            ${isActive(item.path) 
              ? 'bg-white/20 text-white' 
              : 'bg-red-500 text-white'
            }
          `}>
            {item.badge}
          </span>
        )}
      </a>
    ))}
  </nav>
  
  {/* User Profile Section */}
  <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200">
    <div className="flex items-center gap-3 px-3 py-2 bg-neutral-50 rounded-xl">
      <div className="relative">
        <div className="w-10 h-10 bg-ocean-gradient rounded-full flex items-center justify-center text-white font-bold text-sm">
          RA
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-forest-500 rounded-full border-2 border-white"></div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-neutral-900 truncate">Romcill Aquino</p>
        <p className="text-xs text-neutral-600">Iba Admin</p>
      </div>
    </div>
  </div>
</aside>

// When Sidebar is COLLAPSED (80px width)
<aside className="fixed left-0 top-0 h-screen w-[80px] bg-white/90 backdrop-blur-xl border-r border-neutral-200 z-50 transition-all duration-300">
  {/* Collapsed Header */}
  <div className="flex flex-col items-center px-4 py-5 border-b border-neutral-200">
    <img src="/Zambales Logo/64px-Seal_of_Province_of_Zambales.svg.png" className="w-10 h-10 mb-2" />
    <button className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center transition-colors">
      <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
      </svg>
    </button>
  </div>
  
  {/* Collapsed Navigation - Icons Only */}
  <nav className="px-4 py-6 space-y-3">
    {navItems.map(item => (
      <div className="relative group">
        <a
          href={item.path}
          className={`
            flex items-center justify-center w-12 h-12 rounded-xl transition-all
            ${isActive(item.path) 
              ? 'bg-ocean-gradient text-white shadow-lg' 
              : 'text-neutral-700 hover:bg-ocean-50'
            }
          `}
        >
          <span className="text-xl">{item.icon}</span>
          {item.badge && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </a>
        
        {/* Tooltip on Hover */}
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl">
          {item.label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-900"></div>
        </div>
      </div>
    ))}
  </nav>
  
  {/* Collapsed User Profile */}
  <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200">
    <div className="flex justify-center">
      <div className="relative">
        <div className="w-12 h-12 bg-ocean-gradient rounded-full flex items-center justify-center text-white font-bold">
          RA
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-forest-500 rounded-full border-2 border-white"></div>
      </div>
    </div>
  </div>
</aside>
```

### Top Header (When Sidebar Collapsed or Desktop Alternative)
```tsx
<header className="fixed top-0 right-0 left-[80px] h-16 bg-white/90 backdrop-blur-xl border-b border-neutral-200 z-40 transition-all duration-300">
  <div className="h-full px-6 flex items-center justify-between">
    {/* Left: Breadcrumb */}
    <div className="flex items-center gap-2 text-sm">
      <span className="text-neutral-500">Admin</span>
      <span className="text-neutral-400">/</span>
      <span className="text-ocean-600 font-medium">Dashboard</span>
    </div>
    
    {/* Center: Search Bar */}
    <div className="flex-1 max-w-xl mx-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search residents, requests, items..."
          className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 transition-all"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
    
    {/* Right: Actions & Profile */}
    <div className="flex items-center gap-3">
      {/* Notifications */}
      <button className="relative w-10 h-10 bg-neutral-50 hover:bg-neutral-100 rounded-xl flex items-center justify-center transition-colors">
        <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          3
        </span>
      </button>
      
      {/* Municipality Selector */}
      <select className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 focus:outline-none focus:border-ocean-500 cursor-pointer">
        <option>Iba</option>
        <option>All Municipalities</option>
        <option>Olongapo City</option>
        <option>Subic</option>
      </select>
      
      {/* Profile Dropdown */}
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-2 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors">
          <div className="relative">
            <div className="w-8 h-8 bg-ocean-gradient rounded-full flex items-center justify-center text-white font-bold text-xs">
              RA
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-forest-500 rounded-full border-2 border-white"></div>
          </div>
          <span className="text-sm font-medium text-neutral-700">Romcill Aquino</span>
          <svg className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Dropdown Menu */}
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
          {/* Profile Info */}
          <div className="px-4 py-3 border-b border-neutral-200">
            <p className="font-semibold text-sm text-neutral-900">Romcill Aquino</p>
            <p className="text-xs text-neutral-600">admin@iba.zambales.gov.ph</p>
            <span className="inline-block mt-2 px-2 py-1 bg-ocean-100 text-ocean-700 text-xs font-medium rounded-full">
              Super Admin
            </span>
          </div>
          
          {/* Menu Items */}
          <div className="py-2">
            <a href="/admin/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 transition-colors">
              <span className="text-lg">👤</span>
              <span className="text-sm font-medium text-neutral-700">My Profile</span>
            </a>
            <a href="/admin/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 transition-colors">
              <span className="text-lg">⚙️</span>
              <span className="text-sm font-medium text-neutral-700">Settings</span>
            </a>
            <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 transition-colors">
              <span className="text-lg">🌐</span>
              <span className="text-sm font-medium text-neutral-700">View Public Site</span>
            </a>
          </div>
          
          {/* Logout */}
          <div className="px-4 py-3 border-t border-neutral-200">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</header>
```

---

## 📊 DASHBOARD PAGE (Modern Redesign)

```tsx
export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-ocean-50/30 to-forest-50/20">
      {/* Main Content Area - Adjusts based on sidebar state */}
      <div className="ml-[260px] pt-16 transition-all duration-300">
        <div className="p-8">
          {/* Welcome Banner */}
          <div className="mb-8 bg-ocean-gradient text-white rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, Romcill! 👋</h1>
                <p className="text-ocean-100 text-lg">Iba Admin Dashboard • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-semibold transition-all flex items-center gap-2">
                  <span>📄</span>
                  Quick Actions
                </button>
                <button className="px-6 py-3 bg-white text-ocean-700 hover:scale-105 rounded-xl font-semibold transition-all shadow-lg">
                  + New Announcement
                </button>
              </div>
            </div>
          </div>
          
          {/* Stats Grid - Modern Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                icon: '👥', 
                label: 'Pending Verifications', 
                value: '0', 
                change: '+0%',
                changeType: 'neutral',
                color: 'ocean',
                bgGradient: 'from-ocean-500 to-ocean-600'
              },
              { 
                icon: '⚠️', 
                label: 'Active Issues', 
                value: '0', 
                change: '-100%',
                changeType: 'positive',
                color: 'sunset',
                bgGradient: 'from-sunset-500 to-sunset-600'
              },
              { 
                icon: '🛍️', 
                label: 'Marketplace Items', 
                value: '0', 
                change: '+0%',
                changeType: 'neutral',
                color: 'forest',
                bgGradient: 'from-forest-500 to-forest-600'
              },
              { 
                icon: '📢', 
                label: 'Announcements', 
                value: '0', 
                change: '+0%',
                changeType: 'neutral',
                color: 'purple',
                bgGradient: 'from-purple-500 to-purple-600'
              }
            ].map((stat, i) => (
              <div
                key={i}
                className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                {/* Icon with Gradient Background */}
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${stat.bgGradient} rounded-2xl mb-4 text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                
                {/* Stats */}
                <h3 className="text-sm font-medium text-neutral-600 mb-2">{stat.label}</h3>
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-bold text-neutral-900">{stat.value}</p>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.changeType === 'positive' ? 'text-forest-600' :
                    stat.changeType === 'negative' ? 'text-red-600' :
                    'text-neutral-500'
                  }`}>
                    {stat.changeType === 'positive' && '↑'}
                    {stat.changeType === 'negative' && '↓'}
                    {stat.changeType === 'neutral' && '→'}
                    <span>{stat.change}</span>
                  </div>
                </div>
                
                {/* Progress Bar (optional) */}
                <div className="mt-4 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${stat.bgGradient} rounded-full transition-all duration-1000`} style={{ width: `${Math.random() * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Pending Verifications (Redesigned) */}
            <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Pending User Verifications</h2>
                  <p className="text-sm text-neutral-600 mt-1">Review and approve user registrations</p>
                </div>
                <button className="px-4 py-2 bg-ocean-100 hover:bg-ocean-200 text-ocean-700 rounded-xl text-sm font-medium transition-colors">
                  View All
                </button>
              </div>
              
              <div className="p-8">
                {/* Empty State - Modern Design */}
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-100 rounded-3xl mb-4">
                    <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">No pending verifications</h3>
                  <p className="text-sm text-neutral-600 max-w-md mx-auto">
                    All users have been processed. New registration requests will appear here.
                  </p>
                </div>
                
                {/* When there ARE pending verifications, show this instead: */}
                {/* 
                <div className="space-y-3">
                  {verifications.map((user, i) => (
                    <div key={i} className="group flex items-center gap-4 p-4 bg-neutral-50 hover:bg-ocean-50 rounded-2xl transition-all border border-transparent hover:border-ocean-200">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 bg-ocean-gradient rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {user.initials}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-xs">⏳</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-neutral-900 mb-1">{user.name}</h3>
                        <p className="text-sm text-neutral-600">
                          {user.email} • {user.municipality}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Submitted {user.submittedAt}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-forest-100 hover:bg-forest-200 text-forest-700 rounded-lg text-sm font-medium transition-colors">
                          ✓ Approve
                        </button>
                        <button className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors">
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                */}
              </div>
            </div>
            
            {/* Right Column - Announcements (Redesigned) */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              <div className="px-6 py-5 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900 mb-1">Announcements</h2>
                <p className="text-sm text-neutral-600">Create and manage public announcements</p>
              </div>
              
              <div className="p-6">
                <button className="w-full py-4 bg-forest-gradient hover:scale-105 text-white rounded-2xl font-semibold transition-all shadow-lg mb-6 flex items-center justify-center gap-2">
                  <span className="text-xl">+</span>
                  Create Announcement
                </button>
                
                {/* Empty State */}
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-2xl mb-4">
                    <span className="text-3xl">📢</span>
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-2">No announcements</h3>
                  <p className="text-sm text-neutral-600">
                    Create your first announcement to get started.
                  </p>
                </div>
                
                {/* When there ARE announcements, show this instead: */}
                {/*
                <div className="space-y-3">
                  {announcements.map((item, i) => (
                    <div key={i} className="p-4 bg-neutral-50 hover:bg-ocean-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-ocean-200">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-neutral-900 mb-1 line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-xs text-neutral-600">
                            {item.date} • {item.views} views
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                */}
              </div>
            </div>
          </div>
          
          {/* Additional Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Recent Activity Log */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              <div className="px-6 py-5 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900">Recent Activity</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { icon: '✅', text: 'User verification approved', user: 'Juan Dela Cruz', time: '2 min ago', color: 'forest' },
                    { icon: '📄', text: 'Document request submitted', user: 'Maria Santos', time: '15 min ago', color: 'ocean' },
                    { icon: '🛍️', text: 'New marketplace item posted', user: 'Pedro Reyes', time: '1 hour ago', color: 'sunset' },
                    { icon: '📢', text: 'Announcement published', user: 'Admin', time: '3 hours ago', color: 'purple' }
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                      <div className={`w-10 h-10 bg-${activity.color}-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-neutral-900 font-medium mb-1">{activity.text}</p>
                        <p className="text-xs text-neutral-600">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Quick Stats Chart */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-900">Activity Overview</h2>
                <select className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              
              <div className="p-6">
                {/* Simple Bar Chart Visualization */}
                <div className="space-y-4">
                  {[
                    { label: 'Verifications', value: 45, max: 50, color: 'ocean' },
                    { label: 'Documents', value: 78, max: 100, color: 'forest' },
                    { label: 'Marketplace', value: 32, max: 50, color: 'sunset' },
                    { label: 'Issues', value: 12, max: 50, color: 'red' }
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-700">{item.label}</span>
                        <span className="text-sm font-bold text-neutral-900">{item.value}</span>
                      </div>
                      <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 rounded-full transition-all duration-1000`}
                          style={{ width: `${(item.value / item.max) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 👥 RESIDENTS PAGE

```tsx
export default function ResidentsPage() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-ocean-50/30 to-forest-50/20">
      <div className="ml-[260px] pt-16 transition-all duration-300">
        <div className="p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Residents</h1>
              <p className="text-neutral-600">Manage verified residents and user accounts</p>
            </div>
            
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-white/70 backdrop-blur-xl border border-neutral-200 hover:border-ocean-500 text-neutral-700 rounded-xl font-medium transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Data
              </button>
              <button className="px-6 py-3 bg-ocean-gradient hover:scale-105 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2">
                <span className="text-lg">+</span>
                Add Resident
              </button>
            </div>
          </div>
          
          {/* Filters & Search Bar */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or ID number..."
                    className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 transition-all"
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All Status', count: 156 },
                  { value: 'verified', label: 'Verified', count: 142 },
                  { value: 'pending', label: 'Pending', count: 12 },
                  { value: 'suspended', label: 'Suspended', count: 2 }
                ].map(status => (
                  <button
                    key={status.value}
                    onClick={() => setFilter(status.value)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      filter === status.value
                        ? 'bg-ocean-gradient text-white shadow-lg'
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {status.label}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      filter === status.value
                        ? 'bg-white/20'
                        : 'bg-neutral-200'
                    }`}>
                      {status.count}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Municipality Filter */}
              <select className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-medium focus:outline-none focus:border-ocean-500">
                <option>All Municipalities</option>
                <option>Iba</option>
                <option>Olongapo City</option>
                <option>Subic</option>
              </select>
            </div>
          </div>
          
          {/* Residents Table/Grid */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-neutral-700">
                <div className="col-span-4">Resident</div>
                <div className="col-span-3">Contact</div>
                <div className="col-span-2">Municipality</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-neutral-200">
              {[
                {
                  id: 'RES-001',
                  name: 'Juan Dela Cruz',
                  email: 'juan.delacruz@email.com',
                  phone: '+63 912 345 6789',
                  municipality: 'Iba',
                  status: 'verified',
                  joined: '2024-01-15',
                  avatar: 'JD'
                },
                {
                  id: 'RES-002',
                  name: 'Maria Santos',
                  email: 'maria.santos@email.com',
                  phone: '+63 923 456 7890',
                  municipality: 'Olongapo City',
                  status: 'verified',
                  joined: '2024-02-20',
                  avatar: 'MS'
                },
                {
                  id: 'RES-003',
                  name: 'Pedro Reyes',
                  email: 'pedro.reyes@email.com',
                  phone: '+63 934 567 8901',
                  municipality: 'Subic',
                  status: 'pending',
                  joined: '2024-10-10',
                  avatar: 'PR'
                }
              ].map((resident, i) => (
                <div
                  key={i}
                  className="px-6 py-4 hover:bg-ocean-50/30 transition-colors group"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Resident Info */}
                    <div className="col-span-4 flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-ocean-gradient rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                          {resident.avatar}
                        </div>
                        {resident.status === 'verified' && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-forest-500 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-white">✓</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 group-hover:text-ocean-600 transition-colors">
                          {resident.name}
                        </h3>
                        <p className="text-sm text-neutral-600">{resident.id}</p>
                      </div>
                    </div>
                    
                    {/* Contact */}
                    <div className="col-span-3">
                      <p className="text-sm text-neutral-900">{resident.email}</p>
                      <p className="text-sm text-neutral-600">{resident.phone}</p>
                    </div>
                    
                    {/* Municipality */}
                    <div className="col-span-2">
                      <span className="inline-flex items-center px-3 py-1 bg-ocean-100 text-ocean-700 rounded-full text-sm font-medium">
                        {resident.municipality}
                      </span>
                    </div>
                    
                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        resident.status === 'verified' 
                          ? 'bg-forest-100 text-forest-700'
                          : resident.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {resident.status === 'verified' && '✓ '}
                        {resident.status === 'pending' && '⏳ '}
                        {resident.status.charAt(0).toUpperCase() + resident.status.slice(1)}
                      </span>
                      <p className="text-xs text-neutral-500 mt-1">Joined {resident.joined}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="col-span-1 text-right">
                      <div className="relative inline-block">
                        <button className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center transition-colors">
                          <svg className="w-4 h-4 text-neutral-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <div className="py-2">
                            <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2">
                              <span>👁️</span> View Profile
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2">
                              <span>✏️</span> Edit Details
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2">
                              <span>💬</span> Send Message
                            </button>
                            <div className="border-t border-neutral-200 my-2"></div>
                            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                              <span>🚫</span> Suspend Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                Showing <span className="font-semibold">1-10</span> of <span className="font-semibold">156</span> residents
              </p>
              
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-neutral-200 hover:border-ocean-500 text-neutral-700 rounded-lg font-medium transition-all">
                  Previous
                </button>
                <button className="px-4 py-2 bg-ocean-gradient text-white rounded-lg font-medium shadow-lg">
                  1
                </button>
                <button className="px-4 py-2 bg-white border border-neutral-200 hover:border-ocean-500 text-neutral-700 rounded-lg font-medium transition-all">
                  2
                </button>
                <button className="px-4 py-2 bg-white border border-neutral-200 hover:border-ocean-500 text-neutral-700 rounded-lg font-medium transition-all">
                  3
                </button>
                <button className="px-4 py-2 bg-white border border-neutral-200 hover:border-ocean-500 text-neutral-700 rounded-lg font-medium transition-all">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎁 BENEFITS PAGE

```tsx
export default function BenefitsPage() {
  const [activeTab, setActiveTab] = useState('active');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-ocean-50/30 to-forest-50/20">
      <div className="ml-[260px] pt-16 transition-all duration-300">
        <div className="p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Benefits & Programs</h1>
              <p className="text-neutral-600">Manage government assistance and community programs</p>
            </div>
            
            <button className="px-6 py-3 bg-forest-gradient hover:scale-105 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2">
              <span className="text-lg">+</span>
              Create New Program
            </button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: '📋', label: 'Active Programs', value: '12', color: 'ocean' },
              { icon: '👥', label: 'Total Beneficiaries', value: '1,245', color: 'forest' },
              { icon: '⏳', label: 'Pending Applications', value: '34', color: 'sunset' },
              { icon: '✅', label: 'Approved This Month', value: '89', color: 'purple' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:scale-105 transition-transform">
                <div className={`inline-flex w-12 h-12 bg-${stat.color}-100 rounded-xl items-center justify-center text-2xl mb-3`}>
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</p>
                <p className="text-sm text-neutral-600">{stat.label}</p>
              </div>
            ))}
          </div>
          
          {/* Tabs */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/50 mb-6 inline-flex gap-2">
            {[
              { value: 'active', label: 'Active Programs', count: 12 },
              { value: 'applications', label: 'Applications', count: 34 },
              { value: 'archived', label: 'Archived', count: 8 }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.value
                    ? 'bg-ocean-gradient text-white shadow-lg'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.value ? 'bg-white/20' : 'bg-neutral-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          
          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Senior Citizen Assistance',
                description: 'Monthly financial assistance for senior citizens',
                beneficiaries: 234,
                budget: '₱450,000',
                status: 'active',
                icon: '👴',
                color: 'ocean'
              },
              {
                title: 'Educational Scholarship',
                description: 'Full tuition coverage for honor students',
                beneficiaries: 156,
                budget: '₱2,500,000',
                status: 'active',
                icon: '🎓',
                color: 'forest'
              },
              {
                title: 'Medical Assistance Program',
                description: 'Healthcare support for indigent families',
                beneficiaries: 445,
                budget: '₱1,200,000',
                status: 'active',
                icon: '🏥',
                color: 'red'
              },
              {
                title: 'Livelihood Support',
                description: 'Small business seed capital grants',
                beneficiaries: 89,
                budget: '₱800,000',
                status: 'active',
                icon: '💼',
                color: 'sunset'
              },
              {
                title: 'Housing Assistance',
                description: 'Support for home improvement and repairs',
                beneficiaries: 67,
                budget: '₱1,500,000',
                status: 'active',
                icon: '🏠',
                color: 'purple'
              },
              {
                title: 'Disaster Relief Fund',
                description: 'Emergency assistance during calamities',
                beneficiaries: 254,
                budget: '₱3,000,000',
                status: 'active',
                icon: '🆘',
                color: 'yellow'
              }
            ].map((program, i) => (
              <div
                key={i}
                className="group bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {/* Header with Icon */}
                <div className={`relative h-32 bg-gradient-to-br from-${program.color}-400 to-${program.color}-600 flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-white/10"></div>
                  <span className="relative text-6xl">{program.icon}</span>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-neutral-900 group-hover:text-ocean-600 transition-colors">
                      {program.title}
                    </h3>
                    <span className="px-2 py-1 bg-forest-100 text-forest-700 text-xs font-medium rounded-full">
                      Active
                    </span>
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                    {program.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-neutral-50 rounded-xl p-3">
                      <p className="text-xs text-neutral-600 mb-1">Beneficiaries</p>
                      <p className="text-lg font-bold text-neutral-900">{program.beneficiaries}</p>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-3">
                      <p className="text-xs text-neutral-600 mb-1">Budget</p>
                      <p className="text-lg font-bold text-neutral-900">{program.budget}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-ocean-100 hover:bg-ocean-200 text-ocean-700 rounded-xl text-sm font-medium transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-sm transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 📄 REQUESTS PAGE

```tsx
export default function RequestsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-ocean-50/30 to-forest-50/20">
      <div className="ml-[260px] pt-16 transition-all duration-300">
        <div className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Document Requests</h1>
            <p className="text-neutral-600">Process and track resident document requests</p>
          </div>
          
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {[
              { status: 'all', label: 'All Requests', count: 45, icon: '📋', color: 'neutral' },
              { status: 'pending', label: 'Pending Review', count: 12, icon: '⏳', color: 'yellow' },
              { status: 'processing', label: 'Processing', count: 8, icon: '⚙️', color: 'ocean' },
              { status: 'ready', label: 'Ready for Pickup', count: 15, icon: '✅', color: 'forest' },
              { status: 'completed', label: 'Completed', count: 10, icon: '🎉', color: 'purple' }
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => setStatusFilter(item.status)}
                className={`text-left p-4 rounded-2xl transition-all ${
                  statusFilter === item.status
                    ? 'bg-white/90 backdrop-blur-xl shadow-xl scale-105 border-2 border-ocean-500'
                    : 'bg-white/70 backdrop-blur-xl border border-white/50 hover:scale-105'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className={`text-2xl font-bold ${statusFilter === item.status ? 'text-ocean-600' : 'text-neutral-900'}`}>
                    {item.count}
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-700">{item.label}</p>
              </button>
            ))}
          </div>
          
          {/* Requests List */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-neutral-900">Recent Requests</h2>
              
              <div className="flex gap-2">
                <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium">
                  <option>All Document Types</option>
                  <option>Barangay Clearance</option>
                  <option>Certificate of Residency</option>
                  <option>Certificate of Indigency</option>
                  <option>Business Permit</option>
                </select>
                
                <button className="px-4 py-2 bg-white border border-neutral-200 hover:border-ocean-500 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </button>
              </div>
            </div>
            
            {/* Requests Table */}
            <div className="divide-y divide-neutral-200">
              {[
                {
                  id: 'REQ-2024-001',
                  resident: 'Juan Dela Cruz',
                  document: 'Barangay Clearance',
                  purpose: 'Employment',
                  submitted: '2024-10-14',
                  status: 'pending',
                  priority: 'normal'
                },
                {
                  id: 'REQ-2024-002',
                  resident: 'Maria Santos',
                  document: 'Certificate of Residency',
                  purpose: 'School Enrollment',
                  submitted: '2024-10-13',
                  status: 'processing',
                  priority: 'high'
                },
                {
                  id: 'REQ-2024-003',
                  resident: 'Pedro Reyes',
                  document: 'Business Permit Renewal',
                  purpose: 'Business Operations',
                  submitted: '2024-10-12',
                  status: 'ready',
                  priority: 'urgent'
                }
              ].map((request, i) => (
                <div key={i} className="px-6 py-5 hover:bg-ocean-50/30 transition-colors group">
                  <div className="flex items-center gap-6">
                    {/* Priority Indicator */}
                    <div className={`w-1 h-16 rounded-full ${
                      request.priority === 'urgent' ? 'bg-red-500' :
                      request.priority === 'high' ? 'bg-yellow-500' :
                      'bg-neutral-300'
                    }`}></div>
                    
                    {/* Request Info */}
                    <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                      {/* ID & Document */}
                      <div className="col-span-3">
                        <p className="font-bold text-neutral-900 mb-1">{request.id}</p>
                        <p className="text-sm text-neutral-600">{request.document}</p>
                      </div>
                      
                      {/* Resident */}
                      <div className="col-span-2">
                        <p className="font-medium text-neutral-900">{request.resident}</p>
                        <p className="text-xs text-neutral-600">Requester</p>
                      </div>
                      
                      {/* Purpose */}
                      <div className="col-span-2">
                        <p className="text-sm text-neutral-700">{request.purpose}</p>
                      </div>
                      
                      {/* Date */}
                      <div className="col-span-2">
                        <p className="text-sm text-neutral-700">{request.submitted}</p>
                        <p className="text-xs text-neutral-600">Submitted</p>
                      </div>
                      
                      {/* Status */}
                      <div className="col-span-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          request.status === 'processing' ? 'bg-ocean-100 text-ocean-700' :
                          request.status === 'ready' ? 'bg-forest-100 text-forest-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {request.status === 'pending' && '⏳ '}
                          {request.status === 'processing' && '⚙️ '}
                          {request.status === 'ready' && '✅ '}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                      
                      {/* Actions */}
                      <div className="col-span-1 text-right">
                        <button className="px-4 py-2 bg-ocean-100 hover:bg-ocean-200 text-ocean-700 rounded-lg text-sm font-medium transition-colors">
                          Process
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🛍️ MARKETPLACE PAGE

```tsx
export default function MarketplacePage() {
  const [filter, setFilter] = useState('all');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-ocean-50/30 to-forest-50/20">
      <div className="ml-[260px] pt-16 transition-all duration-300">
        <div className="p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Marketplace Management</h1>
              <p className="text-neutral-600">Monitor and moderate community marketplace listings</p>
            </div>
            
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-white/70 backdrop-blur-xl border border-neutral-200 hover:border-ocean-500 text-neutral-700 rounded-xl font-medium transition-all">
                Export Report
              </button>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: '🛍️', label: 'Total Listings', value: '234', trend: '+12', color: 'ocean' },
              { icon: '💰', label: 'For Sale', value: '145', trend: '+8', color: 'forest' },
              { icon: '🤝', label: 'For Lending', value: '67', trend: '+3', color: 'sunset' },
              { icon: '🎁', label: 'Free/Donate', value: '22', trend: '+1', color: 'purple' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:scale-105 transition-transform">
                <div className={`inline-flex w-12 h-12 bg-${stat.color}-100 rounded-xl items-center justify-center text-2xl mb-3`}>
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</p>
                <p className="text-sm text-neutral-600 mb-2">{stat.label}</p>
                <div className="flex items-center gap-1 text-sm text-forest-600 font-medium">
                  <span>↑</span>
                  <span>{stat.trend} this week</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Filters */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/50 mb-6">
            <div className="flex items-center gap-4">
              {/* Transaction Type */}
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All Items', icon: '🏪' },
                  { value: 'sell', label: 'For Sale', icon: '💰' },
                  { value: 'lend', label: 'For Lending', icon: '🤝' },
                  { value: 'donate', label: 'Free', icon: '🎁' }
                ].map(type => (
                  <button
                    key={type.value}
                    onClick={() => setFilter(type.value)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      filter === type.value
                        ? 'bg-ocean-gradient text-white shadow-lg'
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="mr-2">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
              
              {/* Status Filter */}
              <select className="ml-auto px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending Review</option>
                <option>Flagged</option>
                <option>Archived</option>
              </select>
              
              {/* Municipality */}
              <select className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium">
                <option>All Municipalities</option>
                <option>Iba</option>
                <option>Olongapo City</option>
                <option>Subic</option>
              </select>
            </div>
          </div>
          
          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              {
                id: 'MKT-001',
                title: 'Portable Generator 5KW',
                user: 'Juan Dela Cruz',
                type: 'lend',
                category: 'Tools & Equipment',
                image: null,
                views: 45,
                inquiries: 8,
                posted: '2 days ago',
                status: 'active'
              },
              {
                id: 'MKT-002',
                title: 'Children\'s Books Collection',
                user: 'Maria Santos',
                type: 'donate',
                category: 'Books & Education',
                image: null,
                views: 28,
                inquiries: 5,
                posted: '1 week ago',
                status: 'active'
              },
              {
                id: 'MKT-003',
                title: 'Office Desk - Like New',
                user: 'Pedro Reyes',
                type: 'sell',
                category: 'Furniture',
                image: null,
                views: 67,
                inquiries: 12,
                posted: '3 days ago',
                status: 'active'
              },
              {
                id: 'MKT-004',
                title: 'Wedding Decorations Set',
                user: 'Ana Cruz',
                type: 'lend',
                category: 'Events & Party',
                image: null,
                views: 89,
                inquiries: 15,
                posted: '5 days ago',
                status: 'active'
              }
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-ocean-200 to-forest-200">
                  {/* Transaction Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-md ${
                      item.type === 'sell' ? 'bg-forest-500/90' :
                      item.type === 'lend' ? 'bg-ocean-500/90' :
                      'bg-sunset-500/90'
                    }`}>
                      {item.type === 'sell' && '💰 For Sale'}
                      {item.type === 'lend' && '🤝 For Lending'}
                      {item.type === 'donate' && '🎁 Free'}
                    </span>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center shadow-lg mb-2">
                      <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button className="w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-neutral-700" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-forest-100 text-forest-700 rounded-full text-xs font-semibold">
                      ✓ Active
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-neutral-900 line-clamp-2 flex-1 group-hover:text-ocean-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  
                  <p className="text-xs text-neutral-600 mb-3">{item.category}</p>
                  
                  {/* User Info */}
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-neutral-200">
                    <div className="w-6 h-6 bg-ocean-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {item.user.charAt(0)}
                    </div>
                    <p className="text-xs text-neutral-700">{item.user}</p>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div>
                      <p className="text-xs text-neutral-600">Views</p>
                      <p className="text-sm font-bold text-neutral-900">{item.views}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">Inquiries</p>
                      <p className="text-sm font-bold text-neutral-900">{item.inquiries}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">Posted</p>
                      <p className="text-xs font-medium text-neutral-700">{item.posted}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-ocean-100 hover:bg-ocean-200 text-ocean-700 rounded-lg text-xs font-medium transition-colors">
                      Review
                    </button>
                    <button className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs transition-colors">
                      Flag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Load More */}
          <div className="text-center mt-8">
            <button className="px-8 py-3 bg-white/70 backdrop-blur-xl border-2 border-ocean-200 hover:border-ocean-500 text-ocean-600 rounded-xl font-medium transition-all hover:scale-105">
              Load More Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 👨‍💼 ADMINS PAGE

```tsx
export default function AdminsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-ocean-50/30 to-forest-50/20">
      <div className="ml-[260px] pt-16 transition-all duration-300">
        <div className="p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin Management</h1>
              <p className="text-neutral-600">Manage admin accounts and permissions</p>
            </div>
            
            <button className="px-6 py-3 bg-ocean-gradient hover:scale-105 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2">
              <span className="text-lg">+</span>
              Add New Admin
            </button>
          </div>
          
          {/* Role Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { role: 'Super Admin', count: 2, icon: '👑', color: 'purple' },
              { role: 'Municipality Admin', count: 13, icon: '🏛️', color: 'ocean' },
              { role: 'Moderator', count: 8, icon: '⚖️', color: 'forest' },
              { role: 'Support Staff', count: 15, icon: '💬', color: 'sunset' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:scale-105 transition-transform">
                <div className={`inline-flex w-12 h-12 bg-${stat.color}-100 rounded-xl items-center justify-center text-2xl mb-3`}>
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-neutral-900 mb-1">{stat.count}</p>
                <p className="text-sm text-neutral-600">{stat.role}</p>
              </div>
            ))}
          </div>
          
          {/* Admins List */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-900">Admin Accounts</h2>
                
                <div className="flex gap-2">
                  <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium">
                    <option>All Roles</option>
                    <option>Super Admin</option>
                    <option>Municipality Admin</option>
                    <option>Moderator</option>
                    <option>Support Staff</option>
                  </select>
                  
                  <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium">
                    <option>All Municipalities</option>
                    <option>Iba</option>
                    <option>Olongapo City</option>
                    <option>Subic</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Admin Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {[
                {
                  name: 'Romcill Aquino',
                  email: 'romcill.aquino@iba.zambales.gov.ph',
                  role: 'Super Admin',
                  municipality: 'Iba',
                  status: 'active',
                  lastActive: '2 minutes ago',
                  permissions: ['All Access'],
                  avatar: 'RA'
                },
                {
                  name: 'Juan Dela Cruz',
                  email: 'juan.delacruz@olongapo.zambales.gov.ph',
                  role: 'Municipality Admin',
                  municipality: 'Olongapo City',
                  status: 'active',
                  lastActive: '1 hour ago',
                  permissions: ['User Management', 'Documents', 'Announcements'],
                  avatar: 'JD'
                },
                {
                  name: 'Maria Santos',
                  email: 'maria.santos@subic.zambales.gov.ph',
                  role: 'Moderator',
                  municipality: 'Subic',
                  status: 'active',
                  lastActive: '3 hours ago',
                  permissions: ['Marketplace', 'Reports'],
                  avatar: 'MS'
                },
                {
                  name: 'Pedro Reyes',
                  email: 'pedro.reyes@iba.zambales.gov.ph',
                  role: 'Support Staff',
                  municipality: 'Iba',
                  status: 'inactive',
                  lastActive: '2 days ago',
                  permissions: ['View Only'],
                  avatar: 'PR'
                }
              ].map((admin, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl p-6 border border-neutral-200 hover:border-ocean-500 hover:shadow-xl transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-ocean-gradient rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {admin.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${
                        admin.status === 'active' ? 'bg-forest-500' : 'bg-neutral-400'
                      } rounded-full border-2 border-white`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-neutral-900 mb-1">{admin.name}</h3>
                      <p className="text-sm text-neutral-600 mb-2">{admin.email}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          admin.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' :
                          admin.role === 'Municipality Admin' ? 'bg-ocean-100 text-ocean-700' :
                          admin.role === 'Moderator' ? 'bg-forest-100 text-forest-700' :
                          'bg-sunset-100 text-sunset-700'
                        }`}>
                          {admin.role === 'Super Admin' && '👑 '}
                          {admin.role === 'Municipality Admin' && '🏛️ '}
                          {admin.role === 'Moderator' && '⚖️ '}
                          {admin.role === 'Support Staff' && '💬 '}
                          {admin.role}
                        </span>
                        <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-medium">
                          {admin.municipality}
                        </span>
                      </div>
                    </div>
                    
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-neutral-400 hover:text-neutral-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Permissions */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-neutral-600 mb-2">PERMISSIONS</p>
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions.map((perm, j) => (
                        <span key={j} className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                    <p className="text-xs text-neutral-600">
                      Last active: <span className="font-medium">{admin.lastActive}</span>
                    </p>
                    
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-ocean-100 hover:bg-ocean-200 text-ocean-700 rounded-lg text-xs font-medium transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-medium transition-colors">
                        Logs
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 📈 REPORTS PAGE

```tsx
export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-ocean-50/30 to-forest-50/20">
      <div className="ml-[260px] pt-16 transition-all duration-300">
        <div className="p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Reports & Analytics</h1>
              <p className="text-neutral-600">Platform insights and performance metrics</p>
            </div>
            
            <div className="flex gap-3">
              <select className="px-4 py-2 bg-white/70 backdrop-blur-xl border border-neutral-200 rounded-xl font-medium">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This Year</option>
                <option>Custom Range</option>
              </select>
              
              <button className="px-6 py-3 bg-ocean-gradient hover:scale-105 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Report
              </button>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Users', value: '2,456', change: '+12.5%', trend: 'up', icon: '👥', color: 'ocean' },
              { label: 'Active Listings', value: '234', change: '+8.3%', trend: 'up', icon: '🛍️', color: 'forest' },
              { label: 'Documents Issued', value: '1,789', change: '+15.2%', trend: 'up', icon: '📄', color: 'purple' },
              { label: 'System Uptime', value: '99.8%', change: '+0.2%', trend: 'up', icon: '⚡', color: 'sunset' }
            ].map((metric, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:scale-105 transition-transform">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-${metric.color}-100 rounded-xl flex items-center justify-center text-2xl`}>
                    {metric.icon}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    metric.trend === 'up' ? 'bg-forest-100 text-forest-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {metric.trend === 'up' ? '↑' : '↓'} {metric.change}
                  </span>
                </div>
                
                <p className="text-3xl font-bold text-neutral-900 mb-1">{metric.value}</p>
                <p className="text-sm text-neutral-600">{metric.label}</p>
              </div>
            ))}
          </div>
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Growth Chart */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              <div className="px-6 py-5 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900">User Growth</h2>
                <p className="text-sm text-neutral-600 mt-1">New registrations over time</p>
              </div>
              
              <div className="p-6">
                {/* Placeholder for chart - use recharts in actual implementation */}
                <div className="h-64 bg-gradient-to-br from-ocean-50 to-forest-50 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl mb-2">📈</p>
                    <p className="text-sm font-medium text-neutral-600">Chart Component</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Transaction Distribution */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
              <div className="px-6 py-5 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900">Marketplace Activity</h2>
                <p className="text-sm text-neutral-600 mt-1">Transaction type breakdown</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { label: 'For Sale', value: 145, percentage: 62, color: 'forest' },
                    { label: 'For Lending', value: 67, percentage: 29, color: 'ocean' },
                    { label: 'Free/Donate', value: 22, percentage: 9, color: 'sunset' }
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-neutral-700">{item.label}</span>
                        <span className="text-sm font-bold text-neutral-900">{item.value} ({item.percentage}%)</span>
                      </div>
                      <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 rounded-full transition-all duration-1000`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Document Requests Analysis */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900">Document Requests</h2>
              <p className="text-sm text-neutral-600 mt-1">Most requested documents</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Barangay Clearance', count: 456, percentage: 38, icon: '📋' },
                  { name: 'Certificate of Residency', count: 289, percentage: 24, icon: '🏠' },
                  { name: 'Certificate of Indigency', count: 201, percentage: 17, icon: '💙' },
                  { name: 'Business Permit', count: 134, percentage: 11, icon: '🏪' },
                  { name: 'Cedula', count: 89, percentage: 7, icon: '🎫' },
                  { name: 'Building Permit', count: 34, percentage: 3, icon: '🏗️' }
                ].map((doc, i) => (
                  <div
                    key={i}
                    className="bg-neutral-50 rounded-2xl p-4 hover:bg-ocean-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                        {doc.icon}
                      </div>
                      <span className="text-2xl font-bold text-neutral-900">{doc.count}</span>
                    </div>
                    
                    <h3 className="font-semibold text-sm text-neutral-900 mb-2">{doc.name}</h3>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600">{doc.percentage}% of total</span>
                      <span className="text-forest-600 font-medium">↑ Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Municipality Performance */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900">Municipality Performance</h2>
              <p className="text-sm text-neutral-600 mt-1">Activity comparison across municipalities</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { name: 'Iba', users: 523, listings: 89, documents: 234, color: 'ocean' },
                  { name: 'Olongapo City', users: 892, listings: 156, documents: 445, color: 'forest' },
                  { name: 'Subic', users: 445, listings: 67, documents: 178, color: 'purple' },
                  { name: 'Botolan', users: 234, listings: 34, documents: 123, color: 'sunset' },
                  { name: 'Castillejos', users: 198, listings: 28, documents: 89, color: 'yellow' }
                ].map((municipality, i) => (
                  <div
                    key={i}
                    className="p-4 bg-neutral-50 rounded-2xl hover:bg-ocean-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-neutral-900">{municipality.name}</h3>
                      <button className="text-sm text-ocean-600 hover:text-ocean-700 font-medium">
                        View Details →
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-neutral-600 mb-1">Users</p>
                        <p className="text-xl font-bold text-neutral-900">{municipality.users}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600 mb-1">Listings</p>
                        <p className="text-xl font-bold text-neutral-900">{municipality.listings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600 mb-1">Documents</p>
                        <p className="text-xl font-bold text-neutral-900">{municipality.documents}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 GLOBAL ADMIN STYLES & UTILITIES

```css
/* globals.css - Admin-specific additions */

/* Smooth transitions for sidebar toggle */
.admin-main-content {
  transition: margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.admin-main-content.sidebar-open {
  margin-left: 260px;
}

.admin-main-content.sidebar-collapsed {
  margin-left: 80px;
}

/* Custom scrollbar for admin panels */
.admin-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.admin-scrollbar::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.admin-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.admin-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Status badge animations */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
}

.status-active {
  animation: pulse-glow 2s infinite;
}

/* Data table hover effects */
.data-row {
  transition: all 200ms ease;
}

.data-row:hover {
  transform: translateX(4px);
  box-shadow: -4px 0 0 0 #0ea5e9;
}

/* Loading skeleton shimmer */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 1000px 100%;
}

/* Chart tooltips */
.chart-tooltip {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* Notification badge pulse */
@keyframes badge-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.notification-badge {
  animation: badge-pulse 2s infinite;
}

/* Priority indicators */
.priority-urgent {
  position: relative;
}

.priority-urgent::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #ef4444, #dc2626);
  border-radius: 2px;
  animation: pulse-glow 1.5s infinite;
}

/* Mobile responsive utilities */
@media (max-width: 768px) {
  .admin-sidebar {
    transform: translateX(-100%);
    transition: transform 300ms ease;
  }
  
  .admin-sidebar.mobile-open {
    transform: translateX(0);
  }
  
  .admin-main-content {
    margin-left: 0 !important;
  }
}

/* Print styles for reports */
@media print {
  .no-print {
    display: none !important;
  }
  
  .print-full-width {
    width: 100% !important;
    max-width: none !important;
  }
}
```

---

## 📱 MOBILE RESPONSIVE CONSIDERATIONS

### Mobile Navigation (Bottom Bar)
```tsx
{/* Mobile Bottom Navigation - Shows on small screens */}
<nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-neutral-200 px-4 py-3 md:hidden z-50">
  <div className="flex items-center justify-around">
    {[
      { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
      { icon: '👥', label: 'Residents', path: '/admin/residents' },
      { icon: '📄', label: 'Requests', path: '/admin/requests' },
      { icon: '🛍️', label: 'Market', path: '/admin/marketplace' },
      { icon: '⚙️', label: 'More', path: '/admin/menu' }
    ].map((item, i) => (
      <a
        key={i}
        href={item.path}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive(item.path) ? 'text-ocean-600' : 'text-neutral-600'
        }`}
      >
        <span className="text-xl">{item.icon}</span>
        <span className="text-xs font-medium">{item.label}</span>
      </a>
    ))}
  </div>
</nav>
```

### Mobile Sidebar Drawer
```tsx
{/* Mobile Sidebar - Slides from left */}
<div className={`fixed inset-0 z-50 md:hidden ${isMobileSidebarOpen ? 'block' : 'hidden'}`}>
  {/* Backdrop */}
  <div 
    className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm animate-fade-in"
    onClick={() => setIsMobileSidebarOpen(false)}
  ></div>
  
  {/* Drawer */}
  <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl animate-slide-in-left overflow-y-auto">
    {/* Same sidebar content as desktop */}
  </aside>
</div>
```

---

## 🎯 IMPLEMENTATION CHECKLIST

### Phase 1: Core Layout (Week 1)
- [ ] Collapsible sidebar navigation
- [ ] Top header with search & profile
- [ ] Responsive layout system
- [ ] Mobile bottom navigation
- [ ] Mobile drawer menu

### Phase 2: Dashboard & Pages (Week 2)
- [ ] Modern dashboard with stats
- [ ] Residents management page
- [ ] Benefits management page
- [ ] Document requests page
- [ ] Marketplace moderation page

### Phase 3: Admin Features (Week 3)
- [ ] Admin management page
- [ ] Reports & analytics page
- [ ] User profile/settings
- [ ] Notifications system
- [ ] Search functionality

### Phase 4: Polish & Optimization (Week 4)
- [ ] Loading states & skeletons
- [ ] Error handling & validation
- [ ] Toast notifications
- [ ] Modal dialogs
- [ ] Data export functionality
- [ ] Print-friendly reports
- [ ] Mobile optimization
- [ ] Accessibility audit
- [ ] Performance testing

---

## 🔐 SECURITY & PERMISSIONS

### Role-Based Access Control (RBAC)
```typescript
// Permission levels
const PERMISSIONS = {
  SUPER_ADMIN: ['*'], // All access
  MUNICIPALITY_ADMIN: [
    'residents.view',
    'residents.edit',
    'documents.approve',
    'marketplace.moderate',
    'announcements.create'
  ],
  MODERATOR: [
    'marketplace.moderate',
    'reports.view',
    'issues.resolve'
  ],
  SUPPORT_STAFF: [
    'residents.view',
    'documents.view',
    'support.respond'
  ]
};

// Permission check component
const ProtectedAction = ({ permission, children }) => {
  const { userPermissions } = useAuth();
  
  if (!userPermissions.includes(permission) && !userPermissions.includes('*')) {
    return null;
  }
  
  return children;
};

// Usage
<ProtectedAction permission="residents.edit">
  <button>Edit Resident</button>
</ProtectedAction>
```

---

## 💡 KEY DESIGN PRINCIPLES FOR ADMIN

1. **Efficiency First**: Quick access to frequent actions
2. **Clear Hierarchy**: Visual priority for urgent items
3. **Scannable Data**: Easy-to-read tables and lists
4. **Action-Oriented**: Prominent CTAs for common tasks
5. **Status Clarity**: Clear visual indicators for states
6. **Contextual Help**: Tooltips and inline guidance
7. **Responsive Design**: Works on tablets and mobile
8. **Consistent Patterns**: Reusable components throughout

---

## 🎨 COLOR CODING SYSTEM

### Status Colors
- **Active/Verified**: Forest Green (#10b981)
- **Pending**: Yellow (#f59e0b)
- **Processing**: Ocean Blue (#0ea5e9)
- **Completed**: Purple (#a855f7)
- **Urgent**: Red (#ef4444)
- **Inactive**: Neutral Gray (#6b7280)

### Priority Levels
- **Urgent**: Red border/indicator
- **High**: Yellow border/indicator
- **Normal**: Neutral (no special indicator)
- **Low**: Gray/muted appearance

---

This admin dashboard design transforms your current basic interface into a modern, professional, and efficient control center that matches the public-facing MunicipLink Zambales aesthetic while prioritizing admin workflow efficiency and data clarity.