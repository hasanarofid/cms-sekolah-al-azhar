import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { SliderForm } from '../../components/admin/SliderForm'
import { apiClient } from '../../lib/api-client'

export default function SliderEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [slider, setSlider] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadSlider()
    }
  }, [id])

  async function loadSlider() {
    try {
      const data = await apiClient.get(`/admin/sliders/${id}`)
      setSlider(data)
    } catch (err: any) {
      console.error('Error loading slider:', err)
      setError(err.message || 'Gagal memuat data slider')
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

  if (error || !slider) {
    return (
      <AdminLayout>
        <div className="w-full">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error || 'Slider tidak ditemukan'}
            </div>
            <button
              onClick={() => navigate('/admin/sliders')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Kembali ke Daftar Slider
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Edit Slider</h1>
          <SliderForm slider={slider} />
        </div>
      </div>
    </AdminLayout>
  )
}

