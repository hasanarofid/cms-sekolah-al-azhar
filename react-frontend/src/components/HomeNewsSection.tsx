'use client'

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { apiClient } from '../lib/api-client'
import { getImageUrl } from '../lib/utils-image-url'
import { ScrollItem } from './ScrollItem'

interface HomeNewsSectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    content?: string | null
    contentEn?: string | null
  }
  locale?: 'id' | 'en'
}

export function HomeNewsSection({ section, locale = 'id' }: HomeNewsSectionProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [limit] = useState(3) // Default 3 posts like reference

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
        .slice(0, limit)
      setPosts(publishedPosts)
    } catch (error) {
      console.error('Error loading posts:', error)
      setPosts([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const displayTitle = locale === 'en' && section.titleEn ? section.titleEn : section.title

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title - Match reference: centered, dark blue, large font */}
        {displayTitle && (
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: '#1e3a8a' }}
            >
              {displayTitle}
            </h2>
          </div>
        )}

        {/* News Grid - 3 columns like reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            const displayPostTitle = locale === 'en' && post.titleEn ? post.titleEn : post.title
            const displayExcerpt = locale === 'en' && post.excerptEn ? post.excerptEn : post.excerpt

            // Format date like reference: "8 Mei 2025"
            const formatDate = (dateString: string | null) => {
              if (!dateString) return ''
              const date = new Date(dateString)
              const months = [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
              ]
              return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
            }

            return (
              <ScrollItem key={post.id} delay={index * 0.1} direction="up">
                <Link
                  to={`/berita/${post.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group block"
                >
                {/* Image */}
                {post.featuredImage && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={getImageUrl(post.featuredImage)}
                      alt={displayPostTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error('Failed to load image:', post.featuredImage)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Date - Match reference style */}
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

                  {/* Read More Link - Match reference */}
                  <span className="text-blue-600 font-medium text-sm hover:underline inline-flex items-center">
                    {locale === 'en' ? 'Read More' : 'Selengkapnya'}
                    <span className="ml-1">→</span>
                  </span>
                </div>
              </Link>
              </ScrollItem>
            )
          })}
        </div>
      </div>
    </section>
  )
}

