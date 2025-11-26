import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { HomeSectionForm } from '../../components/admin/HomeSectionForm'
import { apiClient } from '../../lib/api-client'

export default function HomeSectionEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [section, setSection] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadSection()
    }
  }, [id])

  async function loadSection() {
    try {
      const data = await apiClient.get(`/admin/home-sections/${id}`)
      // Parse images if it's a JSON string
      if (data.images && typeof data.images === 'string') {
        try {
          data.images = JSON.parse(data.images)
        } catch {
          data.images = []
        }
      }
      setSection(data)
    } catch (error) {
      console.error('Error loading section:', error)
      navigate('/admin/home-sections')
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

  if (!section) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Section tidak ditemukan</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Edit Home Section</h1>
          <HomeSectionForm section={section} />
        </div>
      </div>
    </AdminLayout>
  )
}

