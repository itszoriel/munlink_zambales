import { useEffect, useMemo, useState } from 'react'
import { handleApiError, userApi, mediaUrl } from '../lib/api'
import { useLocation } from 'react-router-dom'
import { useAdminStore } from '../lib/store'
import { DataTable, Modal, Button } from '@munlink/ui'

export default function Residents() {
  const location = useLocation()
  const adminMunicipalityName = useAdminStore((s) => s.user?.admin_municipality_name || s.user?.municipality_name)
  const adminMunicipalitySlug = useAdminStore((s) => s.user?.admin_municipality_slug || s.user?.municipality_slug)
  const adminMunicipalityId = useAdminStore((s) => (s.user as any)?.admin_municipality_id || (s.user as any)?.municipality_id)
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'suspended'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 10

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setError(null)
        setLoading(true)
        // Load verified and pending users in parallel
        const [verifiedRes, pendingRes] = await Promise.all([
          userApi.getVerifiedUsers(1, 100),
          userApi.getPendingUsers(),
        ])

        const verified = (verifiedRes as any)?.data || (verifiedRes as any)?.users || []
        const pending = (pendingRes as any)?.users || (pendingRes as any)?.data?.users || []

        let unified = [
          ...verified.map((u: any) => ({ ...u, __status: 'verified' })),
          ...pending.map((u: any) => ({ ...u, __status: 'pending' })),
        ]

        // Scope to admin's municipality (prefer numeric id to avoid string mismatches)
        if (adminMunicipalityId) {
          unified = unified.filter((u: any) => Number(u.municipality_id) === Number(adminMunicipalityId))
        } else if (adminMunicipalityName || adminMunicipalitySlug) {
          unified = unified.filter((u: any) => {
            const name = (u.municipality_name || '').toLowerCase()
            const slug = (u.municipality_slug || '').toLowerCase()
            const wantName = (adminMunicipalityName || '').toLowerCase()
            const wantSlug = (adminMunicipalitySlug || '').toLowerCase()
            return (wantName && name === wantName) || (wantSlug && slug === wantSlug)
          })
        }

        const mapped = unified.map((u: any) => ({
          id: u.id ? String(u.id) : u.user_id ? String(u.user_id) : u.username || 'USER',
          name: [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || u.email || 'Unknown',
          email: u.email || '',
          phone: u.phone_number || '',
          municipality: u.municipality_name || '—',
          status: u.__status || (u.is_active === false ? 'suspended' : (u.admin_verified ? 'verified' : (u.admin_verified === false ? 'pending' : 'pending'))),
          joined: (u.created_at || '').slice(0, 10),
          avatar: (u.first_name?.[0] || 'U') + (u.last_name?.[0] || ''),
          profile_picture: u.profile_picture,
        }))
        if (mounted) setRows(mapped)
      } catch (e: any) {
        setError(handleApiError(e))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  // Auto-open from query param ?open=<id>
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const openId = params.get('open')
    if (!openId) return
    const found = rows.find((r) => String(r.id) === String(openId))
    if (found) openResident(found)
  }, [location.search, rows])

  const filtered = useMemo(() => rows.filter((r) =>
    (filter === 'all' || r.status === filter) &&
    (r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.email.toLowerCase().includes(searchQuery.toLowerCase()) || String(r.id).toLowerCase().includes(searchQuery.toLowerCase()))
  ), [rows, filter, searchQuery])

  // Reset to first page on filter/search changes
  useEffect(() => { setPage(1) }, [filter, searchQuery])

  // Pagination calculations
  // DataTable handles pagination UI; we keep only page indices
  const startIdx = (page - 1) * perPage
  const endIdx = Math.min(startIdx + perPage, filtered.length)
  const visible = filtered.slice(startIdx, endIdx)
  

  const counts = useMemo(() => ({
    all: rows.length,
    verified: rows.filter((r) => r.status === 'verified').length,
    pending: rows.filter((r) => r.status === 'pending').length,
    suspended: rows.filter((r) => r.status === 'suspended').length,
  }), [rows])

  const openResident = (resident: any) => {
    setSelected(resident)
    setDetailOpen(true)
  }

  const updateRowStatus = (userId: string, status: 'verified' | 'pending' | 'suspended') => {
    setRows((prev: any[]) => prev.map((r: any) => (String(r.id) === String(userId) ? { ...r, status } : r)))
    // If details are open for this user, keep basic status in sync
    setSelected((prev: any | null) => (prev && String(prev.id) === String(userId) ? { ...prev, status } : prev))
  }

  const handleApprove = async (e: any, resident: any) => {
    e.stopPropagation()
    const id = String(resident.id)
    try {
      setError(null)
      setActionLoading(id)
      await userApi.verifyUser(Number(id))
      updateRowStatus(id, 'verified')
    } catch (err: any) {
      setError(handleApiError(err))
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (e: any, resident: any) => {
    e.stopPropagation()
    const id = String(resident.id)
    try {
      const reason = window.prompt('Enter a reason for rejection (optional):', 'Verification rejected by admin') || 'Verification rejected by admin'
      setError(null)
      setActionLoading(id)
      await userApi.rejectUser(Number(id), reason)
      updateRowStatus(id, 'suspended')
    } catch (err: any) {
      setError(handleApiError(err))
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Residents</h1>
              <p className="text-neutral-600">Manage verified residents and user accounts</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-white/70 backdrop-blur-xl border border-neutral-200 hover:border-ocean-500 text-neutral-700 rounded-xl font-medium transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Export Data
              </button>
              <button className="px-6 py-3 bg-ocean-gradient hover:scale-105 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2">
                <span className="text-lg">+</span>
                Add Resident
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <input type="search" name="resident_search" id="resident-search" aria-label="Search residents by name, email, or ID number" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, email, or ID number..." className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 transition-all" />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>
              <div className="w-full lg:w-auto -mx-2 px-2 overflow-x-auto lg:overflow-visible">
                <div className="inline-flex items-center gap-2">
                  {[
                    { value: 'all', label: 'All Status', count: counts.all },
                    { value: 'verified', label: 'Verified', count: counts.verified },
                    { value: 'pending', label: 'Pending', count: counts.pending },
                    { value: 'suspended', label: 'Suspended', count: counts.suspended },
                  ].map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setFilter(status.value as any)}
                      aria-pressed={filter === status.value}
                      className={`shrink-0 px-4 py-2 rounded-xl font-medium transition-all ${filter === status.value ? 'bg-ocean-gradient text-white shadow-lg' : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'}`}
                    >
                      {status.label}
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === status.value ? 'bg-white/20' : 'bg-neutral-200'}`}>{status.count}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Municipality is scoped by admin permissions; show a locked chip instead of a selector */}
              {adminMunicipalityName && (
                <div className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-medium w-full lg:w-auto flex items-center gap-2">
                  <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8z"/></svg>
                  <span className="truncate">{adminMunicipalityName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <DataTable
            className="bg-white/70 backdrop-blur-xl"
            columns={[
              { key: 'resident', header: 'Resident', className: 'md:col-span-3 xl:col-span-3', render: (r: any) => (
                <div className="flex items-center gap-3 min-w-0">
                  {r.profile_picture ? (
                    <img src={mediaUrl(r.profile_picture)} alt={r.name} className="w-10 h-10 rounded-xl object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-ocean-gradient text-white flex items-center justify-center font-bold">{r.avatar}</div>
                  )}
                  <div className="min-w-0">
                    <div className="font-medium truncate">{r.name}</div>
                  </div>
                </div>
              ) },
              { key: 'contact', header: 'Contact', className: 'md:col-span-2 xl:col-span-3', render: (r: any) => (
                <div className="min-w-0">
                  <p className="text-sm">{r.email}</p>
                  <p className="text-sm text-neutral-500">{r.phone}</p>
                </div>
              ) },
              { key: 'municipality', header: 'Municipality', className: 'md:col-span-2 xl:col-span-2' },
              { key: 'status', header: 'Status', className: 'md:col-span-3 xl:col-span-2', render: (r: any) => (
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${r.status === 'verified' ? 'bg-forest-100 text-forest-700' : r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {r.status === 'verified' && '✓ '} {r.status === 'pending' && '⏳ '}
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                  <p className="text-xs text-neutral-500 mt-1">Joined {r.joined}</p>
                </div>
              ) },
              { key: 'actions', header: 'Actions', className: 'md:col-span-2 xl:col-span-2 text-right', render: (r: any) => (
                <div className="flex items-center justify-end gap-1">
                  {r.status === 'pending' ? (
                    <>
                      <button 
                        className="px-1 py-0.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50" 
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleReject(e as any, r) }} 
                        disabled={actionLoading === String(r.id)}
                      >
                        {actionLoading === String(r.id) ? '…' : 'R'}
                      </button>
                      <button 
                        className="px-1 py-0.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" 
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleApprove(e as any, r) }} 
                        disabled={actionLoading === String(r.id)}
                      >
                        {actionLoading === String(r.id) ? '…' : 'A'}
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Suspend/Unsuspend */}
                      <button
                        className={`px-1 py-0.5 text-xs ${r.status==='suspended' ? 'bg-green-600 hover:bg-green-700' : 'bg-rose-600 hover:bg-rose-700'} text-white rounded disabled:opacity-50`}
                        onClick={async (e: React.MouseEvent) => {
                          e.stopPropagation()
                          const id = String(r.id)
                          try {
                            setActionLoading(id)
                            const res = await fetch(`${(import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000'}/api/admin/users/${id}/suspend`, {
                              method: 'POST',
                              headers: { 'Authorization': `Bearer ${useAdminStore.getState().accessToken}` }
                            })
                            const ok = res.ok
                            if (ok) updateRowStatus(id, r.status==='suspended' ? 'verified' : 'suspended')
                          } finally {
                            setActionLoading(null)
                          }
                        }}
                        disabled={actionLoading === String(r.id)}
                        title={r.status==='suspended' ? 'Unsuspend' : 'Suspend'}
                      >
                        {r.status==='suspended' ? 'Un' : ''}S
                      </button>
                      <button 
                        className="px-1 py-0.5 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300" 
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); openResident(r) }}
                      >
                        O
                      </button>
                    </>
                  )}
                </div>
              ) },
            ]}
            data={visible}
            onRowClick={(row: any) => openResident(row)}
            emptyState={loading ? 'Loading…' : (error ? error : 'No residents found')}
            pagination={{ page, pageSize: perPage, total: filtered.length, onChange: (p: number) => setPage(p) }}
          />
        </div>
      </div>
      {/* Detail Modal */}
      {detailOpen && (
        <ResidentDetailModal
          userId={Number(selected?.id)}
          basic={selected}
          onClose={() => setDetailOpen(false)}
          onStatusChange={(id, status) => updateRowStatus(String(id), status)}
        />
      )}
    </div>
  )
}


