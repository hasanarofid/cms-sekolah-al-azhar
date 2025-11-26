import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, Loader2 } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { getImageUrl } from '../../lib/utils-image-url'

const youtubeUrlRegex = /(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)/i

const sliderSchema = z.object({
  title: z.string().min(1, 'Title wajib diisi'),
  titleEn: z.string().optional(),
  subtitle: z.string().optional(),
  subtitleEn: z.string().optional(),
  image: z.string().min(1, 'Gambar wajib diupload'),
  videoUrl: z.string().trim().optional().refine(
    (val) => !val || youtubeUrlRegex.test(val),
    { message: 'Gunakan tautan YouTube yang valid' }
  ),
  videoFile: z.string().optional(),
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
    videoUrl?: string | null
    videoFile?: string | null
    videoDuration?: number | null
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
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(
    slider?.image ? getImageUrl(slider.image) : null
  )
  const [previewVideo, setPreviewVideo] = useState<string | null>(
    slider?.videoFile ? getImageUrl(slider.videoFile) : null
  )
  const [videoDuration, setVideoDuration] = useState<number | null>(
    slider?.videoDuration ?? null
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
          videoUrl: slider.videoUrl || '',
          videoFile: slider.videoFile || '',
          buttonText: slider.buttonText || '',
          buttonTextEn: slider.buttonTextEn || '',
          buttonUrl: slider.buttonUrl || '',
          order: slider.order,
          isActive: slider.isActive,
        }
      : {
          videoUrl: '',
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

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('File harus berupa video (mp4, webm, ogg, mov)')
      return
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('Ukuran file maksimal 50MB')
      return
    }

    setUploadingVideo(true)
    setError('')

    try {
      const data = await apiClient.upload('/admin/upload', file, 'sliders', true, true) // isVideo = true
      const videoUrl = data.url || data.path || ''
      if (!videoUrl) {
        throw new Error('Upload gagal: URL tidak ditemukan dalam response')
      }
      setValue('videoFile', videoUrl, { shouldValidate: true })
      setPreviewVideo(getImageUrl(videoUrl))
      
      // Save video duration if provided by backend
      if (data.videoDuration && data.videoDuration > 0) {
        setVideoDuration(data.videoDuration)
      } else {
        // Try to get duration from video element as fallback
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.src = getImageUrl(videoUrl)
        video.onloadedmetadata = () => {
          const duration = Math.round(video.duration)
          if (duration > 0) {
            setVideoDuration(duration)
          }
        }
      }
      
      setError('') // Clear any previous errors
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Gagal mengupload video')
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleRemoveVideo = () => {
    setValue('videoFile', '')
    setPreviewVideo(null)
    setVideoDuration(null)
  }

  const onSubmit = async (data: SliderFormData) => {
    setIsLoading(true)
    setError('')

    try {
      if (slider) {
        await apiClient.put(`/admin/sliders/${slider.id}`, {
          ...data,
          videoUrl: data.videoUrl?.trim() || null,
          videoFile: data.videoFile?.trim() || null,
          videoDuration: videoDuration || null,
          buttonUrl: data.buttonUrl || null,
        })
      } else {
        await apiClient.post('/admin/sliders/create', {
          ...data,
          videoUrl: data.videoUrl?.trim() || null,
          videoFile: data.videoFile?.trim() || null,
          videoDuration: videoDuration || null,
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video File untuk Autoplay Background (opsional)
        </label>
        {previewVideo ? (
          <div className="relative mb-4">
            <video
              src={previewVideo}
              controls
              className="w-full max-w-md rounded-lg border border-gray-300"
            />
            {videoDuration && (
              <div className="mt-2 text-sm text-gray-600">
                Durasi: {Math.floor(videoDuration / 60)}:{(videoDuration % 60).toString().padStart(2, '0')} ({videoDuration} detik)
              </div>
            )}
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              onChange={handleVideoUpload}
              disabled={uploadingVideo}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {uploadingVideo ? (
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-2" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
              )}
              <span className="text-sm text-gray-600">
                {uploadingVideo ? 'Mengupload video...' : 'Klik untuk upload video (mp4, webm, max 50MB)'}
              </span>
            </label>
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Video ini akan ditampilkan sebagai background autoplay di slider. Jika tidak diisi, akan menggunakan gambar.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video YouTube URL (opsional)
        </label>
        <input
          {...register('videoUrl')}
          type="text"
          placeholder="https://www.youtube.com/watch?v=xxxx"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500">
          Jika diisi, hero slider akan menampilkan tombol play untuk video YouTube ini (untuk modal popup).
        </p>
        {errors.videoUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.videoUrl.message}</p>
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

