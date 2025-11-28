import { useEffect } from 'react'
import { getImageUrl } from './utils-image-url'

interface SEOData {
  title?: string | null
  description?: string | null
  keywords?: string | null
  author?: string | null
  image?: string | null
  robots?: string | null
  canonical?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  ogType?: string | null
  ogSiteName?: string | null
  ogUrl?: string | null
  twitterCard?: string | null
  twitterSite?: string | null
  twitterCreator?: string | null
}

/**
 * Hook untuk menerapkan SEO meta tags ke document head
 */
export function useSEO(seoData: SEOData | null, fallbackTitle?: string) {
  useEffect(() => {
    if (!seoData) return

    // Get current URL for canonical and og:url
    const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

    // Meta Tags
    updateMetaTag('name', 'title', seoData.title || fallbackTitle || '')
    updateMetaTag('name', 'description', seoData.description || '')
    updateMetaTag('name', 'keywords', seoData.keywords || '')
    updateMetaTag('name', 'author', seoData.author || '')
    updateMetaTag('name', 'robots', seoData.robots || 'index, follow')
    
    // Meta Image
    if (seoData.image) {
      const imageUrl = getImageUrl(seoData.image)
      updateMetaTag('property', 'og:image', imageUrl)
      updateMetaTag('name', 'twitter:image', imageUrl)
    }

    // Open Graph
    updateMetaTag('property', 'og:title', seoData.ogTitle || seoData.title || fallbackTitle || '')
    updateMetaTag('property', 'og:description', seoData.ogDescription || seoData.description || '')
    if (seoData.ogImage) {
      const ogImageUrl = getImageUrl(seoData.ogImage)
      updateMetaTag('property', 'og:image', ogImageUrl)
    } else if (seoData.image) {
      const imageUrl = getImageUrl(seoData.image)
      updateMetaTag('property', 'og:image', imageUrl)
    }
    updateMetaTag('property', 'og:type', seoData.ogType || 'website')
    updateMetaTag('property', 'og:site_name', seoData.ogSiteName || '')
    updateMetaTag('property', 'og:url', seoData.ogUrl || currentUrl)

    // Twitter Cards
    updateMetaTag('name', 'twitter:card', seoData.twitterCard || 'summary_large_image')
    updateMetaTag('name', 'twitter:title', seoData.ogTitle || seoData.title || fallbackTitle || '')
    updateMetaTag('name', 'twitter:description', seoData.ogDescription || seoData.description || '')
    if (seoData.ogImage) {
      const ogImageUrl = getImageUrl(seoData.ogImage)
      updateMetaTag('name', 'twitter:image', ogImageUrl)
    } else if (seoData.image) {
      const imageUrl = getImageUrl(seoData.image)
      updateMetaTag('name', 'twitter:image', imageUrl)
    }
    if (seoData.twitterSite) {
      updateMetaTag('name', 'twitter:site', seoData.twitterSite.startsWith('@') ? seoData.twitterSite : `@${seoData.twitterSite}`)
    }
    if (seoData.twitterCreator) {
      updateMetaTag('name', 'twitter:creator', seoData.twitterCreator.startsWith('@') ? seoData.twitterCreator : `@${seoData.twitterCreator}`)
    }

    // Canonical URL
    if (seoData.canonical) {
      updateLinkTag('canonical', seoData.canonical)
    } else {
      updateLinkTag('canonical', currentUrl)
    }

    // Update document title
    if (seoData.title) {
      document.title = seoData.title
    } else if (fallbackTitle) {
      document.title = fallbackTitle
    }
  }, [seoData, fallbackTitle])
}

/**
 * Update atau create meta tag
 */
function updateMetaTag(attribute: 'name' | 'property', key: string, value: string) {
  if (!value) return

  let meta = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attribute, key)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', value)
}

/**
 * Update atau create link tag
 */
function updateLinkTag(rel: string, href: string) {
  if (!href) return

  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