// Detail modal embedded for simplicity
function ResidentDetailModal({ userId, basic, onClose, onStatusChange }: { userId: number; basic: any; onClose: () => void; onStatusChange: (id: number, status: 'verified' | 'pending' | 'suspended') => void }) {
  const [data, setData] = useState<any>(basic)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<boolean>(false)

  // Derive current status from latest data
  const status: 'verified' | 'pending' | 'suspended' = ((): any => {
    const u = data || basic
    if (!u) return 'pending'
    if (u?.is_active === false) return 'suspended'
    if (u?.admin_verified) return 'verified'
    return 'pending'
  })()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await userApi.getUserById(userId)
        const u = (res as any)?.data || res
        if (mounted && u) setData(u)
      } catch (e: any) {
        setError(handleApiError(e))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [userId])

  const approveFromModal = async () => {
    try {
      setError(null)
      setActionLoading(true)
      await userApi.verifyUser(Number(userId))
      onStatusChange(userId, 'verified')
      // Reflect locally in modal
      setData((prev: any) => ({ ...(prev || {}), admin_verified: true, is_active: true }))
    } catch (e: any) {
      setError(handleApiError(e))
    } finally {
      setActionLoading(false)
    }
  }

  const rejectFromModal = async () => {
    const reason = window.prompt('Enter a reason for rejection (optional):', 'Verification rejected by admin') || 'Verification rejected by admin'
    try {
      setError(null)
      setActionLoading(true)
      await userApi.rejectUser(Number(userId), reason)
      onStatusChange(userId, 'suspended')
      // Reflect locally in modal
      setData((prev: any) => ({ ...(prev || {}), is_active: false, admin_verified: false }))
    } catch (e: any) {
      setError(handleApiError(e))
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <Modal
      open={true}
      onOpenChange={(o) => { if (!o) onClose() }}
      title="Resident Details"
      footer={(
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
          {status === 'pending' ? (
            <>
              <Button variant="danger" size="sm" onClick={rejectFromModal} disabled={actionLoading}>
                {actionLoading ? 'Processing…' : 'Reject'}
              </Button>
              <Button size="sm" onClick={approveFromModal} disabled={actionLoading}>
                {actionLoading ? 'Processing…' : 'Approve'}
              </Button>
            </>
          ) : null}
          <div className="flex-1" />
          <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
        </div>
      )}
    >
      {loading && <div className="text-sm text-neutral-600">Loading...</div>}
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{error}</div>}
      <div className="flex items-start gap-4">
        {data?.profile_picture ? (
          <img src={mediaUrl(data.profile_picture)} alt={data?.name || ''} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover" />
        ) : (
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-ocean-gradient rounded-xl flex items-center justify-center text-white font-bold">{(data?.first_name?.[0]||'U')+(data?.last_name?.[0]||'')}</div>
        )}
        <div>
          <h3 className="text-lg font-semibold">{[data?.first_name, data?.last_name].filter(Boolean).join(' ')}</h3>
          <p className="text-sm text-neutral-600">@{data?.username} • {data?.email}</p>
          {data?.municipality_name && (<p className="text-sm text-neutral-600">{data.municipality_name}</p>)}
          <div className="mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status === 'verified' ? 'bg-forest-100 text-forest-700' : status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
              {status === 'verified' ? '✓ Verified' : status === 'pending' ? '⏳ Pending' : 'Suspended'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-3">ID Verification</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.valid_id_front && (
            <div>
              <p className="text-xs text-neutral-500 mb-2">Front</p>
              <img src={mediaUrl(data.valid_id_front)} alt="ID Front" className="w-full h-44 sm:h-48 object-cover rounded border" />
            </div>
          )}
          {data?.valid_id_back && (
            <div>
              <p className="text-xs text-neutral-500 mb-2">Back</p>
              <img src={mediaUrl(data.valid_id_back)} alt="ID Back" className="w-full h-44 sm:h-48 object-cover rounded border" />
            </div>
          )}
          {!data?.valid_id_front && !data?.valid_id_back && (
            <p className="text-sm text-neutral-500">No ID documents uploaded.</p>
          )}
        </div>
      </div>
    </Modal>
  )
}

