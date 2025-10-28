import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` },
          })

          const { access_token } = response.data
          localStorage.setItem('access_token', access_token)

          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }

    // Handle role mismatch: clear tokens and redirect to login
    if (error.response?.status === 403) {
      try {
        const data: any = error.response?.data
        if (data?.code === 'ROLE_MISMATCH') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('munlink:role')
          localStorage.removeItem('munlink:user')
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

