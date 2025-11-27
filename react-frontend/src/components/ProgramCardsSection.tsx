'use client'

import { Link } from 'react-router-dom'
import { getImageUrl } from '../lib/utils-image-url'

interface ProgramItem {
  id: string
  icon: string
  title: string
  description: string
  url?: string
}

interface ProgramCardsSectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    programItems?: ProgramItem[] | string | null
  }
  locale?: 'id' | 'en'
}

export function ProgramCardsSection({ section, locale = 'id' }: ProgramCardsSectionProps) {
  let items: ProgramItem[] = []
  
  if (section.programItems) {
    if (typeof section.programItems === 'string') {
      try {
        const parsed = JSON.parse(section.programItems)
        items = Array.isArray(parsed) ? parsed : []
      } catch {
        items = []
      }
    } else if (Array.isArray(section.programItems)) {
      items = section.programItems
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item) => {
            const cardContent = (
              <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                {/* Icon */}
                {item.icon && (
                  <div className="mb-4">
                    <img
                      src={getImageUrl(item.icon)}
                      alt={item.title}
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>

                {/* Separator */}
                <div className="h-1 w-12 bg-red-500 mb-4"></div>

                {/* Description */}
                <p className="text-gray-600 text-sm md:text-base leading-relaxed flex-grow">
                  {item.description}
                </p>
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
                  {cardContent}
                </a>
              )
            }

            if (item.url) {
              return (
                <Link key={item.id} to={item.url} className="block">
                  {cardContent}
                </Link>
              )
            }

            return (
              <div key={item.id}>
                {cardContent}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

