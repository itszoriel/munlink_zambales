import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// In-memory access token (no localStorage)
let accessToken: string | null = null
let refreshPromise: Promise<string | null> | null = null
let refreshTimer: ReturnType<typeof setTimeout> | null = null

export const getAccessToken = (): string | null => accessToken
export const setAccessToken = (token: string | null) => {
  accessToken = token
  try {
    if (token) sessionStorage.setItem('access_token', token)
    else sessionStorage.removeItem('access_token')
  } catch {}
}
export const clearAccessToken = () => {
  accessToken = null
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
  try { sessionStorage.removeItem('access_token') } catch {}
}

export const setSessionAccessToken = (token: string | null) => {
  setAccessToken(token)
  if (token) scheduleRefresh(token)
}

function base64UrlDecode(input: string): string {
  const pad = (str: string) => str + '='.repeat((4 - (str.length % 4)) % 4)
  const b64 = pad(input).replace(/-/g, '+').replace(/_/g, '/')
  try {
    return decodeURIComponent(
      atob(b64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  } catch {
    return ''
  }
}

function decodeJwt(token: string): any | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(base64UrlDecode(parts[1]) || 'null')
    return payload
  } catch {
    return null
  }
}

function scheduleRefresh(token: string) {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
  const payload = decodeJwt(token)
  const expSec = payload?.exp
  if (!expSec || typeof expSec !== 'number') return
  const nowSec = Math.floor(Date.now() / 1000)
  const bufferSec = 60 // refresh 60s before expiry to account for skew
  const delayMs = Math.max((expSec - nowSec - bufferSec) * 1000, 0)
  refreshTimer = setTimeout(() => {
    // fire and forget
    void doRefresh().catch(() => {})
  }, delayMs)
}

async function doRefresh(): Promise<string | null> {
  try {
    const resp = await axios.post(
      `${API_BASE_URL}/api/auth/refresh`,
      {},
      { withCredentials: true, validateStatus: () => true }
    )
    if (resp.status !== 200) return null
    const newToken: string | undefined = resp?.data?.access_token
    if (newToken) {
      setAccessToken(newToken)
      scheduleRefresh(newToken)
      return newToken
    }
  } catch {
    // ignore; caller handles logout
  }
  return null
}

export async function bootstrapAuth(): Promise<boolean> {
  // First, hydrate from sessionStorage if present for immediate UX
  try {
    const saved = sessionStorage.getItem('access_token')
    if (saved) {
      setAccessToken(saved)
      scheduleRefresh(saved)
      // Attempt background refresh to extend session
      void doRefresh()
      return true
    }
  } catch {}
  // Otherwise, attempt to hydrate from refresh cookie once on app load
  const token = await doRefresh()
  return !!token
}

