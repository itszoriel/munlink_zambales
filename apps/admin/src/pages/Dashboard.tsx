import { useEffect, useState } from 'react'
import { adminApi, handleApiError, userApi, issueApi, marketplaceApi, announcementApi } from '../lib/api'
import UserVerificationList from '../components/UserVerificationList'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../lib/store'
import { StatCard, Card, Button, Select } from '@munlink/ui'

export default function Dashboard() {
  const user = useAdminStore((s) => s.user)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dash, setDash] = useState<{ pending_verifications?: number; active_issues?: number; marketplace_items?: number; announcements?: number } | null>(null)
  const [activity, setActivity] = useState<Array<{ icon: string; text: string; who?: string; ts: number; color: 'ocean'|'forest'|'sunset'|'purple'|'red' }>>([])
  const [overview, setOverview] = useState<Array<{ label: string; value: number; max: number; color: 'ocean'|'forest'|'sunset'|'red' }>>([
    { label: 'Verifications', value: 0, max: 50, color: 'ocean' },
    { label: 'Documents', value: 0, max: 100, color: 'forest' },
    { label: 'Marketplace', value: 0, max: 50, color: 'sunset' },
    { label: 'Issues', value: 0, max: 50, color: 'red' },
  ])

  // Quick actions removed per design update

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setError(null)
        // Prefer admin reports; fallback to dashboard stats is implemented inside adminApi.getReports
        const data = await adminApi.getReports()
        const d = (data?.dashboard || data) as any
        if (mounted) setDash({
          pending_verifications: d?.pending_verifications ?? 0,
          active_issues: d?.active_issues ?? 0,
          marketplace_items: d?.marketplace_items ?? 0,
          announcements: d?.announcements ?? 0,
        })
      } catch (e: any) {
        const msg = handleApiError(e)
        setError(msg)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  // Refresh stats when a verification action occurs
  const reloadStats = async () => {
    try {
      const data = await adminApi.getReports()
      const d = (data?.dashboard || data) as any
      setDash({
        pending_verifications: d?.pending_verifications ?? 0,
        active_issues: d?.active_issues ?? 0,
        marketplace_items: d?.marketplace_items ?? 0,
        announcements: d?.announcements ?? 0,
      })
    } catch {}
  }

  // Load recent activity and overview series
  const loadActivity = async () => {
    try {
      const [pendingUsersRes, issuesRes, itemsRes, announcementsRes] = await Promise.allSettled([
        userApi.getPendingUsers(),
        issueApi.getIssues({ page: 1, per_page: 20 }),
        marketplaceApi.getPendingItems(),
        announcementApi.getAnnouncements(),
      ])

      const pendingUsers = pendingUsersRes.status === 'fulfilled' ? ((pendingUsersRes.value as any)?.data?.users || (pendingUsersRes.value as any)?.users || []) : []
      const issues = issuesRes.status === 'fulfilled' ? ((issuesRes.value as any)?.data?.data || (issuesRes.value as any)?.data || (issuesRes.value as any)?.issues || []) : []
      const items = itemsRes.status === 'fulfilled' ? (((itemsRes.value as any)?.data?.data?.items) || (itemsRes.value as any)?.data?.items || (itemsRes.value as any)?.items || []) : []
      const announcements = announcementsRes.status === 'fulfilled' ? (((announcementsRes.value as any)?.data?.announcements) || (announcementsRes.value as any)?.announcements || []) : []

      // Build feed
      const feed: Array<{ icon: string; text: string; who?: string; ts: number; color: 'ocean'|'forest'|'sunset'|'purple'|'red' }> = []
      for (const u of pendingUsers) {
        const ts = new Date(u.created_at || u.updated_at || Date.now()).getTime()
        feed.push({ icon: '👥', text: 'New registration', who: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim(), ts, color: 'ocean' })
      }
      for (const i of issues) {
        const ts = new Date(i.created_at || i.updated_at || Date.now()).getTime()
        feed.push({ icon: '⚠️', text: `Issue: ${i.title ?? i.category ?? 'New issue'}`, who: i.created_by_name, ts, color: 'red' })
      }
      for (const it of items) {
        const ts = new Date(it.created_at || it.updated_at || Date.now()).getTime()
        feed.push({ icon: '🛍️', text: `Marketplace: ${it.title ?? 'New item'}`, who: it.seller_name, ts, color: 'sunset' })
      }
      for (const a of announcements) {
        const ts = new Date(a.created_at || a.updated_at || Date.now()).getTime()
        feed.push({ icon: '📢', text: `Announcement: ${a.title ?? 'New announcement'}`, who: a.created_by_name, ts, color: 'purple' })
      }

      feed.sort((a, b) => b.ts - a.ts)
      setActivity(feed.slice(0, 10))

      // Overview for last 7 days
      const since = Date.now() - 7 * 24 * 60 * 60 * 1000
      const in7 = (d?: any) => new Date(d || Date.now()).getTime() >= since
      const verifications7 = pendingUsers.filter((u: any) => in7(u.created_at)).length
      const documents7 = 0 // Placeholder: no admin documents endpoint; keep 0 for now
      const marketplace7 = items.filter((it: any) => in7(it.created_at)).length
      const issues7 = issues.filter((i: any) => in7(i.created_at)).length
      setOverview([
        { label: 'Verifications', value: verifications7, max: Math.max(10, verifications7), color: 'ocean' },
        { label: 'Documents', value: documents7, max: Math.max(10, documents7 || 10), color: 'forest' },
        { label: 'Marketplace', value: marketplace7, max: Math.max(10, marketplace7), color: 'sunset' },
        { label: 'Issues', value: issues7, max: Math.max(10, issues7), color: 'red' },
      ])
    } catch {
      setActivity([])
    }
  }

  // Combined reload for polling
  const reloadAll = async () => {
    await Promise.allSettled([reloadStats(), loadActivity()])
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      await loadActivity()
    })()
    const id = window.setInterval(() => { if (mounted) reloadAll() }, 30000)
    return () => { mounted = false; window.clearInterval(id) }
  }, [])

  // KPI cards rendered via shared StatCard

  const timeAgo = (ts: number) => {
    const diff = Math.max(0, Date.now() - ts)
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins} min ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} hour${hrs>1?'s':''} ago`
    const days = Math.floor(hrs / 24)
    return `${days} day${days>1?'s':''} ago`
  }

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen">
      <div className="pt-0">
        <div className="">
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>
          )}
          {/* Welcome Banner */}
          <div className="mb-8 bg-ocean-gradient text-white rounded-3xl p-8 relative overflow-visible">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.first_name}! 👋</h1>
                <p className="text-ocean-100 text-lg">{user?.admin_municipality_name || 'Admin'} Dashboard • {dateStr}</p>
              </div>
              <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto"></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Pending Verifications" value={loading ? '…' : (dash?.pending_verifications ?? 0)} />
            <StatCard title="Active Issues" value={loading ? '…' : (dash?.active_issues ?? 0)} />
            <StatCard title="Marketplace Items" value={loading ? '…' : (dash?.marketplace_items ?? 0)} />
            <StatCard title="Announcements" value={loading ? '…' : (dash?.announcements ?? 0)} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - Pending Verifications */}
            <Card className="lg:col-span-2" title={<span className="text-xl font-bold">Pending User Verifications</span>} subtitle="Review and approve user registrations" actions={<Button variant="secondary" size="sm" onClick={() => navigate('/residents')}>View All</Button>}>
              <UserVerificationList 
                onUserVerified={reloadStats} 
                onUserRejected={reloadStats}
                onReview={(u)=>navigate(`/residents?open=${u.id}`)}
              />
            </Card>

            {/* Right - Announcements */}
            <Card title={<span className="text-xl font-bold">Announcements</span>} subtitle="Create and manage public announcements">
              <Button fullWidth className="mb-6" onClick={() => navigate('/announcements')}>+ Create Announcement</Button>
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-2xl mb-4"><span className="text-3xl">📢</span></div>
                <h3 className="font-bold text-neutral-900 mb-2">No announcements</h3>
                <p className="text-sm text-neutral-600">Create your first announcement to get started.</p>
              </div>
            </Card>
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Recent Activity */}
            <Card title={<span className="text-xl font-bold">Recent Activity</span>}>
              <div className="space-y-4">
                {activity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                    <div className={`w-10 h-10 bg-${a.color}-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0`}>{a.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-900 font-medium mb-1">{a.text}</p>
                      <p className="text-xs text-neutral-600">{a.who || 'System'} • {timeAgo(a.ts)}</p>
                    </div>
                  </div>
                ))}
                {activity.length === 0 && (
                  <div className="text-sm text-neutral-600">No recent activity.</div>
                )}
              </div>
            </Card>

            {/* Activity Overview */}
            <Card title={<span className="text-xl font-bold">Activity Overview</span>} actions={(
              <Select name="activityRange" aria-label="Select activity date range" className="px-3 py-1.5" onChange={(e)=>{ /* no-op placeholder; data already polls */ }}>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </Select>
            )}>
              <div className="space-y-4">
                {overview.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-700">{item.label}</span>
                      <span className="text-sm font-bold text-neutral-900">{item.value}</span>
                    </div>
                    <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 rounded-full transition-all duration-1000`} style={{ width: `${(item.value / item.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


