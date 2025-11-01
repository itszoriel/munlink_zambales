/**
 * MunLink Zambales - Marketplace Overview Component
 * Read-only overview of marketplace listings with filters and details
 */
import { useState, useEffect } from 'react'
import { marketplaceApi, handleApiError, mediaUrl } from '../lib/api'

interface MarketplaceItem {
  id: number
  title: string
  description: string
  price: number
  category: string
  status: string
  seller: {
    first_name: string
    last_name: string
    username: string
    email: string
  }
  images?: string[]
  created_at: string
  municipality_name?: string
}

interface MarketplaceModerationProps {}

export default function MarketplaceModeration({}: MarketplaceModerationProps) {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [transactionType, setTransactionType] = useState<'all'|'sell'|'lend'|'donate'>('all')
  const [status, setStatus] = useState<'all'|'available'|'reserved'|'completed'|'disputed'>('all')

  // Load items with simple filters
  const loadItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const params: any = {}
      if (transactionType !== 'all') params.transaction_type = transactionType
      if (status !== 'all') params.status = status
      const response = await marketplaceApi.listPublicItems({ page: 1, per_page: 50, ...params })
      const data = (response as any)?.items || (response as any)?.data?.items || (response as any)?.data || []
      setItems(Array.isArray(data) ? data : [])
    } catch (err: any) {
      // Handle 422 errors gracefully - show empty state instead of error
      if (err.response?.status === 422) {
        setItems([])
        setError(null)
      } else {
        setError(handleApiError(err))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [transactionType, status])

  // Open item detail modal
  const openItemModal = (item: MarketplaceItem) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zambales-green"></div>
        <span className="ml-2 text-gray-600">Loading marketplace items...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-400 mr-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-800">Error loading items</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
        <p className="text-gray-500">Try changing filters.</p>
      </div>
    )
  }

  return (
    <>
      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Type</label>
          <select value={transactionType} onChange={(e) => setTransactionType(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
            <option value="all">All</option>
            <option value="sell">For Sale</option>
            <option value="lend">For Lending</option>
            <option value="donate">Free</option>
          </select>
          <label className="text-sm text-gray-600 ml-4">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="completed">Completed</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {/* Item Image */}
                <div className="flex-shrink-0">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={mediaUrl(item.images[0])}
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Item Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="font-medium text-green-600">{(item as any).price != null ? `₱${Number((item as any).price).toLocaleString()}` : (['donate','lend'].includes((item as any).transaction_type) ? ((item as any).transaction_type === 'donate' ? 'Free' : 'Lend') : 'N/A')}</span>
                    <span>•</span>
                    <span className="capitalize">{item.category}</span>
                    <span>•</span>
                    <span>By: {item.seller.first_name} {item.seller.last_name}</span>
                    {item.municipality_name && (
                      <>
                        <span>•</span>
                        <span>{item.municipality_name}</span>
                      </>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-1">
                    Posted: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openItemModal(item)}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Item Detail Modal */}
      {showModal && selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => {
            setShowModal(false)
            setSelectedItem(null)
          }}
        />
      )}
    </>
  )
}

// Item Detail Modal Component
interface ItemDetailModalProps {
  item: MarketplaceItem
  onClose: () => void
}

function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  const [idx, setIdx] = useState(0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Marketplace Item Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Item Images */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Item Images</h3>
              {item.images && item.images.length > 0 ? (
                <>
                  <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                    {(() => { const imgs = item.images || []; return (
                      <img src={mediaUrl(imgs[Math.min(Math.max(0, idx), Math.max(0, imgs.length-1))])} alt="preview" className="w-full h-full object-cover" />
                    )})()}
                    {(item.images || []).length > 1 && (
                      <>
                        <button
                          type="button"
                          aria-label="Prev"
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white rounded-full p-2 z-10"
                          onClick={() => setIdx((i) => { const n=(item.images||[]).length; return n? (i - 1 + n) % n : 0 })}
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          aria-label="Next"
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white rounded-full p-2 z-10"
                          onClick={() => setIdx((i) => { const n=(item.images||[]).length; return n? (i + 1) % n : 0 })}
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>
                  {(item.images || []).length > 1 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                      {(item.images || []).map((img, i) => (
                        <button key={`${img}-${i}`} type="button" className={`h-16 w-16 flex-shrink-0 rounded border ${i===idx?'ring-2 ring-blue-600':''}`} onClick={() => setIdx(i)}>
                          <img src={mediaUrl(img)} alt={`thumb ${i+1}`} className="w-full h-full object-cover rounded" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center">
                  <span className="text-gray-500">No images</span>
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                <p className="text-2xl font-bold text-green-600 mt-1">₱{item.price.toLocaleString()}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{item.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Category</h4>
                  <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Status</h4>
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                    {item.status || 'n/a'}
                  </span>
                </div>
              </div>

              {/* Seller Information */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Seller Information</h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span> {item.seller.first_name} {item.seller.last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Username:</span> @{item.seller.username}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {item.seller.email}
                  </p>
                  {item.municipality_name && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Location:</span> {item.municipality_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-400">
                Posted: {new Date(item.created_at).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
