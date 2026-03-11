import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'

export function useRequireAuth() {
  const { status, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (status === 'unauthenticated') {
      void navigate('/auth', {
        replace: true,
        state: { from: location.pathname },
      })
    }
  }, [status, navigate, location])

  return { status, user }
}
