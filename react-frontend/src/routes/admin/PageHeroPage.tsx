import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Plus, PlayCircle } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { apiClient } from '../../lib/api-client'
import { PageHeroForm } from '../../components/admin/PageHeroForm'
import { DeleteButton } from '../../components/admin/DeleteButton'
import { getImageUrl } from '../../lib/utils-image-url'

export default function PageHeroPage() {
  const { pageId } = useParams<{ pageId: string }>()
  const [page, setPage] = useState<any>(null)
  const [heroes, setHeroes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingHero, setEditingHero] = useState<any | null>(null)

  useEffect(() => {
    loadData()
  }, [pageId])

  async function loadData() {
    try {
      const [pageData, heroesData] = await Promise.all([
        apiClient.get(`/admin/pages/${pageId}`),
        apiClient.get(`/admin/pages/${pageId}/hero`).catch(() => [])
      ])
      setPage(pageData)
      setHeroes(Array.isArray(heroesData) ? heroesData : [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    await loadData()
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

  if (editingHero !== null) {
    return (
      <AdminLayout>
        <div className="w-full">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => setEditingHero(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-3xl font-bold">
                {editingHero.id ? 'Edit Hero' : 'Tambah Hero'} - {page?.title}
              </h1>
            </div>
            <PageHeroForm
              pageId={pageId!}
              hero={editingHero}
              onSuccess={() => {
                setEditingHero(null)
                loadData()
              }}
              onCancel={() => {
                setEditingHero(null)
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/pages"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Hero - {page?.title}</h1>
                <p className="text-sm text-gray-500 mt-1">Kelola hero section untuk halaman ini</p>
              </div>
            </div>
            <button
              onClick={() => setEditingHero({})}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Tambah Hero</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {heroes.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p>Belum ada hero. Tambah hero baru untuk memulai.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preview
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtitle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video
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
                  {heroes.map((hero) => (
                    <tr key={hero.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hero.image ? (
                          <img
                            src={getImageUrl(hero.image)}
                            alt={hero.title}
                            className="h-16 w-32 object-cover rounded"
                          />
                        ) : (
                          <div className="h-16 w-32 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{hero.title || '-'}</div>
                        {hero.titleEn && (
                          <div className="text-sm text-gray-500">{hero.titleEn}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {hero.subtitle || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {hero.videoUrl ? (
                          <a
                            href={hero.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary-600 hover:text-primary-800 space-x-1 text-sm"
                          >
                            <PlayCircle size={16} />
                            <span>YouTube</span>
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{hero.order ?? 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            hero.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {hero.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingHero(hero)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit size={18} />
                          </button>
                          <DeleteButton
                            id={hero.id}
                            apiEndpoint="/admin/page-heroes"
                            confirmMessage="Yakin ingin menghapus hero ini?"
                            onDeleted={handleDelete}
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

