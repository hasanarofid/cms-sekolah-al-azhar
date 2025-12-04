import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { MenuForm } from '../../components/admin/MenuForm'
import { apiClient } from '../../lib/api-client'
import { Loader2 } from 'lucide-react'
import NotFound from '../NotFound'

export default function MenuEditPage() {
  const params = useParams()
  const navigate = useNavigate()
  const menuId = params.id as string
  const [menu, setMenu] = useState<any>(null)
  const [allMenus, setAllMenus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (menuId) {
      loadData()
    }
  }, [menuId])

  async function loadData() {
    try {
      const [menuData, menusData] = await Promise.all([
        apiClient.get(`/admin/menus/${menuId}`).catch(() => null),
        apiClient.get('/admin/menus').catch(() => []),
      ])
      
      if (!menuData) {
        setNotFound(true)
        return
      }

      setMenu(menuData)
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
      setAllMenus(flattenMenus(menusData))
    } catch (error) {
      console.error('Error loading data:', error)
      setNotFound(true)
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

  if (notFound || !menu) {
    return (
      <AdminLayout>
        <NotFound />
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
            <h1 className="text-3xl font-bold">Edit Menu</h1>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <MenuForm menu={menu} allMenus={allMenus} />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

