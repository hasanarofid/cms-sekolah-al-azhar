import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { BlockRenderer } from '../components/BlockRenderer'
import { HeroSlider } from '../components/HeroSlider'
import { PageSections } from '../components/PageSections'
import { apiClient } from '../lib/api-client'
import { getImageUrl } from '../lib/utils-image-url'
import { useSettings } from '../lib/use-settings'
import { useSEO } from '../lib/use-seo'
import NotFound from './NotFound'

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
  const [seo, setSeo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Apply settings (favicon, title) ke document
  useSettings(settings)
  
  // Apply SEO meta tags
  useSEO(seo, page?.title || category?.name || settings.website_title?.value || 'Halaman')

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
          try {
            // Load blocks, heroes, sections, and SEO
            const [blocks, heroesData, sections, seoDataRaw] = await Promise.all([
              apiClient.get(`/admin/pages/${foundPage.id}/blocks`).catch(() => []),
              apiClient.get(`/admin/pages/${foundPage.id}/hero`).catch(() => []),
              apiClient.get(`/admin/pages/${foundPage.id}/sections`).catch(() => []),
              apiClient.get(`/admin/seo?pageType=page&pageId=${foundPage.id}`, false).catch(() => 
                apiClient.get('/admin/seo?pageType=global', false).catch(() => null)
              ),
            ])
            
            // Merge page data with SEO
            let seoData: any
            if (seoDataRaw) {
              seoData = {
                ...seoDataRaw,
                title: seoDataRaw.title || foundPage.seoTitle || foundPage.title,
                description: seoDataRaw.description || foundPage.seoDescription || foundPage.excerpt || foundPage.content?.substring(0, 160),
                image: seoDataRaw.image || foundPage.featuredImage,
                ogTitle: seoDataRaw.ogTitle || foundPage.seoTitle || foundPage.title,
                ogDescription: seoDataRaw.ogDescription || foundPage.seoDescription || foundPage.excerpt || foundPage.content?.substring(0, 200),
                ogImage: seoDataRaw.ogImage || foundPage.featuredImage,
              }
            } else {
              // Create SEO from page data
              seoData = {
                title: foundPage.seoTitle || foundPage.title,
                description: foundPage.seoDescription || foundPage.excerpt || foundPage.content?.substring(0, 160),
                keywords: foundPage.seoKeywords,
                image: foundPage.featuredImage,
                ogTitle: foundPage.seoTitle || foundPage.title,
                ogDescription: foundPage.seoDescription || foundPage.excerpt || foundPage.content?.substring(0, 200),
                ogImage: foundPage.featuredImage,
                ogType: 'website',
              }
            }
            
            // Ensure blocks have valid data structure
            const validBlocks = (Array.isArray(blocks) ? blocks : []).map((b: any) => {
              // Ensure data is properly structured
              if (b.data && typeof b.data === 'string') {
                try {
                  b.data = JSON.parse(b.data)
                } catch (e) {
                  console.error('Error parsing block data:', e, 'Block:', b)
                  b.data = {}
                }
              }
              return b
            }).filter((b: any) => b.isActive && b.id && b.id !== foundPage.id).sort((a: any, b: any) => a.order - b.order)
            
            // Process heroes - filter active and sort by order
            const heroes = (Array.isArray(heroesData) ? heroesData : [])
              .filter((h: any) => h.isActive !== false)
              .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
            
            // Process sections - filter active and sort by order
            const processedSections = (Array.isArray(sections) ? sections : [])
              .filter((s: any) => s.isActive !== false)
              .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
            
            foundPage.blocks = validBlocks
            foundPage.heroes = heroes
            foundPage.sections = processedSections
            console.log('Loaded blocks for page:', foundPage.id, 'Blocks:', validBlocks.length, 'Heroes:', heroes.length, 'Sections:', processedSections.length)
            console.log('Sections data:', processedSections)
            console.log('Video-profile sections:', processedSections.filter((s: any) => s.type === 'video-profile'))
            
            setSeo(seoData)
          } catch (error) {
            console.error('Error loading blocks:', error)
            foundPage.blocks = []
            foundPage.heroes = []
            foundPage.sections = []
          }
          setPage(foundPage)
        } else if (foundCategory) {
          const posts = await apiClient.get('/admin/posts').then((p: any[]) => 
            p.filter((post: any) => post.isPublished && post.categoryId === foundCategory.id)
          )
          foundCategory.posts = posts
          setCategory(foundCategory)
          
          // Load SEO for category
          try {
            const categorySeo = await apiClient.get(`/admin/seo?pageType=category&pageSlug=${slug}`, false).catch(() => 
              apiClient.get('/admin/seo?pageType=global', false).catch(() => null)
            )
            if (categorySeo) {
              categorySeo.title = categorySeo.title || foundCategory.name
              categorySeo.description = categorySeo.description || foundCategory.description || foundCategory.descriptionEn
            } else {
              setSeo({
                title: foundCategory.name,
                description: foundCategory.description || foundCategory.descriptionEn,
                ogType: 'website',
              })
            }
            if (categorySeo) setSeo(categorySeo)
          } catch {
            // Use global SEO as fallback
            const globalSeo = await apiClient.get('/admin/seo?pageType=global', false).catch(() => null)
            if (globalSeo) setSeo(globalSeo)
          }
        } else {
          setNotFound(true)
          return
        }

        // Filter menus dengan struktur yang sama seperti HomePage
        const filteredMenus = menusData
          .filter((menu: any) => !menu.parentId && menu.isActive)
          .map((menu: any) => ({
            ...menu,
            titleEn: menu.titleEn ?? undefined,
            children: (menu.children || [])
              .filter((child: any) => child.isActive)
              .map((child: any) => ({
                ...child,
                titleEn: child.titleEn ?? undefined,
                children: (child.children || [])
                  .filter((grandchild: any) => grandchild.isActive)
                  .map((grandchild: any) => ({
                    ...grandchild,
                    titleEn: grandchild.titleEn ?? undefined,
                  })),
              })),
          }))
          .sort((a: any, b: any) => a.order - b.order)

        setMenus(filteredMenus)
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

  if (notFound) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation 
          menus={menus} 
          locale={locale}
          logo={settings.website_logo?.value || null}
          websiteName={settings.website_title?.value || null}
          showWebsiteName={settings.show_website_name?.value === 'true'}
        />
        <NotFound withoutLayout={true} />
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
  
  // Check if page has custom heroes or sections
  const hasPageHeroes = page.heroes && Array.isArray(page.heroes) && page.heroes.length > 0
  const hasPageSections = page.sections && page.sections.length > 0

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation 
        menus={menus} 
        locale={locale}
        logo={settings.website_logo?.value || null}
        websiteName={settings.website_title?.value || null}
        showWebsiteName={settings.show_website_name?.value === 'true'}
      />
      
      {/* Page Heroes (custom heroes per page) - Use HeroSlider like homepage */}
      {hasPageHeroes ? (
        <HeroSlider sliders={page.heroes} locale={locale} />
      ) : hasHeroSlider && heroSliderBlock ? (
        <BlockRenderer blocks={[heroSliderBlock]} locale={locale} />
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
        <>
          {page.featuredImage && (
            <div className="h-64 md:h-80 lg:h-96 bg-gradient-to-r from-gray-200 to-gray-300 relative pt-20 overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src={getImageUrl(page.featuredImage)}
                  alt={page.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', page.featuredImage)
                    e.currentTarget.src = '/placeholder-image.png'
                  }}
                />
                {/* Gradient overlay untuk readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Page Sections (custom sections per page) */}
      {hasPageSections && (
        <PageSections sections={page.sections} locale={locale} />
      )}

      {/* Render all blocks if available, otherwise render page content */}
      {allBlocks && allBlocks.length > 0 ? (
        <div className="bg-white">
          <BlockRenderer blocks={allBlocks} locale={locale} />
        </div>
      ) : !hasPageSections ? (
        // Only show content if there are no blocks or if hero-slider is not present
        <div className="bg-gradient-to-b from-gray-50 to-white">
          {/* Modern Hero Section */}
          {!needsSpecialHeader && !isAcademicTemplate && (
            <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16 md:py-24 overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
              </div>
              
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    {locale === 'en' && page.titleEn ? page.titleEn : page.title}
                  </h1>
                  {page.excerpt && (
                    <p className="text-xl md:text-2xl text-primary-100 leading-relaxed">
                      {locale === 'en' && page.excerptEn ? page.excerptEn : page.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content Section */}
          <article className={`${needsSpecialHeader || isAcademicTemplate ? 'bg-white' : ''} ${needsSpecialHeader || isAcademicTemplate ? 'py-12 md:py-16' : 'py-16 md:py-24'}`}>
            <div className={`${needsSpecialHeader || isAcademicTemplate ? 'max-w-5xl' : 'max-w-4xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
              {(page.content || page.contentEn) && (
                <div
                  className={`prose prose-lg md:prose-xl max-w-none 
                    prose-headings:text-gray-900 prose-headings:font-bold
                    prose-h1:text-4xl prose-h1:md:text-5xl prose-h1:mb-6 prose-h1:mt-8
                    prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-primary-600
                    prose-h3:text-2xl prose-h3:md:text-3xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-gray-800
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-base prose-p:md:text-lg prose-p:mb-4
                    prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                    prose-li:text-gray-700 prose-li:mb-2
                    prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                    prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
                    prose-code:text-primary-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
                    prose-hr:border-gray-300 prose-hr:my-8
                  `}
                  dangerouslySetInnerHTML={{
                    __html: locale === 'en' && page.contentEn ? page.contentEn : page.content
                  }}
                />
              )}
            </div>
          </article>
        </div>
      ) : null}

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

