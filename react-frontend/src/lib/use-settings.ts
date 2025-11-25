import { useEffect } from 'react'
import { getImageUrl } from './utils-image-url'

interface Setting {
  id: string
  key: string
  value: string
  valueEn?: string | null
  type: string
}

/**
 * Hook untuk menerapkan settings (favicon, title) ke document
 */
export function useSettings(settings: Record<string, Setting | undefined>) {
  useEffect(() => {
    // Update favicon
    if (settings.website_favicon?.value) {
      const faviconUrl = getImageUrl(settings.website_favicon.value)
      // Remove existing favicon links
      const existingLinks = document.querySelectorAll("link[rel~='icon']")
      existingLinks.forEach(link => link.remove())
      
      // Add new favicon
      const newLink = document.createElement('link')
      newLink.rel = 'icon'
      newLink.href = faviconUrl
      document.head.appendChild(newLink)
    }

    // Update title - selalu update dari website_title jika ada
    if (settings.website_title?.value) {
      document.title = settings.website_title.value
    } else {
      // Fallback jika belum ada setting
      document.title = 'Al Azhar IIBS'
    }
  }, [settings])
}

