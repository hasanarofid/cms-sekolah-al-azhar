import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { apiClient } from '../../lib/api-client'
import { DeleteButton } from '../../components/admin/DeleteButton'
import { useFlashMessage } from '../../hooks/useFlashMessage'
import { FlashMessage } from '../../components/admin/FlashMessage'

export default function MenusPage() {
  const { flashMessage } = useFlashMessage()
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

  async function toggleMenuActive(menuId: string, currentStatus: boolean) {
    try {
      await apiClient.put(`/admin/menus/${menuId}/update`, {
        isActive: !currentStatus
      })
      // Reload menus setelah update
      await loadMenus()
    } catch (error) {
      console.error('Error toggling menu status:', error)
      alert('Gagal mengubah status menu')
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
          {flashMessage.show && (
            <FlashMessage
              message={flashMessage.message}
              type={flashMessage.type}
              onClose={() => {}}
            />
          )}
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
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{menu.title}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            menu.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {menu.isActive ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>
                        {menu.titleEn && (
                          <p className="text-sm text-gray-600">{menu.titleEn}</p>
                        )}
                        <p className="text-sm text-gray-500">/{menu.slug}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={menu.isActive === 1 || menu.isActive === true}
                            onChange={() => toggleMenuActive(menu.id, menu.isActive === 1 || menu.isActive === true)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
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
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{child.title}</p>
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    child.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {child.isActive ? 'Aktif' : 'Nonaktif'}
                                  </span>
                                </div>
                                {child.titleEn && (
                                  <p className="text-sm text-gray-600">{child.titleEn}</p>
                                )}
                                <p className="text-sm text-gray-500">/{child.slug}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={child.isActive === 1 || child.isActive === true}
                                    onChange={() => toggleMenuActive(child.id, child.isActive === 1 || child.isActive === true)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
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
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm">{grandchild.title}</p>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                                          grandchild.isActive 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                          {grandchild.isActive ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                      </div>
                                      {grandchild.titleEn && (
                                        <p className="text-xs text-gray-600">{grandchild.titleEn}</p>
                                      )}
                                      <p className="text-xs text-gray-500">/{grandchild.slug}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={grandchild.isActive === 1 || grandchild.isActive === true}
                                          onChange={() => toggleMenuActive(grandchild.id, grandchild.isActive === 1 || grandchild.isActive === true)}
                                          className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                      </label>
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

