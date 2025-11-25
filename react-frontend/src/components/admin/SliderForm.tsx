import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, Loader2 } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { getImageUrl } from '../../lib/utils-image-url'

const sliderSchema = z.object({
  title: z.string().min(1, 'Title wajib diisi'),
  titleEn: z.string().optional(),
  subtitle: z.string().optional(),
  subtitleEn: z.string().optional(),
  image: z.string().min(1, 'Gambar wajib diupload'),
  buttonText: z.string().optional(),
  buttonTextEn: z.string().optional(),
  buttonUrl: z.string().refine(
    (val) => !val || val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'),
    { message: 'URL harus dimulai dengan / untuk path relatif atau http:///https:// untuk URL lengkap' }
  ).optional().or(z.literal('')),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

type SliderFormData = z.infer<typeof sliderSchema>

interface SliderFormProps {
  slider?: {
    id: string
    title: string
    titleEn?: string | null
    subtitle?: string | null
    subtitleEn?: string | null
    image: string
    buttonText?: string | null
    buttonTextEn?: string | null
    buttonUrl?: string | null
    order: number
    isActive: boolean
  }
}

export function SliderForm({ slider }: SliderFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(
    slider?.image ? getImageUrl(slider.image) : null
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SliderFormData>({
    resolver: zodResolver(sliderSchema),
    defaultValues: slider
      ? {
          title: slider.title,
          titleEn: slider.titleEn || '',
          subtitle: slider.subtitle || '',
          subtitleEn: slider.subtitleEn || '',
          image: slider.image,
          buttonText: slider.buttonText || '',
          buttonTextEn: slider.buttonTextEn || '',
          buttonUrl: slider.buttonUrl || '',
          order: slider.order,
          isActive: slider.isActive,
        }
      : {
          order: 0,
          isActive: true,
        },
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const data = await apiClient.upload('/admin/upload', file, 'sliders')
      // API returns { url: '/uploads/sliders/...', filename: '...', type: 'sliders' }
      const imageUrl = data.url || data.path || ''
      if (!imageUrl) {
        throw new Error('Upload gagal: URL tidak ditemukan dalam response')
      }
      setValue('image', imageUrl, { shouldValidate: true })
      setPreviewImage(getImageUrl(imageUrl))
      setError('') // Clear any previous errors
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Gagal mengupload gambar')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setValue('image', '')
    setPreviewImage(null)
  }

  const onSubmit = async (data: SliderFormData) => {
    setIsLoading(true)
    setError('')

    try {
      if (slider) {
        await apiClient.put(`/admin/sliders/${slider.id}`, {
          ...data,
          buttonUrl: data.buttonUrl || null,
        })
      } else {
        await apiClient.post('/admin/sliders/create', {
          ...data,
          buttonUrl: data.buttonUrl || null,
        })
      }

      navigate('/admin/sliders')
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="bg-white rounded-lg shadow p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title (ID) *
          </label>
          <input
            {...register('title')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title (EN)
          </label>
          <input
            {...register('titleEn')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.titleEn && (
            <p className="mt-1 text-sm text-red-600">{errors.titleEn.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle (ID)
          </label>
          <input
            {...register('subtitle')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.subtitle && (
            <p className="mt-1 text-sm text-red-600">{errors.subtitle.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle (EN)
          </label>
          <input
            {...register('subtitleEn')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.subtitleEn && (
            <p className="mt-1 text-sm text-red-600">{errors.subtitleEn.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image *
        </label>
        {previewImage ? (
          <div className="relative">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
              disabled={uploading}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin text-primary-600 mb-2" size={32} />
                  <span className="text-gray-600">Mengupload...</span>
                </>
              ) : (
                <>
                  <Upload className="text-gray-400 mb-2" size={32} />
                  <span className="text-gray-600">Klik untuk upload gambar</span>
                  <span className="text-sm text-gray-500 mt-1">Max 5MB</span>
                </>
              )}
            </label>
          </div>
        )}
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Text (ID)
          </label>
          <input
            {...register('buttonText')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Text (EN)
          </label>
          <input
            {...register('buttonTextEn')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Button URL
        </label>
        <input
          {...register('buttonUrl')}
          type="text"
          placeholder="/path atau https://example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            {...register('order', { valueAsNumber: true })}
            type="number"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.order && (
            <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            {...register('isActive')}
            type="checkbox"
            id="isActive"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Active
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/admin/sliders')}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
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

