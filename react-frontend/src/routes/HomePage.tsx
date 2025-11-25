import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { HeroSlider } from '../components/HeroSlider'
import { HomeSections } from '../components/HomeSections'
import { FAQSection } from '../components/FAQSection'
import { FiguresSection } from '../components/FiguresSection'
import { PartnershipsSection } from '../components/PartnershipsSection'
import { getImageUrl } from '../lib/utils-image-url'
import { apiClient } from '../lib/api-client'
import { useSettings } from '../lib/use-settings'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const [searchParams] = useSearchParams()
  const locale = (searchParams.get('locale') as 'id' | 'en') || 'id'
  
  const [menus, setMenus] = useState<any[]>([])
  const [latestPosts, setLatestPosts] = useState<any[]>([])
  const [sliders, setSliders] = useState<any[]>([])
  const [homeSections, setHomeSections] = useState<any[]>([])
  const [faqs, setFaqs] = useState<any[]>([])
  const [figures, setFigures] = useState<any[]>([])
  const [partnerships, setPartnerships] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)

  // Apply settings (favicon, title) ke document
  useSettings(settings)

  useEffect(() => {
    async function loadData() {
      try {
        const [menusData, postsData, slidersData, homeSectionsData, faqsData, figuresData, partnershipsData, settingsData] = await Promise.all([
          apiClient.get('/admin/menus'),
          apiClient.get('/admin/posts'),
          apiClient.get('/admin/sliders'),
          apiClient.get('/admin/home-sections'),
          apiClient.get('/admin/faqs'),
          apiClient.get('/admin/figures'),
          apiClient.get('/admin/partnerships'),
          apiClient.get('/admin/settings').then((s: any[]) => {
            const obj: any = {}
            s.forEach((item: any) => { obj[item.key] = item })
            return obj
          }),
        ])

        // Filter menus
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

        // Filter posts
        const filteredPosts = postsData
          .filter((p: any) => p.isPublished)
          .sort((a: any, b: any) => 
            new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
          )
          .slice(0, 6)

        // Process home sections
        const processedSections = homeSectionsData.map((section: any) => ({
          ...section,
          images: Array.isArray(section.images) ? section.images : (section.images ? [section.images] : [])
        }))

        setMenus(filteredMenus)
        setLatestPosts(filteredPosts)
        setSliders(slidersData)
        setHomeSections(processedSections)
        setFaqs(faqsData)
        setFigures(figuresData)
        setPartnerships(partnershipsData)
        setSettings(settingsData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

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

  return (
    <div className="min-h-screen">
      {/* Hero Slider Section with Navigation Overlay */}
      {sliders.length > 0 ? (
        <div className="relative">
          <Navigation 
            menus={menus} 
            locale={locale}
            logo={settings.website_logo?.value || null}
            websiteName={settings.website_title?.value || null}
            showWebsiteName={settings.show_website_name?.value === 'true'}
          />
          <HeroSlider sliders={sliders} locale={locale} />
        </div>
      ) : (
        <>
          <Navigation 
            menus={menus} 
            locale={locale}
            logo={settings.website_logo?.value || null}
            websiteName={settings.website_title?.value || null}
            showWebsiteName={settings.show_website_name?.value === 'true'}
          />
          {/* Hero Section (Fallback if no sliders) */}
          <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  Al Azhar International Islamic Boarding School
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-primary-100">
                  Qur'anic Learning, Courtesy Oriented and World Class Education
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/pendaftaran"
                    className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors inline-flex items-center justify-center"
                  >
                    Pendaftaran Murid Baru
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Home Sections */}
      <HomeSections sections={homeSections} locale={locale} />

      {/* FAQ Section */}
      <FAQSection faqs={faqs} locale={locale} />

      {/* Latest News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(settings.news_section_quote?.value || settings.news_section_quote?.valueEn) && (
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-serif italic text-gray-900 mb-4">
                "{settings.news_section_quote?.value}"
              </h2>
            </div>
          )}
          
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              {settings.news_section_title?.value || 'Berita Terbaru'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post: any) => (
              <Link key={post.id} to={`/berita/${post.slug}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  {post.featuredImage && (
                    <div className="h-48 bg-gray-200 relative">
                      <img
                        src={getImageUrl(post.featuredImage)}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Failed to load image:', post.featuredImage)
                          e.currentTarget.src = '/placeholder-image.png'
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">
                      {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-gray-900">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                      Selengkapnya →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Figures Section */}
      <FiguresSection 
        figures={figures} 
        locale={locale}
        sectionTitle={settings.figures_section_title?.value || 'Tokoh-Tokoh Al Azhar IIBS'}
        sectionTitleEn={settings.figures_section_title_en?.value || undefined}
        backgroundImage={settings.figures_section_background?.value || undefined}
      />

      {/* Partnerships Section */}
      <PartnershipsSection partnerships={partnerships} locale={locale} />

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

