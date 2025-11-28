import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { SEOForm } from '../../components/admin/SEOForm'
import { apiClient } from '../../lib/api-client'

export default function SEOPage() {
  const [loading, setLoading] = useState(true)
  const [seo, setSeo] = useState<any>(null)

  useEffect(() => {
    loadSEO()
  }, [])

  useEffect(() => {
    // Set document title
    document.title = 'SEO Settings - CMS Sekolah'
  }, [])

  async function loadSEO() {
    try {
      // Load global SEO settings
      const data = await apiClient.get('/admin/seo?pageType=global', false)
      setSeo(data)
    } catch (error) {
      console.error('Error loading SEO:', error)
      // If not found, create empty object
      setSeo(null)
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
          <h1 className="text-3xl font-bold mb-2">Pengaturan SEO</h1>
          <p className="text-gray-600 mb-6">
            Kelola meta tags, Open Graph, dan Twitter Cards untuk meningkatkan visibilitas website di mesin pencari dan media sosial.
          </p>
          <SEOForm seo={seo} />
        </div>
      </div>
    </AdminLayout>
  )
}

