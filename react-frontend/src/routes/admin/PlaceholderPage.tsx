import { AdminLayout } from '../../components/admin/AdminLayout'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <AdminLayout>
      <div className="w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{title}</h1>
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              {description || 'Halaman ini sedang dalam pengembangan.'}
            </p>
            <p className="text-gray-500 text-sm">
              Untuk saat ini, gunakan Next.js admin panel untuk mengelola konten ini.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

