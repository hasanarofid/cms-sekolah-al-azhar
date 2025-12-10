'use client'

import { getImageUrl } from '../lib/utils-image-url'

interface SplitScreenSection {
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

interface SplitScreenSectionProps {
  sections: SplitScreenSection[]
  locale?: 'id' | 'en'
}

export function SplitScreenSection({ sections, locale = 'id' }: SplitScreenSectionProps) {
  const isExternalUrl = (url: string | null | undefined) => 
    url && (url.startsWith('http://') || url.startsWith('https://'))

  if (sections.length === 0) return null

  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="bg-white">
          {/* Full width grid - no container padding */}
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
            {/* Left: Yellow Background with Text - Full width */}
            <div className="bg-yellow-400 flex items-center justify-center p-8 lg:p-12 xl:p-16">
              <div className="max-w-xl space-y-6">
                {section.title && (
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight font-sans">
                    {locale === 'en' && section.titleEn ? section.titleEn : section.title}
                  </h2>
                )}
                {(section.content || section.subtitle) && (
                  <div 
                    className="text-gray-900 text-base md:text-lg leading-relaxed font-sans prose prose-lg"
                    dangerouslySetInnerHTML={{ 
                      __html: locale === 'en' && section.contentEn 
                        ? section.contentEn 
                        : section.content || section.subtitle || ''
                    }}
                  />
                )}
                {section.buttonText && section.buttonUrl && (
                  <div className="pt-4">
                    {isExternalUrl(section.buttonUrl) ? (
                      <a
                        href={section.buttonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-primary-700 hover:bg-primary-800 text-white px-8 py-3.5 rounded-lg font-bold text-base shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                      >
                        {locale === 'en' && section.buttonTextEn
                          ? section.buttonTextEn
                          : section.buttonText}
                      </a>
                    ) : (
                      <a
                        href={section.buttonUrl}
                        className="inline-block bg-primary-700 hover:bg-primary-800 text-white px-8 py-3.5 rounded-lg font-bold text-base shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                      >
                        {locale === 'en' && section.buttonTextEn
                          ? section.buttonTextEn
                          : section.buttonText}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Image - Full width */}
            <div className="relative min-h-[400px] lg:min-h-full">
              {section.image ? (
                <img
                  src={getImageUrl(section.image)}
                  alt={locale === 'en' && section.titleEn ? section.titleEn : section.title || ''}
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
      ))}
    </>
  )
}

