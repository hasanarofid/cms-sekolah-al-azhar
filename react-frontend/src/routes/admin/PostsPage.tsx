import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Eye } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { apiClient } from '../../lib/api-client'
import { DeleteButton } from '../../components/admin/DeleteButton'
import { useFlashMessage } from '../../hooks/useFlashMessage'
import { FlashMessage } from '../../components/admin/FlashMessage'

export default function PostsPage() {
  const { flashMessage } = useFlashMessage()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    try {
      const data = await apiClient.get('/admin/posts')
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading posts:', error)
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
            <h1 className="text-3xl font-bold">Kelola Berita</h1>
            <Link
              to="/admin/posts/new"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Tambah Post Baru</span>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judul
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penulis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Tidak ada post ditemukan
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {post.category || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{post.authorName || 'Admin'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {post.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <a
                            href={`/berita/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye size={18} />
                          </a>
                          <Link
                            to={`/admin/posts/${post.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit size={18} />
                          </Link>
                          <DeleteButton
                            id={post.id}
                            apiEndpoint="/admin/posts"
                            confirmMessage="Yakin ingin menghapus post ini?"
                            onDeleted={loadPosts}
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

