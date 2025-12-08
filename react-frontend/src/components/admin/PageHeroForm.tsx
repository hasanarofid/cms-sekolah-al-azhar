import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, Loader2, X, Scissors } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { getImageUrl } from '../../lib/utils-image-url'
import { useFlashMessage } from '../../hooks/useFlashMessage'
import { trimVideo, shouldTrimVideo, formatFileSize, autoCompressIfNeeded } from '../../lib/video-trimmer'

const heroSchema = z.object({
  title: z.string().optional(),
  titleEn: z.string().optional(),
  subtitle: z.string().optional(),
  subtitleEn: z.string().optional(),
  image: z.string().optional(),
  videoUrl: z.string().optional(),
  videoFile: z.string().optional(),
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
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(
    hero?.image ? getImageUrl(hero.image) : null
  )
  const [previewVideo, setPreviewVideo] = useState<string | null>(
    hero?.videoFile ? getImageUrl(hero.videoFile) : null
  )
  const [videoDuration, setVideoDuration] = useState<number | null>(
    hero?.videoDuration ?? null
  )
  const [autoTrimVideo, setAutoTrimVideo] = useState(false)
  const [trimProgress, setTrimProgress] = useState<number>(0)
  const [isTrimming, setIsTrimming] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressProgress, setCompressProgress] = useState<number>(0)

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
          videoFile: hero.videoFile || undefined,
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

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      setError('File harus berupa video (mp4, webm, ogg, mov)')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('Ukuran file maksimal 50MB')
      return
    }

    setUploadingVideo(true)
    setError('')
    
    let processedFile = file
    let useServerSideTrim = false

    try {
      // Step 1: Auto-compress if file > 5MB
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > 5) {
        try {
          setIsCompressing(true)
          setCompressProgress(0)
          
          console.log(`📦 Video ${formatFileSize(file.size)} > 5MB, compressing...`)
          
          processedFile = await autoCompressIfNeeded(file, 5, (progress) => {
            setCompressProgress(progress)
          })
          
          console.log(`✅ Compressed: ${formatFileSize(file.size)} → ${formatFileSize(processedFile.size)}`)
          
          setIsCompressing(false)
          setCompressProgress(0)
        } catch (compressError: any) {
          console.warn('⚠️ Compression failed:', compressError.message)
          setIsCompressing(false)
          
          if (fileSizeMB > 50) {
            throw new Error('Video terlalu besar. Maksimal 50MB. Silakan compress video terlebih dahulu.')
          }
          processedFile = file
        }
      }
      
      // Step 2: Trim if enabled
      if (autoTrimVideo) {
        const needsTrim = await shouldTrimVideo(processedFile, 5)
        
        if (needsTrim) {
          try {
            setIsTrimming(true)
            setTrimProgress(0)
            
            console.log(`🎬 Video lebih dari 5 detik. Memotong video...`)
            
            const trimmedBlob = await trimVideo(processedFile, 5, (progress) => {
              setTrimProgress(progress)
            })
            
            processedFile = new File(
              [trimmedBlob],
              processedFile.name.replace(/\.[^/.]+$/, '') + '-trimmed.mp4',
              { type: 'video/mp4' }
            )
            
            console.log(`✅ Video berhasil dipotong menjadi 5 detik`)
            
            setIsTrimming(false)
            setTrimProgress(0)
            useServerSideTrim = false
          } catch (trimError: any) {
            console.warn('⚠️ Client-side trimming gagal:', trimError.message)
            setIsTrimming(false)
            useServerSideTrim = true
          }
        }
      }

      const data = await apiClient.upload(
        '/admin/upload', 
        processedFile, 
        'page-heroes', 
        true,
        true, // isVideo
        false,
        useServerSideTrim,
        5
      )
      
      const videoUrl = data.url || data.path || ''
      if (!videoUrl) {
        throw new Error('Upload gagal: URL tidak ditemukan dalam response')
      }
      
      setValue('videoFile', videoUrl, { shouldValidate: true })
      setPreviewVideo(getImageUrl(videoUrl))
      
      if (data.videoDuration && data.videoDuration > 0) {
        setVideoDuration(data.videoDuration)
      }
      
      console.log('✅ Video berhasil diupload')
      setError('')
    } catch (err: any) {
      console.error('❌ Upload error:', err)
      setError(err.message || 'Gagal mengupload video')
      setIsTrimming(false)
    } finally {
      setUploadingVideo(false)
      setTrimProgress(0)
    }
  }

  const handleRemoveVideo = () => {
    setValue('videoFile', '')
    setPreviewVideo(null)
    setVideoDuration(null)
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
        videoFile: data.videoFile || null,
        videoDuration: videoDuration || null,
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
          Video File untuk Autoplay Background (opsional)
        </label>
        
        {/* Auto-trim toggle */}
        <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="auto-trim"
              checked={autoTrimVideo}
              onChange={(e) => setAutoTrimVideo(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="auto-trim" className="flex items-center text-sm text-gray-700 cursor-pointer">
              <Scissors className="w-4 h-4 mr-1 text-blue-600" />
              <span className="font-medium">Auto-trim video menjadi 5 detik (Eksperimental)</span>
            </label>
          </div>
          <p className="text-xs text-gray-600 mt-1 ml-6">
            ⚠️ Fitur ini butuh koneksi internet stabil. Jika gagal, upload video pendek (≤5 detik) atau disable fitur ini.
          </p>
        </div>
        
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
              disabled={uploadingVideo || isTrimming || isCompressing}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {isCompressing ? (
                <>
                  <Loader2 className="w-8 h-8 text-orange-600 animate-spin mb-2" />
                  <span className="text-sm text-gray-600 mb-2">
                    Mengompress video...
                  </span>
                  <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${compressProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{compressProgress}%</span>
                </>
              ) : isTrimming ? (
                <>
                  <Scissors className="w-8 h-8 text-blue-600 animate-pulse mb-2" />
                  <span className="text-sm text-gray-600 mb-2">
                    Memotong video menjadi 5 detik...
                  </span>
                  <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${trimProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{trimProgress}%</span>
                </>
              ) : uploadingVideo ? (
                <>
                  <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-2" />
                  <span className="text-sm text-gray-600">Mengupload video...</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Klik untuk upload video (mp4, webm, max 50MB)
                  </span>
                </>
              )}
            </label>
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Video ini akan ditampilkan sebagai background autoplay di hero. Jika tidak diisi, akan menggunakan gambar.
          <span className="block mt-1 text-orange-600 font-medium">
            🔄 Auto-compress: Video {'>'}5MB akan otomatis di-compress sebelum upload.
          </span>
          {autoTrimVideo ? (
            <span className="block mt-1 text-blue-600 font-medium">
              ✓ Video yang lebih dari 5 detik akan otomatis dipotong menjadi 5 detik pertama.
            </span>
          ) : (
            <span className="block mt-1 text-green-600 font-medium">
              💡 Tip: Upload video yang sudah pendek (≤5 detik) untuk performa terbaik.
            </span>
          )}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video YouTube URL (opsional)
        </label>
        <input
          type="url"
          {...register('videoUrl')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="https://youtube.com/watch?v=..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Jika diisi, hero akan menampilkan tombol play untuk video YouTube ini (untuk modal popup).
        </p>
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

