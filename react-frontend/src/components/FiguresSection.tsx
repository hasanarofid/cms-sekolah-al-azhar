'use client'

import { getImageUrl } from '../lib/utils-image-url'
import { ScrollItem } from './ScrollItem'

interface Figure {
  id: string
  name: string
  nameEn?: string | null
  position: string
  positionEn?: string | null
  image: string
}

interface FiguresSectionProps {
  figures: Figure[]
  locale?: 'id' | 'en'
  sectionTitle?: string
  sectionTitleEn?: string
  backgroundImage?: string
}

export function FiguresSection({ figures, locale = 'id', sectionTitle, sectionTitleEn, backgroundImage }: FiguresSectionProps) {
  if (figures.length === 0) return null

  const displayTitle = locale === 'en' && sectionTitleEn ? sectionTitleEn : (sectionTitle || 'Tokoh-Tokoh SMA AL AZHAR INSAN CENDEKIA JATIBENING')

  return (
    <section 
      className="py-16 relative"
      style={{
        backgroundImage: backgroundImage ? `url(${getImageUrl(backgroundImage)})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay untuk readability jika ada background */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-white/80"></div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title with Animation */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 animate-fade-in-up">
            {displayTitle}
          </h2>
        </div>

        {/* Figures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {figures.map((figure, index) => (
            <ScrollItem key={figure.id} delay={index * 0.1} direction="up">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Figure Image */}
                <div className="relative h-80 bg-gray-200">
                  <img
                    src={getImageUrl(figure.image)}
                    alt={locale === 'en' && figure.nameEn ? figure.nameEn : figure.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Figure Info */}
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {locale === 'en' && figure.nameEn ? figure.nameEn : figure.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {locale === 'en' && figure.positionEn ? figure.positionEn : figure.position}
                  </p>
                </div>
              </div>
            </ScrollItem>
          ))}
        </div>
      </div>
    </section>
  )
}

