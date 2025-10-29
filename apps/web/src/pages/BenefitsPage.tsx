import { StatusBadge, Card, EmptyState } from '@munlink/ui'
import { useEffect, useState } from 'react'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import GatedAction from '@/components/GatedAction'
import { useAppStore } from '@/lib/store'
import { benefitsApi } from '@/lib/api'
import Modal from '@/components/ui/Modal'
import Stepper from '@/components/ui/Stepper'

type Program = {
  id: string | number
  name: string
  summary?: string
  description?: string
  municipality?: string
  eligibility?: string[]
  eligibility_criteria?: string[]
  requirements?: string[]
  required_documents?: string[]
}

export default function BenefitsPage() {
  const selectedMunicipality = useAppStore((s) => s.selectedMunicipality)
  const user = useAppStore((s) => s.user)
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('all')
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<Program | null>(null)
  const [applying, setApplying] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [tab, setTab] = useState<'programs'|'applications'>('programs')
  const [searchParams] = useSearchParams()
  const [applications, setApplications] = useState<any[]>([])
  const [openId, setOpenId] = useState<string | number | null>(null)
  const isMismatch = !!(user as any)?.municipality_id && !!selectedMunicipality?.id && (user as any).municipality_id !== selectedMunicipality.id

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        if (tab === 'applications') {
          const isAuthenticated = !!useAppStore.getState().isAuthenticated
          if (!isAuthenticated) { if (!cancelled) setApplications([]); return }
          const my = await benefitsApi.getMyApplications()
          if (!cancelled) setApplications(my.data?.applications || [])
        } else {
          const params: any = {}
          if (selectedMunicipality?.id) params.municipality_id = selectedMunicipality.id
          if (typeFilter !== 'all') params.type = typeFilter
          const res = await benefitsApi.getPrograms(params)
          if (!cancelled) setPrograms(res.data?.programs || [])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [selectedMunicipality?.id, typeFilter, tab])

  // Initialize tab from query param (?tab=applications)
  useEffect(() => {
    const t = (searchParams.get('tab') || '').toLowerCase()
    if (t === 'applications') setTab('applications')
  }, [searchParams])

  return (
    <div className="container-responsive py-12">
      <div className="mb-3">
        <h1 className="text-fluid-3xl font-serif font-semibold">Benefits</h1>
        <p className="text-gray-600">Explore available programs. You can view details without logging in; applying requires an account.</p>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Type</label>
            <select className="input-field" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="financial">Financial</option>
              <option value="educational">Educational</option>
              <option value="health">Health</option>
              <option value="livelihood">Livelihood</option>
            </select>
          </div>
          <div className="flex items-center gap-2 md:ml-auto">
            <button className={`btn ${tab==='programs'?'btn-primary':'btn-secondary'}`} onClick={() => setTab('programs')}>Programs</button>
            <button className={`btn ${tab==='applications'?'btn-primary':'btn-secondary'}`} onClick={() => setTab('applications')}>My Applications</button>
          </div>
        </div>
      </Card>

      {isMismatch && (
        <div className="mb-4 p-3 rounded-lg border border-yellow-300 bg-yellow-50 text-sm text-yellow-900">
          You are viewing {selectedMunicipality?.name}. Applications are limited to your registered municipality.
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card h-40" />
          ))}
        </div>
      ) : tab==='programs' ? (
        programs.length === 0 ? (
          <EmptyState title="Nothing here yet" description="Try a different filter or check back soon." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((p) => {
              const desc = (p as any).description || p.summary || ''
              const eligibility = (p.eligibility || (p as any).eligibility_criteria || []) as string[]
              const requirements = (p.requirements || (p as any).required_documents || []) as string[]
              return (
              <Card key={p.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold truncate">{p.name}</h3>
                    {openId!==p.id && (
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">{desc}</p>
                    )}
                  </div>
                  <button
                    className="btn-ghost text-blue-700 shrink-0"
                    onClick={() => setOpenId(openId===p.id ? null : p.id)}
                    aria-expanded={openId===p.id}
                  >
                    {openId===p.id ? 'Hide' : 'View details'}
                  </button>
                </div>
                {openId===p.id && (
                  <div className="mt-3 space-y-3">
                    {p.municipality && (
                      <div className="text-xs text-gray-500">{p.municipality}</div>
                    )}
                    {desc && (
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Details</div>
                        <p className="text-sm text-gray-700">{desc}</p>
                      </div>
                    )}
                    {eligibility.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Eligibility</div>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-0.5">
                          {eligibility.map((e, i) => (<li key={i}>{e}</li>))}
                        </ul>
                      </div>
                    )}
                    {requirements.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Requirements</div>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-0.5">
                          {requirements.map((r, i) => (<li key={i}>{r}</li>))}
                        </ul>
                      </div>
                    )}
                    {!(desc && String(desc).trim()) && eligibility.length===0 && requirements.length===0 && (
                      <div className="text-sm text-gray-600">No details provided.</div>
                    )}
                  </div>
                )}
                <div className="mt-4">
                  <GatedAction
                    required="fullyVerified"
                    onAllowed={() => {
                      if (isMismatch) { alert('Applications are limited to your registered municipality'); return }
                      setSelected(p)
                      setOpen(true)
                      setStep(1)
                    }}
                    tooltip="Login required to use this feature"
                  >
                    <button className="btn btn-primary w-full" disabled={isMismatch} title={isMismatch ? 'Applications are limited to your municipality' : undefined}>Apply Now</button>
                  </GatedAction>
                </div>
              </Card>
              )
            })}
          </div>
        )
      ) : (
        applications.length === 0 ? (
          <EmptyState title="No applications yet" description="Submit an application to see it here." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((a) => (
              <Card key={a.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{a.program?.name || 'Application'}</div>
                    <div className="text-xs text-gray-600">{a.application_number}</div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                {a.disbursement_status && <div className="text-xs text-gray-600 mt-2">Disbursement: {a.disbursement_status}</div>}
              </Card>
            ))}
          </div>
        )
      )}

      <Modal isOpen={open} onClose={() => { setOpen(false); setSelected(null); setResult(null); setStep(1) }} title={selected ? `Apply: ${selected.name}` : 'Apply'}>
        <Stepper steps={["Eligibility","Details","Review"]} current={step} />
        {step === 1 && (
          <div className="space-y-3">
            <div className="text-sm">Please confirm you meet the eligibility:</div>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {(((selected as any)?.eligibility) || ((selected as any)?.eligibility_criteria) || []).map((e: string, i: number) => (<li key={i}>{e}</li>))}
            </ul>
            <div className="flex justify-end">
              <button className="btn btn-primary inline-flex items-center gap-2" onClick={() => setStep(2)}>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Additional Information</label>
              <textarea className="input-field" rows={4} placeholder="Share any details to support your application" onChange={(e) => setResult({ ...(result || {}), notes: e.target.value })} />
            </div>
            <div className="flex justify-between">
              <button className="btn btn-secondary inline-flex items-center gap-2" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Back</span>
              </button>
              <button className="btn btn-primary inline-flex items-center gap-2" onClick={() => setStep(3)}>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <div className="text-sm">Review your application then submit.</div>
            <div className="rounded-lg border p-3 text-sm">
              <div><span className="font-medium">Program:</span> {selected?.name}</div>
              {result?.notes && <div><span className="font-medium">Notes:</span> {result.notes}</div>}
            </div>
            <div className="flex items-center justify-between">
              <button className="btn btn-secondary inline-flex items-center gap-2" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Back</span>
              </button>
              <button className="btn btn-primary" disabled={applying} onClick={async () => {
                setApplying(true)
                try {
                  const res = await benefitsApi.createApplication({ program_id: selected!.id, application_data: result || {} })
                  const app = res?.data?.application
                  setResult(app)
                } finally {
                  setApplying(false)
                }
              }}>{applying ? 'Submitting...' : 'Submit Application'}</button>
            </div>
            {result && result.application_number && (
              <div className="mt-3 rounded-lg border p-3 text-sm flex items-center justify-between">
                <div>
                  Submitted • Application No.: <span className="font-medium">{result.application_number}</span>
                </div>
                <StatusBadge status={result.status} />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}


