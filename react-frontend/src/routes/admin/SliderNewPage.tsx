import { AdminLayout } from '../../components/admin/AdminLayout'
import { SliderForm } from '../../components/admin/SliderForm'

export default function SliderNewPage() {
  return (
    <AdminLayout>
      <div className="w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Tambah Slider Baru</h1>
          <SliderForm />
        </div>
      </div>
    </AdminLayout>
  )
}

