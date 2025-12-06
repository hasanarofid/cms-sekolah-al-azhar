import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Upload, X, Loader2 } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { slugify } from '../../lib/utils'
import { getImageUrl } from '../../lib/utils-image-url'
import { PageBlocksManager } from './PageBlocksManager'
import { RichTextEditor } from './RichTextEditor'
import { Select2 } from './Select2'
import { useFlashMessage } from '../../hooks/useFlashMessage'

interface Page {
  id: string
  title: string
  titleEn?: string | null
  slug: string
  content: string
  contentEn?: string | null
  excerpt?: string | null
  excerptEn?: string | null
  featuredImage?: string | null
  menuId?: string | null
  pageType: string
  template?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string | null
  isPublished: boolean
  blocks?: Array<{
    id: string
    type: string
    data: string
    order: number
    isActive: boolean
  }>
}

interface PageFormProps {
  page?: Page
  menus?: Array<{ id: string; title: string; slug: string }>
}

export function PageForm({ page, menus = [] }: PageFormProps) {
  const navigate = useNavigate()
  const { showSuccess } = useFlashMessage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(
    page?.featuredImage ? getImageUrl(page.featuredImage) : null
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: page
      ? {
          title: page.title,
          titleEn: page.titleEn || '',
          slug: page.slug,
          content: page.content,
          contentEn: page.contentEn || '',
          excerpt: page.excerpt || '',
          excerptEn: page.excerptEn || '',
          featuredImage: page.featuredImage || '',
          menuId: page.menuId || '',
          pageType: page.pageType || 'standard',
          template: page.template || '',
          seoTitle: page.seoTitle || '',
          seoDescription: page.seoDescription || '',
          seoKeywords: page.seoKeywords || '',
          isPublished: page.isPublished,
        }
      : {
          pageType: 'standard',
          isPublished: false,
        },
  })

  const content = watch('content')
  const contentEn = watch('contentEn')
  const title = watch('title')

  // Auto-generate slug from title
  useEffect(() => {
    if (!page && title) {
      const generatedSlug = slugify(title)
      setValue('slug', generatedSlug, { shouldValidate: true })
    }
  }, [title, page, setValue])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setValue('featuredImage', imageUrl, { shouldValidate: true })
      setPreviewImage(getImageUrl(imageUrl))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengupload gambar')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setValue('featuredImage', '', { shouldValidate: true })
    setPreviewImage(null)
  }

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    setError('')

    try {
      if (page) {
        await apiClient.put(`/admin/pages/${page.id}`, {
          ...data,
          menuId: data.menuId || null,
          featuredImage: data.featuredImage || null,
          template: data.template || null,
          seoTitle: data.seoTitle || null,
          seoDescription: data.seoDescription || null,
          seoKeywords: data.seoKeywords || null,
        })
        showSuccess('Halaman berhasil diperbarui!', 3000, true)
      } else {
        await apiClient.post('/admin/pages/create', {
          ...data,
          menuId: data.menuId || null,
          featuredImage: data.featuredImage || null,
          template: data.template || null,
          seoTitle: data.seoTitle || null,
          seoDescription: data.seoDescription || null,
          seoKeywords: data.seoKeywords || null,
        })
        showSuccess('Halaman berhasil ditambahkan!', 3000, true)
      }

      navigate('/admin/pages')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul (ID) *
            </label>
            <input
              {...register('title', { required: 'Judul wajib diisi' })}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul (EN)
            </label>
            <input
              {...register('titleEn')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              {...register('slug', { required: 'Slug wajib diisi' })}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              readOnly={!!page}
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message as string}</p>
            )}
            {!page && (
              <p className="mt-1 text-sm text-gray-500">Slug akan otomatis dibuat dari judul</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipe Halaman
            </label>
            <Select2
              name="pageType"
              value={watch('pageType')}
              onChange={(value: string) => setValue('pageType', value as any)}
              options={[
                { value: 'standard', label: 'Standard' },
                { value: 'program', label: 'Program' },
                { value: 'facility', label: 'Fasilitas' },
                { value: 'academic', label: 'Akademik' },
              ]}
              placeholder="Pilih tipe halaman..."
              isSearchable={false}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Menu (opsional)
          </label>
          <Select2
            name="menuId"
            value={watch('menuId') || ''}
            onChange={(value: string) => setValue('menuId', value || undefined)}
            options={[
              { value: '', label: 'Tidak ada menu' },
              ...menus.map((menu) => ({
                value: menu.id,
                label: menu.title
              }))
            ]}
            placeholder="Pilih menu..."
            isSearchable={true}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          
          {previewImage ? (
            <div className="relative mb-4">
              <img
                src={previewImage}
                alt="Preview"
                className="h-64 w-full object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
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
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="page-image-upload"
              />
              <label
                htmlFor="page-image-upload"
                className={`cursor-pointer flex flex-col items-center justify-center ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin text-green-500 mb-2" size={32} />
                    <span className="text-gray-600">Mengupload...</span>
                  </>
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" size={32} />
                    <span className="text-gray-600 mb-1">Klik untuk upload gambar</span>
                    <span className="text-sm text-gray-500">PNG, JPG, GIF maksimal 5MB</span>
                  </>
                )}
              </label>
            </div>
          )}
          
          <input
            {...register('featuredImage')}
            type="hidden"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konten (ID) *
          </label>
          <RichTextEditor
            value={content || ''}
            onChange={(value) => {
              setValue('content', value, { shouldValidate: true })
            }}
            placeholder="Masukkan konten halaman..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konten (EN)
          </label>
          <RichTextEditor
            value={contentEn || ''}
            onChange={(value) => {
              setValue('contentEn', value)
            }}
            placeholder="Enter page content..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt (ID)
            </label>
            <textarea
              {...register('excerpt')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt (EN)
            </label>
            <textarea
              {...register('excerptEn')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                {...register('seoTitle')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description
              </label>
              <textarea
                {...register('seoDescription')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Keywords
              </label>
              <input
                {...register('seoKeywords')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template
              </label>
              <input
                {...register('template')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="with-header (untuk header hijau)"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            {...register('isPublished')}
            type="checkbox"
            id="isPublished"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
            Published
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/pages')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading || uploading}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>

      {/* Page Blocks Manager - Only show when editing existing page */}
      {page && (
        <div className="mt-8">
          <PageBlocksManager 
            pageId={page.id} 
            initialBlocks={page.blocks || []}
          />
        </div>
      )}
    </>
  )
}

