import { AdminLayout } from '../../components/admin/AdminLayout'
import { FAQForm } from '../../components/admin/FAQForm'

export default function FAQNewPage() {
  return (
    <AdminLayout>
      <div className="w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Tambah FAQ</h1>
          <FAQForm />
        </div>
      </div>
    </AdminLayout>
  )
}

