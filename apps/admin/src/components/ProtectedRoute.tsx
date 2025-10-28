import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../lib/store'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAdminStore()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', { replace: true })
      return
    }

    // Verify user has admin role
    if (user.role !== 'municipal_admin' && user.role !== 'admin') {
      console.error('Access denied: User is not an admin')
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  if (!isAuthenticated || !user || (user.role !== 'municipal_admin' && user.role !== 'admin')) {
    return null
  }

  return <>{children}</>
}

