'use client'

import { Link } from 'react-router-dom'
import { getImageUrl } from '../lib/utils-image-url'

interface HomeGlobalStageSectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    subtitle?: string | null
    subtitleEn?: string | null
    content?: string | null
    contentEn?: string | null
    image?: string | null
    buttonText?: string | null
    buttonTextEn?: string | null
    buttonUrl?: string | null
  }
  locale?: 'id' | 'en'
}

export function HomeGlobalStageSection({ section, locale = 'id' }: HomeGlobalStageSectionProps) {
  const title = locale === 'en' && section.titleEn ? section.titleEn : section.title
  const subtitle = locale === 'en' && section.subtitleEn ? section.subtitleEn : section.subtitle
  const content = locale === 'en' && section.contentEn ? section.contentEn : section.content
  const buttonText = locale === 'en' && section.buttonTextEn ? section.buttonTextEn : section.buttonText

  const isExternalUrl = (url: string | null | undefined) => 
    url && (url.startsWith('http://') || url.startsWith('https://'))

  return (
    <section className="bg-white">
      {/* Full width grid - no container padding, exactly 50-50 split like reference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
        {/* Left: Dark Blue Background with Text - Full width, exactly 50% */}
        <div 
          className="bg-blue-900 flex items-center justify-center p-8 lg:p-12 xl:p-16"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1e3a8a 100%)'
          }}
        >
          <div className="max-w-xl space-y-6">
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {title}
              </h2>
            )}
            
            {subtitle && (
              <p className="text-xl md:text-2xl text-white/90 font-medium">
                {subtitle}
              </p>
            )}

            {content && (
              <div 
                className="text-white text-base md:text-lg leading-relaxed"
                style={{
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {buttonText && section.buttonUrl && (
              <div className="pt-4">
                {isExternalUrl(section.buttonUrl) ? (
                  <a
                    href={section.buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {buttonText}
                  </a>
                ) : (
                  <Link
                    to={section.buttonUrl}
                    className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {buttonText}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Image - Full width, exactly 50% */}
        <div className="relative min-h-[400px] lg:min-h-full">
          {section.image ? (
            <img
              src={getImageUrl(section.image)}
              alt={title || 'International Program'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

