import { AdminLayout } from '../../components/admin/AdminLayout'
import { HomeSectionForm } from '../../components/admin/HomeSectionForm'

export default function HomeSectionNewPage() {
  return (
    <AdminLayout>
      <div className="w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Tambah Home Section</h1>
          <HomeSectionForm />
        </div>
      </div>
    </AdminLayout>
  )
}

