import { useState } from 'react'
import { X } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { useFlashMessage } from '../../hooks/useFlashMessage'

interface DeleteButtonProps {
  id: string
  apiEndpoint: string
  confirmMessage: string
  onDeleted?: () => void
  successMessage?: string
}

export function DeleteButton({ id, apiEndpoint, confirmMessage, onDeleted, successMessage }: DeleteButtonProps) {
  const { showSuccess, showError } = useFlashMessage()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(confirmMessage)) {
      return
    }

    setIsDeleting(true)
    try {
      // Use DELETE method with id in path
      await apiClient.delete(`${apiEndpoint}/${id}`)
      showSuccess(successMessage || 'Data berhasil dihapus!')
      if (onDeleted) {
        onDeleted()
      } else {
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (error: any) {
      console.error('Delete error:', error)
      showError(error.message || 'Gagal menghapus data')
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

