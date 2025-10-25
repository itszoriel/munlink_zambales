import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GatedAction from '@/components/GatedAction'
import { documentsApi } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import Stepper from '@/components/ui/Stepper'
import FileUploader from '@/components/ui/FileUploader'

type DocType = {
  id: number
  name: string
  code: string
  fee: number
  processing_days: number
  supports_digital: boolean
  requirements?: any
}

export default function DocumentsPage() {
  const selectedMunicipality = useAppStore((s) => s.selectedMunicipality)
  const user = useAppStore((s) => s.user)
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [types, setTypes] = useState<DocType[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null)
  const [deliveryMethod, setDeliveryMethod] = useState<'digital' | 'pickup'>('digital')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [purpose, setPurpose] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [civilStatus, setCivilStatus] = useState('')
  // const [uploadForm, setUploadForm] = useState<FormData | null>(null)
  const [resultMsg, setResultMsg] = useState<string>('')
  const [createdId, setCreatedId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const res = await documentsApi.getTypes()
        if (!cancelled) setTypes(res.data?.types || [])
      } catch {
        if (!cancelled) setTypes([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const selectedType = useMemo(() => types.find(t => t.id === selectedTypeId) || null, [types, selectedTypeId])
  const isMismatch = useMemo(() => !!(user as any)?.municipality_id && !!selectedMunicipality?.id && (user as any).municipality_id !== selectedMunicipality.id, [user, selectedMunicipality?.id])
  const userMunicipalityName = (user as any)?.municipality_name

  const canSubmit = useMemo(() => {
    return !!selectedTypeId && !!user?.municipality_id && !!purpose && (deliveryMethod === 'digital' || (deliveryMethod === 'pickup' && !!deliveryAddress))
  }, [selectedTypeId, user?.municipality_id, purpose, deliveryMethod, deliveryAddress])

  return (
    <div className="container-responsive py-12">
      <h1 className="text-3xl font-serif font-semibold mb-6">Documents</h1>
      {isMismatch && (
        <div className="mb-4 p-3 rounded-lg border border-yellow-300 bg-yellow-50 text-sm text-yellow-900">
          You are viewing {selectedMunicipality?.name}. Actions are limited to your registered municipality{userMunicipalityName?`: ${userMunicipalityName}`:'.'}
        </div>
      )}
      {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="p-4 space-y-2">
                  <div className="h-4 w-1/3 skeleton" />
                  <div className="h-4 w-2/3 skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-4">
            <Stepper steps={["Type","Details","Review"]} current={step} />

            {/* Step 1: Select Type */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Select Document Type</h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                  {types.map((t) => (
                    <button
                      key={t.id}
                      className={`text-left p-4 rounded-xl border ${selectedTypeId===t.id?'border-ocean-500 bg-ocean-50':'border-gray-200 hover:border-ocean-300'}`}
                      onClick={() => setSelectedTypeId(t.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{t.name}</h3>
                          <p className="text-sm text-gray-600">Processing: {t.processing_days} days</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-700">Fee</div>
                          <div className="text-lg font-bold">₱{t.fee?.toFixed(2)}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="btn-primary" onClick={() => setStep(2)} disabled={!selectedTypeId}>Continue →</button>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Request Details</h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Municipality</label>
                    <input className="input-field" value={selectedMunicipality?.name || ''} disabled title={user?.municipality_id && selectedMunicipality?.id && user.municipality_id !== selectedMunicipality.id ? 'Viewing other municipality. Submissions go to your registered municipality.' : ''} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Delivery Method</label>
                    <select className="input-field" value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value as any)}>
                      <option value="digital">Digital</option>
                      <option value="pickup">Pickup</option>
                    </select>
                  </div>
                  {deliveryMethod === 'pickup' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Pickup Location</label>
                      <input className="input-field" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="e.g., Municipal Hall, Records Section" />
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Purpose</label>
                    <input className="input-field" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g., employment requirement" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Civil Status / Age (optional)</label>
                    <input className="input-field" value={civilStatus} onChange={(e) => setCivilStatus(e.target.value)} placeholder="e.g., 22 years old, single" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Additional Details (optional)</label>
                    <input className="input-field" value={additionalDetails} onChange={(e) => setAdditionalDetails(e.target.value)} placeholder="e.g., Currently enrolled at PRMSU" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Additional Notes</label>
                    <textarea className="input-field" rows={3} value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} />
                  </div>
                </div>
                <div className="mt-6 flex flex-col xs:flex-row gap-3 xs:justify-between">
                  <button className="btn btn-secondary w-full xs:w-auto" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary w-full xs:w-auto" onClick={() => setStep(3)} disabled={!canSubmit || isMismatch}>Continue →</button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Review & Submit</h2>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Type:</span> {selectedType?.name}</div>
                  <div><span className="font-medium">Municipality:</span> {isMismatch ? `${selectedMunicipality?.name} (viewing) • Submission: ${userMunicipalityName || 'Your municipality'}` : (selectedMunicipality?.name || userMunicipalityName || '')}</div>
                  <div><span className="font-medium">Delivery:</span> {deliveryMethod}{deliveryMethod==='pickup'&& deliveryAddress?` • ${deliveryAddress}`:''}</div>
                  <div><span className="font-medium">Purpose:</span> {purpose}</div>
                  {civilStatus && <div><span className="font-medium">Civil Status:</span> {civilStatus}</div>}
                  {additionalDetails && <div><span className="font-medium">Details:</span> {additionalDetails}</div>}
                  {additionalNotes && <div><span className="font-medium">Notes:</span> {additionalNotes}</div>}
                </div>
                <div className="mt-6 flex flex-col xs:flex-row gap-3 xs:justify-between items-stretch xs:items-center">
                  <button className="btn btn-secondary w-full xs:w-auto" onClick={() => setStep(2)}>← Back</button>
                  <GatedAction
                    required="fullyVerified"
                    onAllowed={async () => {
                      if (submitting) return
                      if (isMismatch || !user?.municipality_id || !selectedTypeId) return
                      setSubmitting(true)
                      setResultMsg('')
                      try {
                        const res = await documentsApi.createRequest({
                          document_type_id: selectedTypeId,
                          municipality_id: user!.municipality_id,
                          delivery_method: deliveryMethod,
                          delivery_address: deliveryMethod==='pickup'? deliveryAddress : undefined,
                          purpose,
                          additional_details: additionalDetails || undefined,
                          civil_status: civilStatus || undefined,
                          additional_notes: additionalNotes || undefined,
                        })
                        const id = res?.data?.request?.id
                        setCreatedId(id || null)
                        setResultMsg('Request created successfully')
                        // Redirect to dashboard with a flash toast
                        navigate('/dashboard', {
                          replace: true,
                          state: {
                            toast: {
                              type: 'success',
                              message: 'Your document request has been submitted successfully.'
                            }
                          }
                        })
                      } catch (e: any) {
                        setResultMsg(e?.response?.data?.error || 'Failed to create request')
                      } finally {
                        setSubmitting(false)
                      }
                    }}
                    tooltip="Login required to use this feature"
                  >
                    <button className="btn btn-primary w-full xs:w-auto" disabled={!canSubmit || submitting || isMismatch} title={isMismatch ? 'Requests are limited to your registered municipality' : undefined}>
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </GatedAction>
                </div>
                {resultMsg && (
                  <div className="mt-4 text-sm text-gray-700">
                    {resultMsg}
                    {createdId && (
                      <div className="mt-3">
                        <div className="font-medium mb-1">Upload supporting documents (optional)</div>
                        <FileUploader
                          accept="image/*,.pdf"
                          multiple
                          onFiles={async (files) => {
                            const form = new FormData()
                            files.forEach((f) => form.append('file', f))
                            try {
                              await documentsApi.uploadSupportingDocs(createdId, form)
                              setResultMsg('Files uploaded successfully')
                            } catch {
                              setResultMsg('Upload failed')
                            }
                          }}
                          label="Upload files"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
    </div>
  )
}


