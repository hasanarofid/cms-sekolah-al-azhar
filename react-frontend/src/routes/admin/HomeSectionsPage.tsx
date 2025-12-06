import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { apiClient } from '../../lib/api-client'
import { DeleteButton } from '../../components/admin/DeleteButton'
import { StatusToggleButton } from '../../components/admin/StatusToggleButton'
import { useFlashMessage } from '../../hooks/useFlashMessage'
import { FlashMessage } from '../../components/admin/FlashMessage'

export default function HomeSectionsPage() {
  const { flashMessage } = useFlashMessage()
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSections()
  }, [])

  async function loadSections() {
    try {
      const data = await apiClient.get('/admin/home-sections')
      setSections(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading home sections:', error)
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
          {flashMessage.show && (
            <FlashMessage
              message={flashMessage.message}
              type={flashMessage.type}
              onClose={() => {}}
            />
          )}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Kelola Home Sections</h1>
            <Link
              to="/admin/home-sections/new"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Tambah Section</span>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {sections.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Belum ada section. Klik "Tambah Section" untuk membuat baru.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
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
                  {sections.map((section) => (
                    <tr key={section.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {section.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {section.title || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {section.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          section.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {section.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <StatusToggleButton
                            id={section.id}
                            apiEndpoint="/admin/home-sections"
                            isActive={section.isActive}
                            onToggled={loadSections}
                          />
                          <Link
                            to={`/admin/home-sections/${section.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit size={18} />
                          </Link>
                          <DeleteButton
                            id={section.id}
                            apiEndpoint="/admin/home-sections"
                            confirmMessage="Yakin ingin menghapus section ini?"
                            onDeleted={loadSections}
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

