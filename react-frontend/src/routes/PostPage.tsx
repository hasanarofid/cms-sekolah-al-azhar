import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { apiClient } from '../lib/api-client'
import { useSettings } from '../lib/use-settings'
import { useSEO } from '../lib/use-seo'
import { getImageUrl } from '../lib/utils-image-url'
import { Search, ChevronRight } from 'lucide-react'

export default function PostPage() {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const slug = params?.slug as string
  const locale = (searchParams.get('locale') as 'id' | 'en') || 'id'

  const [post, setPost] = useState<any>(null)
  const [menus, setMenus] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [seo, setSeo] = useState<any>(null)
  const [latestPosts, setLatestPosts] = useState<any[]>([])
  const [nextPost, setNextPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Apply settings (favicon, title) ke document
  useSettings(settings)
  
  // Apply SEO meta tags - use post SEO if available, otherwise global
  useSEO(seo, post?.title || settings.website_title?.value || 'Berita')

  useEffect(() => {
      async function loadData() {
      try {
        const [postData, menusData, settingsData, postsData] = await Promise.all([
          apiClient.get(`/admin/posts`).then((posts: any[]) => posts.find((p: any) => p.slug === slug && p.isPublished)),
          apiClient.get('/admin/menus'),
          apiClient.get('/admin/settings').then((s: any[]) => {
            const obj: any = {}
            s.forEach((item: any) => { obj[item.key] = item })
            return obj
          }),
          apiClient.get('/admin/posts').then((posts: any[]) => posts.filter((p: any) => p.isPublished)),
        ])
        
        // Load SEO for this post
        let seoData = null
        if (postData) {
          try {
            // Try to get post-specific SEO
            seoData = await apiClient.get(`/admin/seo?pageType=post&pageId=${postData.id}`, false)
          } catch {
            // Fallback to global SEO
            seoData = await apiClient.get('/admin/seo?pageType=global', false).catch(() => null)
          }
          
          // Merge post data with SEO
          if (seoData) {
            seoData = {
              ...seoData,
              title: seoData.title || postData.title,
              description: seoData.description || postData.excerpt || postData.content?.substring(0, 160),
              image: seoData.image || postData.featuredImage,
              ogTitle: seoData.ogTitle || postData.title,
              ogDescription: seoData.ogDescription || postData.excerpt || postData.content?.substring(0, 200),
              ogImage: seoData.ogImage || postData.featuredImage,
            }
          } else {
            // Create SEO from post data
            seoData = {
              title: postData.title,
              description: postData.excerpt || postData.content?.substring(0, 160),
              image: postData.featuredImage,
              ogTitle: postData.title,
              ogDescription: postData.excerpt || postData.content?.substring(0, 200),
              ogImage: postData.featuredImage,
              ogType: 'article',
            }
          }
        }

        if (!postData) {
          navigate('/404')
          return
        }

        setPost(postData)
        setMenus(menusData.filter((m: any) => !m.parentId && m.isActive))
        
        const publishedPosts = postsData.sort((a: any, b: any) => 
          new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
        )
        const currentIndex = publishedPosts.findIndex((p: any) => p.id === postData.id)
        setNextPost(currentIndex > 0 ? publishedPosts[currentIndex - 1] : null)
        setLatestPosts(publishedPosts.filter((p: any) => p.id !== postData.id).slice(0, 5))
        setSettings(settingsData)
        setSeo(seoData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadData()
    }
  }, [slug, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        menus={menus} 
        locale={locale}
        logo={settings.website_logo?.value || null}
        websiteName={settings.website_title?.value || null}
        showWebsiteName={settings.show_website_name?.value === 'true'}
      />

      <div className="bg-primary-600 text-white py-24 md:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
            {locale === 'en' && post.titleEn ? post.titleEn : post.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-200 text-sm md:text-base mt-6">
            <span>{post.publishedAt && new Date(post.publishedAt).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            <span>•</span>
            <span>{post.category || 'alazhar'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
            {post.featuredImage && (
              <div className="mb-8">
                <img
                  src={getImageUrl(post.featuredImage)}
                  alt={post.title}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            )}


            <div
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{
                __html: locale === 'en' && post.contentEn ? post.contentEn : post.content
              }}
            />

            {nextPost && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <Link 
                  to={`/berita/${nextPost.slug}`}
                  className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  <span>Next</span>
                  <ChevronRight size={20} className="ml-2" />
                  <span className="ml-2">
                    {locale === 'en' && nextPost.titleEn ? nextPost.titleEn : nextPost.title}
                  </span>
                </Link>
              </div>
            )}
          </article>

          <aside className="lg:col-span-1">
            <div className="mb-8">
              <form className="flex">
                <input
                  type="search"
                  placeholder="Cari..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded-r-lg hover:bg-orange-600 transition-colors"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Berita Terbaru</h3>
              <ul className="space-y-3">
                {latestPosts.map((latestPost: any) => (
                  <li key={latestPost.id}>
                    <Link
                      to={`/berita/${latestPost.slug}`}
                      className="text-gray-700 hover:text-primary-600 transition-colors block"
                    >
                      {locale === 'en' && latestPost.titleEn ? latestPost.titleEn : latestPost.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <Footer 
        locale={locale}
        logo={settings.website_logo?.value || null}
        websiteName={settings.website_title?.value || null}
        address={settings.footer_address?.value || null}
        phone={settings.footer_phone?.value || null}
        email={settings.footer_email?.value || null}
        facebookUrl={settings.facebook_url?.value || null}
        instagramUrl={settings.instagram_url?.value || null}
        youtubeUrl={settings.youtube_url?.value || null}
      />

      <WhatsAppButton 
        phoneNumber={settings.whatsapp_phone?.value || null}
        defaultMessage={settings.whatsapp_message?.value || null}
      />
    </div>
  )
}

