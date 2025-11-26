import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { SettingsForm } from '../../components/admin/SettingsForm'
import { apiClient } from '../../lib/api-client'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<Record<string, any>>({})

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    // Set document title dari settings
    if (settings.website_title?.value) {
      document.title = settings.website_title.value
    } else {
      document.title = 'Pengaturan - CMS Sekolah'
    }
  }, [settings])

  async function loadSettings() {
    try {
      const data = await apiClient.get('/admin/settings', false) // false = tidak perlu auth untuk settings
      // Convert array to object dengan key sebagai index
      const settingsObj: Record<string, any> = {}
      if (Array.isArray(data)) {
        data.forEach((setting: any) => {
          settingsObj[setting.key] = setting
        })
      }
      setSettings(settingsObj)
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Pengaturan</h1>
          <SettingsForm settings={settings} />
        </div>
      </div>
    </AdminLayout>
  )
}

