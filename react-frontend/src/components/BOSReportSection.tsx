'use client'

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, FileText, Calendar, Search, Eye, X } from 'lucide-react'
import { apiClient } from '../lib/api-client'
import { getImageUrl } from '../lib/utils-image-url'

interface DocumentItem {
  id: string
  nama: string
  fileUrl: string
  fileName?: string
  order: number
}

interface BOSReportSectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    subtitle?: string | null
    subtitleEn?: string | null
    content?: string | null
    contentEn?: string | null
    documentItems?: DocumentItem[] | string | null
  }
  locale?: 'id' | 'en'
}

export function BOSReportSection({ section, locale = 'id' }: BOSReportSectionProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewPdf, setPreviewPdf] = useState<string | null>(null)

  // Debug: Log when previewPdf changes
  useEffect(() => {
    console.log('previewPdf state changed to:', previewPdf)
  }, [previewPdf])

  // Parse documentItems
  let documentItems: DocumentItem[] = []
  if (section.documentItems) {
    if (Array.isArray(section.documentItems)) {
      documentItems = section.documentItems
    } else if (typeof section.documentItems === 'string') {
      try {
        const parsed = JSON.parse(section.documentItems)
        documentItems = Array.isArray(parsed) ? parsed : []
      } catch {
        documentItems = []
      }
    }
  }

  // Debug: Log documentItems structure
  useEffect(() => {
    console.log('=== DOCUMENT ITEMS DEBUG ===')
    console.log('Raw section.documentItems:', section.documentItems)
    console.log('Parsed documentItems:', documentItems)
    documentItems.forEach((item, index) => {
      console.log(`Item ${index}:`, {
        id: item.id,
        nama: item.nama,
        fileUrl: item.fileUrl,
        fileName: item.fileName,
        order: item.order
      })
    })
  }, [section.documentItems, documentItems])

  // Filter out items without fileUrl
  documentItems = documentItems.filter(item => item.fileUrl && item.fileUrl.trim() !== '')

  // Sort by order
  documentItems = documentItems.sort((a, b) => (a.order || 0) - (b.order || 0))

  // Load posts
  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    try {
      const allPosts = await apiClient.get('/admin/posts', false) // No auth needed for public
      const publishedPosts = (Array.isArray(allPosts) ? allPosts : [])
        .filter((post: any) => post.isPublished)
        .sort((a: any, b: any) => {
          const dateA = new Date(a.publishedAt || a.createdAt).getTime()
          const dateB = new Date(b.publishedAt || b.createdAt).getTime()
          return dateB - dateA
        })
        .slice(0, 5) // Show 5 latest posts
      setPosts(publishedPosts)
    } catch (error) {
      console.error('Error loading posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  // Filter documents by search
  const filteredDocuments = documentItems.filter(doc =>
    doc.nama.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const displayTitle = locale === 'en' && section.titleEn ? section.titleEn : section.title
  const displaySubtitle = locale === 'en' && section.subtitleEn ? section.subtitleEn : section.subtitle
  const displayContent = locale === 'en' && section.contentEn ? section.contentEn : section.content

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const getFileExtension = (fileName?: string) => {
    if (!fileName) return 'PDF'
    return fileName.split('.').pop()?.toUpperCase() || 'PDF'
  }

  const handlePreviewClick = (fileUrl: string, itemId: string) => {
    console.log('handlePreviewClick called with:', { fileUrl, itemId })
    if (!fileUrl || fileUrl.trim() === '') {
      console.error('File URL is empty!')
      alert('File URL tidak tersedia. Silakan hubungi administrator.')
      return
    }
    const pdfUrl = getImageUrl(fileUrl)
    console.log('PDF URL generated:', pdfUrl)
    if (!pdfUrl || pdfUrl.trim() === '') {
      console.error('Generated PDF URL is empty!')
      alert('Gagal membuat URL PDF. Silakan coba lagi.')
      return
    }
    setPreviewPdf(pdfUrl)
    console.log('previewPdf state set to:', pdfUrl)
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Title */}
        {displayTitle && (
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            {displayTitle}
          </h1>
        )}

        {displaySubtitle && (
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6 text-center">
            {displaySubtitle}
          </h2>
        )}

        {/* Content */}
        {displayContent && (
          <div 
            className="prose prose-lg max-w-none mb-8 text-gray-700"
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />
        )}

        {/* Documents Section */}
        {documentItems.length > 0 && (
          <div className="mb-12">
            {/* Search Box */}
            <div className="mb-6 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari dokumen..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Documents List */}
            <div className="space-y-3" style={{ position: 'relative', zIndex: 1 }}>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg hover:shadow-md transition-shadow relative"
                    style={{ position: 'relative', zIndex: 1 }}
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <FileText className="text-blue-600 flex-shrink-0" size={24} />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 truncate">{item.nama}</div>
                        {item.fileName && (
                          <div className="text-sm text-gray-500 truncate">
                            {item.fileName} ({getFileExtension(item.fileName)})
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4" style={{ position: 'relative', zIndex: 10 }}>
                      {item.fileUrl && item.fileUrl.trim() !== '' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('=== PREVIEW BUTTON CLICKED ===')
                            console.log('Item ID:', item.id)
                            console.log('File URL:', item.fileUrl)
                            handlePreviewClick(item.fileUrl, item.id)
                          }}
                        onMouseDown={(e) => {
                          console.log('Preview button mouse down event')
                          e.stopPropagation()
                        }}
                        onMouseUp={(e) => {
                          console.log('Preview button mouse up event')
                          e.stopPropagation()
                        }}
                        onTouchStart={(e) => {
                          console.log('Preview button touch start (mobile)')
                          e.stopPropagation()
                        }}
                        style={{ 
                          position: 'relative',
                          zIndex: 11,
                          pointerEvents: 'auto',
                          cursor: 'pointer',
                          userSelect: 'none',
                          WebkitUserSelect: 'none'
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors"
                        aria-label="Preview PDF"
                        tabIndex={0}
                      >
                          <Eye size={18} />
                          <span>Preview</span>
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500 italic">File tidak tersedia</span>
                      )}
                      {item.fileUrl && item.fileUrl.trim() !== '' ? (
                        <a
                          href={getImageUrl(item.fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors pointer-events-auto z-10 relative"
                        >
                          <Download size={18} />
                          <span>Unduh</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Tidak ada dokumen yang ditemukan.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Latest News Section */}
        {!loading && posts.length > 0 && (
          <div className="mt-12 pt-12 border-t border-gray-300">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Berita Terbaru
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const displayPostTitle = locale === 'en' && post.titleEn ? post.titleEn : post.title
                const displayExcerpt = locale === 'en' && post.excerptEn ? post.excerptEn : post.excerpt

                return (
                  <Link
                    key={post.id}
                    to={`/berita/${post.slug}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Image */}
                    {post.featuredImage && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={getImageUrl(post.featuredImage)}
                          alt={displayPostTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      {/* Date */}
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Calendar size={16} className="mr-2" />
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {displayPostTitle}
                      </h3>

                      {/* Excerpt */}
                      {displayExcerpt && (
                        <p className="text-gray-600 text-sm md:text-base line-clamp-3 mb-4">
                          {displayExcerpt}
                        </p>
                      )}

                      {/* Read More Link */}
                      <span className="text-blue-600 font-medium text-sm hover:underline inline-flex items-center">
                        {locale === 'en' ? 'Read More' : 'Selengkapnya'}
                        <span className="ml-1">→</span>
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {documentItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p>Belum ada dokumen yang tersedia.</p>
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      {previewPdf && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => {
            console.log('Modal backdrop clicked')
            setPreviewPdf(null)
          }}
        >
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-2xl flex flex-col"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
              <h3 className="text-lg font-semibold text-gray-900">Preview PDF</h3>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setPreviewPdf(null)
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden bg-gray-100 relative">
              {/* Try Google Docs Viewer first (bypasses X-Frame-Options) */}
              <iframe
                key={previewPdf}
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewPdf)}&embedded=true`}
                className="w-full h-full border-0"
                title="PDF Preview"
                allow="fullscreen"
                onError={() => {
                  console.log('Google Docs Viewer failed')
                }}
              />
              {/* Fallback message if iframe fails */}
              <div className="absolute inset-0 flex items-center justify-center bg-white hidden" id="pdf-fallback">
                <div className="text-center p-8">
                  <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 mb-4">
                    PDF tidak dapat ditampilkan di preview. Silakan unduh untuk melihat.
                  </p>
                  <a
                    href={previewPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download size={18} />
                    <span>Buka PDF di Tab Baru</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-300">
              <a
                href={previewPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <FileText size={18} />
                <span>Buka di Tab Baru</span>
              </a>
              <div className="flex items-center space-x-2">
                <a
                  href={previewPdf}
                  download
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <Download size={18} />
                  <span>Unduh PDF</span>
                </a>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreviewPdf(null)
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

