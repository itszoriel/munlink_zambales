import { useEffect, useState } from 'react'
import { auditAdminApi } from '../../lib/api'

export default function TransferRequestModal({ open, onClose, transfer }: { open: boolean; onClose: () => void; transfer: any }) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!open || !transfer?.id) return
    ;(async () => {
      try {
        setLoading(true)
        const res = await auditAdminApi.list({ entity_type: 'transfer_request', entity_id: transfer.id, per_page: 50 })
        const data: any = (res as any)
        if (!cancelled) setLogs(data.logs || data.data?.logs || [])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [open, transfer?.id])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" onKeyDown={(e)=>{ if (e.key==='Escape') onClose()}}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-[92%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border p-5" tabIndex={-1}>
        <h3 className="text-lg font-semibold mb-2">Transfer Details</h3>
        <div className="text-sm text-neutral-600 mb-3">Transfer #{transfer?.id}</div>
        <div className="space-y-2 text-sm mb-4">
          <div><span className="font-medium">Resident:</span> {transfer?.resident_name || `User #${transfer?.user_id}`}</div>
          <div><span className="font-medium">From:</span> {transfer?.from_municipality_id} → <span className="font-medium">To:</span> {transfer?.to_municipality_id}</div>
          {transfer?.notes && <div><span className="font-medium">Notes:</span> {transfer.notes}</div>}
          <div><span className="font-medium">Requested:</span> {String(transfer?.created_at||'').replace('T',' ').slice(0,19)}</div>
          <div><span className="font-medium">Status:</span> {String(transfer?.status||'pending')}</div>
        </div>
        <h4 className="text-sm font-semibold mb-2">Timeline</h4>
        {loading ? (
          <div className="text-sm">Loading…</div>
        ) : logs.length === 0 ? (
          <div className="text-sm text-neutral-600">No audit entries.</div>
        ) : (
          <div className="space-y-2 text-sm">
            {logs.map((l, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-neutral-500 min-w-[11ch]">{String(l.created_at||'').replace('T',' ').slice(0,19)}</span>
                <span className="capitalize">{String(l.action||'').replace(/_/g,' ')}</span>
                <span className="text-neutral-600">{l.actor_role||'admin'}</span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center justify-end">
          <button className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}


