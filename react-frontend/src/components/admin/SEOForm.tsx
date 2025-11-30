import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Upload, X, Loader2, Save } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { Select2 } from './Select2'
import { getImageUrl } from '../../lib/utils-image-url'

interface SEOData {
  id?: string
  pageType?: string
  pageId?: string | null
  pageSlug?: string | null
  title?: string | null
  description?: string | null
  keywords?: string | null
  author?: string | null
  image?: string | null
  robots?: string | null
  canonical?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  ogType?: string | null
  ogSiteName?: string | null
  ogUrl?: string | null
  twitterCard?: string | null
  twitterSite?: string | null
  twitterCreator?: string | null
}

interface SEOFormProps {
  seo?: SEOData | null
}

export function SEOForm({ seo }: SEOFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploading, setUploading] = useState(false)
  
  const [previewImage, setPreviewImage] = useState<string | null>(
    seo?.image ? getImageUrl(seo.image) : null
  )

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      // Meta Tags
      seoTitle: seo?.title || '',
      seoDescription: seo?.description || '',
      seoKeywords: seo?.keywords || '',
      seoAuthor: seo?.author || '',
      seoImage: seo?.image || '',
      
      // Open Graph
      ogTitle: seo?.ogTitle || '',
      ogDescription: seo?.ogDescription || '',
      ogImage: seo?.ogImage || '',
      ogType: seo?.ogType || 'website',
      ogSiteName: seo?.ogSiteName || '',
      ogUrl: seo?.ogUrl || '',
      
      // Twitter Cards
      twitterCard: seo?.twitterCard || 'summary_large_image',
      twitterSite: seo?.twitterSite || '',
      twitterCreator: seo?.twitterCreator || '',
      
      // Additional
      seoRobots: seo?.robots || 'index, follow',
      seoCanonical: seo?.canonical || '',
    }
  })

  const watchedOgImage = watch('ogImage')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'seoImage' | 'ogImage') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB')
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
      setValue(field, imageUrl, { shouldValidate: true })
      if (field === 'seoImage') {
        setPreviewImage(getImageUrl(imageUrl))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengupload gambar')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (field: 'seoImage' | 'ogImage') => {
    setValue(field, '', { shouldValidate: true })
    if (field === 'seoImage') {
      setPreviewImage(null)
    }
  }

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Prepare SEO data
      const seoData = {
        pageType: 'global',
        title: data.seoTitle || null,
        description: data.seoDescription || null,
        keywords: data.seoKeywords || null,
        author: data.seoAuthor || null,
        image: data.seoImage || null,
        robots: data.seoRobots || 'index, follow',
        canonical: data.seoCanonical || null,
        ogTitle: data.ogTitle || null,
        ogDescription: data.ogDescription || null,
        ogImage: data.ogImage || null,
        ogType: data.ogType || 'website',
        ogSiteName: data.ogSiteName || null,
        ogUrl: data.ogUrl || null,
        twitterCard: data.twitterCard || 'summary_large_image',
        twitterSite: data.twitterSite || null,
        twitterCreator: data.twitterCreator || null,
      }

      // Save SEO settings
      if (seo?.id) {
        // Update existing
        await apiClient.put(`/admin/seo/${seo.id}/update`, seoData)
      } else {
        // Create new
        await apiClient.post('/admin/seo/create', seoData)
      }

      setSuccess('Pengaturan SEO berhasil disimpan!')
      setTimeout(() => {
        setSuccess('')
        // Reload page to get updated data
        window.location.reload()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan pengaturan SEO')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Error & Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Meta Tags Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Meta Tags</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('seoTitle', { required: 'Title wajib diisi' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Judul website untuk SEO"
            />
            <p className="text-xs text-gray-500 mt-1">Rekomendasi: 50-60 karakter</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('seoDescription', { required: 'Description wajib diisi' })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Deskripsi website untuk SEO"
            />
            <p className="text-xs text-gray-500 mt-1">Rekomendasi: 150-160 karakter</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords
            </label>
            <input
              type="text"
              {...register('seoKeywords')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="keyword1, keyword2, keyword3"
            />
            <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <input
              type="text"
              {...register('seoAuthor')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Nama author atau organisasi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Image
            </label>
            {previewImage ? (
              <div className="relative inline-block">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-32 w-auto rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage('seoImage')}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="seoImageUpload"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'seoImage')}
                  className="hidden"
                  disabled={uploading}
                />
                <label
                  htmlFor="seoImageUpload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {uploading ? (
                    <Loader2 className="animate-spin text-primary-600 mb-2" size={24} />
                  ) : (
                    <Upload className="text-gray-400 mb-2" size={24} />
                  )}
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Mengupload...' : 'Klik untuk upload gambar'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Rekomendasi: 1200x630px, maks 5MB
                  </span>
                </label>
              </div>
            )}
            <input
              type="hidden"
              {...register('seoImage')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Robots
            </label>
            <Select2
              name="seoRobots"
              value={watch('seoRobots')}
              onChange={(value) => setValue('seoRobots', value)}
              options={[
                { value: 'index, follow', label: 'Index, Follow' },
                { value: 'index, nofollow', label: 'Index, No Follow' },
                { value: 'noindex, follow', label: 'No Index, Follow' },
                { value: 'noindex, nofollow', label: 'No Index, No Follow' },
              ]}
              placeholder="Pilih robots..."
              isSearchable={false}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canonical URL
            </label>
            <input
              type="url"
              {...register('seoCanonical')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com"
            />
            <p className="text-xs text-gray-500 mt-1">URL kanonik website (opsional)</p>
          </div>
        </div>
      </div>

      {/* Open Graph Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Open Graph (Facebook, LinkedIn, dll)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG Title
            </label>
            <input
              type="text"
              {...register('ogTitle')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Kosongkan untuk menggunakan SEO Title"
            />
            <p className="text-xs text-gray-500 mt-1">Rekomendasi: 60 karakter</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG Description
            </label>
            <textarea
              {...register('ogDescription')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Kosongkan untuk menggunakan SEO Description"
            />
            <p className="text-xs text-gray-500 mt-1">Rekomendasi: 200 karakter</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG Image
            </label>
            {watchedOgImage ? (
              <div className="relative inline-block">
                <img
                  src={getImageUrl(watchedOgImage)}
                  alt="Preview"
                  className="h-32 w-auto rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage('ogImage')}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="ogImageUpload"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'ogImage')}
                  className="hidden"
                  disabled={uploading}
                />
                <label
                  htmlFor="ogImageUpload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {uploading ? (
                    <Loader2 className="animate-spin text-primary-600 mb-2" size={24} />
                  ) : (
                    <Upload className="text-gray-400 mb-2" size={24} />
                  )}
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Mengupload...' : 'Klik untuk upload gambar'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Rekomendasi: 1200x630px, maks 5MB
                  </span>
                </label>
              </div>
            )}
            <input
              type="hidden"
              {...register('ogImage')}
            />
            <p className="text-xs text-gray-500 mt-1">Kosongkan untuk menggunakan Default Image</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG Type
            </label>
            <Select2
              name="ogType"
              value={watch('ogType')}
              onChange={(value) => setValue('ogType', value)}
              options={[
                { value: 'website', label: 'Website' },
                { value: 'article', label: 'Article' },
                { value: 'blog', label: 'Blog' },
              ]}
              placeholder="Pilih OG Type..."
              isSearchable={false}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG Site Name
            </label>
            <input
              type="text"
              {...register('ogSiteName')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Nama website"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG URL
            </label>
            <input
              type="url"
              {...register('ogUrl')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com"
            />
            <p className="text-xs text-gray-500 mt-1">URL utama website</p>
          </div>
        </div>
      </div>

      {/* Twitter Cards Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Twitter Cards</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Type
            </label>
            <Select2
              name="twitterCard"
              value={watch('twitterCard')}
              onChange={(value) => setValue('twitterCard', value)}
              options={[
                { value: 'summary', label: 'Summary' },
                { value: 'summary_large_image', label: 'Summary Large Image' },
              ]}
              placeholder="Pilih Card Type..."
              isSearchable={false}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter Site (@username)
            </label>
            <input
              type="text"
              {...register('twitterSite')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="@username"
            />
            <p className="text-xs text-gray-500 mt-1">Username Twitter website (tanpa @)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter Creator (@username)
            </label>
            <input
              type="text"
              {...register('twitterCreator')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="@username"
            />
            <p className="text-xs text-gray-500 mt-1">Username Twitter creator (tanpa @)</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Simpan Pengaturan</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

