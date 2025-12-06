import { useEffect, useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Edit, Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { apiClient } from '../../lib/api-client'
import { DeleteButton } from '../../components/admin/DeleteButton'
import { useFlashMessage } from '../../hooks/useFlashMessage'
import { FlashMessage } from '../../components/admin/FlashMessage'

export default function PagesPage() {
  const { flashMessage } = useFlashMessage()
  const [searchParams] = useSearchParams()
  const slug = searchParams.get('slug')
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadPages()
  }, [slug])

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when search changes
  }, [searchQuery])

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

  // Filter pages based on search query
  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) {
      return pages
    }
    
    const query = searchQuery.toLowerCase()
    return pages.filter((page) => 
      page.title?.toLowerCase().includes(query) ||
      page.slug?.toLowerCase().includes(query) ||
      page.authorName?.toLowerCase().includes(query)
    )
  }, [pages, searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredPages.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPages = filteredPages.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
          {flashMessage.show && (
            <FlashMessage
              message={flashMessage.message}
              type={flashMessage.type}
              onClose={() => {}}
            />
          )}
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

          {/* Search Input */}
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari berdasarkan judul, slug, atau penulis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            {searchQuery && (
              <div className="mt-2 text-sm text-gray-600">
                Menampilkan {filteredPages.length} dari {pages.length} halaman
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Judul
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Slug
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Penulis
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        {searchQuery
                          ? `Tidak ada halaman ditemukan untuk "${searchQuery}"`
                          : slug 
                          ? `Tidak ada halaman ditemukan untuk ${slug.toUpperCase()}` 
                          : 'Tidak ada halaman ditemukan'}
                      </td>
                    </tr>
                  ) : (
                    paginatedPages.map((page) => (
                      <tr key={page.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{page.title}</div>
                          <div className="text-sm text-gray-500 sm:hidden mt-1">
                            {page.slug === '/' || page.slug === 'beranda' ? '/' : `/${page.slug}`}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-sm text-gray-500">
                            {page.slug === '/' || page.slug === 'beranda' ? '/' : `/${page.slug}`}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
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
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-500">{page.authorName || 'Admin'}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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

            {/* Pagination */}
            {filteredPages.length > itemsPerPage && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Selanjutnya
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Menampilkan <span className="font-medium">{startIndex + 1}</span> sampai{' '}
                      <span className="font-medium">
                        {endIndex > filteredPages.length ? filteredPages.length : endIndex}
                      </span>{' '}
                      dari <span className="font-medium">{filteredPages.length}</span> hasil
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => goToPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNum === currentPage
                                  ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return (
                            <span
                              key={pageNum}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          )
                        }
                        return null
                      })}
                      
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

