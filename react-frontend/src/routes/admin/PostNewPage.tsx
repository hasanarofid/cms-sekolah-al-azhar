import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { PostForm } from '../../components/admin/PostForm'
import { apiClient } from '../../lib/api-client'
import { Loader2 } from 'lucide-react'

export default function PostNewPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      const data = await apiClient.get('/admin/categories')
      // Flatten categories (include parent and children)
      const allCategories: any[] = []
      if (Array.isArray(data)) {
        data.forEach((cat: any) => {
          allCategories.push(cat)
          if (cat.children && Array.isArray(cat.children)) {
            allCategories.push(...cat.children)
          }
        })
      }
      setCategories(allCategories)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin h-12 w-12 text-primary-600" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate('/admin/posts')}
              className="text-primary-600 hover:text-primary-700 mb-4"
            >
              ← Kembali ke Daftar Berita
            </button>
            <h1 className="text-3xl font-bold">Tambah Berita Baru</h1>
          </div>

          <PostForm categories={categories} />
        </div>
      </div>
    </AdminLayout>
  )
}

