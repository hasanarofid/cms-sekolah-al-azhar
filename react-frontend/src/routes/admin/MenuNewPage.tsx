import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { MenuForm } from '../../components/admin/MenuForm'
import { apiClient } from '../../lib/api-client'
import { Loader2 } from 'lucide-react'

export default function MenuNewPage() {
  const navigate = useNavigate()
  const [allMenus, setAllMenus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMenus()
  }, [])

  async function loadMenus() {
    try {
      const data = await apiClient.get('/admin/menus')
      // Flatten all menus untuk parent options
      const flattenMenus = (menus: any[]): any[] => {
        const result: any[] = []
        menus.forEach((m) => {
          result.push(m)
          if (m.children && m.children.length > 0) {
            result.push(...flattenMenus(m.children))
          }
        })
        return result
      }
      setAllMenus(flattenMenus(data))
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
          <Loader2 className="animate-spin h-12 w-12 text-primary-600" />
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
              onClick={() => navigate('/admin/menus')}
              className="text-primary-600 hover:text-primary-700 mb-4"
            >
              ← Kembali ke Daftar Menu
            </button>
            <h1 className="text-3xl font-bold">Tambah Menu Baru</h1>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <MenuForm allMenus={allMenus} />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

