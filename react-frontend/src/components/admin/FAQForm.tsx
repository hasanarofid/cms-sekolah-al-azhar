import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, Loader2 } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { getImageUrl } from '../../lib/utils-image-url'
import { RichTextEditor } from './RichTextEditor'
import { useFlashMessage } from '../../hooks/useFlashMessage'

const faqSchema = z.object({
  question: z.string().min(1, 'Pertanyaan wajib diisi'),
  questionEn: z.string().optional(),
  answer: z.string().min(1, 'Jawaban wajib diisi'),
  answerEn: z.string().optional(),
  image: z.string().optional(),
  sectionTitle: z.string().optional(),
  sectionTitleEn: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

type FAQFormData = z.infer<typeof faqSchema>

interface FAQFormProps {
  faq?: {
    id: string
    question: string
    questionEn?: string | null
    answer: string
    answerEn?: string | null
    image?: string | null
    sectionTitle?: string | null
    sectionTitleEn?: string | null
    order: number
    isActive: boolean
  }
}

export function FAQForm({ faq }: FAQFormProps) {
  const navigate = useNavigate()
  const { showSuccess } = useFlashMessage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(
    faq?.image ? getImageUrl(faq.image) : null
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: faq
      ? {
          question: faq.question || '',
          questionEn: faq.questionEn || undefined,
          answer: faq.answer || '',
          answerEn: faq.answerEn || undefined,
          image: faq.image || undefined,
          sectionTitle: faq.sectionTitle || undefined,
          sectionTitleEn: faq.sectionTitleEn || undefined,
          order: faq.order ?? 0,
          isActive: faq.isActive ?? true,
        }
      : {
          order: 0,
          isActive: true,
          answer: '',
          answerEn: undefined,
          image: undefined,
          sectionTitle: undefined,
          sectionTitleEn: undefined,
        },
  } as any)

  const answerContent = watch('answer')
  const answerEnContent = watch('answerEn')

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
      const data = await apiClient.upload('/admin/upload', file, 'faqs')
      const imageUrl = data.url || data.path || ''
      if (!imageUrl) {
        throw new Error('Upload gagal: URL tidak ditemukan dalam response')
      }
      setValue('image', imageUrl, { shouldValidate: true })
      setPreviewImage(getImageUrl(imageUrl))
    } catch (err: any) {
      setError(err.message || 'Gagal mengupload gambar')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setValue('image', '', { shouldValidate: true })
    setPreviewImage(null)
  }

  const onSubmit = async (data: FAQFormData) => {
    setIsLoading(true)
    setError('')

    try {
      if (faq) {
        await apiClient.put(`/admin/faqs/${faq.id}`, data)
        showSuccess('FAQ berhasil diperbarui!', 3000, true)
      } else {
        await apiClient.post('/admin/faqs/create', data)
        showSuccess('FAQ berhasil ditambahkan!', 3000, true)
      }

      navigate('/admin/faqs')
    } catch (err: any) {
      console.error('Submit error:', err)
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pertanyaan (ID) *
        </label>
        <input
          {...register('question')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Apa Program Unggulan SMA AL AZHAR INSAN CENDEKIA JATIBENING?"
        />
        {errors.question && (
          <p className="mt-1 text-sm text-red-600">{errors.question.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pertanyaan (EN)
        </label>
        <input
          {...register('questionEn')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="What are SMA AL AZHAR INSAN CENDEKIA JATIBENING's Flagship Programs?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jawaban (ID) *
        </label>
        <RichTextEditor
          value={answerContent || ''}
          onChange={(value) => setValue('answer', value, { shouldValidate: true })}
          placeholder="Masukkan jawaban..."
        />
        {errors.answer && (
          <p className="mt-1 text-sm text-red-600">{errors.answer.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jawaban (EN)
        </label>
        <RichTextEditor
          value={answerEnContent || ''}
          onChange={(value) => setValue('answerEn', value, { shouldValidate: true })}
          placeholder="Enter answer..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Section Title / Motto (ID)
        </label>
        <input
          {...register('sectionTitle')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Excellence in Education, Harmony in Faith"
        />
        <p className="mt-1 text-xs text-gray-500">Judul/motto yang ditampilkan di atas FAQ section</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Section Title / Motto (EN)
        </label>
        <input
          {...register('sectionTitleEn')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Excellence in Education, Harmony in Faith"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gambar Samping (Right Side Image)
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
        <p className="mt-1 text-xs text-gray-500">Gambar yang ditampilkan di sebelah kanan FAQ section</p>
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
          onClick={() => navigate('/admin/faqs')}
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

