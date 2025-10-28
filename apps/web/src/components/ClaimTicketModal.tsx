import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { documentsApi, mediaUrl } from '@/lib/api'

type Props = { requestId: number | null; isOpen: boolean; onClose: () => void }

export default function ClaimTicketModal({ requestId, isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any | null>(null)
  const [revealing, setRevealing] = useState(false)
  const [showPlain, setShowPlain] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!isOpen || !requestId) return
      setLoading(true)
      try {
        const res = await documentsApi.getClaimTicket(requestId)
        if (mounted) setData((res as any)?.data || res)
      } catch {
        if (mounted) setData(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [isOpen, requestId])

  const qr = data?.qr_url ? mediaUrl(data.qr_url) : undefined
  const code = showPlain && data?.code_plain ? data.code_plain : data?.code_masked
  const muni = data?.muni_name
  const doc = data?.doc_name
  const reqId = data?.request_id
  const reqNo = data?.request_number

  const onToggleReveal = async () => {
    if (!requestId) return
    if (showPlain) {
      setShowPlain(false)
      return
    }
    // Reveal flow: fetch plaintext once then cache in state
    if (!data?.code_plain) {
      try {
        setRevealing(true)
        const res = await documentsApi.getClaimTicket(requestId, { reveal: 1 })
        const next = (res as any)?.data || res
        setData((prev: any) => ({ ...(prev || {}), ...(next || {}) }))
      } catch {}
      finally {
        setRevealing(false)
      }
    }
    setShowPlain(true)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Claim Ticket"
      footer={(
        <div className="flex items-center justify-end gap-2">
          <button className="btn-secondary" onClick={() => window.print()}>Print</button>
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      )}
    >
      {loading ? (
        <div className="space-y-2">
          <div className="h-6 w-40 skeleton" />
          <div className="h-40 w-40 skeleton rounded" />
        </div>
      ) : data ? (
        <div className="space-y-3">
          <div className="text-sm text-neutral-700">Show this at the counter to claim your document.</div>
          {qr && (
            <div className="flex items-center justify-center">
              <img src={qr} alt="Claim QR" className="w-48 h-48 border rounded" />
            </div>
          )}
          <div className="text-sm flex items-center gap-2">
            <span className="font-medium">Pickup Code:</span>
            <span>{code || '—'}</span>
            <button
              type="button"
              aria-label={showPlain ? 'Hide code' : 'Show code'}
              title={showPlain ? 'Hide code' : 'Show code'}
              className="ml-1 inline-flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50"
              onClick={onToggleReveal}
              disabled={revealing}
            >
              {showPlain ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {(reqId || reqNo) && (
            <div className="text-sm text-neutral-700">
              {reqId && (<span className="mr-4"><span className="font-medium">Request ID:</span> {reqId}</span>)}
              {reqNo && (<span><span className="font-medium">Request No.:</span> {reqNo}</span>)}
            </div>
          )}
          <div className="text-sm"><span className="font-medium">Document:</span> {doc || '—'}</div>
          <div className="text-sm"><span className="font-medium">Municipality:</span> {muni || '—'}</div>
          {(data?.window_start || data?.window_end) && (
            <div className="text-sm"><span className="font-medium">Pickup Window:</span> {data?.window_start || '—'} to {data?.window_end || '—'}</div>
          )}
          <div className="text-xs text-neutral-600">Bring a valid government ID. If the QR fails, the staff can use your code.</div>
        </div>
      ) : (
        <div className="text-sm text-rose-700">No claim ticket available yet.</div>
      )}
    </Modal>
  )
}



