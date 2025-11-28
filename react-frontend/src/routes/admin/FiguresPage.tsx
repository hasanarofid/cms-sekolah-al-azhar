import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { apiClient } from '../../lib/api-client'
import { DeleteButton } from '../../components/admin/DeleteButton'
import { getImageUrl } from '../../lib/utils-image-url'

export default function FiguresPage() {
  const [figures, setFigures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFigures()
  }, [])

  async function loadFigures() {
    try {
      const data = await apiClient.get('/admin/figures')
      setFigures(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading figures:', error)
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
            <h1 className="text-3xl font-bold">Kelola Tokoh-Tokoh SMA AL AZHAR INSAN CENDEKIA JATIBENING</h1>
            <Link
              to="/admin/figures/new"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Tambah Tokoh</span>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {figures.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Belum ada tokoh. Klik "Tambah Tokoh" untuk membuat baru.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Foto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posisi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {figures.map((figure) => (
                    <tr key={figure.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {figure.image ? (
                          <img
                            src={getImageUrl(figure.image)}
                            alt={figure.name}
                            className="h-16 w-16 object-cover rounded-full"
                            onError={(e) => {
                              console.error('Failed to load image:', figure.image)
                              e.currentTarget.src = '/placeholder-image.png'
                            }}
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {figure.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {figure.position}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {figure.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          figure.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {figure.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/admin/figures/${figure.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit size={18} />
                          </Link>
                          <DeleteButton
                            id={figure.id}
                            apiEndpoint="/admin/figures"
                            confirmMessage="Yakin ingin menghapus tokoh ini?"
                            onDeleted={loadFigures}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

