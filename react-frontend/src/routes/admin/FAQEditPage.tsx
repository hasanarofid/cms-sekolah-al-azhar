import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { FAQForm } from '../../components/admin/FAQForm'
import { apiClient } from '../../lib/api-client'

export default function FAQEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [faq, setFaq] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadFAQ()
    }
  }, [id])

  async function loadFAQ() {
    try {
      const data = await apiClient.get(`/admin/faqs/${id}`)
      setFaq(data)
    } catch (error) {
      console.error('Error loading FAQ:', error)
      navigate('/admin/faqs')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!faq) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">FAQ tidak ditemukan</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Edit FAQ</h1>
          <FAQForm faq={faq} />
        </div>
      </div>
    </AdminLayout>
  )
}

