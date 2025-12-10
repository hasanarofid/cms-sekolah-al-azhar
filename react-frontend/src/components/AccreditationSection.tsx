'use client'

import { getImageUrl } from '../lib/utils-image-url'

interface AccreditationSectionProps {
  section: {
    id: string
    badgeImage?: string | null
    title?: string | null
    titleEn?: string | null
    content?: string | null
    contentEn?: string | null
    accreditationNumber?: string | null
    accreditationBody?: string | null
  }
  locale?: 'id' | 'en'
}

export function AccreditationSection({ section, locale = 'id' }: AccreditationSectionProps) {
  const displayTitle = locale === 'en' && section.titleEn ? section.titleEn : section.title
  const displayContent = locale === 'en' && section.contentEn ? section.contentEn : section.content

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Badge Image */}
          {section.badgeImage && (
            <div className="flex-shrink-0">
              <img
                src={getImageUrl(section.badgeImage)}
                alt="Akreditasi Badge"
                className="h-48 w-48 md:h-64 md:w-64 object-contain"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            {displayTitle && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {displayTitle}
              </h2>
            )}
            {displayContent && (
              <div 
                className="text-gray-600 text-base md:text-lg leading-relaxed prose prose-lg"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            )}
            {section.accreditationNumber && (
              <p className="text-sm text-gray-500 mt-2">
                No. {section.accreditationNumber}
              </p>
            )}
            {section.accreditationBody && (
              <p className="text-sm text-gray-500">
                {section.accreditationBody}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

