import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { apiClient } from '../../lib/api-client'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    posts: 0,
    pages: 0,
    menus: 0,
    contacts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [posts, pages, menus, contacts] = await Promise.all([
          apiClient.get('/admin/posts').catch(() => []),
          apiClient.get('/admin/pages').catch(() => []),
          apiClient.get('/admin/menus').catch(() => []),
          apiClient.get('/admin/contacts').catch(() => []),
        ])

        setStats({
          posts: Array.isArray(posts) ? posts.length : 0,
          pages: Array.isArray(pages) ? pages.length : 0,
          menus: Array.isArray(menus) ? menus.length : 0,
          contacts: Array.isArray(contacts) ? contacts.length : 0,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Posts</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.posts}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Pages</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.pages}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Menus</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.menus}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Contacts</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.contacts}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Selamat Datang di Admin Panel</h2>
          <p className="text-gray-600">
            Gunakan menu di sidebar untuk mengelola konten website.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}

