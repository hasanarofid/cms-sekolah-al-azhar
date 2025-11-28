'use client'

import { getImageUrl } from '../lib/utils-image-url'

interface FigureItem {
  id: string
  name: string
  nameEn?: string
  position: string
  positionEn?: string
  image: string
}

interface HomeFiguresSectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    image?: string | null
    figures?: FigureItem[] | string | null
  }
  locale?: 'id' | 'en'
}

export function HomeFiguresSection({ section, locale = 'id' }: HomeFiguresSectionProps) {
  // Parse figures from section
  let figures: FigureItem[] = []
  
  if (section.figures) {
    if (Array.isArray(section.figures)) {
      figures = section.figures
    } else if (typeof section.figures === 'string') {
      try {
        const parsed = JSON.parse(section.figures)
        figures = Array.isArray(parsed) ? parsed : []
      } catch (e) {
        console.error('Error parsing figures:', e)
        figures = []
      }
    }
  }

  if (figures.length === 0) return null

  const displayTitle = locale === 'en' && section.titleEn ? section.titleEn : (section.title || 'Tokoh-Tokoh SMA AL AZHAR INSAN CENDEKIA JATIBENING')

  return (
    <section 
      className="relative py-20 md:py-24 lg:py-32 min-h-[700px] flex items-center"
      style={{
        backgroundImage: section.image 
          ? `url(${getImageUrl(section.image)})` 
          : 'linear-gradient(to bottom, #4a5568 0%, #2d3748 25%, #1a202c 50%, #2d3748 75%, #4a5568 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Subtle overlay untuk readability - lebih ringan seperti referensi */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Title - Match reference style */}
        <div className="text-center mb-16 md:mb-20">
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
            style={{
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              letterSpacing: '-0.02em'
            }}
          >
            {displayTitle}
          </h2>
        </div>

        {/* Figures Grid - Match reference layout (2 columns for 2 figures) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-5xl mx-auto">
          {figures.map((figure) => {
            const displayName = locale === 'en' && figure.nameEn ? figure.nameEn : figure.name
            const displayPosition = locale === 'en' && figure.positionEn ? figure.positionEn : figure.position

            return (
              <div 
                key={figure.id} 
                className="relative group flex flex-col items-center"
              >
                {/* Figure Portrait - Match reference style */}
                <div className="relative mb-6 w-full max-w-sm">
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <img
                      src={getImageUrl(figure.image)}
                      alt={displayName}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
                
                {/* Figure Info - Match reference style dengan background box */}
                <div className="text-center w-full">
                  <div 
                    className="bg-blue-900/95 backdrop-blur-sm px-6 py-4 rounded-lg shadow-xl inline-block"
                    style={{
                      minWidth: '200px',
                      maxWidth: '100%'
                    }}
                  >
                    <h3 
                      className="text-lg md:text-xl font-bold text-white mb-1.5"
                      style={{
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {displayName}
                    </h3>
                    <p 
                      className="text-sm md:text-base text-white/95 font-medium uppercase tracking-wide"
                      style={{
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {displayPosition}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

