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
      
      // Remove ALL existing favicon links (icon, shortcut icon, apple-touch-icon)
      const existingLinks = document.querySelectorAll("link[rel*='icon']")
      existingLinks.forEach(link => link.remove())
      
      // Add timestamp to force browser to reload favicon (cache-busting)
      const separator = faviconUrl.includes('?') ? '&' : '?'
      const timestampedUrl = `${faviconUrl}${separator}v=${Date.now()}`
      
      // Add new favicon links with multiple rel types for better compatibility
      const iconTypes = ['icon', 'shortcut icon', 'apple-touch-icon']
      iconTypes.forEach(relType => {
        const newLink = document.createElement('link')
        newLink.rel = relType
        newLink.type = 'image/x-icon'
        newLink.href = timestampedUrl
        document.head.appendChild(newLink)
      })
    }

    // Update title - selalu update dari website_title jika ada
    if (settings.website_title?.value) {
      document.title = settings.website_title.value
    } else {
      // Fallback jika belum ada setting - gunakan generic title
      document.title = 'CMS Sekolah'
    }
  }, [settings])
}

