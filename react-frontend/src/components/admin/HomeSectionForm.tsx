'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, Loader2 } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { getImageUrl } from '../../lib/utils-image-url'
import { FAQItemsManager } from './FAQItemsManager'
import { FiguresItemsManager } from './FiguresItemsManager'
import { PartnershipsItemsManager } from './PartnershipsItemsManager'
import { Select2 } from './Select2'
import { useFlashMessage } from '../../hooks/useFlashMessage'
import { FlashMessage } from './FlashMessage'
import { RichTextEditor } from './RichTextEditor'

const sectionSchema = z.object({
  type: z.enum(['motto', 'video-profile', 'admission', 'feature', 'split-screen', 'masjid-al-fatih', 'university-map', 'global-stage', 'faq', 'figures', 'partnerships', 'news-section', 'maps', 'browser-section']),
  title: z.string().optional(),
  titleEn: z.string().optional(),
  subtitle: z.string().optional(),
  subtitleEn: z.string().optional(),
  content: z.string().optional(),
  contentEn: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  imageLeft: z.string().optional(),
  imageRight: z.string().optional(),
  videoUrl: z.string().optional(),
  buttonText: z.string().optional(),
  buttonTextEn: z.string().optional(),
  buttonUrl: z.string().refine(
    (val) => !val || val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'),
    { message: 'URL harus dimulai dengan / untuk path relatif atau http:///https:// untuk URL lengkap' }
  ).optional().or(z.literal('')),
  faqItems: z.array(z.object({
    id: z.string(),
    question: z.string(),
    questionEn: z.string().optional(),
    answer: z.string(),
    answerEn: z.string().optional(),
    order: z.number(),
  })).optional(),
  figures: z.array(z.object({
    id: z.string(),
    name: z.string(),
    nameEn: z.string().optional(),
    position: z.string(),
    positionEn: z.string().optional(),
    image: z.string(),
  })).optional(),
  partnerships: z.array(z.object({
    id: z.string(),
    name: z.string(),
    nameEn: z.string().optional(),
    logo: z.string().optional(),
    location: z.string().optional(),
    locationEn: z.string().optional(),
    category: z.enum(['international', 'health', 'student-escort']),
    order: z.number(),
  })).optional(),
  mapEmbedUrl: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.union([z.boolean(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val === 1
    return val === true
  }).default(true),
})

type SectionFormData = z.infer<typeof sectionSchema>

interface HomeSectionFormProps {
  section?: {
    id: string
    type: string
    title?: string | null
    titleEn?: string | null
    subtitle?: string | null
    subtitleEn?: string | null
    content?: string | null
    contentEn?: string | null
    image?: string | null
    images?: string[] | null
    imageLeft?: string | null
    imageRight?: string | null
    videoUrl?: string | null
    buttonText?: string | null
    buttonTextEn?: string | null
    buttonUrl?: string | null
    faqItems?: string | any[] | null
    figures?: string | any[] | null
    partnerships?: string | any[] | null
    mapEmbedUrl?: string | null
    order: number
    isActive: boolean
  }
  defaultType?: 'motto' | 'video-profile' | 'admission' | 'feature' | 'split-screen' | 'masjid-al-fatih' | 'university-map' | 'global-stage' | 'faq' | 'figures' | 'partnerships' | 'news-section' | 'maps'
}

export function HomeSectionForm({ section, defaultType }: HomeSectionFormProps) {
  const navigate = useNavigate()
  const { flashMessage, showSuccess } = useFlashMessage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(
    section?.image ? getImageUrl(section.image) : null
  )
  const [previewImages, setPreviewImages] = useState<string[]>(
    section?.images || []
  )
  const [previewImageLeft, setPreviewImageLeft] = useState<string | null>(
    section?.imageLeft ? getImageUrl(section.imageLeft) : null
  )
  const [previewImageRight, setPreviewImageRight] = useState<string | null>(
    section?.imageRight ? getImageUrl(section.imageRight) : null
  )
  
  // Parse faqItems from section (could be JSON string or array)
  const parseFAQItems = () => {
    if (!section?.faqItems) return []
    if (Array.isArray(section.faqItems)) return section.faqItems
    try {
      const parsed = JSON.parse(section.faqItems)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  
  // Parse figures from section (could be JSON string or array)
  const parseFigures = () => {
    if (!section?.figures) return []
    if (Array.isArray(section.figures)) return section.figures
    try {
      const parsed = JSON.parse(section.figures)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  
  // Parse partnerships from section (could be JSON string or array)
  const parsePartnerships = () => {
    if (!section?.partnerships) return []
    if (Array.isArray(section.partnerships)) return section.partnerships
    try {
      const parsed = JSON.parse(section.partnerships)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  
  const [faqItems, setFaqItems] = useState<any[]>(parseFAQItems())
  const [figures, setFigures] = useState<any[]>(parseFigures())
  const [partnerships, setPartnerships] = useState<any[]>(parsePartnerships())

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    mode: 'onChange',
    defaultValues: section
      ? {
          type: section.type as 'motto' | 'video-profile' | 'admission' | 'feature' | 'split-screen' | 'masjid-al-fatih' | 'university-map' | 'global-stage' | 'faq' | 'figures' | 'partnerships' | 'news-section' | 'maps',
          title: section.title || undefined,
          titleEn: section.titleEn || undefined,
          subtitle: section.subtitle || undefined,
          subtitleEn: section.subtitleEn || undefined,
          content: section.content || undefined,
          contentEn: section.contentEn || undefined,
          image: section.image || undefined,
          images: section.images || undefined,
          imageLeft: section.imageLeft || undefined,
          imageRight: section.imageRight || undefined,
          videoUrl: section.videoUrl || undefined,
          buttonText: section.buttonText || undefined,
          buttonTextEn: section.buttonTextEn || undefined,
          buttonUrl: section.buttonUrl || undefined,
          faqItems: parseFAQItems(),
          figures: parseFigures(),
          mapEmbedUrl: section.mapEmbedUrl || undefined,
          order: section.order ?? 0,
          isActive: typeof section.isActive === 'number' ? section.isActive === 1 : (section.isActive ?? true),
        }
      : {
          type: defaultType || 'feature',
          order: 0,
          isActive: true,
          images: undefined,
          title: undefined,
          titleEn: undefined,
          subtitle: undefined,
          subtitleEn: undefined,
          content: undefined,
          contentEn: undefined,
          image: undefined,
          imageLeft: undefined,
          imageRight: undefined,
          videoUrl: undefined,
          buttonText: undefined,
          buttonTextEn: undefined,
          buttonUrl: undefined,
          faqItems: undefined,
          mapEmbedUrl: undefined,
        },
  } as any)

  const sectionType = watch('type') as string
  const watchedImages = watch('images')
  const content = watch('content')
  const contentEn = watch('contentEn')

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
      const data = await apiClient.upload('/admin/upload', file, 'home-sections')
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

  const handleMultipleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError('')

    try {
      const uploadedUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file.type.startsWith('image/')) continue
        if (file.size > 5 * 1024 * 1024) continue

        try {
          const data = await apiClient.upload('/admin/upload', file, 'home-sections')
          const imageUrl = data.url || data.path || ''
          if (imageUrl) {
            uploadedUrls.push(imageUrl)
          }
        } catch (err) {
          console.error('Error uploading file:', err)
        }
      }

      const currentImages = watchedImages || []
      const newImages = [...currentImages, ...uploadedUrls]
      setValue('images', newImages, { shouldValidate: true })
      setPreviewImages(newImages)
    } catch (err: any) {
      setError(err.message || 'Gagal mengupload gambar')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setValue('image', '')
    setPreviewImage(null)
  }

  const handleFileUploadLeft = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const data = await apiClient.upload('/admin/upload', file, 'home-sections')
      const imageUrl = data.url || data.path || ''
      if (!imageUrl) {
        throw new Error('Upload gagal: URL tidak ditemukan dalam response')
      }
      setValue('imageLeft', imageUrl, { shouldValidate: true })
      setPreviewImageLeft(getImageUrl(imageUrl))
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Gagal mengupload gambar')
    } finally {
      setUploading(false)
    }
  }

  const handleFileUploadRight = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const data = await apiClient.upload('/admin/upload', file, 'home-sections')
      const imageUrl = data.url || data.path || ''
      if (!imageUrl) {
        throw new Error('Upload gagal: URL tidak ditemukan dalam response')
      }
      setValue('imageRight', imageUrl, { shouldValidate: true })
      setPreviewImageRight(getImageUrl(imageUrl))
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Gagal mengupload gambar')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImageLeft = () => {
    setValue('imageLeft', '')
    setPreviewImageLeft(null)
  }

  const handleRemoveImageRight = () => {
    setValue('imageRight', '')
    setPreviewImageRight(null)
  }

  const handleRemoveMultipleImage = (index: number) => {
    const currentImages = watchedImages || []
    const newImages = currentImages.filter((_, i) => i !== index)
    setValue('images', newImages, { shouldValidate: true })
    setPreviewImages(newImages)
  }

  const onSubmit = async (data: SectionFormData) => {
    setIsLoading(true)
    setError('')

    try {
      // Prepare form data - ensure images is properly handled
      const imagesArray = Array.isArray(data.images) ? data.images : (watchedImages || [])
      
      const formData = {
        type: data.type,
        title: data.title || null,
        titleEn: data.titleEn || null,
        subtitle: data.subtitle || null,
        subtitleEn: data.subtitleEn || null,
        content: data.content || null,
        contentEn: data.contentEn || null,
        image: data.image || null,
        images: imagesArray.length > 0 ? imagesArray : null,
        imageLeft: data.imageLeft || null,
        imageRight: data.imageRight || null,
        videoUrl: data.videoUrl || null,
        buttonText: data.buttonText || null,
        buttonTextEn: data.buttonTextEn || null,
        buttonUrl: data.buttonUrl || null,
        faqItems: sectionType === 'faq' && faqItems.length > 0 ? JSON.stringify(faqItems) : null,
        figures: sectionType === 'figures' && figures.length > 0 ? JSON.stringify(figures) : null,
        partnerships: sectionType === 'partnerships' && partnerships.length > 0 ? JSON.stringify(partnerships) : null,
        mapEmbedUrl: sectionType === 'maps' ? (data.mapEmbedUrl || null) : null,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      }
      
      if (section) {
        await apiClient.put(`/admin/home-sections/${section.id}`, formData)
        showSuccess('Section berhasil diperbarui!', 3000, true)
      } else {
        await apiClient.post('/admin/home-sections/create', formData)
        showSuccess('Section berhasil ditambahkan!', 3000, true)
      }

      navigate('/admin/home-sections')
    } catch (err: any) {
      console.error('Submit error:', err)
      setError(err.message || 'Terjadi kesalahan saat menyimpan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any, (errors) => {
      console.error('Form validation errors:', errors)
      setError('Mohon lengkapi semua field yang wajib diisi')
    })} className="bg-white rounded-lg shadow p-6 space-y-6">
      {flashMessage.show && (
        <FlashMessage
          message={flashMessage.message}
          type={flashMessage.type}
          onClose={() => {}}
        />
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {Object.keys(errors).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p className="font-semibold mb-2">Terdapat kesalahan pada form:</p>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(errors).map(([key, error]: [string, any]) => (
              <li key={key}>{error?.message || `${key}: ${JSON.stringify(error)}`}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipe Section *
        </label>
        <Select2
          name="type"
          value={sectionType}
          onChange={(value) => {
            setValue('type', value as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
            trigger('type')
          }}
          options={[
            { value: 'motto', label: 'Motto' },
            { value: 'video-profile', label: 'Video Profile' },
            { value: 'admission', label: 'Admission (Penerimaan)' },
            { value: 'split-screen', label: 'Split Screen (Yellow Background)' },
            { value: 'masjid-al-fatih', label: 'Masjid AL FATIH' },
            { value: 'university-map', label: 'University Map (Peta Universitas)' },
            { value: 'global-stage', label: 'Global Stage (International Program)' },
            { value: 'feature', label: 'Feature' },
            { value: 'faq', label: 'FAQ Section' },
            { value: 'figures', label: 'Figures / Tokoh-Tokoh' },
            { value: 'partnerships', label: 'Partnerships / Kerjasama' },
            { value: 'news-section', label: 'News Section (Berita)' },
            { value: 'maps', label: 'Maps (Peta)' },
            { value: 'browser-section', label: 'Browser Section (Section Browser)' },
          ]}
          placeholder="Pilih tipe section..."
          isSearchable={true}
          error={errors.type?.message}
        />
        <input
          {...register('type')}
          type="hidden"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title (ID) {sectionType === 'masjid-al-fatih' && '*'}
          </label>
          <input
            {...register('title')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={sectionType === 'masjid-al-fatih' ? 'Masjid AL FATIH' : ''}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title (EN)
          </label>
          <input
            {...register('titleEn')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={sectionType === 'masjid-al-fatih' ? 'Al-Fatih Mosque' : ''}
          />
        </div>
      </div>

      {sectionType !== 'university-map' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle / Quote (ID) {sectionType === 'masjid-al-fatih' && '*'}
            </label>
            <input
              {...register('subtitle')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle / Quote (EN)
            </label>
            <input
              {...register('subtitleEn')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {(sectionType === 'admission' || sectionType === 'feature' || sectionType === 'split-screen' || sectionType === 'masjid-al-fatih' || sectionType === 'global-stage') && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content / Deskripsi (ID) {sectionType === 'masjid-al-fatih' && '*'}
            </label>
            <RichTextEditor
              value={content || ''}
              onChange={(value) => {
                setValue('content', value, { shouldValidate: true })
              }}
              placeholder="Masukkan konten deskripsi..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content / Deskripsi (EN)
            </label>
            <RichTextEditor
              value={contentEn || ''}
              onChange={(value) => {
                setValue('contentEn', value, { shouldValidate: true })
              }}
              placeholder="Enter content description..."
            />
          </div>
        </>
      )}

      {/* FAQ Items Manager */}
      {sectionType === 'faq' && (
        <FAQItemsManager
          value={faqItems}
          onChange={(items) => {
            setFaqItems(items)
            setValue('faqItems', items, { shouldValidate: true })
          }}
        />
      )}

      {/* Figures Items Manager */}
      {sectionType === 'figures' && (
        <FiguresItemsManager
          value={figures}
          onChange={(items) => {
            setFigures(items)
            setValue('figures', items, { shouldValidate: true })
          }}
        />
      )}

      {/* Partnerships Items Manager */}
      {sectionType === 'partnerships' && (
        <PartnershipsItemsManager
          value={partnerships}
          onChange={(items) => {
            setPartnerships(items)
            setValue('partnerships', items, { shouldValidate: true })
          }}
        />
      )}

      {sectionType === 'video-profile' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video URL
          </label>
          <input
            {...register('videoUrl')}
            type="url"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      )}

      {/* Single Image Upload */}
      {(sectionType === 'motto' || sectionType === 'video-profile' || sectionType === 'admission' || sectionType === 'split-screen' || sectionType === 'masjid-al-fatih' || sectionType === 'university-map' || sectionType === 'global-stage' || sectionType === 'faq' || sectionType === 'figures' || sectionType === 'browser-section') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gambar Utama
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
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <X size={18} />
              </button>
              {sectionType === 'browser-section' && previewImage && (
                <a
                  href={previewImage}
                  download
                  className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Upload size={18} />
                </a>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
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
                    <span className="text-gray-600 mb-1">Klik untuk upload gambar</span>
                    <span className="text-sm text-gray-500">PNG, JPG, GIF maksimal 5MB</span>
                  </>
                )}
              </label>
            </div>
          )}
          
          <input
            {...register('image')}
            type="hidden"
          />
        </div>
      )}

      {/* Image Left and Right Upload (for masjid-al-fatih) */}
      {sectionType === 'masjid-al-fatih' && (
        <div className="grid grid-cols-2 gap-4">
          {/* Image Left */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Kiri
            </label>
            
            {previewImageLeft ? (
              <div className="relative mb-4">
                <img
                  src={previewImageLeft}
                  alt="Preview Left"
                  className="h-48 w-full object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveImageLeft}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUploadLeft}
                  disabled={uploading}
                  className="hidden"
                  id="image-left-upload"
                />
                <label
                  htmlFor="image-left-upload"
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
                      <span className="text-gray-600 mb-1">Klik untuk upload gambar kiri</span>
                      <span className="text-sm text-gray-500">PNG, JPG, GIF maksimal 5MB</span>
                    </>
                  )}
                </label>
              </div>
            )}
            
            <input
              {...register('imageLeft')}
              type="hidden"
            />
          </div>

          {/* Image Right */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Kanan
            </label>
            
            {previewImageRight ? (
              <div className="relative mb-4">
                <img
                  src={previewImageRight}
                  alt="Preview Right"
                  className="h-48 w-full object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveImageRight}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUploadRight}
                  disabled={uploading}
                  className="hidden"
                  id="image-right-upload"
                />
                <label
                  htmlFor="image-right-upload"
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
                      <span className="text-gray-600 mb-1">Klik untuk upload gambar kanan</span>
                      <span className="text-sm text-gray-500">PNG, JPG, GIF maksimal 5MB</span>
                    </>
                  )}
                </label>
              </div>
            )}
            
            <input
              {...register('imageRight')}
              type="hidden"
            />
          </div>
        </div>
      )}

      {/* Multiple Images Upload (for admission collage) */}
      {sectionType === 'admission' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gambar Collage (Multiple)
          </label>
          
          {previewImages.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {previewImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={getImageUrl(img)}
                    alt={`Preview ${index + 1}`}
                    className="h-32 w-full object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMultipleImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleFileUpload}
              disabled={uploading}
              className="hidden"
              id="images-upload"
            />
            <label
              htmlFor="images-upload"
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
                  <span className="text-gray-600 mb-1">Klik untuk upload multiple gambar</span>
                  <span className="text-sm text-gray-500">PNG, JPG, GIF maksimal 5MB per gambar</span>
                </>
              )}
            </label>
          </div>
          
          <input
            type="hidden"
            {...register('images', { value: watchedImages || [] })}
          />
        </div>
      )}

      {/* Button Fields */}
      {(sectionType !== 'university-map' && sectionType !== 'masjid-al-fatih' && sectionType !== 'browser-section') && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text (ID)
              </label>
              <input
                {...register('buttonText')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Daftar Sekarang"
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
                placeholder="Register Now"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="/pendaftaran atau https://example.com"
            />
            {errors.buttonUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.buttonUrl.message}</p>
            )}
          </div>
        </>
      )}

      {/* Maps Section Fields */}
      {sectionType === 'maps' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Maps Embed URL / Iframe *
          </label>
          <textarea
            {...register('mapEmbedUrl')}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            placeholder="Paste iframe code atau embed URL dari Google Maps. Contoh: &lt;iframe src=&quot;https://www.google.com/maps/embed?pb=...&quot; width=&quot;600&quot; height=&quot;450&quot; style=&quot;border:0;&quot; allowfullscreen=&quot;&quot; loading=&quot;lazy&quot; referrerpolicy=&quot;no-referrer-when-downgrade&quot;&gt;&lt;/iframe&gt;"
          />
          <p className="mt-1 text-sm text-gray-500">
            Paste seluruh iframe code atau hanya URL src dari Google Maps embed
          </p>
          {errors.mapEmbedUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.mapEmbedUrl.message}</p>
          )}
        </div>
      )}

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
        </div>

        <div className="flex items-center pt-8">
          <input
            {...register('isActive')}
            type="checkbox"
            id="isActive"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Aktif
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/admin/home-sections')}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  )
}

