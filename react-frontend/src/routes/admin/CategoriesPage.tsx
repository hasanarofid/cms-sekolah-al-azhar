import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { apiClient } from '../../lib/api-client'
import { DeleteButton } from '../../components/admin/DeleteButton'
import { getImageUrl } from '../../lib/utils-image-url'

const categoryTypeLabels: Record<string, string> = {
  'program': 'Program',
  'facility': 'Fasilitas',
  'academic': 'Akademik',
  'general': 'Umum',
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      const data = await apiClient.get('/admin/categories')
      // Filter hanya parent categories (yang tidak punya parentId)
      const parentCategories = Array.isArray(data) 
        ? data.filter((c: any) => !c.parentId)
        : []
      setCategories(parentCategories)
    } catch (error) {
      console.error('Error loading categories:', error)
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
            <h1 className="text-3xl font-bold">Kelola Kategori</h1>
            <Link
              to="/admin/categories/new"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Tambah Kategori</span>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {categories.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p>Belum ada kategori. Tambah kategori baru untuk memulai.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <div key={category.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {category.image ? (
                          <img
                            src={getImageUrl(category.image)}
                            alt={category.name}
                            className="h-16 w-16 object-cover rounded"
                            onError={(e) => {
                              console.error('Failed to load image:', category.image)
                              e.currentTarget.src = '/placeholder-image.png'
                            }}
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            No Image
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">{category.name}</h3>
                          {category.nameEn && (
                            <p className="text-sm text-gray-600">{category.nameEn}</p>
                          )}
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-sm text-gray-500">/{category.slug}</p>
                            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                              {categoryTypeLabels[category.categoryType] || category.categoryType}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/admin/categories/${category.id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <Edit size={18} />
                        </Link>
                        <DeleteButton
                          id={category.id}
                          apiEndpoint="/admin/categories"
                          confirmMessage="Yakin ingin menghapus kategori ini?"
                          onDeleted={loadCategories}
                        />
                      </div>
                    </div>
                    {category.children && category.children.length > 0 && (
                      <div className="mt-4 ml-6 space-y-2">
                        {category.children.map((child: any) => (
                          <div
                            key={child.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded"
                          >
                            <div>
                              <p className="font-medium">{child.name}</p>
                              <p className="text-sm text-gray-500">/{child.slug}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/admin/categories/${child.id}`}
                                className="text-primary-600 hover:text-primary-700"
                              >
                                <Edit size={16} />
                              </Link>
                              <DeleteButton
                                id={child.id}
                                apiEndpoint="/admin/categories"
                                confirmMessage="Yakin ingin menghapus kategori ini?"
                                onDeleted={loadCategories}
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
        </div>
      </div>
    </AdminLayout>
  )
}

