import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { HeroSlider } from '../components/HeroSlider'
import { SectionRenderer } from '../components/SectionRenderer'
import { FAQSection } from '../components/FAQSection'
import { FiguresSection } from '../components/FiguresSection'
import { PartnershipsSection } from '../components/PartnershipsSection'
import { ScrollAnimationWrapper } from '../components/ScrollAnimationWrapper'
import { apiClient } from '../lib/api-client'
import { useSettings } from '../lib/use-settings'
import { useSEO } from '../lib/use-seo'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const [searchParams] = useSearchParams()
  const locale = (searchParams.get('locale') as 'id' | 'en') || 'id'
  
  const [menus, setMenus] = useState<any[]>([])
  const [, setLatestPosts] = useState<any[]>([])
  const [sliders, setSliders] = useState<any[]>([])
  const [homeSections, setHomeSections] = useState<any[]>([])
  const [faqs, setFaqs] = useState<any[]>([])
  const [figures, setFigures] = useState<any[]>([])
  const [partnerships, setPartnerships] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [seo, setSeo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeVideo, setActiveVideo] = useState<{ sectionId: string; videoId: string } | null>(null)

  // Apply settings (favicon, title) ke document
  useSettings(settings)
  
  // Apply SEO meta tags
  useSEO(seo, settings.website_title?.value || 'SMA AL AZHAR INSAN CENDEKIA JATIBENING')

  useEffect(() => {
    async function loadData() {
      try {
        const [menusData, postsData, slidersData, homeSectionsData, faqsData, figuresData, partnershipsData, settingsData, seoData] = await Promise.all([
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
          apiClient.get('/admin/seo?pageType=global', false).catch(() => null),
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
        
        // Debug: Log sliders data
        if (import.meta.env.DEV) {
          console.log('Loaded sliders:', slidersData)
          console.log('Active sliders:', slidersData.filter((s: any) => s.isActive !== false))
        }
        
        setSliders(slidersData)
        setHomeSections(processedSections)
        setFaqs(faqsData)
        setFigures(figuresData)
        setPartnerships(partnershipsData)
        setSettings(settingsData)
        setSeo(seoData)
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

      {/* Render all sections in order */}
      {(() => {
        // Sort all sections by order
        const sortedSections = [...homeSections]
          .filter((s: any) => s.isActive)
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))

        const handlePlayVideo = (section: any) => {
          if (!section.videoUrl) return
          const trimmed = section.videoUrl.trim()
          const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
          const match = trimmed.match(youtubeRegex)
          if (match && match[1]) {
            setActiveVideo({ sectionId: section.id, videoId: match[1] })
          } else {
            window.open(section.videoUrl, '_blank', 'noopener,noreferrer')
          }
        }

        // Group consecutive video-profile sections together
        const renderedSections: React.ReactElement[] = []
        let i = 0
        
        while (i < sortedSections.length) {
          const section = sortedSections[i]
          
          // If it's a video-profile, collect all consecutive video-profiles
          if (section.type === 'video-profile') {
            const videoProfiles: any[] = [section]
            i++
            while (i < sortedSections.length && sortedSections[i].type === 'video-profile') {
              videoProfiles.push(sortedSections[i])
              i++
            }
            
            // Render grouped video profiles
            renderedSections.push(
              <ScrollAnimationWrapper key={`video-group-${videoProfiles[0].id}`} delay={0}>
                <section className="py-8 md:py-10 lg:py-12 bg-white">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      {videoProfiles.map((videoSection: any) => (
                        <SectionRenderer
                          key={videoSection.id}
                          section={videoSection}
                          locale={locale}
                          activeVideo={activeVideo}
                          onPlayVideo={handlePlayVideo}
                          onCloseVideo={() => setActiveVideo(null)}
                          isGrouped={true}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              </ScrollAnimationWrapper>
            )
          } else {
            // Render other sections individually
            renderedSections.push(
              <ScrollAnimationWrapper key={section.id} delay={0}>
                <SectionRenderer
                  section={section}
                  locale={locale}
                  activeVideo={activeVideo}
                  onPlayVideo={handlePlayVideo}
                  onCloseVideo={() => setActiveVideo(null)}
                />
              </ScrollAnimationWrapper>
            )
            i++
          }
        }

        return renderedSections
      })()}

      {/* FAQ Section - Only show if no FAQ section in HomeSections */}
      {(() => {
        const hasFAQSection = homeSections.some((s: any) => s.type === 'faq' && s.isActive)
        if (!hasFAQSection && faqs.length > 0) {
          return (
            <ScrollAnimationWrapper delay={0}>
              <FAQSection faqs={faqs} locale={locale} />
            </ScrollAnimationWrapper>
          )
        }
        return null
      })()}

     

      {/* Figures Section */}
      <ScrollAnimationWrapper delay={0}>
        <FiguresSection 
          figures={figures} 
          locale={locale}
          sectionTitle={settings.figures_section_title?.value || 'Tokoh-Tokoh SMA AL AZHAR INSAN CENDEKIA JATIBENING'}
          sectionTitleEn={settings.figures_section_title_en?.value || undefined}
          backgroundImage={settings.figures_section_background?.value || undefined}
        />
      </ScrollAnimationWrapper>

      {/* Partnerships Section */}
      <ScrollAnimationWrapper delay={0}>
        <PartnershipsSection partnerships={partnerships} locale={locale} />
      </ScrollAnimationWrapper>

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

