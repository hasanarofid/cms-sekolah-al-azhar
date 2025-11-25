import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { ProtectedRoute } from '../ProtectedRoute'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <AdminHeader />
        <main className="ml-64 mt-16 p-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}

