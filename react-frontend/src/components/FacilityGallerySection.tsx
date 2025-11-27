'use client'

import { Link } from 'react-router-dom'
import { getImageUrl } from '../lib/utils-image-url'

interface FacilityItem {
  id: string
  image: string
  caption?: string
  url?: string
}

interface FacilityGallerySectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    facilityItems?: FacilityItem[] | string | null
  }
  locale?: 'id' | 'en'
}

export function FacilityGallerySection({ section, locale = 'id' }: FacilityGallerySectionProps) {
  let items: FacilityItem[] = []
  
  if (section.facilityItems) {
    if (typeof section.facilityItems === 'string') {
      try {
        const parsed = JSON.parse(section.facilityItems)
        items = Array.isArray(parsed) ? parsed : []
      } catch {
        items = []
      }
    } else if (Array.isArray(section.facilityItems)) {
      items = section.facilityItems
    }
  }

  if (items.length === 0) return null

  const displayTitle = locale === 'en' && section.titleEn ? section.titleEn : section.title
  const isExternalUrl = (url?: string) => url && (url.startsWith('http://') || url.startsWith('https://'))

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {displayTitle && (
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-12">
            {displayTitle}
          </h2>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((item) => {
            const imageContent = (
              <div className="relative group overflow-hidden rounded-lg">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.caption || 'Facility'}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-medium text-sm md:text-base">
                      {item.caption}
                    </p>
                  </div>
                )}
              </div>
            )

            if (item.url && isExternalUrl(item.url)) {
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {imageContent}
                </a>
              )
            }

            if (item.url) {
              return (
                <Link key={item.id} to={item.url} className="block">
                  {imageContent}
                </Link>
              )
            }

            return (
              <div key={item.id}>
                {imageContent}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

