/**
 * MunLink Zambales - Announcement Manager Component
 * Component for managing municipality announcements
 */
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { announcementApi, handleApiError, mediaUrl } from '../lib/api'

interface Announcement {
  id: number
  title: string
  content: string
  priority: 'high' | 'medium' | 'low'
  is_active: boolean
  created_at: string
  updated_at: string
  municipality_name?: string
  creator_name?: string
  images?: string[]
}

interface AnnouncementManagerProps {
  onAnnouncementUpdated?: (announcementId: number) => void
}

export default function AnnouncementManager({ onAnnouncementUpdated }: AnnouncementManagerProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Load announcements
  const loadAnnouncements = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await announcementApi.getAnnouncements()
      setAnnouncements((response as any).announcements || [])
    } catch (err: any) {
      // Handle 422 errors gracefully - show empty state instead of error
      if (err.response?.status === 422) {
        setAnnouncements([])
        setError(null)
      } else {
        setError(handleApiError(err))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnnouncements()
  }, [])

  // Handle announcement update
  const handleUpdateAnnouncement = async (id: number, data: any) => {
    try {
      setActionLoading(id)
      await announcementApi.updateAnnouncement(id, data)
      
      // Update local state
      setAnnouncements(prev => prev.map(announcement => 
        announcement.id === id 
          ? { ...announcement, ...data, updated_at: new Date().toISOString() }
          : announcement
      ))
      
      onAnnouncementUpdated?.(id)
      
      // Close modal if this was the selected announcement
      if (selectedAnnouncement?.id === id) {
        setShowModal(false)
        setSelectedAnnouncement(null)
      }
    } catch (err: any) {
      setError(handleApiError(err))
    } finally {
      setActionLoading(null)
    }
  }

  // Handle announcement deletion
  const handleDeleteAnnouncement = async (id: number) => {
    try {
      setActionLoading(id)
      await announcementApi.deleteAnnouncement(id)
      
      // Remove announcement from list
      setAnnouncements(prev => prev.filter(announcement => announcement.id !== id))
      onAnnouncementUpdated?.(id)
      
      // Close modal
      setShowModal(false)
      setSelectedAnnouncement(null)
    } catch (err: any) {
      setError(handleApiError(err))
    } finally {
      setActionLoading(null)
    }
  }

  // Handle announcement creation
  const handleCreateAnnouncement = async (data: any, files?: File[]) => {
    try {
      setActionLoading(-1) // Use -1 for create action
      const response = await announcementApi.createAnnouncement(data)
      const created = (response as any).announcement || (response as any).data?.announcement
      const id = created?.id
      if (id && files && files.length) {
        for (const f of files.slice(0, 5)) {
          try { await announcementApi.uploadImage(id, f) } catch {}
        }
      }
      
      // Add new announcement to list
      if (created) {
        setAnnouncements(prev => [created, ...prev])
        onAnnouncementUpdated?.(created.id)
      }
      
      // Close modal
      setShowCreateModal(false)
    } catch (err: any) {
      setError(handleApiError(err))
    } finally {
      setActionLoading(null)
    }
  }

  // Open announcement detail modal
  const openAnnouncementModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setShowModal(true)
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zambales-green"></div>
        <span className="ml-2 text-gray-600">Loading announcements...</span>
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
            <h3 className="text-sm font-medium text-red-800">Error loading announcements</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header with Create Button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Announcements</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-zambales-green hover:bg-green-700 rounded-md transition-colors"
        >
          Create Announcement
        </button>
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            {/* Image banner with fixed aspect to avoid stretching on wide screens */}
            {Array.isArray(announcement.images) && announcement.images.length > 0 ? (
              <div className="aspect-[16/9] bg-neutral-100">
                <img src={mediaUrl(announcement.images[0])} alt="Announcement" loading="lazy" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-[16/9] bg-neutral-100" />
            )}
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}>{announcement.priority.toUpperCase()}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${announcement.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{announcement.is_active ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
                <div className="flex items-center gap-2 sm:self-start">
                  <button onClick={() => openAnnouncementModal(announcement)} className="px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">Edit</button>
                  <button onClick={() => handleUpdateAnnouncement(announcement.id, { is_active: !announcement.is_active })} disabled={actionLoading === announcement.id} className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${announcement.is_active ? 'text-orange-700 bg-orange-100 hover:bg-orange-200' : 'text-green-700 bg-green-100 hover:bg-green-200'}`}>{actionLoading === announcement.id ? 'Updating…' : (announcement.is_active ? 'Deactivate' : 'Activate')}</button>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{announcement.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{announcement.content}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                {announcement.municipality_name && (<span className="truncate">{announcement.municipality_name}</span>)}
                {announcement.creator_name && (<span className="truncate">By: {announcement.creator_name}</span>)}
                <span className="hidden sm:inline">•</span>
                <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements</h3>
          <p className="text-gray-500">Create your first announcement to get started.</p>
        </div>
      )}

      {/* Announcement Detail/Edit Modal */}
      {showModal && selectedAnnouncement && (
        <AnnouncementDetailModal
          announcement={selectedAnnouncement}
          onClose={() => {
            setShowModal(false)
            setSelectedAnnouncement(null)
          }}
          onUpdate={handleUpdateAnnouncement}
          onDelete={handleDeleteAnnouncement}
          loading={actionLoading === selectedAnnouncement.id}
        />
      )}

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <CreateAnnouncementModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateAnnouncement}
          loading={actionLoading === -1}
        />
      )}
    </>
  )
}

// Announcement Detail Modal Component
interface AnnouncementDetailModalProps {
  announcement: Announcement
  onClose: () => void
  onUpdate: (id: number, data: any) => void
  onDelete: (id: number) => void
  loading: boolean
}

function AnnouncementDetailModal({ 
  announcement, 
  onClose, 
  onUpdate, 
  onDelete, 
  loading 
}: AnnouncementDetailModalProps) {
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    title: announcement.title,
    content: announcement.content,
    priority: announcement.priority,
    is_active: announcement.is_active
  })
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>(announcement.images || [])

  const handleSave = () => {
    onUpdate(announcement.id, { ...formData, images })
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      onDelete(announcement.id)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto pb-24 sm:pb-0" tabIndex={-1} autoFocus>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editMode ? 'Edit Announcement' : 'Announcement Details'}
            </h2>
            <div className="flex items-center space-x-2">
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Edit
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Images */}
            <div>
              <label htmlFor="ann-images" className="block text-sm font-medium text-gray-700 mb-1">Images</label>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {images.map((img, idx) => (
                    <img key={idx} src={mediaUrl(img)} alt="Image" className="w-full h-20 object-cover rounded border" />
                  ))}
                </div>
              )}
              <input id="ann-images" name="announcement_images" type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                if (images.length >= 5) return
                try {
                  setUploading(true)
                  const fd = new FormData()
                  fd.set('file', file)
                  // Use direct client since admin api lacks helper
                  const res = await fetch(`${(import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'}/api/admin/announcements/${announcement.id}/upload`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${localStorage.getItem('admin:access_token') || ''}` },
                    body: fd,
                  })
                  const data = await res.json()
                  if (res.ok) {
                    const next = (data.announcement?.images || []).slice(0, 5)
                    setImages(next)
                  }
                } finally {
                  setUploading(false)
                }
              }} disabled={uploading || images.length >= 5} />
              <p className="text-xs text-gray-500 mt-1">Upload up to 5 images.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              {editMode ? (
                <input
                  name="announcement_title"
                  id="announcement-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zambales-green"
                />
              ) : (
                <p className="text-gray-900">{announcement.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              {editMode ? (
                <textarea
                  name="announcement_content"
                  id="announcement-content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zambales-green"
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">{announcement.content}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                {editMode ? (
                  <select
                    name="announcement_priority"
                    id="announcement-priority"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zambales-green"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority.toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                {editMode ? (
                  <select
                    name="announcement_status"
                    id="announcement-status"
                    value={formData.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'active' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zambales-green"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${announcement.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {announcement.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <p>Created: {new Date(announcement.created_at).toLocaleString()}</p>
              <p>Updated: {new Date(announcement.updated_at).toLocaleString()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t mt-6">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>

            <div className="flex items-center space-x-3">
              {editMode && (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading || uploading || !formData.title.trim() || !formData.content.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-zambales-green hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// Create Announcement Modal Component
interface CreateAnnouncementModalProps {
  onClose: () => void
  onCreate: (data: any, files?: File[]) => void
  loading: boolean
}

function CreateAnnouncementModal({ onClose, onCreate, loading }: CreateAnnouncementModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  })
  const [files, setFiles] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title.trim() && formData.content.trim()) {
      onCreate(formData, files)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto pb-24 sm:pb-0" tabIndex={-1} autoFocus>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create Announcement</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                name="create_announcement_title"
                id="create-announcement-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zambales-green"
                placeholder="Enter announcement title"
                required
              />
            </div>

            <div>
              <label htmlFor="create-ann-images" className="block text-sm font-medium text-gray-700 mb-1">Images (optional, up to 5)</label>
              <input
                id="create-ann-images"
                name="create_announcement_images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 5))}
                className="w-full"
              />
              {files.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {files.map((f, i) => (
                    <div key={i} className="text-xs px-2 py-1 bg-neutral-100 rounded">{f.name}</div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea
                name="create_announcement_content"
                id="create-announcement-content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zambales-green"
                placeholder="Enter announcement content"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                name="create_announcement_priority"
                id="create-announcement-priority"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zambales-green"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title.trim() || !formData.content.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-zambales-green hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                {loading ? 'Creating...' : 'Create Announcement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}

// Helper function for priority colors
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
