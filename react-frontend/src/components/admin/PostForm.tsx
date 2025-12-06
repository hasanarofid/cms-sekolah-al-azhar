import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Upload, X, Loader2, Tag } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { slugify } from '../../lib/utils'
import { getImageUrl } from '../../lib/utils-image-url'
import { RichTextEditor } from './RichTextEditor'
import { Select2 } from './Select2'
import { useFlashMessage } from '../../hooks/useFlashMessage'

interface Post {
  id: string
  title: string
  titleEn?: string | null
  slug: string
  content: string
  contentEn?: string | null
  excerpt?: string | null
  excerptEn?: string | null
  featuredImage?: string | null
  category?: string | null
  categoryId?: string | null
  tags?: string[]
  postType?: string
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string | null
  isPublished: boolean
}

interface PostFormProps {
  post?: Post
  categories?: Array<{ id: string; name: string; slug: string }>
}

export function PostForm({ post, categories = [] }: PostFormProps) {
  const navigate = useNavigate()
  const { showSuccess } = useFlashMessage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(
    post?.featuredImage ? getImageUrl(post.featuredImage) : null
  )
  const [tagsInput, setTagsInput] = useState<string>(
    post?.tags ? post.tags.join(', ') : ''
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: post
      ? {
          title: post.title,
          titleEn: post.titleEn || '',
          slug: post.slug,
          content: post.content,
          contentEn: post.contentEn || '',
          excerpt: post.excerpt || '',
          excerptEn: post.excerptEn || '',
          featuredImage: post.featuredImage || '',
          category: post.category || '',
          categoryId: post.categoryId || '',
          postType: post.postType || 'post',
          seoTitle: post.seoTitle || '',
          seoDescription: post.seoDescription || '',
          seoKeywords: post.seoKeywords || '',
          isPublished: post.isPublished,
        }
      : {
          postType: 'post',
          isPublished: false,
        },
  })

  const content = watch('content')
  const contentEn = watch('contentEn')
  const title = watch('title')

  // Auto-generate slug from title
  useEffect(() => {
    if (!post && title) {
      const generatedSlug = slugify(title)
      setValue('slug', generatedSlug, { shouldValidate: true })
    }
  }, [title, post, setValue])

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
      // Parse tags from comma-separated string
      const tags = tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const postData = {
        ...data,
        categoryId: data.categoryId || null,
        category: data.categoryId
          ? categories.find((c) => c.id === data.categoryId)?.name || null
          : null,
        featuredImage: data.featuredImage || null,
        tags,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        seoKeywords: data.seoKeywords || null,
      }

      if (post) {
        await apiClient.put(`/admin/posts/${post.id}`, postData)
        showSuccess('Post berhasil diperbarui!', 3000, true)
      } else {
        await apiClient.post('/admin/posts/create', postData)
        showSuccess('Post berhasil ditambahkan!', 3000, true)
      }

      navigate('/admin/posts')
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul (ID) *
          </label>
          <input
            {...register('title', { required: 'Judul wajib diisi' })}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Masukkan judul berita"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter post title (EN)"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            readOnly={!!post}
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug.message as string}</p>
          )}
          {!post && (
            <p className="mt-1 text-sm text-gray-500">Slug akan otomatis dibuat dari judul</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <Select2
            name="categoryId"
            value={watch('categoryId') || ''}
            onChange={(value: string) => setValue('categoryId', value || undefined)}
            options={[
              { value: '', label: 'Pilih Kategori' },
              ...categories.map((category) => ({
                value: category.id,
                label: category.name
              }))
            ]}
            placeholder="Pilih kategori..."
            isSearchable={true}
          />
        </div>
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
              id="post-image-upload"
            />
            <label
              htmlFor="post-image-upload"
              className={`cursor-pointer flex flex-col items-center justify-center ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin text-primary-500 mb-2" size={32} />
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt (ID) - Ringkasan
          </label>
          <textarea
            {...register('excerpt')}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ringkasan singkat artikel (akan muncul di preview)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt (EN) - Summary
          </label>
          <textarea
            {...register('excerptEn')}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Brief summary of the article (will appear in preview)"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags <span className="text-gray-500 text-xs">(pisahkan dengan koma)</span>
        </label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="contoh: berita, sekolah, pendidikan"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Contoh: berita, sekolah, pendidikan, akademik
        </p>
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
          placeholder="Masukkan konten artikel..."
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
          placeholder="Enter article content (EN)..."
        />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Judul untuk SEO (jika kosong akan menggunakan judul artikel)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Description
            </label>
            <textarea
              {...register('seoDescription')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Deskripsi untuk SEO (jika kosong akan menggunakan excerpt)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Keywords
            </label>
            <input
              {...register('seoKeywords')}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          {...register('isPublished')}
          type="checkbox"
          id="isPublished"
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
          Published (Tampilkan di halaman publik)
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/admin/posts')}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading || uploading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  )
}

