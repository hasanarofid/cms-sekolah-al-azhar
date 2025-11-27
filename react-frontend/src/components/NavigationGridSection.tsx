'use client'

import { Link } from 'react-router-dom'
import { getImageUrl } from '../lib/utils-image-url'

interface NavigationItem {
  id: string
  label: string
  url: string
  icon?: string
}

interface NavigationGridSectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    navigationItems?: NavigationItem[] | string | null
  }
  locale?: 'id' | 'en'
}

export function NavigationGridSection({ section, locale = 'id' }: NavigationGridSectionProps) {
  let items: NavigationItem[] = []
  
  if (section.navigationItems) {
    if (typeof section.navigationItems === 'string') {
      try {
        const parsed = JSON.parse(section.navigationItems)
        items = Array.isArray(parsed) ? parsed : []
      } catch {
        items = []
      }
    } else if (Array.isArray(section.navigationItems)) {
      items = section.navigationItems
    }
  }

  if (items.length === 0) return null

  const displayTitle = locale === 'en' && section.titleEn ? section.titleEn : section.title
  const isExternalUrl = (url: string) => url.startsWith('http://') || url.startsWith('https://')

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {displayTitle && (
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-12">
            {displayTitle}
          </h2>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => {
            const content = (
              <div className="bg-gradient-to-br from-blue-500 to-teal-500 text-white p-6 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-md h-full flex flex-col items-center justify-center text-center">
                {item.icon && (
                  <div className="mb-3">
                    <img
                      src={getImageUrl(item.icon)}
                      alt={item.label}
                      className="h-12 w-12 object-contain"
                    />
                  </div>
                )}
                <span className="font-semibold text-sm md:text-base">
                  {item.label}
                </span>
              </div>
            )

            if (isExternalUrl(item.url)) {
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {content}
                </a>
              )
            }

            return (
              <Link key={item.id} to={item.url} className="block">
                {content}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

