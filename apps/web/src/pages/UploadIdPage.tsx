import { useState } from 'react'
import { authApi, getAccessToken } from '@/lib/api'
import { useAppStore } from '@/lib/store'

export default function UploadIdPage() {
  const selectedMunicipality = useAppStore((s) => s.selectedMunicipality)
  const emailVerified = useAppStore((s) => s.emailVerified)
  const user = useAppStore((s) => s.user)
  const setAuth = useAppStore((s) => s.setAuth)
  const [front, setFront] = useState<File | null>(null)
  const [back, setBack] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState<string>('')
  const [err, setErr] = useState<string>('')

  // Check if user already has ID documents uploaded
  const hasIdDocuments = user?.valid_id_front || user?.valid_id_back

  const canSubmit = !!front || !!back || !!selfie

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('')
    setErr('')
    if (!canSubmit) {
      setErr('Please select at least one file to upload')
      return
    }
    setSubmitting(true)
    try {
      const response = await authApi.uploadVerificationDocs({
        municipality_slug: selectedMunicipality?.slug,
        valid_id_front: front || undefined,
        valid_id_back: back || undefined,
        selfie_with_id: selfie || undefined,
      })
      
      // Update the user profile in the store with the new data
      if (response.data?.user) {
        setAuth(
          response.data.user,
          getAccessToken() || '',
          ''
        )
      }
      
      setMsg(response.data?.message || 'Verification documents uploaded. Your account is pending admin review.')
      setFront(null); setBack(null); setSelfie(null)
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Failed to upload verification documents')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="card max-w-2xl mx-auto">
        <h1 className="text-fluid-3xl font-serif font-semibold mb-2">Upload Verification Documents</h1>
        {hasIdDocuments ? (
          <p className="text-sm text-gray-600 mb-6">You have already uploaded ID documents. You can upload new ones to replace the existing ones.</p>
        ) : (
          <p className="text-sm text-gray-600 mb-6">Upload your government ID to complete your account verification.</p>
        )}

        {!emailVerified && (
          <div className="mb-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-sm">
            Please verify your email first. You can still upload files, but processing will start after email verification.
          </div>
        )}

        {err && <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">{err}</div>}
        {msg && <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm">{msg}</div>}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="id-front" className="block text-sm font-medium mb-1">Valid ID - Front</label>
            <input id="id-front" name="id_front" className="input-field" type="file" accept="image/*" onChange={(e)=>setFront(e.target.files?.[0] || null)} />
            {front && <p className="text-xs text-gray-500 mt-1">Selected: {front.name}</p>}
          </div>
          <div>
            <label htmlFor="id-back" className="block text-sm font-medium mb-1">Valid ID - Back</label>
            <input id="id-back" name="id_back" className="input-field" type="file" accept="image/*" onChange={(e)=>setBack(e.target.files?.[0] || null)} />
            {back && <p className="text-xs text-gray-500 mt-1">Selected: {back.name}</p>}
          </div>
          <div>
            <label htmlFor="id-selfie" className="block text-sm font-medium mb-1">Selfie holding the ID (optional)</label>
            <input id="id-selfie" name="id_selfie" className="input-field" type="file" accept="image/*" onChange={(e)=>setSelfie(e.target.files?.[0] || null)} />
            {selfie && <p className="text-xs text-gray-500 mt-1">Selected: {selfie.name}</p>}
          </div>

          <div className="pt-2">
            <button className="btn btn-primary w-full sm:w-auto" disabled={!canSubmit || submitting}>
              {submitting ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


