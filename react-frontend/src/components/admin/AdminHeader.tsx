import { useState, useEffect } from 'react'
import { logout, getUser } from '../../lib/auth'
import type { User } from '../../lib/auth'

export function AdminHeader() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(getUser())
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center justify-between px-6">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

