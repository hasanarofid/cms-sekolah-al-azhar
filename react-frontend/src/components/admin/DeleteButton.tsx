import { useState } from 'react'
import { X } from 'lucide-react'
import { apiClient } from '../../lib/api-client'

interface DeleteButtonProps {
  id: string
  apiEndpoint: string
  confirmMessage: string
  onDeleted?: () => void
}

export function DeleteButton({ id, apiEndpoint, confirmMessage, onDeleted }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(confirmMessage)) {
      return
    }

    setIsDeleting(true)
    try {
      // Use DELETE method with id in path
      await apiClient.delete(`${apiEndpoint}/${id}`)
      if (onDeleted) {
        onDeleted()
      } else {
        window.location.reload()
      }
    } catch (error: any) {
      console.error('Delete error:', error)
      alert(error.message || 'Gagal menghapus data')
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
      title="Hapus"
    >
      <X size={18} />
    </button>
  )
}

