import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Edit, Eye } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { apiClient } from '../../lib/api-client'
import { DeleteButton } from '../../components/admin/DeleteButton'

export default function PagesPage() {
  const [searchParams] = useSearchParams()
  const slug = searchParams.get('slug')
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPages()
  }, [slug])

  async function loadPages() {
    try {
      const data = await apiClient.get('/admin/pages')
      let filtered = Array.isArray(data) ? data : []
      
      // Filter by slug if provided
      if (slug) {
        filtered = filtered.filter((page: any) => 
          page.slug === slug || 
          page.slug?.includes(`-${slug}`) || 
          page.slug?.startsWith(`${slug}-`)
        )
      }
      
      setPages(filtered)
    } catch (error) {
      console.error('Error loading pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const pageTitle = slug === 'smp' 
    ? 'Kelola Halaman SMP' 
    : slug === 'sma' 
    ? 'Kelola Halaman SMA' 
    : 'Kelola Halaman'

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
            <div>
              <h1 className="text-3xl font-bold">{pageTitle}</h1>
              {slug && (
                <p className="text-sm text-gray-500 mt-1">
                  Menampilkan halaman untuk {slug.toUpperCase()}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              {slug && (
                <Link
                  to="/admin/pages"
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <span>Semua Halaman</span>
                </Link>
              )}
              <Link
                to="/admin/pages/new"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Tambah Halaman</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judul
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penulis
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {slug 
                        ? `Tidak ada halaman ditemukan untuk ${slug.toUpperCase()}` 
                        : 'Tidak ada halaman ditemukan'}
                    </td>
                  </tr>
                ) : (
                  pages.map((page) => (
                    <tr key={page.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{page.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {page.slug === '/' || page.slug === 'beranda' ? '/' : `/${page.slug}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            page.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {page.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{page.authorName || 'Admin'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <a
                            href={page.slug === '/' || page.slug === 'beranda' ? '/' : `/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                            title="Lihat Halaman"
                          >
                            <Eye size={18} />
                          </a>
                          {/* Hide Hero action for beranda/home page */}
                          {(page.slug !== '/' && page.slug !== 'beranda') && (
                            <Link
                              to={`/admin/pages/${page.id}/hero`}
                              className="text-green-600 hover:text-green-900"
                              title="Kelola Hero"
                            >
                              <span className="text-xs">Hero</span>
                            </Link>
                          )}
                          <Link
                            to={`/admin/pages/${page.id}/sections`}
                            className="text-purple-600 hover:text-purple-900"
                            title="Kelola Sections"
                          >
                            <span className="text-xs">Section</span>
                          </Link>
                          <Link
                            to={`/admin/pages/${page.id}`}
                            className="text-primary-600 hover:text-primary-900"
                            title="Edit Halaman"
                          >
                            <Edit size={18} />
                          </Link>
                          <DeleteButton
                            id={page.id}
                            apiEndpoint="/admin/pages"
                            confirmMessage="Yakin ingin menghapus halaman ini?"
                            onDeleted={loadPages}
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

