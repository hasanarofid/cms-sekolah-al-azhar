'use client'

import { Download } from 'lucide-react'
import { getImageUrl } from '../lib/utils-image-url'

interface BrosurSectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    content?: string | null
    contentEn?: string | null
    image?: string | null
  }
  locale?: 'id' | 'en'
}

export function BrosurSection({ section, locale = 'id' }: BrosurSectionProps) {
  const title = locale === 'en' && section.titleEn ? section.titleEn : section.title
  const content = locale === 'en' && section.contentEn ? section.contentEn : section.content

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
        )}

        {/* Brosur Container */}
        <div className="relative w-full" style={{ minHeight: '600px' }}>
          {section.image ? (
            <div className="relative w-full h-full">
              <img
                src={getImageUrl(section.image)}
                alt={title || 'Brosur Section'}
                className="w-full h-auto object-contain"
                style={{ maxHeight: '800px' }}
              />
              <a
                href={getImageUrl(section.image)}
                download
                className="absolute bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Download size={20} />
                <span>{locale === 'id' ? 'Unduh Brosur' : 'Download Brochure'}</span>
              </a>
            </div>
          ) : (
            <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" style={{ minHeight: '600px' }}>
              <p className="text-gray-500 text-lg">
                {locale === 'id' ? 'Tidak ada gambar brosur yang diunggah' : 'No brochure image uploaded'}
              </p>
            </div>
          )}
        </div>

        {/* Content/Description */}
        {content && (
          <div className="mt-8 text-center">
            <div
              className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto prose prose-lg"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
