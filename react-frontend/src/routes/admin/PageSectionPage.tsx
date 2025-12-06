import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Edit } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { apiClient } from '../../lib/api-client'
import { DeleteButton } from '../../components/admin/DeleteButton'
import { StatusToggleButton } from '../../components/admin/StatusToggleButton'
import { PageSectionForm } from '../../components/admin/PageSectionForm'
import { useFlashMessage } from '../../hooks/useFlashMessage'
import { FlashMessage } from '../../components/admin/FlashMessage'

export default function PageSectionPage() {
  const { pageId } = useParams<{ pageId: string }>()
  const { flashMessage, showSuccess } = useFlashMessage()
  const [page, setPage] = useState<any>(null)
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadData()
  }, [pageId])

  async function loadData() {
    try {
      const [pageData, sectionsData] = await Promise.all([
        apiClient.get(`/admin/pages/${pageId}`),
        apiClient.get(`/admin/pages/${pageId}/sections`).catch(() => [])
      ])
      setPage(pageData)
      setSections(Array.isArray(sectionsData) ? sectionsData : [])
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (showForm || editingSection) {
    return (
      <AdminLayout>
        <div className="w-full">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingSection(null)
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-3xl font-bold">
                {editingSection ? 'Edit Section' : 'Tambah Section'} - {page?.title}
              </h1>
            </div>
            <PageSectionForm
              pageId={pageId!}
              section={editingSection}
              onSuccess={() => {
                showSuccess(editingSection ? 'Section berhasil diperbarui!' : 'Section berhasil ditambahkan!')
                setShowForm(false)
                setEditingSection(null)
                loadData()
              }}
              onCancel={() => {
                setShowForm(false)
                setEditingSection(null)
              }}
            />
          </div>
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/pages"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Sections - {page?.title}</h1>
                <p className="text-sm text-gray-500 mt-1">Kelola sections untuk halaman ini</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Tambah Section</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TYPE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TITLE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ORDER
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AKSI
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sections.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Tidak ada section ditemukan. Klik "Tambah Section" untuk menambahkan.
                    </td>
                  </tr>
                ) : (
                  sections.map((section) => (
                    <tr key={section.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">{section.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{section.title || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{section.order}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            section.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {section.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <StatusToggleButton
                            id={section.id}
                            apiEndpoint="/admin/page-sections"
                            isActive={section.isActive}
                            onToggled={loadData}
                          />
                          <button
                            onClick={() => setEditingSection(section)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit size={18} />
                          </button>
                          <DeleteButton
                            id={section.id}
                            apiEndpoint="/admin/page-sections"
                            confirmMessage="Yakin ingin menghapus section ini?"
                            onDeleted={loadData}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

