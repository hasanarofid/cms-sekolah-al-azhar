import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { ContactForm } from '../components/ContactForm'
import { apiClient } from '../lib/api-client'

export default function ContactPage() {
  const [searchParams] = useSearchParams()
  const locale = (searchParams.get('locale') as 'id' | 'en') || 'id'

  const [menus, setMenus] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)

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
      <Navigation 
        menus={menus} 
        locale={locale}
        logo={settings.website_logo?.value || null}
        websiteName={settings.website_title?.value || null}
        showWebsiteName={settings.show_website_name?.value === 'true'}
      />

      <div className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Kontak</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Alamat</h2>
            <p className="text-gray-600 mb-4">
              {settings.footer_address?.value || 'Jl. Raya Solo - Tawangmangu, Gedangan, Salam, Kec. Karangpandan, Kabupaten Karanganyar, Jawa Tengah 57791'}
            </p>
            <div className="space-y-2">
              {settings.footer_phone?.value && (
                <p className="text-gray-600">
                  <strong>Call Center:</strong> {settings.footer_phone.value}
                </p>
              )}
              {settings.footer_email?.value && (
                <p className="text-gray-600">
                  <strong>Email:</strong> {settings.footer_email.value}
                </p>
              )}
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
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

