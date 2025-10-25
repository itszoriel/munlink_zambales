import { useEffect, useState } from 'react'
import GatedAction from '@/components/GatedAction'
import { useAppStore } from '@/lib/store'
import { benefitsApi } from '@/lib/api'
import Modal from '@/components/ui/Modal'
import Stepper from '@/components/ui/Stepper'
import StatusBadge from '@/components/ui/StatusBadge'

type Program = {
  id: string | number
  name: string
  summary: string
  municipality?: string
  eligibility?: string[]
  requirements?: string[]
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
  const [applications, setApplications] = useState<any[]>([])
  const isMismatch = !!(user as any)?.municipality_id && !!selectedMunicipality?.id && (user as any).municipality_id !== selectedMunicipality.id

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        if (tab === 'applications') {
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

  return (
    <div className="container-responsive py-12">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-3xl font-serif font-semibold">Benefits</h1>
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
      </div>
      <p className="text-gray-600 mb-6">Explore available programs. You can view details without logging in; applying requires an account.</p>

      <div className="mb-4 flex items-center gap-2">
        <button className={`btn ${tab==='programs'?'btn-primary':'btn-secondary'}`} onClick={() => setTab('programs')}>Programs</button>
        <button className={`btn ${tab==='applications'?'btn-primary':'btn-secondary'}`} onClick={() => setTab('applications')}>My Applications</button>
      </div>

      {isMismatch && (
        <div className="mb-4 p-3 rounded-lg border border-yellow-300 bg-yellow-50 text-sm text-yellow-900">
          You are viewing {selectedMunicipality?.name}. Applications are limited to your registered municipality.
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading programs...</div>
      ) : tab==='programs' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((p) => (
            <div key={p.id} className="bg-white rounded-lg border p-4 flex flex-col">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{p.name}</h3>
                <p className="text-sm text-gray-700 mb-3">{p.summary}</p>
                {p.eligibility && p.eligibility.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Eligibility</div>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-0.5">
                      {p.eligibility.map((e, i) => (<li key={i}>{e}</li>))}
                    </ul>
                  </div>
                )}
                {p.requirements && p.requirements.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Requirements</div>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-0.5">
                      {p.requirements.map((r, i) => (<li key={i}>{r}</li>))}
                    </ul>
                  </div>
                )}
              </div>
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
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((a) => (
            <div key={a.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{a.program?.name || 'Application'}</div>
                  <div className="text-xs text-gray-600">{a.application_number}</div>
                </div>
                <StatusBadge status={a.status} />
              </div>
              {a.disbursement_status && <div className="text-xs text-gray-600 mt-2">Disbursement: {a.disbursement_status}</div>}
            </div>
          ))}
          {applications.length===0 && <div className="text-gray-600">No applications yet.</div>}
        </div>
      )}

      <Modal isOpen={open} onClose={() => { setOpen(false); setSelected(null); setResult(null); setStep(1) }} title={selected ? `Apply: ${selected.name}` : 'Apply'}>
        <Stepper steps={["Eligibility","Details","Review"]} current={step} />
        {step === 1 && (
          <div className="space-y-3">
            <div className="text-sm">Please confirm you meet the eligibility:</div>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {(selected?.eligibility || []).map((e, i) => (<li key={i}>{e}</li>))}
            </ul>
            <div className="flex justify-end">
              <button className="btn btn-primary" onClick={() => setStep(2)}>Continue →</button>
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
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Continue →</button>
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
              <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
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


