import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { apiClient } from '../../lib/api-client'
import { DeleteButton } from '../../components/admin/DeleteButton'

export default function MenusPage() {
  const [menus, setMenus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMenus()
  }, [])

  async function loadMenus() {
    try {
      const data = await apiClient.get('/admin/menus')
      // Filter hanya parent menus (yang tidak punya parentId)
      const parentMenus = Array.isArray(data) 
        ? data.filter((m: any) => !m.parentId)
        : []
      setMenus(parentMenus)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Kelola Menu</h1>
            <Link
              to="/admin/menus/new"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Tambah Menu</span>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {menus.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p>Belum ada menu. Tambah menu baru untuk memulai.</p>
                </div>
              ) : (
                menus.map((menu) => (
                  <div key={menu.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{menu.title}</h3>
                        {menu.titleEn && (
                          <p className="text-sm text-gray-600">{menu.titleEn}</p>
                        )}
                        <p className="text-sm text-gray-500">/{menu.slug}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/menus/${menu.id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <Edit size={18} />
                        </Link>
                        <DeleteButton
                          id={menu.id}
                          apiEndpoint="/admin/menus"
                          confirmMessage="Yakin ingin menghapus menu ini?"
                          onDeleted={loadMenus}
                        />
                      </div>
                    </div>
                    {menu.children && menu.children.length > 0 && (
                      <div className="mt-4 ml-6 space-y-2">
                        {menu.children.map((child: any) => (
                          <div key={child.id}>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <div>
                                <p className="font-medium">{child.title}</p>
                                {child.titleEn && (
                                  <p className="text-sm text-gray-600">{child.titleEn}</p>
                                )}
                                <p className="text-sm text-gray-500">/{child.slug}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Link
                                  to={`/admin/menus/${child.id}`}
                                  className="text-primary-600 hover:text-primary-700"
                                >
                                  <Edit size={16} />
                                </Link>
                                <DeleteButton
                                  id={child.id}
                                  apiEndpoint="/admin/menus"
                                  confirmMessage="Yakin ingin menghapus menu ini?"
                                  onDeleted={loadMenus}
                                />
                              </div>
                            </div>
                            {/* Level 2 Children (Grandchildren) */}
                            {child.children && child.children.length > 0 && (
                              <div className="mt-2 ml-6 space-y-2">
                                {child.children.map((grandchild: any) => (
                                  <div
                                    key={grandchild.id}
                                    className="flex items-center justify-between p-3 bg-gray-100 rounded"
                                  >
                                    <div>
                                      <p className="font-medium text-sm">{grandchild.title}</p>
                                      {grandchild.titleEn && (
                                        <p className="text-xs text-gray-600">{grandchild.titleEn}</p>
                                      )}
                                      <p className="text-xs text-gray-500">/{grandchild.slug}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Link
                                        to={`/admin/menus/${grandchild.id}`}
                                        className="text-primary-600 hover:text-primary-700"
                                      >
                                        <Edit size={14} />
                                      </Link>
                                      <DeleteButton
                                        id={grandchild.id}
                                        apiEndpoint="/admin/menus"
                                        confirmMessage="Yakin ingin menghapus menu ini?"
                                        onDeleted={loadMenus}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

