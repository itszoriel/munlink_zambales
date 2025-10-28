import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { documentsApi, mediaUrl } from '@/lib/api'

export default function VerifyDocumentPage() {
  const { requestNumber } = useParams()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await documentsApi.publicVerify(requestNumber || '')
        if (mounted) setData((res as any)?.data || res)
      } catch {
        if (mounted) setData({ valid: false })
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [requestNumber])

  const valid = !!data?.valid

  return (
    <div className="container-responsive py-12">
      <h1 className="text-3xl font-serif font-semibold mb-6">Verify Document</h1>
      {loading ? (
        <div className="space-y-2">
          <div className="h-6 w-40 skeleton" />
          <div className="h-4 w-80 skeleton" />
        </div>
      ) : (
        <div className={`rounded-xl border p-5 ${valid ? 'border-emerald-300 bg-emerald-50' : 'border-rose-300 bg-rose-50'}`}>
          <div className="text-xl font-bold mb-2">{valid ? 'Valid MunLink Document' : 'Invalid or Not Found'}</div>
          <div className="space-y-1 text-sm">
            <div><span className="font-medium">Request #:</span> {data?.request_number || requestNumber}</div>
            {data?.doc_name && <div><span className="font-medium">Document:</span> {data.doc_name}</div>}
            {data?.muni_name && <div><span className="font-medium">Municipality:</span> {data.muni_name}</div>}
            {data?.status && <div><span className="font-medium">Status:</span> {data.status}</div>}
            {data?.issued_at && <div><span className="font-medium">Issued:</span> {String(data.issued_at).slice(0,10)}</div>}
            {valid && data?.url && (
              <div className="mt-2"><a className="text-blue-700 underline" href={mediaUrl(data.url)} target="_blank" rel="noreferrer">Open Document</a></div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}



