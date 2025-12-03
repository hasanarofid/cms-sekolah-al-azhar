import { useState } from 'react'
import { Power, PowerOff } from 'lucide-react'
import { apiClient } from '../../lib/api-client'

interface StatusToggleButtonProps {
  id: string
  apiEndpoint: string
  isActive: boolean
  onToggled?: () => void
}

export function StatusToggleButton({ id, apiEndpoint, isActive, onToggled }: StatusToggleButtonProps) {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      // Update status using PUT method
      // Use update endpoint for consistency
      await apiClient.put(`${apiEndpoint}/${id}/update`, {
        isActive: !isActive
      })
      if (onToggled) {
        onToggled()
      } else {
        window.location.reload()
      }
    } catch (error: any) {
      console.error('Toggle status error:', error)
      alert(error.message || 'Gagal mengubah status')
      setIsToggling(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className={`${
        isActive 
          ? 'text-green-600 hover:text-green-900' 
          : 'text-gray-400 hover:text-gray-600'
      } disabled:opacity-50`}
      title={isActive ? 'Nonaktifkan' : 'Aktifkan'}
    >
      {isActive ? <Power size={18} /> : <PowerOff size={18} />}
    </button>
  )
}

