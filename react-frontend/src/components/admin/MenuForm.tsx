import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { slugify } from '../../lib/utils'
import { Select2 } from './Select2'

interface Menu {
  id: string
  title: string
  titleEn?: string | null
  slug: string
  parentId?: string | null
  menuType: string
  externalUrl?: string | null
  icon?: string | null
  description?: string | null
  descriptionEn?: string | null
  order: number
  isActive: boolean
}

interface MenuFormProps {
  menu?: Menu
  allMenus?: Menu[]
}

export function MenuForm({ menu, allMenus = [] }: MenuFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: menu
      ? {
          title: menu.title,
          titleEn: menu.titleEn || '',
          slug: menu.slug,
          parentId: menu.parentId || '',
          menuType: menu.menuType || 'page',
          externalUrl: menu.externalUrl || '',
          icon: menu.icon || '',
          description: menu.description || '',
          descriptionEn: menu.descriptionEn || '',
          order: menu.order || 0,
          isActive: menu.isActive !== undefined ? menu.isActive : true,
        }
      : {
          menuType: 'page',
          order: 0,
          isActive: true,
        },
  })

  const title = watch('title')
  const menuType = watch('menuType')
  const parentId = watch('parentId')

  // Auto-generate slug from title
  useEffect(() => {
    if (!menu && title) {
      const generatedSlug = slugify(title)
      setValue('slug', generatedSlug, { shouldValidate: true })
    }
  }, [title, menu, setValue])

  // Filter out current menu and its children from parent options
  const getParentOptions = () => {
    if (!menu) {
      return allMenus
        .filter((m) => !m.parentId)
        .map((m) => ({
          value: m.id,
          label: m.title,
        }))
    }

    // Exclude current menu and its children
    const excludeIds = [menu.id]
    const getChildrenIds = (menuId: string): string[] => {
      const children = allMenus.filter((m) => m.parentId === menuId)
      const ids = children.map((c) => c.id)
      children.forEach((c) => {
        ids.push(...getChildrenIds(c.id))
      })
      return ids
    }
    excludeIds.push(...getChildrenIds(menu.id))

    return allMenus
      .filter((m) => !m.parentId && !excludeIds.includes(m.id))
      .map((m) => ({
        value: m.id,
        label: m.title,
      }))
  }

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    setError('')

    try {
      const payload: any = {
        title: data.title,
        titleEn: data.titleEn || null,
        slug: data.slug || '#',
        parentId: data.parentId || null,
        menuType: data.menuType || 'page',
        externalUrl: data.externalUrl || null,
        icon: data.icon || null,
        description: data.description || null,
        descriptionEn: data.descriptionEn || null,
        order: parseInt(data.order) || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      }

      if (menu) {
        // Update existing menu
        await apiClient.put(`/admin/menus/${menu.id}/update`, payload)
      } else {
        // Create new menu
        await apiClient.post('/admin/menus/create', payload)
      }

      navigate('/admin/menus')
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan menu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul Menu (Indonesia) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('title', { required: 'Judul menu wajib diisi' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Contoh: Beranda"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul Menu (English)
          </label>
          <input
            type="text"
            {...register('titleEn')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Example: Home"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('slug', { required: 'Slug wajib diisi' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="contoh-slug"
          />
          <p className="mt-1 text-sm text-gray-500">
            Gunakan "#" untuk menu tanpa halaman (parent menu saja)
          </p>
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parent Menu
          </label>
          <Select2
            name="parentId"
            value={parentId || ''}
            onChange={(value: string) => setValue('parentId', value || undefined)}
            options={[
              { value: '', label: 'Tidak ada parent (Menu Utama)' },
              ...getParentOptions(),
            ]}
            placeholder="Pilih parent menu..."
            isSearchable={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipe Menu <span className="text-red-500">*</span>
          </label>
          <select
            {...register('menuType', { required: 'Tipe menu wajib dipilih' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="page">Halaman</option>
            <option value="external">Link Eksternal</option>
            <option value="category">Kategori</option>
            <option value="post-list">Daftar Post</option>
          </select>
          {errors.menuType && (
            <p className="mt-1 text-sm text-red-600">{errors.menuType.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urutan
          </label>
          <input
            type="number"
            {...register('order')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      {menuType === 'external' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Eksternal <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            {...register('externalUrl', {
              required: menuType === 'external' ? 'URL eksternal wajib diisi' : false,
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="https://example.com"
          />
          {errors.externalUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.externalUrl.message as string}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon (opsional)
          </label>
          <input
            type="text"
            {...register('icon')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Nama icon atau class CSS"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('isActive')}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Menu Aktif</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi (Indonesia)
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Deskripsi menu..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi (English)
        </label>
        <textarea
          {...register('descriptionEn')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Menu description..."
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <button
          type="button"
          onClick={() => navigate('/admin/menus')}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
          <span>{menu ? 'Simpan Perubahan' : 'Buat Menu'}</span>
        </button>
      </div>
    </form>
  )
}

