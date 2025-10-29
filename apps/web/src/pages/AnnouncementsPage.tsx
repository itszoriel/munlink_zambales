import { useEffect, useMemo, useState } from 'react'
import { announcementsApi } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import AnnouncementCard from '@/components/AnnouncementCard'
import { getHideRead, isRead, setHideRead } from '@/utils/unread'

type Announcement = {
  id: number
  title: string
  content: string
  municipality_name?: string
  priority: 'high' | 'medium' | 'low'
  created_at?: string
  images?: string[]
  pinned?: boolean
}

export default function AnnouncementsPage() {
  const selectedMunicipality = useAppStore((s) => s.selectedMunicipality)
  const [priority, setPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [hideRead, setHideReadState] = useState<boolean>(getHideRead())

  const params = useMemo(() => {
    const p: any = { active: true, page: 1, per_page: 20 }
    if (selectedMunicipality?.id) p.municipality_id = selectedMunicipality.id
    // priority filter is client-side until backend supports param
    return p
  }, [selectedMunicipality?.id])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const res = await announcementsApi.getAll(params)
        let list: Announcement[] = res.data?.announcements || []
        if (priority !== 'all') list = list.filter(a => a.priority === priority)
        if (hideRead) list = list.filter(a => !isRead(a.id))
        if (!cancelled) setItems(list)
      } catch {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [params, priority, hideRead])

  return (
    <div className="container-responsive py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-fluid-3xl font-serif font-semibold">Announcements</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority pills */}
          {(['all','high','medium','low'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                priority===p
                  ? 'bg-ocean-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.charAt(0).toUpperCase()+p.slice(1)}
            </button>
          ))}
          {/* Hide read toggle */}
          <label className="ml-2 inline-flex items-center gap-2 text-sm text-gray-700 select-none">
            <input
              type="checkbox"
              checked={hideRead}
              onChange={(e) => { setHideReadState(e.target.checked); setHideRead(e.target.checked) }}
              className="h-4 w-4 rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
            />
            Hide read
          </label>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`ann-skel-${i}`} className="skeleton-card">
              <div className="aspect-[4/3] skeleton-image" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-2/3 skeleton" />
                <div className="h-4 w-1/2 skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((a) => (
              <AnnouncementCard
                key={a.id}
                id={a.id}
                title={a.title}
                content={a.content}
                municipality={a.municipality_name || 'Province-wide'}
                priority={a.priority}
                createdAt={a.created_at}
                images={a.images}
                pinned={(a as any).pinned}
                href={`/announcements/${a.id}`}
              />
            ))}
          </div>
          {items.length === 0 && (
            <div className="text-center text-gray-600">No announcements.</div>
          )}
        </>
      )}
    </div>
  )
}


