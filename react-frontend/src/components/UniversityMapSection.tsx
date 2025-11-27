'use client'

import { getImageUrl } from '../lib/utils-image-url'

interface UniversityMapSectionProps {
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

export function UniversityMapSection({ section, locale = 'id' }: UniversityMapSectionProps) {
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

        {/* Map Container */}
        <div className="relative w-full" style={{ minHeight: '600px' }}>
          {section.image ? (
            <div className="relative w-full h-full">
              <img
                src={getImageUrl(section.image)}
                alt={title || 'University Map'}
                className="w-full h-auto object-contain"
                style={{ maxHeight: '800px' }}
              />
            </div>
          ) : (
            <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ minHeight: '600px' }}>
              {/* Placeholder Map - Simple SVG World Map */}
              <svg
                viewBox="0 0 1000 500"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Ocean */}
                <rect width="1000" height="500" fill="#e0f2fe" />
                
                {/* Continents - Simplified shapes */}
                {/* North America */}
                <path
                  d="M 150 100 L 250 80 L 280 120 L 270 180 L 200 200 L 150 180 Z"
                  fill="#3b82f6"
                  stroke="#1e40af"
                  strokeWidth="2"
                />
                
                {/* South America */}
                <path
                  d="M 200 220 L 250 200 L 260 280 L 240 350 L 200 340 Z"
                  fill="#3b82f6"
                  stroke="#1e40af"
                  strokeWidth="2"
                />
                
                {/* Europe */}
                <path
                  d="M 450 80 L 520 70 L 540 120 L 500 150 L 450 140 Z"
                  fill="#3b82f6"
                  stroke="#1e40af"
                  strokeWidth="2"
                />
                
                {/* Africa */}
                <path
                  d="M 480 150 L 550 140 L 560 280 L 520 350 L 480 340 Z"
                  fill="#3b82f6"
                  stroke="#1e40af"
                  strokeWidth="2"
                />
                
                {/* Asia */}
                <path
                  d="M 550 50 L 750 40 L 800 100 L 780 200 L 720 250 L 650 240 L 580 200 L 560 120 Z"
                  fill="#3b82f6"
                  stroke="#1e40af"
                  strokeWidth="2"
                />
                
                {/* Australia */}
                <path
                  d="M 750 300 L 850 290 L 860 330 L 840 360 L 780 350 Z"
                  fill="#3b82f6"
                  stroke="#1e40af"
                  strokeWidth="2"
                />
                
                {/* Marker dots for universities */}
                <circle cx="200" cy="140" r="6" fill="#ef4444" />
                <circle cx="480" cy="100" r="6" fill="#ef4444" />
                <circle cx="650" cy="80" r="6" fill="#ef4444" />
                <circle cx="700" cy="150" r="6" fill="#ef4444" />
                <circle cx="800" cy="200" r="6" fill="#ef4444" />
                <circle cx="800" cy="320" r="6" fill="#ef4444" />
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500 text-lg">
                  {locale === 'id' ? 'Upload gambar peta universitas' : 'Upload university map image'}
                </p>
              </div>
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

