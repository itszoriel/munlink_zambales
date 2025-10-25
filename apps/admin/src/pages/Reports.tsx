import { useEffect, useMemo, useState } from 'react'
import { handleApiError, dashboardApi, userApi, marketplaceApi, announcementApi, documentsAdminApi, municipalitiesAdminApi } from '../lib/api'

export default function Reports() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<any>(null)
  const [range, setRange] = useState<string>('last_30_days')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setError(null)
        setLoading(true)
        const [dashRes, userRes, marketRes, annRes, docsRes, muniRes, growthRes] = await Promise.allSettled([
          dashboardApi.getDashboardStats(),
          userApi.getUserStats(),
          marketplaceApi.getMarketplaceStats(),
          announcementApi.getAnnouncementStats(),
          documentsAdminApi.getStats(range),
          municipalitiesAdminApi.getPerformance(range),
          dashboardApi.getUserGrowth(range),
        ])

        const dashboard = dashRes.status === 'fulfilled' ? ((dashRes.value as any).data || dashRes.value) : undefined
        const users = userRes.status === 'fulfilled' ? ((userRes.value as any).data || userRes.value) : undefined
        const marketplace = marketRes.status === 'fulfilled' ? ((marketRes.value as any).data || marketRes.value) : undefined
        const announcements = annRes.status === 'fulfilled' ? ((annRes.value as any).data || annRes.value) : undefined
        const documents = docsRes.status === 'fulfilled' ? ((docsRes.value as any).data || docsRes.value) : undefined
        const municipalities = muniRes.status === 'fulfilled' ? (((muniRes.value as any).data || muniRes.value)?.municipalities) : undefined

        const usersGrowth = growthRes.status === 'fulfilled' ? ((growthRes.value as any).data || growthRes.value) : undefined
        if (mounted) setReport({ dashboard, users, marketplace, announcements, documents, municipalities, usersGrowth })
      } catch (e: any) {
        setError(handleApiError(e))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [range])

  const metrics = useMemo(() => ([
    { label: 'Total Users', value: String(report?.users?.total_users ?? '—'), change: '+0%', trend: 'up', icon: '👥', color: 'ocean' },
    { label: 'Active Listings', value: String(report?.marketplace?.total_items ?? '—'), change: '+0%', trend: 'up', icon: '🛍️', color: 'forest' },
    { label: 'Documents Issued', value: String(report?.documents?.issued_total ?? '—'), change: '+0%', trend: 'up', icon: '📄', color: 'purple' },
    { label: 'Active Announcements', value: String(report?.announcements?.active_announcements ?? '—'), change: '+0%', trend: 'up', icon: '📢', color: 'sunset' },
  ] as const), [report])

  const documents = (report?.documents?.top_requested as any[]) || []

  const municipalities = (report?.municipalities as any[]) || []
  const growth = ((report as any)?.usersGrowth?.series as any[]) || []

  return (
    <div className="min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">Reports & Analytics</h1>
          <p className="text-neutral-600">Platform insights and performance metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select name="reportRange" id="report-range" aria-label="Select report date range" value={range} onChange={(e)=> setRange(e.target.value)} className="px-4 py-2 bg-white/70 backdrop-blur-xl border border-neutral-200 rounded-xl font-medium">
            <option value="last_7_days">Last 7 days</option>
            <option value="last_30_days">Last 30 days</option>
            <option value="last_90_days">Last 90 days</option>
            <option value="this_year">This Year</option>
          </select>
          <button className="w-full sm:w-auto px-6 py-3 bg-ocean-gradient hover:scale-105 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Export Report
          </button>
        </div>
      </div>

      {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        {(loading ? [...Array(4)] : metrics).map((metric: any, i: number) => (
          <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:scale-105 transition-transform">
            {loading ? (
              <>
                <div className="h-12 w-12 skeleton rounded-xl mb-4" />
                <div className="h-6 w-24 skeleton rounded mb-2" />
                <div className="h-3 w-20 skeleton rounded" />
              </>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-${metric.color}-100 rounded-xl flex items-center justify-center text-2xl`}>{metric.icon}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${metric.trend === 'up' ? 'bg-forest-100 text-forest-700' : 'bg-red-100 text-red-700'}`}>{metric.trend === 'up' ? '↑' : '↓'} {metric.change}</span>
                </div>
                <p className="text-3xl font-bold text-neutral-900 mb-1">{metric.value}</p>
                <p className="text-sm text-neutral-600">{metric.label}</p>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-200"><h2 className="text-xl font-bold text-neutral-900">User Growth</h2><p className="text-sm text-neutral-600 mt-1">New registrations over time</p></div>
          <div className="p-6">
            {growth.length === 0 ? (
              <div className="h-64 bg-gradient-to-br from-ocean-50 to-forest-50 rounded-2xl flex items-center justify-center text-sm text-neutral-600">No data</div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-auto">
                {growth.map((g: any) => (
                  <div key={g.day} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-700">{g.day}</span>
                    <span className="font-semibold text-neutral-900">{g.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-200"><h2 className="text-xl font-bold text-neutral-900">Marketplace Activity</h2><p className="text-sm text-neutral-600 mt-1">Transaction type breakdown</p></div>
          <div className="p-6 space-y-4">
            {(() => {
              const stats = (report?.marketplace || {}) as any
              const total = Math.max(1, Number(stats.total_items || 0))
              const buckets = [
                { label: 'Pending', value: Number(stats.pending_items || 0), color: 'sunset' },
                { label: 'Approved', value: Number(stats.approved_items || 0), color: 'forest' },
                { label: 'Rejected', value: Number(stats.rejected_items || 0), color: 'red' },
              ]
              return buckets.map((item, i) => {
                const pct = Math.round((item.value / total) * 100)
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-neutral-700">{item.label}</span><span className="text-sm font-bold text-neutral-900">{item.value} ({pct}%)</span></div>
                    <div className="h-3 bg-neutral-100 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} /></div>
                  </div>
                )
              })
            })()}
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-neutral-200"><h2 className="text-xl font-bold text-neutral-900">Document Requests</h2><p className="text-sm text-neutral-600 mt-1">Most requested documents</p></div>
        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_,i)=> (<div key={i} className="h-28 skeleton rounded-2xl" />))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-sm text-neutral-600">No document requests in the selected range.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {documents.map((doc: any) => (
                <div key={doc.name} className="bg-neutral-50 rounded-2xl p-4 hover:bg-ocean-50 transition-colors">
                  <div className="flex items-start justify-between mb-3"><div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">📋</div><span className="text-2xl font-bold text-neutral-900">{doc.count}</span></div>
                  <h3 className="font-semibold text-sm text-neutral-900 mb-2">{doc.name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-200"><h2 className="text-xl font-bold text-neutral-900">Municipality Performance</h2><p className="text-sm text-neutral-600 mt-1">Activity comparison across municipalities</p></div>
        <div className="p-6 space-y-4">
          {loading ? (
            [...Array(3)].map((_,i)=> (<div key={i} className="h-24 skeleton rounded-2xl" />))
          ) : municipalities.length === 0 ? (
            <div className="text-sm text-neutral-600">No data available.</div>
          ) : (
            municipalities.map((m: any) => (
              <div key={m.name} className="p-4 bg-neutral-50 rounded-2xl hover:bg-ocean-50 transition-colors">
                <div className="flex items-center justify-between mb-3"><h3 className="font-bold text-neutral-900">{m.name}</h3><button className="text-sm text-ocean-600 hover:text-ocean-700 font-medium">View Details →</button></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><p className="text-xs text-neutral-600 mb-1">Users</p><p className="text-xl font-bold text-neutral-900">{m.users}</p></div>
                  <div><p className="text-xs text-neutral-600 mb-1">Listings</p><p className="text-xl font-bold text-neutral-900">{m.listings}</p></div>
                  <div><p className="text-xs text-neutral-600 mb-1">Documents</p><p className="text-xl font-bold text-neutral-900">{m.documents}</p></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}


