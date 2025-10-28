import { Navigate } from 'react-router-dom'
import type { ReactElement } from 'react'
import { useAppStore } from '@/lib/store'

type Props = {
  children: ReactElement
  allow: Array<'public' | 'resident' | 'admin'>
}

export default function ProtectedRoute({ children, allow }: Props) {
  const role = useAppStore((s) => s.role)
  if (!allow.includes(role)) {
    return <Navigate to="/login" replace />
  }
  return children
}


