import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Upload, X, Loader2 } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { getImageUrl } from '../../lib/utils-image-url'

interface Setting {
  id: string
  key: string
  value: string
  valueEn?: string | null
  type: string
}

interface SettingsFormProps {
  settings: Record<string, Setting | undefined>
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)
  
  const [previewBackground, setPreviewBackground] = useState<string | null>(
    settings.figures_section_background?.value ? getImageUrl(settings.figures_section_background.value) : null
  )
  const [previewLogo, setPreviewLogo] = useState<string | null>(
    settings.website_logo?.value ? getImageUrl(settings.website_logo.value) : null
  )
  const [previewFavicon, setPreviewFavicon] = useState<string | null>(
    settings.website_favicon?.value ? getImageUrl(settings.website_favicon.value) : null
  )

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      newsQuote: settings.news_section_quote?.value || 'Integrating Knowledge and Faith for a Brighter Tomorrow',
      newsQuoteEn: settings.news_section_quote?.valueEn || '',
      newsTitle: settings.news_section_title?.value || 'Berita Terbaru',
      newsTitleEn: settings.news_section_title?.valueEn || 'Latest News',
      figuresTitle: settings.figures_section_title?.value || 'Tokoh-Tokoh SMA AL AZHAR INSAN CENDEKIA JATIBENING',
      figuresTitleEn: settings.figures_section_title_en?.value || 'Figures of SMA AL AZHAR INSAN CENDEKIA JATIBENING',
      figuresBackground: settings.figures_section_background?.value || '',
      websiteLogo: settings.website_logo?.value || '',
      websiteFavicon: settings.website_favicon?.value || '',
      websiteTitle: settings.website_title?.value || '',
      showWebsiteName: settings.show_website_name?.value === 'true' || false,
      whatsappPhone: settings.whatsapp_phone?.value || '',
      whatsappMessage: settings.whatsapp_message?.value || 'Assalamualaikum SMA AL AZHAR INSAN CENDEKIA JATIBENING\nMohon info lebih lanjut untuk pendaftaran murid baru\nTerima Kasih',
      footerAddress: settings.footer_address?.value || 'Jl. Raya Solo - Tawangmangu, Gedangan, Salam, Kec. Karangpandan, Kabupaten Karanganyar, Jawa Tengah 57791',
      footerPhone: settings.footer_phone?.value || '0811 2020 101',
      footerEmail: settings.footer_email?.value || 'aaiibs@alazhariibs.sch.id',
      androidAppUrl: settings.android_app_url?.value || '',
      iosAppUrl: settings.ios_app_url?.value || '',
      facebookUrl: settings.facebook_url?.value || '',
      instagramUrl: settings.instagram_url?.value || '',
      youtubeUrl: settings.youtube_url?.value || '',
    }
  })

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const data = await apiClient.upload('/admin/upload', file, 'general')
      const imageUrl = data.url || data.path || ''
      if (!imageUrl) {
        throw new Error('Upload gagal: URL tidak ditemukan dalam response')
      }
      setValue('figuresBackground', imageUrl, { shouldValidate: true })
      setPreviewBackground(getImageUrl(imageUrl))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengupload gambar')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveBackground = () => {
    setValue('figuresBackground', '', { shouldValidate: true })
    setPreviewBackground(null)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB')
      return
    }

    setUploadingLogo(true)
    setError('')

    try {
      const data = await apiClient.upload('/admin/upload', file, 'general')
      const imageUrl = data.url || data.path || ''
      if (!imageUrl) {
        throw new Error('Upload gagal: URL tidak ditemukan dalam response')
      }
      setValue('websiteLogo', imageUrl, { shouldValidate: true })
      setPreviewLogo(getImageUrl(imageUrl))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengupload gambar')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran file maksimal 2MB')
      return
    }

    setUploadingFavicon(true)
    setError('')

    try {
      const data = await apiClient.upload('/admin/upload', file, 'general')
      const imageUrl = data.url || data.path || ''
      if (!imageUrl) {
        throw new Error('Upload gagal: URL tidak ditemukan dalam response')
      }
      setValue('websiteFavicon', imageUrl, { shouldValidate: true })
      setPreviewFavicon(getImageUrl(imageUrl))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengupload gambar')
    } finally {
      setUploadingFavicon(false)
    }
  }

  const handleRemoveLogo = () => {
    setValue('websiteLogo', '', { shouldValidate: true })
    setPreviewLogo(null)
  }

  const handleRemoveFavicon = () => {
    setValue('websiteFavicon', '', { shouldValidate: true })
    setPreviewFavicon(null)
  }

  const updateSetting = async (key: string, value: string, valueEn?: string | null) => {
    const existing = settings[key]
    if (existing) {
      await apiClient.put(`/admin/settings/${key}`, {
        value,
        valueEn: valueEn ?? existing.valueEn,
        type: existing.type || 'text',
      })
    } else {
      await apiClient.post('/admin/settings/create', {
        key,
        value,
        valueEn: valueEn || null,
        type: 'text',
      })
    }
  }

  const onSubmit = async (data: {
    newsQuote: string
    newsQuoteEn: string
    newsTitle: string
    newsTitleEn: string
    figuresTitle: string
    figuresTitleEn: string
    figuresBackground: string
    websiteLogo: string
    websiteFavicon: string
    websiteTitle: string
    showWebsiteName: boolean
    whatsappPhone: string
    whatsappMessage: string
    footerAddress: string
    footerPhone: string
    footerEmail: string
    androidAppUrl: string
    iosAppUrl: string
    facebookUrl: string
    instagramUrl: string
    youtubeUrl: string
  }) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await Promise.all([
        updateSetting('news_section_quote', data.newsQuote, data.newsQuoteEn),
        updateSetting('news_section_title', data.newsTitle, data.newsTitleEn),
        updateSetting('figures_section_title', data.figuresTitle),
        updateSetting('figures_section_title_en', data.figuresTitleEn),
        updateSetting('figures_section_background', data.figuresBackground || ''),
        updateSetting('website_logo', data.websiteLogo || ''),
        updateSetting('website_favicon', data.websiteFavicon || ''),
        updateSetting('website_title', data.websiteTitle || ''),
        updateSetting('show_website_name', data.showWebsiteName ? 'true' : 'false'),
        updateSetting('whatsapp_phone', data.whatsappPhone || ''),
        updateSetting('whatsapp_message', data.whatsappMessage || ''),
        updateSetting('footer_address', data.footerAddress || ''),
        updateSetting('footer_phone', data.footerPhone || ''),
        updateSetting('footer_email', data.footerEmail || ''),
        updateSetting('android_app_url', data.androidAppUrl || ''),
        updateSetting('ios_app_url', data.iosAppUrl || ''),
        updateSetting('facebook_url', data.facebookUrl || ''),
        updateSetting('instagram_url', data.instagramUrl || ''),
        updateSetting('youtube_url', data.youtubeUrl || ''),
      ])

      setSuccess('Pengaturan berhasil disimpan!')
      // Update favicon di document head dengan cache-busting
      if (data.websiteFavicon) {
        const faviconUrl = getImageUrl(data.websiteFavicon)
        
        // Remove ALL existing favicon links (icon, shortcut icon, apple-touch-icon)
        const existingLinks = document.querySelectorAll("link[rel*='icon']")
        existingLinks.forEach(link => link.remove())
        
        // Add timestamp to force browser to reload favicon (cache-busting)
        const separator = faviconUrl.includes('?') ? '&' : '?'
        const timestampedUrl = `${faviconUrl}${separator}v=${Date.now()}`
        
        // Add new favicon links with multiple rel types for better compatibility
        const iconTypes = ['icon', 'shortcut icon', 'apple-touch-icon']
        iconTypes.forEach(relType => {
          const newLink = document.createElement('link')
          newLink.rel = relType
          newLink.type = 'image/x-icon'
          newLink.href = timestampedUrl
          document.head.appendChild(newLink)
        })
      }
      // Update title
      if (data.websiteTitle) {
        document.title = data.websiteTitle
      }
      
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* News Section Settings */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold mb-4">Pengaturan Section Berita</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quote Section Berita (ID) *
            </label>
            <input
              {...register('newsQuote', { required: true })}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Integrating Knowledge and Faith for a Brighter Tomorrow"
            />
            <p className="mt-1 text-xs text-gray-500">Quote yang ditampilkan di atas section berita</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quote Section Berita (EN)
            </label>
            <input
              {...register('newsQuoteEn')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title Section Berita (ID) *
            </label>
            <input
              {...register('newsTitle', { required: true })}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Berita Terbaru"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title Section Berita (EN)
            </label>
            <input
              {...register('newsTitleEn')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Latest News"
            />
          </div>
        </div>
      </div>

      {/* Website Settings */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold mb-4">Pengaturan Website</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title Website *
            </label>
            <input
              {...register('websiteTitle', { required: true })}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="SMA AL AZHAR INSAN CENDEKIA JATIBENING"
            />
            <p className="mt-1 text-xs text-gray-500">Title website yang akan ditampilkan di browser tab</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo Website
            </label>
            
            {previewLogo ? (
              <div className="relative mb-4">
                <img
                  src={previewLogo}
                  alt="Logo Preview"
                  className="h-32 w-auto object-contain rounded-lg border border-gray-300 bg-white p-2"
                />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className={`cursor-pointer flex flex-col items-center justify-center ${
                    uploadingLogo ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingLogo ? (
                    <>
                      <Loader2 className="animate-spin text-primary-600 mb-2" size={32} />
                      <span className="text-gray-600">Mengupload...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="text-gray-400 mb-2" size={32} />
                      <span className="text-gray-600 mb-1">Klik untuk upload logo</span>
                      <span className="text-sm text-gray-500">PNG, JPG, GIF maksimal 10MB</span>
                    </>
                  )}
                </label>
              </div>
            )}
            
            <input
              {...register('websiteLogo')}
              type="hidden"
            />
            <p className="mt-1 text-xs text-gray-500">Logo website yang akan ditampilkan di header menu</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Favicon Website
            </label>
            
            {previewFavicon ? (
              <div className="relative mb-4">
                <img
                  src={previewFavicon}
                  alt="Favicon Preview"
                  className="h-16 w-16 object-contain rounded-lg border border-gray-300 bg-white p-2"
                />
                <button
                  type="button"
                  onClick={handleRemoveFavicon}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFaviconUpload}
                  disabled={uploadingFavicon}
                  className="hidden"
                  id="favicon-upload"
                />
                <label
                  htmlFor="favicon-upload"
                  className={`cursor-pointer flex flex-col items-center justify-center ${
                    uploadingFavicon ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingFavicon ? (
                    <>
                      <Loader2 className="animate-spin text-primary-600 mb-2" size={32} />
                      <span className="text-gray-600">Mengupload...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="text-gray-400 mb-2" size={32} />
                      <span className="text-gray-600 mb-1">Klik untuk upload favicon</span>
                      <span className="text-sm text-gray-500">PNG, ICO, SVG maksimal 2MB (disarankan 32x32 atau 16x16)</span>
                    </>
                  )}
                </label>
              </div>
            )}
            
            <input
              {...register('websiteFavicon')}
              type="hidden"
            />
            <p className="mt-1 text-xs text-gray-500">Favicon yang akan ditampilkan di browser tab</p>
          </div>

          <div className="flex items-center">
            <input
              {...register('showWebsiteName')}
              type="checkbox"
              id="showWebsiteName"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="showWebsiteName" className="ml-2 block text-sm text-gray-700">
              Tampilkan Nama Website di Header Menu
            </label>
          </div>
        </div>
      </div>

      {/* Figures Section Settings */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold mb-4">Pengaturan Section Tokoh-Tokoh</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title Section Tokoh (ID) *
            </label>
            <input
              {...register('figuresTitle', { required: true })}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Tokoh-Tokoh SMA AL AZHAR INSAN CENDEKIA JATIBENING"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title Section Tokoh (EN)
            </label>
            <input
              {...register('figuresTitleEn')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Figures of SMA AL AZHAR INSAN CENDEKIA JATIBENING"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image Section Tokoh
            </label>
            
            {previewBackground ? (
              <div className="relative mb-4">
                <img
                  src={previewBackground}
                  alt="Background Preview"
                  className="h-48 w-full object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveBackground}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  disabled={uploading}
                  className="hidden"
                  id="figures-background-upload"
                />
                <label
                  htmlFor="figures-background-upload"
                  className={`cursor-pointer flex flex-col items-center justify-center ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin text-primary-600 mb-2" size={32} />
                      <span className="text-gray-600">Mengupload...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="text-gray-400 mb-2" size={32} />
                      <span className="text-gray-600 mb-1">Klik untuk upload background image</span>
                      <span className="text-sm text-gray-500">PNG, JPG, GIF maksimal 10MB</span>
                    </>
                  )}
                </label>
              </div>
            )}
            
            <input
              {...register('figuresBackground')}
              type="hidden"
            />
          </div>
        </div>
      </div>

      {/* WhatsApp Settings */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold mb-4">Pengaturan WhatsApp</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor WhatsApp *
            </label>
            <input
              {...register('whatsappPhone', { required: true })}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="08112020101"
            />
            <p className="mt-1 text-xs text-gray-500">Nomor WhatsApp tujuan (tanpa + atau spasi)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pesan Default WhatsApp *
            </label>
            <textarea
              {...register('whatsappMessage', { required: true })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">Pesan default yang akan ditampilkan saat user klik tombol WhatsApp</p>
          </div>
        </div>
      </div>

      {/* Footer Settings */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold mb-4">Pengaturan Footer</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat
            </label>
            <textarea
              {...register('footerAddress')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon
              </label>
              <input
                {...register('footerPhone')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register('footerEmail')}
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Aplikasi Android
              </label>
              <input
                {...register('androidAppUrl')}
                type="url"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Aplikasi iOS
              </label>
              <input
                {...register('iosAppUrl')}
                type="url"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Facebook
              </label>
              <input
                {...register('facebookUrl')}
                type="url"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Instagram
              </label>
              <input
                {...register('instagramUrl')}
                type="url"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL YouTube
              </label>
              <input
                {...register('youtubeUrl')}
                type="url"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading && <Loader2 className="animate-spin" size={16} />}
          <span>{isLoading ? 'Menyimpan...' : 'Simpan'}</span>
        </button>
      </div>
    </form>
  )
}

