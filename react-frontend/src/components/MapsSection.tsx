'use client'

interface MapsSectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    subtitle?: string | null
    subtitleEn?: string | null
    content?: string | null
    contentEn?: string | null
    mapEmbedUrl?: string | null
  }
  locale?: 'id' | 'en'
}

export function MapsSection({ section, locale = 'id' }: MapsSectionProps) {
  const title = locale === 'en' && section.titleEn ? section.titleEn : section.title
  const subtitle = locale === 'en' && section.subtitleEn ? section.subtitleEn : section.subtitle
  const content = locale === 'en' && section.contentEn ? section.contentEn : section.content

  // Extract src URL from iframe code if needed
  const getMapSrc = (embedUrl: string | null | undefined): string | null => {
    if (!embedUrl) return null
    
    // If it's already a URL, return it
    if (embedUrl.startsWith('http://') || embedUrl.startsWith('https://')) {
      return embedUrl
    }
    
    // If it's an iframe code, extract the src
    const srcMatch = embedUrl.match(/src=["']([^"']+)["']/)
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1]
    }
    
    // Try to find URL in the string
    const urlMatch = embedUrl.match(/https?:\/\/[^\s<>"']+/)
    if (urlMatch && urlMatch[0]) {
      return urlMatch[0]
    }
    
    return embedUrl
  }

  const mapSrc = getMapSrc(section.mapEmbedUrl)

  if (!mapSrc) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg md:text-xl text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        {content && (
          <div 
            className="prose prose-lg max-w-none mb-8 text-center"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {/* Map Container */}
        <div className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-lg" style={{ minHeight: '450px' }}>
          <iframe
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '450px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={title || 'Map Location'}
          />
        </div>
      </div>
    </section>
  )
}