// Add auth token to requests
api.interceptors.request.use((config: any) => {
  if (!config.headers) config.headers = {}
  if (accessToken) {
    try {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    } catch {
      ;(config.headers as any).Authorization = `Bearer ${accessToken}`
    }
  }
  return config
})

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {}

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        refreshPromise = refreshPromise || doRefresh()
        const newToken = await refreshPromise.finally(() => { refreshPromise = null })
        if (newToken) {
          originalRequest.headers = originalRequest.headers || {}
          try {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`
          } catch {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }
          return api(originalRequest)
        }
      } catch {}
      // If refresh failed, clear and redirect to login
      clearAccessToken()
      window.location.href = '/login'
    }

    // Handle role mismatch: clear tokens and redirect to login
    if (error.response?.status === 403) {
      try {
        const data: any = error.response?.data
        if (data?.code === 'ROLE_MISMATCH') {
          try {
            // best-effort client cleanup; cookies cleared server-side on logout
            if (typeof window !== 'undefined') {
              localStorage.removeItem('munlink:role')
              localStorage.removeItem('munlink:user')
            }
          } catch {}
          window.location.href = '/login'
          return Promise.reject(error)
        }
      } catch {}
    }

    return Promise.reject(error)
  }
)

// API methods
export const authApi = {
  register: (data: any, files?: { profile_picture?: File, valid_id_front?: File, valid_id_back?: File, selfie_with_id?: File, municipality_slug?: string }) => {
    if (files) {
      const form = new FormData()
      Object.entries(data || {}).forEach(([k,v]) => form.append(k, String(v ?? '')))
      if (files.municipality_slug) form.append('municipality_slug', files.municipality_slug)
      if (files.profile_picture) form.append('profile_picture', files.profile_picture)
      // Optional: accept verification docs at registration if provided
      if (files.valid_id_front) form.append('valid_id_front', files.valid_id_front)
      if (files.valid_id_back) form.append('valid_id_back', files.valid_id_back)
      if (files.selfie_with_id) form.append('selfie_with_id', files.selfie_with_id)
      return api.post('/api/auth/register', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    }
    return api.post('/api/auth/register', data)
  },
  login: (data: any) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data: any) => api.put('/api/auth/profile', data),
  resendVerification: () => api.post('/api/auth/resend-verification'),
  resendVerificationPublic: (email: string) => api.post('/api/auth/resend-verification-public', { email }),
  uploadVerificationDocs: (files: { valid_id_front?: File, valid_id_back?: File, selfie_with_id?: File, municipality_slug?: string }) => {
    const form = new FormData()
    if (files.municipality_slug) form.append('municipality_slug', files.municipality_slug)
    if (files.valid_id_front) form.append('valid_id_front', files.valid_id_front)
    if (files.valid_id_back) form.append('valid_id_back', files.valid_id_back)
    if (files.selfie_with_id) form.append('selfie_with_id', files.selfie_with_id)
    return api.post('/api/auth/verification-docs', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
}

export const municipalityApi = {
  getAll: () => api.get('/api/municipalities'),
  getById: (id: number) => api.get(`/api/municipalities/${id}`),
  getBySlug: (slug: string) => api.get(`/api/municipalities/slug/${slug}`),
  getBarangays: (id: number) => api.get(`/api/municipalities/${id}/barangays`),
}

export const marketplaceApi = {
  getItems: (params?: any) => api.get('/api/marketplace/items', { params }),
  getItem: (id: number) => api.get(`/api/marketplace/items/${id}`),
  createItem: (data: any) => api.post('/api/marketplace/items', data),
  updateItem: (id: number, data: any) => api.put(`/api/marketplace/items/${id}`, data),
  deleteItem: (id: number) => api.delete(`/api/marketplace/items/${id}`),
  getMyItems: () => api.get('/api/marketplace/my-items'),
  createTransaction: (data: any) => api.post('/api/marketplace/transactions', data),
  // New proposal/confirmation flow
  proposeTransaction: (id: number, data: { pickup_at: string, pickup_location: string }) => api.post(`/api/marketplace/transactions/${id}/propose`, data),
  confirmTransaction: (id: number) => api.post(`/api/marketplace/transactions/${id}/confirm`),
  buyerRejectProposal: (id: number) => api.post(`/api/marketplace/transactions/${id}/reject-buyer`),
  // Dual-confirmation handover/returns
  handoverSeller: (id: number, notes?: string) => api.post(`/api/marketplace/transactions/${id}/handover-seller`, { notes }),
  handoverBuyer: (id: number, notes?: string) => api.post(`/api/marketplace/transactions/${id}/handover-buyer`, { notes }),
  returnBuyer: (id: number, notes?: string) => api.post(`/api/marketplace/transactions/${id}/return-buyer`, { notes }),
  returnSeller: (id: number, notes?: string) => api.post(`/api/marketplace/transactions/${id}/return-seller`, { notes }),
  complete: (id: number, notes?: string) => api.post(`/api/marketplace/transactions/${id}/complete`, { notes }),
  dispute: (id: number, reason: string) => api.post(`/api/marketplace/transactions/${id}/dispute`, { reason }),
  getAudit: (id: number) => api.get(`/api/marketplace/transactions/${id}/audit`),
  // Legacy accept (kept for compatibility in case other screens still call it)
  acceptTransaction: (id: number, data: { pickup_at: string, pickup_location: string }) => api.post(`/api/marketplace/transactions/${id}/accept`, data),
  rejectTransaction: (id: number) => api.post(`/api/marketplace/transactions/${id}/reject`),
  getMyTransactions: () => api.get('/api/marketplace/my-transactions'),
  uploadItemImage: (id: number, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/api/marketplace/items/${id}/upload`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
}

export const announcementsApi = {
  getAll: (params?: any) => api.get('/api/announcements', { params }),
  getById: (id: number) => api.get(`/api/announcements/${id}`),
}

export const documentsApi = {
  getTypes: () => api.get('/api/documents/types'),
  createRequest: (data: any) => api.post('/api/documents/requests', data),
  getMyRequests: () => api.get('/api/documents/my-requests'),
  getRequest: (id: number) => api.get(`/api/documents/requests/${id}`),
  uploadSupportingDocs: (id: number, form: FormData) => api.post(`/api/documents/requests/${id}/upload`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getClaimTicket: (id: number, params?: any) => api.get(`/api/documents/requests/${id}/claim-ticket`, { params }),
  publicVerify: (requestNumber: string) => api.get(`/api/documents/verify/${encodeURIComponent(requestNumber)}`),
}

export const issuesApi = {
  getAll: (params?: any) => api.get('/api/issues', { params }),
  getById: (id: number) => api.get(`/api/issues/${id}`),
  create: (data: any) => api.post('/api/issues', data),
  getMine: () => api.get('/api/issues/my'),
  upload: (id: number, form: FormData) => api.post(`/api/issues/${id}/upload`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getCategories: () => api.get('/api/issues/categories'),
}

export const benefitsApi = {
  getPrograms: (params?: any) => api.get('/api/benefits/programs', { params }),
  getProgram: (id: number) => api.get(`/api/benefits/programs/${id}`),
  createApplication: (data: any) => api.post('/api/benefits/applications', data),
  getMyApplications: () => api.get('/api/benefits/my-applications'),
  uploadDocs: (id: number, form: FormData) => api.post(`/api/benefits/applications/${id}/upload`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

export const transferApi = {
  request: (to_municipality_id: number, notes?: string) => api.post('/api/auth/transfer', { to_municipality_id, notes }),
  listAdmin: (): Promise<any> => api.get('/api/admin/transfers'),
  updateAdmin: (id: number, status: 'approved'|'rejected'|'accepted') => api.put(`/api/admin/transfers/${id}/status`, { status }),
}

// Toast helper for consistent notifications
export const showToast = (message: string, _type: 'success' | 'error' | 'info' = 'info') => {
  // Use browser alert for now - in a real app you'd use a toast library
  alert(message)
}

export const mediaUrl = (p?: string): string => {
  if (!p) return ''
  let s = p.replace(/\\/g, '/').replace(/^\/+/, '')
  if (/^https?:\/\//i.test(s)) return s
  const idx = s.indexOf('/uploads/')
  if (idx !== -1) s = s.slice(idx + 9)
  s = s.replace(/^uploads\//, '')
  return `${API_BASE_URL}/uploads/${s}`
}

export default api

