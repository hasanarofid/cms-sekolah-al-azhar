import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { PostForm } from '../../components/admin/PostForm'
import { apiClient } from '../../lib/api-client'
import { Loader2 } from 'lucide-react'

export default function PostEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  async function loadData() {
    try {
      const [postData, categoriesData] = await Promise.all([
        apiClient.get(`/admin/posts/${id}`),
        apiClient.get('/admin/categories'),
      ])

      // Flatten categories (include parent and children)
      const allCategories: any[] = []
      if (Array.isArray(categoriesData)) {
        categoriesData.forEach((cat: any) => {
          allCategories.push(cat)
          if (cat.children && Array.isArray(cat.children)) {
            allCategories.push(...cat.children)
          }
        })
      }

      setPost(postData)
      setCategories(allCategories)
    } catch (error) {
      console.error('Error loading data:', error)
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

  if (!post) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Post tidak ditemukan</p>
          <button
            onClick={() => navigate('/admin/posts')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            ← Kembali ke Daftar Berita
          </button>
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
            <h1 className="text-3xl font-bold">Edit Berita</h1>
          </div>

          <PostForm post={post} categories={categories} />
        </div>
      </div>
    </AdminLayout>
  )
}

