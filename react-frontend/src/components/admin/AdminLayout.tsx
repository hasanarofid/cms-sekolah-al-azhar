import { useEffect, useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { ProtectedRoute } from '../ProtectedRoute'
import { apiClient } from '../../lib/api-client'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [settings, setSettings] = useState<Record<string, any>>({})

  useEffect(() => {
    // Load settings untuk set document title
    async function loadSettings() {
      try {
        const data = await apiClient.get('/admin/settings', false)
        const settingsObj: Record<string, any> = {}
        if (Array.isArray(data)) {
          data.forEach((setting: any) => {
            settingsObj[setting.key] = setting
          })
        }
        setSettings(settingsObj)
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
    loadSettings()
  }, [])

  useEffect(() => {
    // Set document title dari settings
    if (settings.website_title?.value) {
      document.title = settings.website_title.value
    } else {
      document.title = 'Admin - CMS Sekolah'
    }
  }, [settings])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <AdminHeader />
        <main className="ml-64 mt-16 p-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}

