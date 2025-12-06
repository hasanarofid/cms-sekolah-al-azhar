import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, PlayCircle } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { apiClient } from '../../lib/api-client'
import { DeleteButton } from '../../components/admin/DeleteButton'
import { getImageUrl } from '../../lib/utils-image-url'
import { useFlashMessage } from '../../hooks/useFlashMessage'
import { FlashMessage } from '../../components/admin/FlashMessage'

export default function SlidersPage() {
  const { flashMessage } = useFlashMessage()
  const [sliders, setSliders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSliders()
  }, [])

  async function loadSliders() {
    try {
      setLoading(true)
      const data = await apiClient.get('/admin/sliders', true) // Include auth for admin
      setSliders(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error('Error loading sliders:', error)
      setError(error.message || 'Gagal memuat data sliders')
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

  if (error) {
    return (
      <AdminLayout>
        <div className="w-full">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <button
              onClick={loadSliders}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Coba Lagi
            </button>
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Kelola Slider</h1>
            <Link
              to="/admin/sliders/new"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Tambah Slider</span>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {sliders.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p>Belum ada slider. Tambah slider baru untuk memulai.</p>
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
                  {sliders.map((slider) => (
                    <tr key={slider.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {slider.image ? (
                          <img
                            src={getImageUrl(slider.image)}
                            alt={slider.title}
                            className="h-16 w-32 object-cover rounded"
                            onError={(e) => {
                              const imgSrc = e.currentTarget.src;
                              console.error('Failed to load image:', {
                                originalPath: slider.image,
                                fullUrl: imgSrc,
                                sliderId: slider.id
                              });
                              // Don't set placeholder, just log the error
                              // e.currentTarget.style.display = 'none';
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', getImageUrl(slider.image));
                            }}
                          />
                        ) : (
                          <div className="h-16 w-32 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{slider.title}</div>
                        {slider.titleEn && (
                          <div className="text-sm text-gray-500">{slider.titleEn}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {slider.subtitle || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {slider.videoUrl ? (
                          <a
                            href={slider.videoUrl}
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
                        <div className="text-sm text-gray-500">{slider.order}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            slider.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {slider.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/admin/sliders/${slider.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit size={18} />
                          </Link>
                          <DeleteButton
                            id={slider.id}
                            apiEndpoint="/admin/sliders"
                            confirmMessage="Yakin ingin menghapus slider ini?"
                            onDeleted={loadSliders}
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

