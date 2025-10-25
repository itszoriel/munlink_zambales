import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api, { authApi } from '@/lib/api'
import { useAppStore } from '@/lib/store'

export default function VerifyEmailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const setAuth = useAppStore((s) => s.setAuth)
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [resendMessage, setResendMessage] = useState<string>('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    if (!token) {
      setStatus('error')
      setMessage('Missing verification token. Please open the link from your email or resend a new link below.')
      return
    }

    const doVerify = async () => {
      setStatus('verifying')
      try {
        const res = await api.get(`/api/auth/verify-email/${encodeURIComponent(token)}`)
        setStatus('success')
        setMessage(res.data?.message || 'Email verified successfully')
        // Optionally refresh profile if already logged in
        try {
          const resp = await api.get('/api/auth/profile')
          const { id, username, role, email_verified, admin_verified, profile_picture } = resp.data || {}
          if (id) {
            setAuth({ id, username, role, email_verified, admin_verified, profile_picture } as any, localStorage.getItem('access_token') || '', localStorage.getItem('refresh_token') || '')
          }
        } catch {}
      } catch (err: any) {
        const msg = err?.response?.data?.error || 'Email verification failed'
        setStatus('error')
        setMessage(msg)
      }
    }

    doVerify()
  }, [location.search])

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="card max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">Verify Email</h1>
        {status === 'verifying' && <p>Verifying your email...</p>}
        {status !== 'verifying' && (
          <>
            <p className={status === 'error' ? 'text-red-600' : 'text-green-700'}>{message}</p>
            {status === 'error' && (
              <div className="mt-4">
                <button
                  onClick={async () => {
                    setResendStatus('sending')
                    setResendMessage('')
                    try {
                      const res = await authApi.resendVerification()
                      setResendStatus('sent')
                      setResendMessage(res.data?.message || 'Verification email sent')
                    } catch (err: any) {
                      const msg = err?.response?.data?.error || 'Failed to resend verification email'
                      setResendStatus('error')
                      setResendMessage(msg)
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-ocean-600 text-white hover:bg-ocean-700 disabled:opacity-60"
                  disabled={resendStatus === 'sending'}
                >
                  {resendStatus === 'sending' ? 'Sending…' : 'Resend verification email'}
                </button>
                {!!resendMessage && (
                  <p className={resendStatus === 'error' ? 'text-red-600' : 'text-green-700'}>
                    {resendMessage}
                  </p>
                )}
              </div>
            )}
            {status === 'success' && (
              <div className="mt-4 text-sm text-gray-600">
                <p>Your account is now email-verified. Please upload your government ID for admin review to unlock all features.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}


