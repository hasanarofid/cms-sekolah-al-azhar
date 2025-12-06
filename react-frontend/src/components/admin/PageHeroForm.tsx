import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, Loader2 } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { getImageUrl } from '../../lib/utils-image-url'
import { useFlashMessage } from '../../hooks/useFlashMessage'

const heroSchema = z.object({
  title: z.string().optional(),
  titleEn: z.string().optional(),
  subtitle: z.string().optional(),
  subtitleEn: z.string().optional(),
  image: z.string().optional(),
  videoUrl: z.string().optional(),
  buttonText: z.string().optional(),
  buttonTextEn: z.string().optional(),
  buttonUrl: z.string().refine(
    (val) => !val || val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'),
    { message: 'URL harus dimulai dengan / untuk path relatif atau http:///https:// untuk URL lengkap' }
  ).optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

type HeroFormData = z.infer<typeof heroSchema>

interface PageHeroFormProps {
  pageId: string
  hero?: any
  onSuccess?: () => void
  onCancel?: () => void
}

export function PageHeroForm({ pageId, hero, onSuccess, onCancel }: PageHeroFormProps) {
  const { showSuccess } = useFlashMessage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(
    hero?.image ? getImageUrl(hero.image) : null
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema) as any,
    defaultValues: hero
      ? {
          title: hero.title || undefined,
          titleEn: hero.titleEn || undefined,
          subtitle: hero.subtitle || undefined,
          subtitleEn: hero.subtitleEn || undefined,
          image: hero.image || undefined,
          videoUrl: hero.videoUrl || undefined,
          buttonText: hero.buttonText || undefined,
          buttonTextEn: hero.buttonTextEn || undefined,
          buttonUrl: hero.buttonUrl || undefined,
          order: hero.order ?? 0,
          isActive: hero.isActive ?? true,
        }
      : {
          order: 0,
          isActive: true,
        },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const data = await apiClient.upload('/admin/upload', file, 'page-heroes')
      const imageUrl = data.url || data.path || ''
      if (!imageUrl) {
        throw new Error('Upload gagal: URL tidak ditemukan dalam response')
      }
      setValue('image', imageUrl, { shouldValidate: true })
      setPreviewImage(getImageUrl(imageUrl))
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Gagal mengupload gambar')
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: HeroFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const formData = {
        pageId,
        title: data.title || null,
        titleEn: data.titleEn || null,
        subtitle: data.subtitle || null,
        subtitleEn: data.subtitleEn || null,
        image: data.image || null,
        videoUrl: data.videoUrl || null,
        buttonText: data.buttonText || null,
        buttonTextEn: data.buttonTextEn || null,
        buttonUrl: data.buttonUrl || null,
        order: data.order ?? 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      }

      if (hero?.id) {
        // Update existing hero
        await apiClient.put(`/admin/page-heroes/${hero.id}`, formData)
        showSuccess('Hero berhasil diperbarui!')
      } else {
        // Create new hero
        await apiClient.post(`/admin/pages/${pageId}/hero/create`, formData)
        showSuccess('Hero berhasil ditambahkan!')
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      console.error('Submit error:', err)
      setError(err.message || 'Terjadi kesalahan saat menyimpan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul (ID) *
          </label>
          <input
            type="text"
            {...register('title')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Judul Hero"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul (EN)
          </label>
          <input
            type="text"
            {...register('titleEn')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Title (EN)"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle (ID)
          </label>
          <input
            type="text"
            {...register('subtitle')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Subtitle"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle (EN)
          </label>
          <input
            type="text"
            {...register('subtitleEn')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Subtitle (EN)"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gambar Hero
        </label>
        {previewImage ? (
          <div className="relative mb-4">
            <img
              src={previewImage}
              alt="Preview"
              className="h-48 w-full object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={() => {
                setValue('image', '')
                setPreviewImage(null)
              }}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Upload size={18} className="mr-2" />
              {uploading ? 'Mengupload...' : 'Upload Gambar'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">
              PNG, JPG, GIF maksimal 5MB
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video URL
        </label>
        <input
          type="url"
          {...register('videoUrl')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Text (ID)
          </label>
          <input
            type="text"
            {...register('buttonText')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Daftar Sekarang"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Text (EN)
          </label>
          <input
            type="text"
            {...register('buttonTextEn')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Register Now"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Button URL
        </label>
        <input
          type="text"
          {...register('buttonUrl')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="/pendaftaran atau https://example.com"
        />
        {errors.buttonUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.buttonUrl.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order
          </label>
          <input
            type="number"
            {...register('order', { valueAsNumber: true })}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('isActive')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Aktif
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading && <Loader2 size={18} className="animate-spin" />}
          <span>{isLoading ? 'Menyimpan...' : 'Simpan'}</span>
        </button>
      </div>
    </form>
  )
}

