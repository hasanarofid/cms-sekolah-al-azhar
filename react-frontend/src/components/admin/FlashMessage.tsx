import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react'
import type { FlashMessageType } from '../../hooks/useFlashMessage'

interface FlashMessageProps {
  message: string
  type?: FlashMessageType
  duration?: number
  onClose?: () => void
  show?: boolean
}

export function FlashMessage({ 
  message, 
  type = 'success', 
  duration = 3000,
  onClose,
  show = true
}: FlashMessageProps) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)
  }, [show])

  useEffect(() => {
    if (duration > 0 && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) {
          setTimeout(onClose, 300) // Wait for fade out animation
        }
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose, isVisible])

  if (!isVisible || !message) return null

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: XCircle,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: Info,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: AlertCircle,
    },
  }

  const style = styles[type]
  const Icon = style.icon

  return (
    <div
      className={`${style.bg} ${style.border} ${style.text} border px-4 py-3 rounded-lg mb-4 flex items-center justify-between transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon size={20} className="flex-shrink-0" />
        <p className="font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className={`${style.text} hover:opacity-70 transition-opacity ml-4`}
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}

