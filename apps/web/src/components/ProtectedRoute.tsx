import { Navigate } from 'react-router-dom'
import { useAppStore } from '@/lib/store'

type Props = {
  children: JSX.Element
  allow: Array<'public' | 'resident' | 'admin'>
}

export default function ProtectedRoute({ children, allow }: Props) {
  const role = useAppStore((s) => s.role)
  if (!allow.includes(role)) {
    return <Navigate to="/login" replace />
  }
  return children
}


