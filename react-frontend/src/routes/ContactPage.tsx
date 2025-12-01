import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { PageSections } from '../components/PageSections'
import { apiClient } from '../lib/api-client'
import { useSettings } from '../lib/use-settings'
import { useSEO } from '../lib/use-seo'

export default function ContactPage() {
  const [searchParams] = useSearchParams()
  const locale = (searchParams.get('locale') as 'id' | 'en') || 'id'

  const [menus, setMenus] = useState<any[]>([])
  const [page, setPage] = useState<any>(null)
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)

  // Apply settings (favicon, title) ke document
  useSettings(settings)
  
  // Apply SEO meta tags
  useSEO(page?.seo || null, settings.website_title?.value || 'SMA AL AZHAR INSAN CENDEKIA JATIBENING')

  useEffect(() => {
    async function loadData() {
      try {
        const [menusData, settingsData] = await Promise.all([
          apiClient.get('/admin/menus'),
          apiClient.get('/admin/settings').then((s: any[]) => {
            const obj: any = {}
            s.forEach((item: any) => { obj[item.key] = item })
            return obj
          }),
        ])

        const filteredMenus = menusData
          .filter((m: any) => !m.parentId && m.isActive)
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

        // Load page by slug 'kontak' - same approach as DynamicPage
        try {
          const pagesData = await apiClient.get('/admin/pages')
          const foundPage = pagesData.find((p: any) => p.slug === 'kontak' && p.isPublished)
          
          if (foundPage) {
            // Load sections for this page
            const [sections, seoDataRaw] = await Promise.all([
              apiClient.get(`/admin/pages/${foundPage.id}/sections`).catch(() => []),
              apiClient.get(`/admin/seo?pageType=page&pageId=${foundPage.id}`, false).catch(() => 
                apiClient.get('/admin/seo?pageType=global', false).catch(() => null)
              ),
            ])
            
            // Merge page data with sections and SEO
            let seoData: any
            if (seoDataRaw) {
              seoData = Array.isArray(seoDataRaw) ? seoDataRaw[0] : seoDataRaw
            }
            
            setPage({
              ...foundPage,
              sections: sections || [],
              seo: seoData || null,
            })
          } else {
            console.warn('Page with slug "kontak" not found or not published')
          }
        } catch (error) {
          console.error('Error loading page:', error)
        }
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

  const hasPageSections = page?.sections && Array.isArray(page.sections) && page.sections.length > 0

  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        menus={menus} 
        locale={locale}
        logo={settings.website_logo?.value || null}
        websiteName={settings.website_title?.value || null}
        showWebsiteName={settings.show_website_name?.value === 'true'}
      />

      {/* Hero Section - Blue Background */}
      <div className="bg-primary-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            {locale === 'en' && page?.titleEn ? page.titleEn : (page?.title || (locale === 'en' ? 'Contact' : 'Kontak'))}
          </h1>
        </div>
      </div>

      {/* Page Sections (custom sections per page) */}
      {hasPageSections && (
        <PageSections sections={page.sections} locale={locale} />
      )}

      {/* Fallback jika tidak ada sections */}
      {!hasPageSections && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-500">
            {locale === 'en' ? 'No content available.' : 'Konten belum tersedia.'}
          </p>
        </div>
      )}

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

