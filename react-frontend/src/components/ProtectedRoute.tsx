import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated, getSession } from '../lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  useEffect(() => {
    async function checkAuth() {
      if (isAuthenticated()) {
        // Verify token dengan server
        const sessionUser = await getSession()
        if (sessionUser) {
          setIsAuth(true)
        } else {
          setIsAuth(false)
        }
      } else {
        setIsAuth(false)
      }
      setIsChecking(false)
    }

    checkAuth()
  }, [])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!isAuth) {
    // Redirect ke login dengan callback URL
    return <Navigate to={`/login?callbackUrl=${encodeURIComponent(location.pathname)}`} replace />
  }

  return <>{children}</>
}

