import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { PageForm } from '../../components/admin/PageForm'
import { apiClient } from '../../lib/api-client'
import { Loader2 } from 'lucide-react'

export default function PageEditPage() {
  const params = useParams()
  const navigate = useNavigate()
  const pageId = params.id as string
  const [page, setPage] = useState<any>(null)
  const [menus, setMenus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (pageId) {
      loadData()
    }
  }, [pageId])

  async function loadData() {
    try {
      const [pageData, menusData] = await Promise.all([
        apiClient.get(`/admin/pages/${pageId}`),
        apiClient.get('/admin/menus'),
      ])
      setPage(pageData)
      setMenus(menusData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin h-12 w-12 text-green-500" />
        </div>
      </AdminLayout>
    )
  }

  if (!page) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Halaman tidak ditemukan</p>
          <button
            onClick={() => navigate('/admin/pages')}
            className="mt-4 text-green-600 hover:text-green-700"
          >
            Kembali ke Daftar Halaman
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate('/admin/pages')}
              className="text-green-600 hover:text-green-700 mb-4"
            >
              ← Kembali ke Daftar Halaman
            </button>
            <h1 className="text-3xl font-bold">Edit Halaman</h1>
          </div>

          <PageForm page={page} menus={menus} />
        </div>
      </div>
    </AdminLayout>
  )
}

