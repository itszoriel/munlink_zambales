import { useEffect, useMemo, useState } from 'react'
import { adminApi, handleApiError, marketplaceApi } from '../lib/api'
import { useAdminStore } from '../lib/store'

export default function Marketplace() {
  const [filter, setFilter] = useState<'all' | 'sell' | 'lend' | 'donate'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<any[]>([])
  const [stats, setStats] = useState<{ total_items: number; pending_items: number; approved_items: number; rejected_items: number } | null>(null)
  const userRole = useAdminStore((s)=> s.user?.role)
  const adminMunicipalityName = useAdminStore((s)=> s.user?.admin_municipality_name || s.user?.municipality_name)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setError(null)
        setLoading(true)
        const [itemsRes, statsRes] = await Promise.allSettled([
          adminApi.getItems({ page: 1, per_page: 24 }),
          marketplaceApi.getMarketplaceStats(),
        ])

        if (itemsRes.status === 'fulfilled') {
          const items = (itemsRes.value as any).items || []
          const mapped = items.map((it: any) => ({
            id: it.id || it.item_id || it.code || 'ITEM',
            title: it.title || it.name || 'Untitled',
            user: it.owner_name || it.user?.username || 'User',
            type: (it.type || it.transaction_type || 'sell').toLowerCase(),
            category: it.category || 'General',
            image: (Array.isArray(it.images) && it.images[0]) || it.image_url || null,
            views: it.views || 0,
            inquiries: it.inquiries || 0,
            posted: (it.created_at || '').slice(0, 10),
            status: it.status || 'active',
          }))
          if (mounted) setRows(mapped)
        }

        if (statsRes.status === 'fulfilled') {
          const data = (statsRes.value as any)?.data || statsRes.value
          if (mounted) setStats(data)
        }
      } catch (e: any) {
        setError(handleApiError(e))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => rows.filter((i) => filter === 'all' || i.type === filter), [rows, filter])

  return (
    <div className="min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">Marketplace Management</h1>
          <p className="text-neutral-600">Monitor and moderate community marketplace listings</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-white/70 backdrop-blur-xl border border-neutral-200 hover:border-ocean-500 text-neutral-700 rounded-xl font-medium transition-all">Export Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { icon: '🛍️', label: 'Total Items', value: String(stats?.total_items ?? '—'), color: 'ocean' },
          { icon: '⏳', label: 'Pending Review', value: String(stats?.pending_items ?? '—'), color: 'sunset' },
          { icon: '✅', label: 'Approved', value: String(stats?.approved_items ?? '—'), color: 'forest' },
          { icon: '❌', label: 'Rejected', value: String(stats?.rejected_items ?? '—'), color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:scale-105 transition-transform">
            <div className={`inline-flex w-12 h-12 bg-${stat.color}-100 rounded-xl items-center justify-center text-2xl mb-3`}>{stat.icon}</div>
            <p className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</p>
            <p className="text-sm text-neutral-600 mb-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/50 mb-6 -mx-2 px-2 overflow-x-auto">
        <div className="inline-flex items-center gap-4 min-w-max">
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All Items', icon: '🏪' },
              { value: 'sell', label: 'For Sale', icon: '💰' },
              { value: 'lend', label: 'For Lending', icon: '🤝' },
              { value: 'donate', label: 'Free', icon: '🎁' },
            ].map((type) => (
              <button key={type.value} onClick={() => setFilter(type.value as any)} className={`shrink-0 px-4 py-2 rounded-xl font-medium transition-all ${filter === type.value ? 'bg-ocean-gradient text-white shadow-lg' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'}`}>
                <span className="mr-2">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
          <select name="statusFilter" id="marketplace-status-filter" aria-label="Filter by status" className="ml-auto px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium"><option>All Status</option><option>Active</option><option>Pending Review</option><option>Flagged</option><option>Archived</option></select>
          {userRole === 'admin' ? (
            <select name="municipalityFilter" id="marketplace-municipality-filter" aria-label="Filter by municipality" className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium"><option>All Municipalities</option></select>
          ) : (
            <div className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-medium inline-flex items-center gap-2" aria-label="Municipality">
              <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8z"/></svg>
              <span className="truncate max-w-[12rem]">{adminMunicipalityName || 'Municipality'}</span>
            </div>
          )}
        </div>
      </div>

      {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && [...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg p-4">
            <div className="aspect-square skeleton rounded-xl mb-3" />
            <div className="h-4 w-40 skeleton rounded mb-2" />
            <div className="h-3 w-24 skeleton rounded" />
          </div>
        ))}
        {!loading && filtered.map((item) => (
          <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="relative aspect-square bg-gradient-to-br from-ocean-200 to-forest-200">
              <div className="absolute top-3 left-3 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-md ${item.type === 'sell' ? 'bg-forest-500/90' : item.type === 'lend' ? 'bg-ocean-500/90' : 'bg-sunset-500/90'}`}>
                  {item.type === 'sell' && '💰 For Sale'}
                  {item.type === 'lend' && '🤝 For Lending'}
                  {item.type === 'donate' && '🎁 Free'}
                </span>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center shadow-lg mb-2">
                  <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
                <button className="w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-neutral-700" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/></svg>
                </button>
              </div>
              <div className="absolute bottom-3 left-3"><span className="px-3 py-1 bg-forest-100 text-forest-700 rounded-full text-xs font-semibold">✓ Active</span></div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-neutral-900 line-clamp-2 flex-1 group-hover:text-ocean-600 transition-colors">{item.title}</h3>
              </div>
              <p className="text-xs text-neutral-600 mb-3">{item.category}</p>
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-neutral-200">
                <div className="w-6 h-6 bg-ocean-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">{item.user.charAt(0)}</div>
                <p className="text-xs text-neutral-700">{item.user}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div><p className="text-xs text-neutral-600">Views</p><p className="text-sm font-bold text-neutral-900">{item.views}</p></div>
                <div><p className="text-xs text-neutral-600">Inquiries</p><p className="text-sm font-bold text-neutral-900">{item.inquiries}</p></div>
                <div><p className="text-xs text-neutral-600">Posted</p><p className="text-xs font-medium text-neutral-700">{item.posted}</p></div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-ocean-100 hover:bg-ocean-200 text-ocean-700 rounded-lg text-xs font-medium transition-colors">Review</button>
                <button className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs transition-colors">Flag</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="px-8 py-3 bg-white/70 backdrop-blur-xl border-2 border-ocean-200 hover:border-ocean-500 text-ocean-600 rounded-xl font-medium transition-all hover:scale-105">Load More Items</button>
      </div>
    </div>
  )
}


