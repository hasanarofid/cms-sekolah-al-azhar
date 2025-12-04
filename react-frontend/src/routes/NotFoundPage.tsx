import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { apiClient } from '../lib/api-client'
import { useSettings } from '../lib/use-settings'
import { useSEO } from '../lib/use-seo'

export default function NotFoundPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const locale = (searchParams.get('locale') as 'id' | 'en') || 'id'

  const [menus, setMenus] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)

  // Apply settings (favicon, title) ke document
  useSettings(settings)
  
  // Apply SEO meta tags
  useSEO(null, settings.website_title?.value || '404 - Halaman Tidak Ditemukan')

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

    loadData()
  }, [])

  // Set document title
  useEffect(() => {
    document.title = locale === 'en' 
      ? '404 - Page Not Found' 
      : '404 - Halaman Tidak Ditemukan'
  }, [locale])

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
    <div className="min-h-screen bg-white">
      <Navigation 
        menus={menus} 
        locale={locale}
        logo={settings.website_logo?.value || null}
        websiteName={settings.website_title?.value || null}
        showWebsiteName={settings.show_website_name?.value === 'true'}
      />

      {/* 404 Content - Centered */}
      <main className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full text-center">
          {/* 404 Illustration SVG */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative mb-6">
              <svg
                className="w-64 h-64 md:w-80 md:h-80"
                viewBox="0 0 400 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Circle */}
                <circle cx="200" cy="120" r="100" fill="#F0FDF4" opacity="0.6"/>
                
                {/* Main Character - Confused Face */}
                <circle cx="200" cy="100" r="50" fill="#10B981" stroke="#059669" strokeWidth="2"/>
                
                {/* Eyes - Confused look */}
                <circle cx="185" cy="90" r="6" fill="#FFFFFF"/>
                <circle cx="215" cy="90" r="6" fill="#FFFFFF"/>
                <circle cx="185" cy="90" r="3" fill="#065F46"/>
                <circle cx="215" cy="90" r="3" fill="#065F46"/>
                
                {/* Confused Mouth */}
                <path
                  d="M 180 115 Q 200 125 220 115"
                  stroke="#065F46"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                
                {/* Paper with 404 */}
                <rect x="130" y="160" width="140" height="80" rx="6" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4"/>
                <rect x="140" y="170" width="120" height="60" rx="4" fill="#F0FDF4"/>
                
                {/* Decorative Elements */}
                <circle cx="80" cy="60" r="15" fill="#86EFAC" opacity="0.5"/>
                <circle cx="320" cy="60" r="12" fill="#86EFAC" opacity="0.5"/>
                <circle cx="80" cy="240" r="12" fill="#86EFAC" opacity="0.5"/>
                <circle cx="320" cy="240" r="15" fill="#86EFAC" opacity="0.5"/>
              </svg>
              
              {/* 404 Text Overlay */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full">
                <div className="bg-white border-2 border-primary-600 rounded-lg px-6 py-4 shadow-lg">
                  <div className="text-6xl md:text-7xl font-bold text-primary-600 mb-2">404</div>
                  <div className="text-sm md:text-base text-gray-600 font-medium">
                    {locale === 'en' ? 'Page Not Found' : 'Halaman Tidak Ditemukan'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 mb-4">
            Oops!
          </h1>
          
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            {locale === 'en' ? 'Halaman yang Anda cari tidak ditemukan' : 'Halaman yang Anda cari tidak ditemukan'}
          </h2>

          {/* Description */}
          <div className="max-w-2xl mx-auto space-y-3 mb-10">
            <p className="text-lg md:text-xl text-gray-600">
              {locale === 'en' 
                ? 'Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.'
                : 'Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.'}
            </p>
            <p className="text-base md:text-lg text-gray-500">
              {locale === 'en'
                ? 'Halaman mungkin telah dihapus, dipindahkan, atau URL yang Anda masukkan salah.'
                : 'Halaman mungkin telah dihapus, dipindahkan, atau URL yang Anda masukkan salah.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="group inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[220px] text-base"
            >
              <Home className="mr-2 h-5 w-5" />
              {locale === 'en' ? 'Kembali ke Beranda' : 'Kembali ke Beranda'}
            </Link>
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1)
                } else {
                  navigate('/')
                }
              }}
              className="group inline-flex items-center justify-center bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg min-w-[220px] text-base"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              {locale === 'en' ? 'Kembali' : 'Kembali'}
            </button>
          </div>
        </div>
      </main>

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

