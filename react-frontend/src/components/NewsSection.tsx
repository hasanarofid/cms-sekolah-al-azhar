'use client'

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../lib/api-client'
import { getImageUrl } from '../lib/utils-image-url'

interface NewsSectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    content?: string | null
    contentEn?: string | null
    image?: string | null
  }
  locale?: 'id' | 'en'
}

export function NewsSection({ section, locale = 'id' }: NewsSectionProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [limit] = useState(6) // Default limit, bisa diubah dari section content

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    try {
      const allPosts = await apiClient.get('/admin/posts')
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
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {(section.title || section.content) && (
          <div className="text-center mb-12">
            {section.title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {locale === 'en' && section.titleEn ? section.titleEn : section.title}
              </h2>
            )}
            {section.content && (
              <div 
                className="text-lg text-gray-600 max-w-3xl mx-auto prose prose-lg"
                dangerouslySetInnerHTML={{ 
                  __html: locale === 'en' && section.contentEn ? section.contentEn : section.content 
                }}
              />
            )}
          </div>
        )}

        {/* News Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/berita/${post.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {post.featuredImage && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={getImageUrl(post.featuredImage)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error('Failed to load image:', post.featuredImage)
                        e.currentTarget.src = '/placeholder-image.png'
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-3">
                    {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {locale === 'en' && post.titleEn ? post.titleEn : post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {locale === 'en' && post.excerptEn ? post.excerptEn : post.excerpt}
                    </p>
                  )}
                  <span className="text-primary-600 font-medium text-sm hover:underline">
                    {locale === 'en' ? 'Read More →' : 'Selengkapnya →'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              {locale === 'en' ? 'No news available yet.' : 'Belum ada berita tersedia.'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

