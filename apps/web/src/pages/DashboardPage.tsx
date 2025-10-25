import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { marketplaceApi, documentsApi } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { FileText, Package, ShoppingBag, Plus, ArrowRight, User, AlertTriangle } from 'lucide-react'

type MyItem = { id: number, title: string, status: string }
type MyTx = { id: number, status: string, transaction_type: string }
type MyReq = { id: number, request_number: string, status: string, document_type?: { name: string } }

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<MyItem[]>([])
  const [txs, setTxs] = useState<MyTx[]>([])
  const [reqs, setReqs] = useState<MyReq[]>([])
  const user = useAppStore((s) => s.user)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const [myItemsRes, myTxRes, myReqRes] = await Promise.all([
          marketplaceApi.getMyItems(),
          marketplaceApi.getMyTransactions(),
          documentsApi.getMyRequests(),
        ])
        if (!cancelled) {
          setItems((myItemsRes.data?.items || []).slice(0, 5))
          const asBuyer = myTxRes.data?.as_buyer || []
          const asSeller = myTxRes.data?.as_seller || []
          setTxs([...(asBuyer as any[]), ...(asSeller as any[])].slice(0, 5))
          setReqs((myReqRes.data?.requests || []).slice(0, 5))
        }
      } catch {
        if (!cancelled) {
          setItems([]); setTxs([]); setReqs([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="container-responsive py-8 md:py-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-r from-sky-50 via-blue-50 to-emerald-50 p-6 md:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-ocean-gradient text-white flex items-center justify-center shadow-md">
                <User size={20} />
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold">Welcome{user?.username ? `, ${user.username}` : ''}</h1>
            </div>
            <p className="text-sm md:text-base text-gray-600 mt-2 max-w-2xl">Quickly manage your marketplace items, follow transactions, and track document requests—all in one place.</p>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 w-full md:w-auto">
            <Link to="/documents" className="group rounded-xl border bg-white/80 backdrop-blur shadow-sm px-4 py-3 flex items-center gap-2 hover:shadow transition">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <FileText size={16} />
              </div>
              <span className="text-sm font-medium">Request Document</span>
              <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition" />
            </Link>
            <Link to="/marketplace" className="group rounded-xl border bg-white/80 backdrop-blur shadow-sm px-4 py-3 flex items-center gap-2 hover:shadow transition">
              <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Plus size={16} />
              </div>
              <span className="text-sm font-medium">Post Item</span>
              <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition" />
            </Link>
            <Link to="/issues" className="group rounded-xl border bg-white/80 backdrop-blur shadow-sm px-4 py-3 flex items-center gap-2 hover:shadow transition">
              <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertTriangle size={16} />
              </div>
              <span className="text-sm font-medium">Report Issue</span>
              <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition" />
            </Link>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 mt-6">
        <StatCard icon={<Package size={16} />} label="Items" value={items.length} hint="latest 5 shown" />
        <StatCard icon={<ShoppingBag size={16} />} label="Transactions" value={txs.length} hint="recent activity" />
        <StatCard icon={<FileText size={16} />} label="Requests" value={reqs.length} hint="in progress" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card p-6">
              <div className="h-5 w-1/3 skeleton mb-3" />
              <div className="space-y-2">
                <div className="h-4 w-2/3 skeleton" />
                <div className="h-4 w-1/2 skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <ListCard
            title="My Items"
            icon={<Package size={18} />}
            emptyLabel="No items yet."
            footer={<Link to="/marketplace" className="text-sm text-blue-700 hover:underline inline-flex items-center gap-1">View marketplace<ArrowRight size={14} /></Link>}
            entries={items.map((it) => ({ id: it.id, primary: it.title, status: it.status }))}
          />

          <ListCard
            title="My Transactions"
            icon={<ShoppingBag size={18} />}
            emptyLabel="No transactions yet."
            footer={<Link to="/marketplace" className="text-sm text-blue-700 hover:underline inline-flex items-center gap-1">See all<ArrowRight size={14} /></Link>}
            entries={txs.map((t) => ({ id: t.id, primary: t.transaction_type, status: t.status }))}
          />

          <ListCard
            title="My Document Requests"
            icon={<FileText size={18} />}
            emptyLabel="No requests yet."
            footer={<Link to="/documents" className="text-sm text-blue-700 hover:underline inline-flex items-center gap-1">Open documents<ArrowRight size={14} /></Link>}
            entries={reqs.map((r) => ({ id: r.id, primary: r.document_type?.name || r.request_number, status: r.status, href: `/dashboard/requests/${r.id}` }))}
          />
        </div>
      )}
    </div>
  )
}

type StatCardProps = {
  icon: JSX.Element
  label: string
  value: number | string
  hint?: string
}

function StatCard({ icon, label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-xl bg-white shadow-sm border p-4 flex items-center gap-4">
      <div className="h-10 w-10 rounded-lg bg-ocean-gradient text-white flex items-center justify-center shadow">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
        <div className="text-2xl font-semibold leading-tight">{value}</div>
        {hint && <div className="text-xs text-gray-500">{hint}</div>}
      </div>
    </div>
  )
}

type ListEntry = { id: number | string, primary: string, status: string, href?: string }

type ListCardProps = {
  title: string
  icon?: JSX.Element
  entries: ListEntry[]
  emptyLabel: string
  footer?: JSX.Element
}

function ListCard({ title, icon, entries, emptyLabel, footer }: ListCardProps) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        {icon && <div className="h-8 w-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">{icon}</div>}
        <h3 className="text-base md:text-lg font-semibold">{title}</h3>
      </div>
      <div className="space-y-2">
        {entries.map((e) => (
          <div key={e.id} className="flex items-center gap-3 justify-between rounded-lg border px-3 py-2">
            {e.href ? (
              <Link to={e.href} className="truncate font-medium capitalize text-blue-700 hover:underline">{e.primary}</Link>
            ) : (
              <div className="truncate font-medium capitalize">{e.primary}</div>
            )}
            <StatusBadge status={e.status} />
          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gray-300" />
            {emptyLabel}
          </div>
        )}
      </div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const normalized = (status || '').toLowerCase()
  const color =
    normalized.includes('pending') ? 'bg-amber-50 text-amber-700 ring-amber-200' :
    normalized.includes('approved') || normalized.includes('success') || normalized.includes('completed') ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
    normalized.includes('rejected') || normalized.includes('cancel') || normalized.includes('failed') ? 'bg-rose-50 text-rose-700 ring-rose-200' :
    'bg-gray-100 text-gray-700 ring-gray-200'
  return (
    <span className={`px-2.5 py-1 text-xs rounded-full ring-1 ${color} whitespace-nowrap capitalize`}>{status}</span>
  )
}

