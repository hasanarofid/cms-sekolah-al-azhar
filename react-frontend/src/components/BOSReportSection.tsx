'use client'

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, FileText, Calendar, Search } from 'lucide-react'
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
            <div className="space-y-3">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <FileText className="text-blue-600" size={24} />
                      <div>
                        <div className="font-medium text-gray-900">{item.nama}</div>
                        {item.fileName && (
                          <div className="text-sm text-gray-500">
                            {item.fileName} ({getFileExtension(item.fileName)})
                          </div>
                        )}
                      </div>
                    </div>
                    <a
                      href={getImageUrl(item.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download size={18} />
                      <span>Unduh</span>
                    </a>
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
    </section>
  )
}

