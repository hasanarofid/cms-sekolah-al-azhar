import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { BlockRenderer } from '../components/BlockRenderer'
import { apiClient } from '../lib/api-client'
import { getImageUrl } from '../lib/utils-image-url'
import { useSettings } from '../lib/use-settings'

export default function DynamicPage() {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const slug = params?.slug as string
  const locale = (searchParams.get('locale') as 'id' | 'en') || 'id'

  const [page, setPage] = useState<any>(null)
  const [category, setCategory] = useState<any>(null)
  const [menus, setMenus] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)

  // Apply settings (favicon, title) ke document
  useSettings(settings)

  useEffect(() => {
    async function loadData() {
      try {
        const [pagesData, categoriesData, menusData, settingsData] = await Promise.all([
          apiClient.get('/admin/pages'),
          apiClient.get('/admin/categories'),
          apiClient.get('/admin/menus'),
          apiClient.get('/admin/settings').then((s: any[]) => {
            const obj: any = {}
            s.forEach((item: any) => { obj[item.key] = item })
            return obj
          }),
        ])

        const foundPage = pagesData.find((p: any) => p.slug === slug && p.isPublished)
        const foundCategory = categoriesData.find((c: any) => c.slug === slug && c.isActive)

        if (foundPage) {
          const blocks = await apiClient.get(`/admin/pages/${foundPage.id}/blocks`).catch(() => [])
          foundPage.blocks = blocks.filter((b: any) => b.isActive).sort((a: any, b: any) => a.order - b.order)
          setPage(foundPage)
        } else if (foundCategory) {
          const posts = await apiClient.get('/admin/posts').then((p: any[]) => 
            p.filter((post: any) => post.isPublished && post.categoryId === foundCategory.id)
          )
          foundCategory.posts = posts
          setCategory(foundCategory)
        } else {
          navigate('/404')
          return
        }

        setMenus(menusData.filter((m: any) => !m.parentId && m.isActive))
        setSettings(settingsData)
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

  if (category) {
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
              {locale === 'en' && category.nameEn ? category.nameEn : category.name}
            </h1>
            {category.description && (
              <p className="text-xl md:text-2xl mt-6 text-gray-200">
                {locale === 'en' && category.descriptionEn ? category.descriptionEn : category.description}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {category.posts && category.posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.posts.map((post: any) => (
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
                      Selengkapnya →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                {locale === 'en' ? 'No content available in this category yet.' : 'Belum ada konten di kategori ini.'}
              </p>
            </div>
          )}
        </div>

        <Footer 
          locale={locale}
          address={settings.footer_address?.value || null}
          phone={settings.footer_phone?.value || null}
          email={settings.footer_email?.value || null}
          androidAppUrl={settings.android_app_url?.value || null}
          iosAppUrl={settings.ios_app_url?.value || null}
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

  if (!page) {
    return null
  }

  const needsSpecialHeader = page.slug === 'tentang-kami' || page.template === 'with-header'
  const isAcademicTemplate = page.template === 'academic-smp' || page.template === 'academic-sma'
  
  // Check if first block is hero-slider (will be rendered separately)
  const hasHeroSlider = page.blocks && page.blocks.length > 0 && page.blocks[0].type === 'hero-slider'
  const heroSliderBlock = hasHeroSlider ? page.blocks[0] : null
  // All blocks will be rendered by BlockRenderer, but hero-slider is rendered separately if it's the first block
  const allBlocks = page.blocks || []

  return (
    <div className="min-h-screen bg-white">
      {hasHeroSlider && heroSliderBlock ? (
        <div className="relative">
          <Navigation 
            menus={menus} 
            locale={locale}
            logo={settings.website_logo?.value || null}
            websiteName={settings.website_title?.value || null}
            showWebsiteName={settings.show_website_name?.value === 'true'}
          />
          <BlockRenderer blocks={[heroSliderBlock]} locale={locale} />
        </div>
      ) : needsSpecialHeader ? (
        <div className="relative bg-primary-600 text-white">
          <Navigation 
            menus={menus} 
            locale={locale}
            logo={settings.website_logo?.value || null}
            websiteName={settings.website_title?.value || null}
            showWebsiteName={settings.show_website_name?.value === 'true'}
          />
          <div className="py-24 md:py-32 lg:py-40 pt-32 md:pt-40 lg:pt-48">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                {locale === 'en' && page.titleEn ? page.titleEn : page.title}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <Navigation 
            menus={menus} 
            locale={locale}
            logo={settings.website_logo?.value || null}
            websiteName={settings.website_title?.value || null}
            showWebsiteName={settings.show_website_name?.value === 'true'}
          />
          {page.featuredImage && (
            <div className="h-64 md:h-96 bg-gray-200 relative pt-20">
              <img
                src={getImageUrl(page.featuredImage)}
                alt={page.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Failed to load image:', page.featuredImage)
                  e.currentTarget.src = '/placeholder-image.png'
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Render all blocks if available, otherwise render page content */}
      {allBlocks && allBlocks.length > 0 ? (
        <div className="bg-white">
          <BlockRenderer blocks={allBlocks} locale={locale} />
        </div>
      ) : (
        // Only show content if there are no blocks or if hero-slider is not present
        <div className="bg-white">
          <article className={`${needsSpecialHeader || isAcademicTemplate ? 'bg-white' : 'max-w-4xl mx-auto'} px-4 sm:px-6 lg:px-8 ${needsSpecialHeader || isAcademicTemplate ? 'py-12 md:py-16' : 'py-12'}`}>
            {!needsSpecialHeader && !isAcademicTemplate && (
              <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                  {locale === 'en' && page.titleEn ? page.titleEn : page.title}
                </h1>
                {page.excerpt && (
                  <p className="text-xl text-gray-600">
                    {locale === 'en' && page.excerptEn ? page.excerptEn : page.excerpt}
                  </p>
                )}
              </header>
            )}

            {(page.content || page.contentEn) && (
              <div
                className={`${needsSpecialHeader ? 'max-w-5xl mx-auto' : ''} prose prose-lg max-w-none`}
                dangerouslySetInnerHTML={{
                  __html: locale === 'en' && page.contentEn ? page.contentEn : page.content
                }}
              />
            )}
          </article>
        </div>
      )}

      <Footer 
        locale={locale}
        address={settings.footer_address?.value || null}
        phone={settings.footer_phone?.value || null}
        email={settings.footer_email?.value || null}
        androidAppUrl={settings.android_app_url?.value || null}
        iosAppUrl={settings.ios_app_url?.value || null}
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

