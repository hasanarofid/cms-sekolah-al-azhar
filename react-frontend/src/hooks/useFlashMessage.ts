import { useState, useCallback, useEffect } from 'react'

export type FlashMessageType = 'success' | 'error' | 'info' | 'warning'

interface FlashMessageState {
  message: string
  type: FlashMessageType
  show: boolean
}

const FLASH_MESSAGE_KEY = 'flash_message'

export function useFlashMessage() {
  const [flashMessage, setFlashMessage] = useState<FlashMessageState>({
    message: '',
    type: 'success',
    show: false,
  })

  // Load flash message from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(FLASH_MESSAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setFlashMessage({
          message: parsed.message,
          type: parsed.type,
          show: true,
        })
        sessionStorage.removeItem(FLASH_MESSAGE_KEY)
        
        // Auto hide after duration
        if (parsed.duration && parsed.duration > 0) {
          setTimeout(() => {
            setFlashMessage((prev) => ({ ...prev, show: false }))
          }, parsed.duration)
        }
      } catch (e) {
        console.error('Error parsing flash message:', e)
      }
    }
  }, [])

  const showFlashMessage = useCallback((
    message: string,
    type: FlashMessageType = 'success',
    duration: number = 3000,
    persist: boolean = false
  ) => {
    setFlashMessage({
      message,
      type,
      show: true,
    })

    if (persist) {
      // Save to sessionStorage for next page
      sessionStorage.setItem(FLASH_MESSAGE_KEY, JSON.stringify({
        message,
        type,
        duration,
      }))
    } else {
      // Remove from sessionStorage if exists
      sessionStorage.removeItem(FLASH_MESSAGE_KEY)
      
      if (duration > 0) {
        setTimeout(() => {
          setFlashMessage((prev) => ({ ...prev, show: false }))
        }, duration)
      }
    }
  }, [])

  const hideFlashMessage = useCallback(() => {
    setFlashMessage((prev) => ({ ...prev, show: false }))
    sessionStorage.removeItem(FLASH_MESSAGE_KEY)
  }, [])

  const showSuccess = useCallback((message: string, duration?: number, persist?: boolean) => {
    showFlashMessage(message, 'success', duration, persist)
  }, [showFlashMessage])

  const showError = useCallback((message: string, duration?: number, persist?: boolean) => {
    showFlashMessage(message, 'error', duration, persist)
  }, [showFlashMessage])

  const showInfo = useCallback((message: string, duration?: number, persist?: boolean) => {
    showFlashMessage(message, 'info', duration, persist)
  }, [showFlashMessage])

  const showWarning = useCallback((message: string, duration?: number, persist?: boolean) => {
    showFlashMessage(message, 'warning', duration, persist)
  }, [showFlashMessage])

  return {
    flashMessage,
    showFlashMessage,
    hideFlashMessage,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
}

