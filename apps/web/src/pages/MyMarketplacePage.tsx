import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { marketplaceApi, mediaUrl, showToast } from '@/lib/api'

type MyItem = {
  id: number
  title: string
  status: string
  images?: string[]
  transaction_type: 'donate' | 'lend' | 'sell'
  price?: number
  created_at?: string
}

type MyTx = {
  id: number
  item_id: number
  status: string
  transaction_type: string
  created_at?: string
  as?: 'buyer' | 'seller'
}

export default function MyMarketplacePage() {
  const [tab, setTab] = useState<'items' | 'transactions'>('items')
  const [items, setItems] = useState<MyItem[]>([])
  const [txs, setTxs] = useState<MyTx[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [acceptingId, setAcceptingId] = useState<number | null>(null)
  const [editItem, setEditItem] = useState<MyItem | null>(null)
  const [editForm, setEditForm] = useState<{ title: string; description: string; price?: string; images: string[] }>({ title: '', description: '', price: '', images: [] })
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const [myItemsRes, myTxRes] = await Promise.all([
          marketplaceApi.getMyItems(),
          marketplaceApi.getMyTransactions(),
        ])
        if (!cancelled) {
          setItems((myItemsRes.data?.items || []) as MyItem[])
          const asBuyer = (myTxRes.data?.as_buyer || []).map((t: any) => ({ ...t, as: 'buyer' }))
          const asSeller = (myTxRes.data?.as_seller || []).map((t: any) => ({ ...t, as: 'seller' }))
          setTxs([...(asBuyer as any[]), ...(asSeller as any[])])
        }
      } catch {
        if (!cancelled) { setItems([]); setTxs([]) }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const reloadItems = async () => {
    try {
      const myItemsRes = await marketplaceApi.getMyItems()
      setItems((myItemsRes.data?.items || []) as MyItem[])
    } catch {}
  }

  const sellerPending = useMemo(() => txs.filter((t) => t.as === 'seller' && t.status === 'pending'), [txs])

  return (
    <div className="container-responsive py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">My Marketplace</h1>
        <div className="inline-flex rounded-lg border overflow-hidden">
          <button onClick={() => setTab('items')} className={`px-4 py-2 text-sm ${tab==='items'?'bg-ocean-600 text-white':'bg-white hover:bg-neutral-50'}`}>My Items</button>
          <button onClick={() => setTab('transactions')} className={`px-4 py-2 text-sm ${tab==='transactions'?'bg-ocean-600 text-white':'bg-white hover:bg-neutral-50'}`}>My Transactions</button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="aspect-[4/3] skeleton-image" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-2/3 skeleton" />
                <div className="h-4 w-1/2 skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : tab === 'items' ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <div key={it.id} className="card">
              <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg mb-3 overflow-hidden">
                {it.images?.[0] && (
                  <img src={mediaUrl(it.images[0])} alt={it.title} className="w-full h-full object-cover" />
                )}
              </div>
              <h3 className="font-semibold mb-1 truncate">{it.title}</h3>
              <div className="text-xs text-gray-600 mb-2 capitalize">{it.transaction_type}{it.transaction_type==='sell'&& it.price?` • ₱${Number(it.price).toLocaleString()}`:''}</div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className={`px-2 py-0.5 rounded-full ${it.status==='available'?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700'}`}>{it.status}</span>
                <span className="text-gray-500">{(it.created_at || '').slice(0,10)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-secondary flex-1"
                  onClick={() => {
                    setEditItem(it)
                    setEditForm({
                      title: it.title,
                      description: '',
                      price: it.price !== undefined ? String(it.price) : '',
                      images: Array.isArray(it.images) ? [...it.images] : [],
                    })
                    setUploadFiles([])
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger flex-1"
                  disabled={deletingId === it.id}
                  onClick={async () => {
                    if (!window.confirm('Delete this item? This cannot be undone.')) return
                    setDeletingId(it.id)
                    try {
                      await marketplaceApi.deleteItem(it.id)
                      setItems((prev) => prev.filter((p) => p.id !== it.id))
                      showToast('Item deleted', 'success')
                    } catch (e: any) {
                      const msg = e?.response?.data?.error || 'Failed to delete item'
                      showToast(msg, 'error')
                    } finally {
                      setDeletingId(null)
                    }
                  }}
                >
                  {deletingId === it.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center text-gray-600">You have no items yet.</div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {txs.map((t) => (
            <div key={`${t.id}-${t.as || 'role'}`} className="flex items-center justify-between rounded-lg border p-3">
              <div className="min-w-0">
                <div className="font-medium capitalize truncate">{t.transaction_type}</div>
                <div className="text-xs text-gray-600">{(t.created_at || '').slice(0,10)} • {t.as === 'seller' ? 'You are the seller' : 'You are the buyer'}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${t.status==='accepted'?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700'}`}>{t.status}</span>
                {t.as === 'seller' && t.status === 'pending' && (
                  <>
                    <button
                      className="text-xs px-2 py-1 rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      disabled={acceptingId === t.id}
                      onClick={async () => {
                        setAcceptingId(t.id)
                        try {
                          await marketplaceApi.acceptTransaction(t.id)
                          setTxs((prev) => prev.map((x) => x.id === t.id ? { ...x, status: 'accepted' } : x))
                          showToast('Transaction accepted', 'success')
                        } catch (e: any) {
                          const msg = e?.response?.data?.error || 'Failed to accept transaction'
                          showToast(msg, 'error')
                        } finally {
                          setAcceptingId(null)
                        }
                      }}
                    >
                      {acceptingId === t.id ? 'Accepting…' : 'Accept'}
                    </button>
                    <button
                      className="text-xs px-2 py-1 rounded border border-rose-200 text-rose-700 hover:bg-rose-50"
                      onClick={async () => {
                        try {
                          await marketplaceApi.rejectTransaction(t.id)
                          setTxs((prev) => prev.map((x) => x.id === t.id ? { ...x, status: 'rejected' } : x))
                          showToast('Transaction rejected. Others can now request this item.', 'success')
                        } catch (e: any) {
                          const msg = e?.response?.data?.error || 'Failed to reject transaction'
                          showToast(msg, 'error')
                        }
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {txs.length === 0 && (
            <div className="text-center text-gray-600">No transactions yet.</div>
          )}
        </div>
      )}
      {editItem && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Item</h2>
              <button onClick={() => setEditItem(null)} className="text-neutral-500 hover:text-neutral-700" aria-label="Close">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input className="input-field" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="input-field" rows={4} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
              </div>
              {editItem.transaction_type === 'sell' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input type="number" min="0" step="0.01" className="input-field" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                </div>
              )}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editForm.images.map((img, idx) => (
                    <div key={`${img}-${idx}`} className="relative">
                      <img src={mediaUrl(img)} className="w-20 h-20 rounded object-cover border" />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-white border rounded-full p-1"
                        onClick={() => setEditForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}
                        aria-label="Remove image"
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
                <input type="file" accept="image/*" multiple onChange={(e) => setUploadFiles(Array.from(e.target.files || []).slice(0,5))} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button className="btn btn-secondary" onClick={() => setEditItem(null)}>Cancel</button>
              <button
                className="btn btn-primary"
                disabled={saving || !editForm.title}
                onClick={async () => {
                  if (!editItem) return
                  setSaving(true)
                  try {
                    const payload: any = { title: editForm.title }
                    if (editForm.description) payload.description = editForm.description
                    if (editItem.transaction_type === 'sell' && editForm.price !== undefined) payload.price = Number(editForm.price || 0)
                    // Persist image removals
                    payload.images = editForm.images
                    await marketplaceApi.updateItem(editItem.id, payload)
                    // Upload new files (parallel)
                    if (uploadFiles.length) {
                      await Promise.all(uploadFiles.map((f) => marketplaceApi.uploadItemImage(editItem.id, f)))
                    }
                    await reloadItems()
                    showToast('Item updated', 'success')
                    setEditItem(null)
                  } catch (e: any) {
                    const msg = e?.response?.data?.error || 'Failed to update item'
                    showToast(msg, 'error')
                  } finally {
                    setSaving(false)
                  }
                }}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


