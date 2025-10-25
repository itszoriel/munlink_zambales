import { useAdminStore } from '../lib/store'

export default function Profile() {
  const user = useAdminStore((s) => s.user)

  const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'
  const resolveImageUrl = (path?: string) => {
    if (!path) return undefined
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) return path
    if (path.startsWith('/uploads/')) return `${API_BASE_URL}${path}`
    return `${API_BASE_URL}/uploads/${path}`
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
        <div className="flex items-center gap-6 mb-6">
          {user?.profile_picture ? (
            <img src={resolveImageUrl(user.profile_picture)} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 text-2xl font-semibold">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">{user?.first_name} {user?.last_name}</h2>
            <p className="text-neutral-600">{user?.email}</p>
            <p className="text-neutral-600">{user?.admin_municipality_name || user?.municipality_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">Personal Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">First name</span><span className="text-neutral-900">{user?.first_name || '—'}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Middle name</span><span className="text-neutral-900">{user?.middle_name || '—'}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Last name</span><span className="text-neutral-900">{user?.last_name || '—'}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Username</span><span className="text-neutral-900">{user?.username || '—'}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Email</span><span className="text-neutral-900">{user?.email || '—'}</span></div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">Admin Assignment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">Municipality name</span><span className="text-neutral-900">{user?.admin_municipality_name || user?.municipality_name || '—'}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Municipality slug</span><span className="text-neutral-900">{user?.admin_municipality_slug || user?.municipality_slug || '—'}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Role</span><span className="text-neutral-900">{user?.role || '—'}</span></div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">Security</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">Password</span><span className="text-neutral-900">••••••••</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Admin secret</span><span className="text-neutral-900">••••••••</span></div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">Verification Documents</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">Valid ID (front)</span><span className="text-neutral-900">On file</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Valid ID (back)</span><span className="text-neutral-900">On file</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



