'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, Loader2 } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { getImageUrl } from '../../lib/utils-image-url'
import { FAQItemsManager } from './FAQItemsManager'
import { NavigationItemsManager } from './NavigationItemsManager'
import { ProgramItemsManager } from './ProgramItemsManager'
import { FacilityItemsManager } from './FacilityItemsManager'
import { ExtracurricularItemsManager } from './ExtracurricularItemsManager'
import { OrganizationStructureManager } from './OrganizationStructureManager'
import { StudentAchievementsManager } from './StudentAchievementsManager'
import { CurriculumItemsManager } from './CurriculumItemsManager'
import { AcademicCalendarItemsManager } from './AcademicCalendarItemsManager'
import { DocumentItemsManager } from './DocumentItemsManager'
import { RichTextEditor } from './RichTextEditor'
import { Select2 } from './Select2'

const sectionSchema = z.object({
  type: z.enum(['motto', 'video-profile', 'admission', 'feature', 'split-screen', 'masjid-al-fatih', 'university-map', 'global-stage', 'news-section', 'faq', 'accreditation', 'navigation-grid', 'program-cards', 'facility-gallery', 'extracurricular-detail', 'organization-structure', 'student-achievements', 'curriculum-table', 'academic-calendar', 'bos-report', 'contact', 'maps', 'brosur-section']),
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
  badgeImage: z.string().optional(),
  accreditationNumber: z.string().optional(),
  accreditationBody: z.string().optional(),
  navigationItems: z.array(z.object({
    id: z.string(),
    label: z.string(),
    url: z.string(),
    icon: z.string().optional(),
  })).optional(),
  programItems: z.array(z.object({
    id: z.string(),
    icon: z.string(),
    title: z.string(),
    description: z.string(),
    url: z.string().optional(),
  })).optional(),
  facilityItems: z.array(z.object({
    id: z.string(),
    image: z.string(),
    caption: z.string().optional(),
    url: z.string().optional(),
  })).optional(),
  extracurricularItems: z.array(z.object({
    id: z.string(),
    image: z.string(),
    title: z.string(),
    description: z.string(),
  })).optional(),
  organizationItems: z.array(z.object({
    id: z.string(),
    name: z.string(),
    position: z.string(),
    positionEn: z.string().optional(),
    image: z.string().optional(),
    parentId: z.string().nullable().optional(),
    level: z.number(),
    order: z.number(),
  })).optional(),
  achievementItems: z.array(z.object({
    id: z.string(),
    title: z.string(),
    titleEn: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string(),
    descriptionEn: z.string().optional(),
    competitionName: z.string().optional(),
    competitionNameEn: z.string().optional(),
    students: z.array(z.object({
      id: z.string(),
      name: z.string(),
      image: z.string().optional(),
      position: z.string().optional(),
    })),
    backgroundType: z.enum(['gradient', 'gold', 'blue']).optional(),
    leftLogo: z.string().optional(),
    rightLogo: z.string().optional(),
    order: z.number(),
  })).optional(),
  faqItems: z.array(z.object({
    id: z.string(),
    question: z.string(),
    questionEn: z.string().optional(),
    answer: z.string(),
    answerEn: z.string().optional(),
    order: z.number(),
  })).optional(),
  curriculumItems: z.array(z.object({
    id: z.string(),
    mataPelajaran: z.string(),
    jpTM: z.number(),
    jpProyek: z.number().nullable().optional(),
    order: z.number(),
  })).optional(),
  calendarItems: z.array(z.object({
    id: z.string(),
    bulan: z.string(),
    kegiatan: z.string(),
    keterangan: z.string().optional(),
    tanggalMulai: z.string().optional(),
    tanggalSelesai: z.string().optional(),
    order: z.number(),
  })).optional(),
  documentItems: z.array(z.object({
    id: z.string(),
    nama: z.string(),
    fileUrl: z.string(),
    fileName: z.string().optional(),
    order: z.number(),
  })).optional(),
  address: z.string().optional(),
  addressEn: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')).nullable(),
  phone: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.union([z.boolean(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val === 1
    return val === true
  }).default(true),
})

type SectionFormData = z.infer<typeof sectionSchema>

interface PageSectionFormProps {
  pageId: string
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
    address?: string | null
    addressEn?: string | null
    email?: string | null
    phone?: string | null
    mapEmbedUrl?: string | null
    order: number
    isActive: boolean
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export function PageSectionForm({ pageId, section, onSuccess, onCancel }: PageSectionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(
    section?.image ? getImageUrl(section.image) : null
  )
  const [previewImages, setPreviewImages] = useState<string[]>(
    section?.images || []
  )
  
  // Parse items from section (could be JSON string or array)
  const parseItems = (items: any) => {
    if (!items) {
      console.log('parseItems: items is null/undefined')
      return []
    }
    if (Array.isArray(items)) {
      console.log('parseItems: items is already array:', items)
      return items
    }
    try {
      const parsed = JSON.parse(items)
      console.log('parseItems: parsed JSON:', parsed)
      return Array.isArray(parsed) ? parsed : []
    } catch (err) {
      console.error('parseItems: JSON parse error:', err, 'Items:', items)
      return []
    }
  }
  
  const [faqItems, setFaqItems] = useState<any[]>(parseItems(section?.faqItems))
  const [navigationItems, setNavigationItems] = useState<any[]>(parseItems((section as any)?.navigationItems))
  const [programItems, setProgramItems] = useState<any[]>(parseItems((section as any)?.programItems))
  const [facilityItems, setFacilityItems] = useState<any[]>(parseItems((section as any)?.facilityItems))
  const [extracurricularItems, setExtracurricularItems] = useState<any[]>(parseItems((section as any)?.extracurricularItems))
  const [organizationItems, setOrganizationItems] = useState<any[]>(parseItems((section as any)?.organizationItems))
  const [achievementItems, setAchievementItems] = useState<any[]>(parseItems((section as any)?.achievementItems))
  const [curriculumItems, setCurriculumItems] = useState<any[]>(parseItems((section as any)?.curriculumItems))
  const [calendarItems, setCalendarItems] = useState<any[]>(parseItems((section as any)?.calendarItems))
  const [documentItems, setDocumentItems] = useState<any[]>(() => {
    const parsed = parseItems((section as any)?.documentItems)
    console.log('=== LOADING DOCUMENT ITEMS ===')
    console.log('Raw section.documentItems:', (section as any)?.documentItems)
    console.log('Parsed documentItems:', parsed)
    parsed.forEach((item: any, index: number) => {
      console.log(`Document Item ${index}:`, {
        id: item.id,
        nama: item.nama,
        fileUrl: item.fileUrl,
        fileName: item.fileName,
        order: item.order
      })
    })
    return parsed
  })
  
  const [previewBadgeImage, setPreviewBadgeImage] = useState<string | null>(
    (section as any)?.badgeImage ? getImageUrl((section as any).badgeImage) : null
  )

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
          type: section.type as any,
          title: section.title || undefined,
          titleEn: section.titleEn || undefined,
          subtitle: section.subtitle || undefined,
          subtitleEn: section.subtitleEn || undefined,
          content: section.content || undefined,
          contentEn: section.contentEn || undefined,
          image: section.image || undefined,
          images: section.images || undefined,
          videoUrl: section.videoUrl || undefined,
          buttonText: section.buttonText || undefined,
          buttonTextEn: section.buttonTextEn || undefined,
          buttonUrl: section.buttonUrl || undefined,
          faqItems: parseItems(section.faqItems),
          badgeImage: (section as any)?.badgeImage || undefined,
          accreditationNumber: (section as any)?.accreditationNumber || undefined,
          accreditationBody: (section as any)?.accreditationBody || undefined,
          navigationItems: parseItems((section as any)?.navigationItems),
          programItems: parseItems((section as any)?.programItems),
          facilityItems: parseItems((section as any)?.facilityItems),
          extracurricularItems: parseItems((section as any)?.extracurricularItems),
          organizationItems: parseItems((section as any)?.organizationItems),
          achievementItems: parseItems((section as any)?.achievementItems),
          curriculumItems: parseItems((section as any)?.curriculumItems),
          calendarItems: parseItems((section as any)?.calendarItems),
          documentItems: parseItems((section as any)?.documentItems),
          address: (section as any)?.address || undefined,
          addressEn: (section as any)?.addressEn || undefined,
          email: (section as any)?.email || undefined,
          phone: (section as any)?.phone || undefined,
          mapEmbedUrl: (section as any)?.mapEmbedUrl || undefined,
          order: section.order ?? 0,
          isActive: typeof section.isActive === 'number' ? section.isActive === 1 : (section.isActive ?? true),
        }
      : {
          type: 'feature',
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
          videoUrl: undefined,
          buttonText: undefined,
          buttonTextEn: undefined,
          buttonUrl: undefined,
          faqItems: undefined,
        },
  } as any)

  const sectionType = watch('type')
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
      const data = await apiClient.upload('/admin/upload', file, 'page-sections')
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
          const data = await apiClient.upload('/admin/upload', file, 'page-sections')
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

  const handleBadgeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar')
      return
    }

    setUploading(true)
    try {
      const data = await apiClient.upload('/admin/upload', file, 'general')
      const imageUrl = data.url || data.path || ''
      if (imageUrl) {
        setValue('badgeImage', imageUrl)
        setPreviewBadgeImage(getImageUrl(imageUrl))
      }
    } catch (err) {
      alert('Gagal mengupload gambar')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setValue('image', '')
    setPreviewImage(null)
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
      const imagesArray = Array.isArray(data.images) ? data.images : (watchedImages || [])
      
      const formData = {
        pageId,
        type: data.type,
        title: data.title || null,
        titleEn: data.titleEn || null,
        subtitle: data.subtitle || null,
        subtitleEn: data.subtitleEn || null,
        content: data.content || null,
        contentEn: data.contentEn || null,
        image: data.image || null,
        images: imagesArray.length > 0 ? imagesArray : null,
        videoUrl: data.videoUrl || null,
        buttonText: data.buttonText || null,
        buttonTextEn: data.buttonTextEn || null,
        buttonUrl: data.buttonUrl || null,
        badgeImage: data.badgeImage || null,
        accreditationNumber: data.accreditationNumber || null,
        accreditationBody: data.accreditationBody || null,
        navigationItems: sectionType === 'navigation-grid' && navigationItems.length > 0 ? JSON.stringify(navigationItems) : null,
        programItems: sectionType === 'program-cards' && programItems.length > 0 ? JSON.stringify(programItems) : null,
        facilityItems: sectionType === 'facility-gallery' && facilityItems.length > 0 ? JSON.stringify(facilityItems) : null,
        extracurricularItems: sectionType === 'extracurricular-detail' && extracurricularItems.length > 0 ? JSON.stringify(extracurricularItems) : null,
        organizationItems: sectionType === 'organization-structure' && organizationItems.length > 0 ? JSON.stringify(organizationItems) : null,
        achievementItems: sectionType === 'student-achievements' && achievementItems.length > 0 ? JSON.stringify(achievementItems) : null,
        curriculumItems: sectionType === 'curriculum-table' && curriculumItems.length > 0 ? JSON.stringify(curriculumItems) : null,
        calendarItems: sectionType === 'academic-calendar' && calendarItems.length > 0 ? JSON.stringify(calendarItems) : null,
        documentItems: sectionType === 'bos-report' && documentItems.length > 0 ? (() => {
          console.log('=== SAVING DOCUMENT ITEMS ===')
          console.log('documentItems before filter:', documentItems)
          
          // Filter hanya item yang memiliki fileUrl (wajib untuk preview)
          const validItems = documentItems.filter(item => {
            const hasFileUrl = item.fileUrl && item.fileUrl.trim() !== ''
            if (!hasFileUrl) {
              console.warn('Skipping item without fileUrl:', item)
            }
            return hasFileUrl
          })
          
          console.log('documentItems after filter (with fileUrl):', validItems)
          
          if (validItems.length === 0) {
            console.warn('WARNING: Tidak ada documentItems yang valid (semua tidak punya fileUrl)!')
            console.warn('Semua items:', documentItems)
            // Tetap kirim array kosong atau null, jangan kirim item tanpa fileUrl
            return null
          }
          
          const jsonString = JSON.stringify(validItems)
          console.log('documentItems JSON string:', jsonString)
          return jsonString
        })() : null,
        address: sectionType === 'contact' ? (data.address || null) : null,
        addressEn: sectionType === 'contact' ? (data.addressEn || null) : null,
        email: sectionType === 'contact' ? (data.email || null) : null,
        phone: sectionType === 'contact' ? (data.phone || null) : null,
        mapEmbedUrl: (sectionType === 'contact' || sectionType === 'maps') ? (data.mapEmbedUrl || null) : null,
        faqItems: sectionType === 'faq' && faqItems.length > 0 ? JSON.stringify(faqItems) : null,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      }
      
      console.log('=== FORM SUBMIT ===')
      console.log('Section type:', sectionType)
      console.log('Form data to send:', formData)
      
      if (section) {
        console.log('Updating section:', section.id)
        await apiClient.put(`/admin/page-sections/${section.id}`, formData)
      } else {
        console.log('Creating new section')
        await apiClient.post(`/admin/pages/${pageId}/sections/create`, formData)
      }
      
      console.log('Section saved successfully!')

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
    <form onSubmit={handleSubmit(onSubmit as any, (errors) => {
      console.error('Form validation errors:', errors)
      setError('Mohon lengkapi semua field yang wajib diisi')
    })} className="bg-white rounded-lg shadow p-6 space-y-6">
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
            { value: 'news-section', label: 'News Section (Berita)' },
            { value: 'faq', label: 'FAQ Section' },
            { value: 'accreditation', label: 'Accreditation (Akreditasi)' },
            { value: 'navigation-grid', label: 'Navigation Grid (Grid Navigasi)' },
            { value: 'program-cards', label: 'Program Cards (Kartu Program)' },
            { value: 'facility-gallery', label: 'Facility Gallery (Galeri Fasilitas)' },
            { value: 'extracurricular-detail', label: 'Extracurricular Detail (Detail Ekstrakurikuler)' },
            { value: 'organization-structure', label: 'Organization Structure (Struktur Organisasi)' },
            { value: 'student-achievements', label: 'Student Achievements (Prestasi Siswa)' },
            { value: 'curriculum-table', label: 'Curriculum Table (Tabel Kurikulum)' },
            { value: 'academic-calendar', label: 'Academic Calendar (Kalender Pendidikan)' },
            { value: 'bos-report', label: 'BOS Report (Laporan Realisasi BOS)' },
            { value: 'contact', label: 'Contact (Kontak)' },
            { value: 'maps', label: 'Maps (Peta)' },
            { value: 'brosur-section', label: 'Brosur Section (Section Brosur)' },
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

      {/* Content / Deskripsi dengan RichTextEditor untuk curriculum-table, academic-calendar, bos-report, dan contact */}
      {(sectionType === 'curriculum-table' || sectionType === 'academic-calendar' || sectionType === 'bos-report' || sectionType === 'contact') && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi (ID)
            </label>
            <RichTextEditor
              value={watch('content') || ''}
              onChange={(value) => setValue('content', value, { shouldValidate: true })}
              placeholder={
                sectionType === 'curriculum-table' ? "Masukkan deskripsi kurikulum..." :
                sectionType === 'academic-calendar' ? "Masukkan deskripsi kalender pendidikan..." :
                sectionType === 'bos-report' ? "Masukkan deskripsi laporan realisasi BOS..." :
                "Masukkan deskripsi kontak..."
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi (EN)
            </label>
            <RichTextEditor
              value={watch('contentEn') || ''}
              onChange={(value) => setValue('contentEn', value, { shouldValidate: true })}
              placeholder={
                sectionType === 'curriculum-table' ? "Enter curriculum description..." :
                sectionType === 'academic-calendar' ? "Enter academic calendar description..." :
                sectionType === 'bos-report' ? "Enter BOS realization report description..." :
                "Enter contact description..."
              }
            />
          </div>
        </>
      )}

      {(sectionType === 'admission' || sectionType === 'feature' || sectionType === 'split-screen' || sectionType === 'masjid-al-fatih' || sectionType === 'news-section' || sectionType === 'global-stage') && (
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

      {/* Accreditation Section */}
      {sectionType === 'accreditation' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Badge Image *
            </label>
            {previewBadgeImage ? (
              <div className="relative mb-4">
                <img
                  src={previewBadgeImage}
                  alt="Badge Preview"
                  className="h-32 w-32 object-contain border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setValue('badgeImage', '')
                    setPreviewBadgeImage(null)
                  }}
                  className="absolute top-0 right-0 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBadgeImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="badge-image-upload"
                />
                <label
                  htmlFor="badge-image-upload"
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
                      <span className="text-gray-600 mb-1">Klik untuk upload badge</span>
                    </>
                  )}
                </label>
              </div>
            )}
            <input
              {...register('badgeImage')}
              type="hidden"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accreditation Number (Opsional)
            </label>
            <input
              {...register('accreditationNumber')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="267/BAN-PDM/SK/2024"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accreditation Body (Opsional)
            </label>
            <input
              {...register('accreditationBody')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="BAN-PDM"
            />
          </div>
        </>
      )}

      {/* Navigation Grid Items Manager */}
      {sectionType === 'navigation-grid' && (
        <NavigationItemsManager
          value={navigationItems}
          onChange={(items) => {
            setNavigationItems(items)
            setValue('navigationItems', items, { shouldValidate: true })
          }}
        />
      )}

      {/* Program Cards Items Manager */}
      {sectionType === 'program-cards' && (
        <ProgramItemsManager
          value={programItems}
          onChange={(items) => {
            setProgramItems(items)
            setValue('programItems', items, { shouldValidate: true })
          }}
        />
      )}

      {/* Facility Gallery Items Manager */}
      {sectionType === 'facility-gallery' && (
        <FacilityItemsManager
          value={facilityItems}
          onChange={(items) => {
            setFacilityItems(items)
            setValue('facilityItems', items, { shouldValidate: true })
          }}
        />
      )}

      {/* Organization Structure Items Manager */}
      {sectionType === 'organization-structure' && (
        <OrganizationStructureManager
          value={organizationItems}
          onChange={(items) => {
            setOrganizationItems(items)
            setValue('organizationItems', items, { shouldValidate: true })
          }}
        />
      )}

      {/* Student Achievements Items Manager */}
      {sectionType === 'student-achievements' && (
        <StudentAchievementsManager
          value={achievementItems}
          onChange={(items) => {
            setAchievementItems(items)
            setValue('achievementItems', items, { shouldValidate: true })
          }}
        />
      )}

      {/* Curriculum Table Items Manager */}
      {sectionType === 'curriculum-table' && (
        <CurriculumItemsManager
          value={curriculumItems}
          onChange={(items) => {
            setCurriculumItems(items)
            setValue('curriculumItems', items, { shouldValidate: true })
          }}
        />
      )}

      {/* Academic Calendar Items Manager */}
      {sectionType === 'academic-calendar' && (
        <AcademicCalendarItemsManager
          value={calendarItems}
          onChange={(items) => {
            setCalendarItems(items)
            setValue('calendarItems', items, { shouldValidate: true })
          }}
        />
      )}

      {/* BOS Report / Document Items Manager */}
      {sectionType === 'bos-report' && (
        <DocumentItemsManager
          value={documentItems}
          onChange={(items) => {
            setDocumentItems(items)
            setValue('documentItems', items, { shouldValidate: true })
          }}
        />
      )}

      {/* Contact Section Fields */}
      {sectionType === 'contact' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat (ID) *
              </label>
              <textarea
                {...register('address')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Jl. Raya Solo – Tawangmangu, Salam, Karangpandan, Karanganyar"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat (EN)
              </label>
              <textarea
                {...register('addressEn')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Jl. Raya Solo – Tawangmangu, Salam, Karangpandan, Karanganyar"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="aaiibs@alazhariibs.sch.id"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call Center / Phone *
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0811 2020 101"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Maps Embed URL / Iframe *
            </label>
            <textarea
              {...register('mapEmbedUrl')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              placeholder="Paste iframe code atau embed URL dari Google Maps. Contoh: &lt;iframe src=&quot;https://www.google.com/maps/embed?pb=...&quot; width=&quot;600&quot; height=&quot;450&quot; style=&quot;border:0;&quot; allowfullscreen=&quot;&quot; loading=&quot;lazy&quot; referrerpolicy=&quot;no-referrer-when-downgrade&quot;&gt;&lt;/iframe&gt;"
            />
            <p className="mt-1 text-sm text-gray-500">
              Cara mendapatkan embed URL: Buka Google Maps → Cari lokasi → Klik "Bagikan" → Pilih "Sematkan peta" → Salin URL iframe src atau paste seluruh iframe code
            </p>
          </div>
        </>
      )}

      {/* Extracurricular Detail Items Manager */}
      {sectionType === 'extracurricular-detail' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Left (Gambar Siswa di Kiri) *
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
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="extracurricular-image-left-upload"
                />
                <label
                  htmlFor="extracurricular-image-left-upload"
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
          <ExtracurricularItemsManager
            value={extracurricularItems}
            onChange={(items) => {
              setExtracurricularItems(items)
              setValue('extracurricularItems', items, { shouldValidate: true })
            }}
          />
        </>
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
      {(sectionType === 'motto' || sectionType === 'video-profile' || sectionType === 'admission' || sectionType === 'split-screen' || sectionType === 'masjid-al-fatih' || sectionType === 'university-map' || sectionType === 'global-stage' || sectionType === 'news-section' || sectionType === 'faq' || sectionType === 'accreditation' || sectionType === 'brosur-section') && (
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
              {sectionType === 'brosur-section' && previewImage && (
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
      {(sectionType !== 'university-map' && sectionType !== 'masjid-al-fatih' && sectionType !== 'news-section' && sectionType !== 'brosur-section') && (
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
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading && <Loader2 size={18} className="animate-spin" />}
          <span>{isLoading ? 'Menyimpan...' : 'Simpan'}</span>
        </button>
      </div>
    </form>
  )
}

