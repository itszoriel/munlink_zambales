import { useEffect, useState } from 'react'
import { adminApi, handleApiError, documentsAdminApi, mediaUrl, showToast } from '../lib/api'
import { ClipboardList, Hourglass, Cog, CheckCircle, PartyPopper, Smartphone, Package as PackageIcon } from 'lucide-react'

type Status = 'all' | 'pending' | 'processing' | 'ready' | 'completed' | 'picked_up'

export default function Requests() {
  const [statusFilter, setStatusFilter] = useState<Status>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<any[]>([])
  const [stats, setStats] = useState<{ total_requests: number; pending_requests: number; processing_requests: number; ready_requests: number; completed_requests: number } | null>(null)
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | 'digital' | 'pickup'>('all')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setError(null)
        setLoading(true)
        const res = await adminApi.getRequests({ page: 1, per_page: 50, status: statusFilter === 'all' ? undefined : statusFilter })
        const list = (res.requests || []) as any[]
        const mapped = list.map((r) => {
          const raw = (r.status || 'pending').toLowerCase()
          const normalized = raw === 'in_progress' ? 'processing' : raw === 'resolved' ? 'ready' : raw === 'closed' ? 'completed' : raw
          let extra: any = undefined
          try {
            const rawNotes = r.additional_notes
            if (rawNotes && typeof rawNotes === 'string' && rawNotes.trim().startsWith('{')) {
              extra = JSON.parse(rawNotes)
            }
          } catch {}
          return {
            id: r.request_number || r.id || 'REQ',
            resident: [r.user?.first_name, r.user?.last_name].filter(Boolean).join(' ') || 'Unknown',
            document: r.document_type?.name || 'Document',
            purpose: r.purpose || '—',
            details: extra?.text || '',
            civil_status: extra?.civil_status || r.civil_status || '',
            submitted: (r.created_at || '').slice(0, 10),
            status: normalized,
            priority: r.priority || 'normal',
            delivery_method: (r.delivery_method === 'physical' ? 'pickup' : r.delivery_method) || 'digital',
            delivery_address: r.delivery_address || '',
            request_id: r.id,
            document_file: r.document_file,
            resident_input: (r as any).resident_input,
            admin_edited_content: (r as any).admin_edited_content,
            additional_notes: r.additional_notes,
          }
        })
        if (mounted) setRows(mapped)
      } catch (e: any) {
        setError(handleApiError(e))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [statusFilter])

  // Load header counters from document request stats
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        // Fetch stats for each status
        const [allRes, pendingRes, processingRes, readyRes, completedRes] = await Promise.allSettled([
          adminApi.getRequests({ page: 1, per_page: 1 }),
          adminApi.getRequests({ status: 'pending', page: 1, per_page: 1 }),
          adminApi.getRequests({ status: 'processing', page: 1, per_page: 1 }),
          adminApi.getRequests({ status: 'ready', page: 1, per_page: 1 }),
          adminApi.getRequests({ status: 'completed', page: 1, per_page: 1 }),
        ])
        
        const total = allRes.status === 'fulfilled' ? (allRes.value.pagination?.total || 0) : 0
        const pending = pendingRes.status === 'fulfilled' ? (pendingRes.value.pagination?.total || 0) : 0
        const processing = processingRes.status === 'fulfilled' ? (processingRes.value.pagination?.total || 0) : 0
        const ready = readyRes.status === 'fulfilled' ? (readyRes.value.pagination?.total || 0) : 0
        const completed = completedRes.status === 'fulfilled' ? (completedRes.value.pagination?.total || 0) : 0
        
        if (mounted) setStats({ 
          total_requests: total,
          pending_requests: pending,
          processing_requests: processing,
          ready_requests: ready,
          completed_requests: completed
        })
      } catch {}
    })()
    return () => { mounted = false }
  }, [])

  // Actions
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectForId, setRejectForId] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState<string>('')
  const [editFor, setEditFor] = useState<null | { id: number; purpose: string; remarks: string; civil_status: string; age?: string }>(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const visibleRows = rows.filter((r) => {
    // If Ready filter is active, and delivery filter is 'all', force pickup-only per requirements
    const effectiveDelivery = deliveryFilter === 'all' && statusFilter === 'ready' ? 'pickup' : deliveryFilter
    if (effectiveDelivery !== 'all' && r.delivery_method !== (effectiveDelivery === 'pickup' ? 'pickup' : 'digital')) return false
    return true
  })
  const refresh = async () => {
    try {
      const delivery = deliveryFilter === 'all' ? undefined : deliveryFilter
      const res = await adminApi.getRequests({ page: 1, per_page: 50, status: statusFilter === 'all' ? undefined : statusFilter, delivery })
      const list = (res.requests || []) as any[]
      const mapped = list.map((r) => {
        const raw = (r.status || 'pending').toLowerCase()
        const normalized = raw === 'in_progress' ? 'processing' : raw === 'resolved' ? 'ready' : raw === 'closed' ? 'completed' : raw
        let extra: any = undefined
        try {
          const rawNotes = r.additional_notes
          if (rawNotes && typeof rawNotes === 'string' && rawNotes.trim().startsWith('{')) {
            extra = JSON.parse(rawNotes)
          }
        } catch {}
        return {
          id: r.request_number || r.id || 'REQ',
          resident: [r.user?.first_name, r.user?.last_name].filter(Boolean).join(' ') || 'Unknown',
          document: r.document_type?.name || 'Document',
          purpose: r.purpose || '—',
          details: extra?.text || '',
          civil_status: extra?.civil_status || r.civil_status || '',
          submitted: (r.created_at || '').slice(0, 10),
          status: normalized,
          priority: r.priority || 'normal',
          delivery_method: (r.delivery_method === 'physical' ? 'pickup' : r.delivery_method) || 'digital',
          delivery_address: r.delivery_address || '',
          request_id: r.id,
          document_file: r.document_file,
          resident_input: (r as any).resident_input,
          admin_edited_content: (r as any).admin_edited_content,
          additional_notes: r.additional_notes,
        }
      })
      setRows(mapped)
    } catch (e: any) {
      setError(handleApiError(e))
    }
  }

  const handleGeneratePdf = async (row: any) => {
    try {
      setActionLoading(String(row.id))
      const res = await documentsAdminApi.generatePdf(row.request_id)
      await refresh()
      const url = (res as any)?.url || (res as any)?.data?.url
      if (url) {
        window.open(mediaUrl(url), '_blank')
        showToast('Document generated successfully', 'success')
      }
    } catch (e: any) {
      showToast(handleApiError(e), 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleApproveAndGenerate = async (row: any) => {
    try {
      setActionLoading(String(row.id))
      await documentsAdminApi.updateStatus(row.request_id, 'processing')
      const res = await documentsAdminApi.generatePdf(row.request_id)
      await refresh()
      const url = (res as any)?.url || (res as any)?.data?.url
      if (url) {
        window.open(mediaUrl(url), '_blank')
        showToast('Document approved and generated', 'success')
      }
    } catch (e: any) {
      showToast(handleApiError(e), 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleViewPdf = async (row: any) => {
    try {
      setActionLoading(String(row.id))
      const res = await documentsAdminApi.downloadPdf(row.request_id)
      const url = (res as any)?.url || (res as any)?.data?.url
      if (url) window.open(mediaUrl(url), '_blank')
    } catch (e: any) {
      showToast(handleApiError(e), 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSetProcessing = async (row: any) => {
    try {
      setActionLoading(String(row.id))
      await documentsAdminApi.updateStatus(row.request_id, 'processing')
      await refresh()
      showToast('Request marked as processing', 'success')
    } catch (e: any) {
      showToast(handleApiError(e), 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSetReady = async (row: any) => {
    try {
      setActionLoading(String(row.id))
      const res = await documentsAdminApi.readyForPickup(row.request_id)
      await refresh()
      const claim = (res as any)?.claim || (res as any)?.data?.claim
      if (claim?.code_masked) {
        showToast(`Ready for pickup. Claim code: ${claim.code_masked}`, 'success')
      } else {
        showToast('Request marked as ready for pickup', 'success')
      }
    } catch (e: any) {
      showToast(handleApiError(e), 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handlePickedUp = async (row: any) => {
    try {
      setActionLoading(String(row.id))
      await documentsAdminApi.updateStatus(row.request_id, 'picked_up', 'Verified and released to resident')
      await refresh()
      showToast('Marked as picked up', 'success')
    } catch (e: any) {
      showToast(handleApiError(e), 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleComplete = async (row: any) => {
    try {
      setActionLoading(String(row.id))
      await documentsAdminApi.updateStatus(row.request_id, 'completed')
      await refresh()
      showToast('Request completed', 'success')
    } catch (e: any) {
      showToast(handleApiError(e), 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const openReject = (row: any) => {
    setRejectForId(row.request_id)
    setRejectReason('')
  }

  const submitReject = async () => {
    if (!rejectForId) return
    try {
      setActionLoading(String(rejectForId))
      await documentsAdminApi.updateStatus(rejectForId, 'rejected', undefined, rejectReason || 'Request rejected by admin')
      setRejectForId(null)
      setRejectReason('')
      await refresh()
      showToast('Request rejected', 'success')
    } catch (e: any) {
      showToast(handleApiError(e), 'error')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Document Requests</h1>
        <p className="text-neutral-600">Process and track resident document requests</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        {[
          { status: 'all', label: 'All Requests', count: stats?.total_requests ?? '—', icon: '📋', color: 'neutral' },
          { status: 'pending', label: 'Pending Review', count: stats?.pending_requests ?? '—', icon: '⏳', color: 'yellow' },
          { status: 'processing', label: 'Processing', count: stats?.processing_requests ?? '—', icon: '⚙️', color: 'ocean' },
          { status: 'ready', label: 'Ready for Pickup', count: stats?.ready_requests ?? '—', icon: '✅', color: 'forest' },
          { status: 'completed', label: 'Completed', count: stats?.completed_requests ?? '—', icon: '🎉', color: 'purple' },
        ].map((item) => (
          <button key={item.status} onClick={() => setStatusFilter(item.status as Status)} className={`text-left p-4 rounded-2xl transition-all ${statusFilter === item.status ? 'bg-white/90 backdrop-blur-xl shadow-xl scale-105 border-2 border-ocean-500' : 'bg-white/70 backdrop-blur-xl border border-white/50 hover:scale-105'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">
                {(() => {
                  const code = String(item.icon)
                  if (code === '📋') return <ClipboardList className="w-6 h-6" aria-hidden="true" />
                  if (code === '⏳') return <Hourglass className="w-6 h-6" aria-hidden="true" />
                  if (code === '⚙️') return <Cog className="w-6 h-6" aria-hidden="true" />
                  if (code === '✅') return <CheckCircle className="w-6 h-6" aria-hidden="true" />
                  if (code === '🎉') return <PartyPopper className="w-6 h-6" aria-hidden="true" />
                  return <ClipboardList className="w-6 h-6" aria-hidden="true" />
                })()}
              </span>
              <span className={`text-2xl font-bold ${statusFilter === item.status ? 'text-ocean-600' : 'text-neutral-900'}`}>{item.count}</span>
            </div>
            <p className="text-sm font-medium text-neutral-700">{item.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-neutral-900">Recent Requests</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              name="deliveryFilter"
              id="requests-delivery-filter"
              aria-label="Filter by delivery method"
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value as any)}
              className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium"
            >
              <option value="all">All Delivery Types</option>
              <option value="digital">Digital</option>
              <option value="pickup">Pickup</option>
            </select>
            <button className="px-4 py-2 bg-white border border-neutral-200 hover:border-ocean-500 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
              Filter
            </button>
          </div>
        </div>

        {error && <div className="px-6 py-3 text-sm text-red-700 bg-red-50 border-b border-red-200">{error}</div>}
        <div className="divide-y divide-neutral-200">
          {loading && (
            <div className="px-6 py-6">
              <div className="h-6 w-40 skeleton rounded mb-4" />
              <div className="space-y-2">{[...Array(5)].map((_, i) => (<div key={i} className="h-16 skeleton rounded" />))}</div>
            </div>
          )}
          {!loading && visibleRows.map((request) => (
            <div key={request.id} className="px-6 py-5 hover:bg-ocean-50/30 transition-colors group">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className={`sm:col-span-1 w-1 h-6 sm:h-16 rounded-full ${request.priority === 'urgent' ? 'bg-red-500' : request.priority === 'high' ? 'bg-yellow-500' : 'bg-neutral-300'}`} />
                <div className="sm:col-span-11 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center min-w-0">
                  <div className="sm:col-span-3 min-w-0">
                    <p className="font-bold text-neutral-900 mb-1">{request.id}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-neutral-600">{request.document}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${request.delivery_method === 'digital' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {request.delivery_method === 'digital' ? (
                          <>
                            <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Digital</span>
                          </>
                        ) : (
                          <>
                            <PackageIcon className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Pickup</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-2 min-w-0">
                    <p className="text-sm text-neutral-700">{request.resident}</p>
                    <p className="text-xs text-neutral-600">Requester</p>
                  </div>
                  <div className="sm:col-span-3 min-w-0">
                    <p className="text-sm text-neutral-700 truncate">{request.purpose}</p>
                    {(request.civil_status || request.details) && (
                      <p className="text-xs text-neutral-600 truncate">{[request.civil_status, request.details].filter(Boolean).join(' • ')}</p>
                    )}
                  </div>
                  <div className="sm:col-span-1">
                    <p className="text-sm text-neutral-700">{request.submitted}</p>
                    <p className="text-xs text-neutral-600">Submitted</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : request.status === 'processing' ? 'bg-ocean-100 text-ocean-700' : request.status === 'ready' ? 'bg-forest-100 text-forest-700' : request.status === 'picked_up' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
                      {request.status === 'pending' && <Hourglass className="w-3.5 h-3.5" aria-hidden="true" />}
                      {request.status === 'processing' && <Cog className="w-3.5 h-3.5" aria-hidden="true" />}
                      {request.status === 'ready' && <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />}
                      <span>{request.status === 'picked_up' ? 'Picked Up' : (request.status.charAt(0).toUpperCase() + request.status.slice(1))}</span>
                    </span>
                  </div>
                  <div className="sm:col-span-1 text-left sm:text-right space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:justify-end sm:gap-2">
                    <button
                      onClick={() => {
                        const edited = (request as any).admin_edited_content || {}
                        const resident = (request as any).resident_input || {}
                        const legacyNotes = (request as any).additional_notes
                        let remarks = ''
                        if (edited && edited.remarks) remarks = edited.remarks
                        else if (resident && resident.remarks) remarks = resident.remarks
                        else if (typeof legacyNotes === 'string') remarks = legacyNotes
                        const ageVal = (edited?.age ?? resident?.age)
                        setEditFor({ id: request.request_id, purpose: (edited?.purpose || request.purpose || ''), remarks: remarks || '', civil_status: (edited?.civil_status || request.civil_status || ''), age: (ageVal !== undefined && ageVal !== null) ? String(ageVal) : '' })
                      }}
                      className="w-full sm:w-auto px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                    >Edit</button>
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleSetProcessing(request)}
                        className="w-full sm:w-auto px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-60"
                        disabled={actionLoading === String(request.id)}
                      >{actionLoading === String(request.id) ? 'Starting…' : 'Start Processing'}</button>
                    )}
                    {request.status === 'pending' && (
                      <button
                        onClick={() => openReject(request)}
                        className="w-full sm:w-auto px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-60"
                        disabled={actionLoading === String(request.id)}
                      >Reject</button>
                    )}
                    {request.status === 'pending' && request.delivery_method === 'digital' && (
                      <button
                        onClick={() => handleApproveAndGenerate(request)}
                        className="w-full sm:w-auto px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-60"
                        disabled={actionLoading === String(request.id)}
                      >{actionLoading === String(request.id) ? 'Generating…' : 'Approve & Generate'}</button>
                    )}
                    {request.status === 'processing' && request.delivery_method === 'digital' && (
                      <button
                        onClick={() => handleGeneratePdf(request)}
                        className="w-full sm:w-auto px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-60"
                        disabled={actionLoading === String(request.id)}
                      >{actionLoading === String(request.id) ? 'Generating…' : 'Generate PDF'}</button>
                    )}
                    {request.status === 'processing' && request.delivery_method === 'pickup' && (
                      <button
                        onClick={() => handleSetReady(request)}
                        className="w-full sm:w-auto px-3 py-2 bg-forest-100 hover:bg-forest-200 text-forest-700 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-60"
                        disabled={actionLoading === String(request.id)}
                      >{actionLoading === String(request.id) ? 'Updating…' : 'Generate Ticket & Mark Ready'}</button>
                    )}
                    {request.status === 'ready' && request.delivery_method === 'pickup' && (
                      <button
                        onClick={() => handlePickedUp(request)}
                        className="w-full sm:w-auto px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-60"
                        disabled={actionLoading === String(request.id)}
                      >{actionLoading === String(request.id) ? 'Saving…' : 'Mark Picked Up'}</button>
                    )}
                    {request.status === 'ready' && request.delivery_method === 'digital' && (
                      <button
                        onClick={() => handleViewPdf(request)}
                        className="w-full sm:w-auto px-3 py-2 bg-forest-100 hover:bg-forest-200 text-forest-700 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-60"
                        disabled={actionLoading === String(request.id)}
                      >{actionLoading === String(request.id) ? 'Opening…' : 'View Document'}</button>
                    )}
                    {request.status === 'ready' && (
                      <button
                        onClick={() => handleComplete(request)}
                        className="w-full sm:w-auto px-3 py-2 bg-forest-100 hover:bg-forest-200 text-forest-700 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-60"
                        disabled={actionLoading === String(request.id)}
                      >{actionLoading === String(request.id) ? 'Completing…' : 'Mark Completed'}</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Reject Modal */}
      {rejectForId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" onKeyDown={(e) => { if (e.key === 'Escape') setRejectForId(null) }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setRejectForId(null)} />
          <div className="relative bg-white w-[92%] max-w-md max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border p-5 pb-24 sm:pb-5" tabIndex={-1} autoFocus>
            <h3 className="text-lg font-semibold mb-2">Reject Request</h3>
            <p className="text-sm text-neutral-700 mb-3">Provide a reason to inform the resident.</p>
            <label htmlFor="reject-reason" className="block text-sm font-medium mb-1">Reason</label>
            <textarea id="reject-reason" name="reject_reason" className="w-full border border-neutral-300 rounded-md p-2 text-sm" rows={4} value={rejectReason} onChange={(e)=> setRejectReason(e.target.value)} placeholder="e.g., Missing required details" />
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
              <button className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm" onClick={() => setRejectForId(null)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm disabled:opacity-60" disabled={!rejectReason || actionLoading===String(rejectForId)} onClick={submitReject}>
                {actionLoading===String(rejectForId) ? 'Rejecting…' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Content Modal */}
      {editFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" onKeyDown={(e) => { if (e.key === 'Escape') setEditFor(null) }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditFor(null)} />
          <div className="relative bg-white w-[92%] max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border p-5 pb-24 sm:pb-5" tabIndex={-1} autoFocus>
            <h3 className="text-lg font-semibold mb-2">Edit Request Content</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="edit-purpose" className="block text-sm font-medium mb-1">Purpose</label>
                <input id="edit-purpose" name="edit_purpose" className="w-full border border-neutral-300 rounded-md p-2 text-sm" value={editFor.purpose} onChange={(e)=> setEditFor({ ...editFor, purpose: e.target.value })} />
              </div>
              <div>
                <label htmlFor="edit-remarks" className="block text-sm font-medium mb-1">Remarks or Additional Information</label>
                <textarea id="edit-remarks" name="edit_remarks" className="w-full border border-neutral-300 rounded-md p-2 text-sm" rows={4} value={editFor.remarks} onChange={(e)=> setEditFor({ ...editFor, remarks: e.target.value })} placeholder="Provide extra context or clarifications" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Civil Status / Age (optional)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input id="edit-civil" name="edit_civil_status" className="w-full border border-neutral-300 rounded-md p-2 text-sm" value={editFor.civil_status} onChange={(e)=> setEditFor({ ...editFor, civil_status: e.target.value })} placeholder="e.g., single" />
                  <input id="edit-age" name="edit_age" className="w-full border border-neutral-300 rounded-md p-2 text-sm" type="number" min={0} value={editFor.age || ''} onChange={(e)=> setEditFor({ ...editFor, age: e.target.value })} placeholder="Age e.g., 22" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
              <button className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm" onClick={() => setEditFor(null)}>Cancel</button>
              <button
                className="px-4 py-2 rounded-lg bg-ocean-600 hover:bg-ocean-700 text-white text-sm disabled:opacity-60"
                disabled={savingEdit}
                onClick={async () => {
                  try {
                    setSavingEdit(true)
                    await documentsAdminApi.updateContent(editFor.id, { purpose: editFor.purpose || undefined, remarks: editFor.remarks || undefined, civil_status: editFor.civil_status || undefined, age: (editFor.age && !Number.isNaN(Number(editFor.age))) ? Number(editFor.age) : undefined })
                    await refresh()
                    setEditFor(null)
                    showToast('Content saved', 'success')
                  } catch (e: any) {
                    showToast(handleApiError(e), 'error')
                  } finally {
                    setSavingEdit(false)
                  }
                }}
              >{savingEdit ? 'Saving…' : 'Save'}</button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-60"
                disabled={savingEdit}
                onClick={async () => {
                  try {
                    setSavingEdit(true)
                    await documentsAdminApi.updateContent(editFor.id, { purpose: editFor.purpose || undefined, remarks: editFor.remarks || undefined, civil_status: editFor.civil_status || undefined, age: (editFor.age && !Number.isNaN(Number(editFor.age))) ? Number(editFor.age) : undefined })
                    await documentsAdminApi.updateStatus(editFor.id, 'processing')
                    const res = await documentsAdminApi.generatePdf(editFor.id)
                    await refresh()
                    const url = (res as any)?.url || (res as any)?.data?.url
                    if (url) {
                      window.open(mediaUrl(url), '_blank')
                    }
                    setEditFor(null)
                    showToast('Saved and generated', 'success')
                  } catch (e: any) {
                    showToast(handleApiError(e), 'error')
                  } finally {
                    setSavingEdit(false)
                  }
                }}
              >{savingEdit ? 'Working…' : 'Save & Generate'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


