import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { PageForm } from '../../components/admin/PageForm'
import { apiClient } from '../../lib/api-client'
import { Loader2 } from 'lucide-react'

export default function PageNewPage() {
  const navigate = useNavigate()
  const [menus, setMenus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMenus()
  }, [])

  async function loadMenus() {
    try {
      const data = await apiClient.get('/admin/menus')
      setMenus(data)
    } catch (error) {
      console.error('Error loading menus:', error)
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
            <h1 className="text-3xl font-bold">Tambah Halaman Baru</h1>
          </div>

          <PageForm menus={menus} />
        </div>
      </div>
    </AdminLayout>
  )
}

