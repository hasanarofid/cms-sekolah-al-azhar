'use client'

import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { SplitScreenSection } from './SplitScreenSection'
import { parseImages } from '../lib/utils-images'
import { getImageUrl, getImageUrls } from '../lib/utils-image-url'

interface HomeSection {
  id: string
  type: string
  title?: string | null
  titleEn?: string | null
  subtitle?: string | null
  subtitleEn?: string | null
  content?: string | null
  contentEn?: string | null
  image?: string | null
  images?: string | string[] | null // Bisa berupa JSON string, array, atau null
  videoUrl?: string | null
  buttonText?: string | null
  buttonTextEn?: string | null
  buttonUrl?: string | null
}

interface HomeSectionsProps {
  sections: HomeSection[]
  locale?: 'id' | 'en'
}

export function HomeSections({ sections, locale = 'id' }: HomeSectionsProps) {
  const mottoSections = sections.filter(s => s.type === 'motto')
  const videoProfiles = sections.filter(s => s.type === 'video-profile')
  const admissionSections = sections.filter(s => s.type === 'admission')
  const featureSections = sections.filter(s => s.type === 'feature')
  const splitSections = sections.filter(s => s.type === 'split-screen')
  // Masjid sections are rendered separately after FAQ in homepage

  const isExternalUrl = (url: string | null | undefined) => 
    url && (url.startsWith('http://') || url.startsWith('https://'))

  return (
    <>
      {/* Motto Section */}
      {mottoSections.length > 0 && mottoSections.map((section) => (
        <section key={section.id} className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold italic text-gray-900">
                "{locale === 'en' && section.titleEn ? section.titleEn : section.title}"
              </h2>
            </div>
          </div>
        </section>
      ))}

      {/* Video Profiles Section */}
      {videoProfiles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videoProfiles.map((section) => {
                return (
                  <div key={section.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {section.image && (
                      <div className="relative h-80 bg-gray-200 group cursor-pointer">
                        <img
                          src={getImageUrl(section.image)}
                          alt={locale === 'en' && section.titleEn ? section.titleEn : section.title || ''}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Gradient overlay like reference */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/60 to-transparent"></div>
                        {section.videoUrl && (
                          <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                            <button
                              onClick={() => {
                                // Open video in modal or new tab
                                if (section.videoUrl) {
                                  window.open(section.videoUrl, '_blank')
                                }
                              }}
                              className="bg-white/95 hover:bg-white rounded-full p-5 transition-all hover:scale-110 shadow-xl"
                            >
                              <Play className="text-gray-900 ml-1" size={40} fill="currentColor" />
                            </button>
                          </div>
                        )}
                        {/* Title overlay on image like reference */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                            {locale === 'en' && section.titleEn ? section.titleEn : section.title}
                          </h3>
                        </div>
                      </div>
                    )}
                    {section.content && (
                      <div className="p-6">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {locale === 'en' && section.contentEn ? section.contentEn : section.content}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}


      {/* Admission Section - Layout: Circular images left, Text & Button right */}
      {admissionSections.length > 0 && admissionSections.map((section) => {
        const images = getImageUrls(parseImages(section.images))
        return (
          <section key={section.id} className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left: Circular Images - 2 overlapping circles like reference */}
                <div className="relative flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
                  {images.length >= 2 ? (
                    <div className="relative w-full max-w-lg h-full">
                      {/* First circular image - top/center-left, larger */}
                      {images[0] && (
                        <div className="absolute top-0 left-0 w-64 h-64 lg:w-80 lg:h-80 z-10">
                          <img
                            src={images[0]}
                            alt="Admission Image 1"
                            className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white"
                            onError={(e) => {
                              console.error('Failed to load image:', images[0])
                              e.currentTarget.src = '/placeholder-image.png'
                            }}
                          />
                        </div>
                      )}
                      {/* Second circular image - bottom/center-right, overlapping, slightly smaller */}
                      {images[1] && (
                        <div className="absolute bottom-0 right-0 w-56 h-56 lg:w-72 lg:h-72 z-0">
                          <img
                            src={images[1]}
                            alt="Admission Image 2"
                            className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white"
                            onError={(e) => {
                              console.error('Failed to load image:', images[1])
                              e.currentTarget.src = '/placeholder-image.png'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ) : images.length === 1 ? (
                    <div className="w-64 h-64 lg:w-80 lg:h-80">
                      <img
                        src={images[0]}
                        alt="Admission Image"
                        className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white"
                        onError={(e) => {
                          console.error('Failed to load image:', images[0])
                          e.currentTarget.src = '/placeholder-image.png'
                        }}
                      />
                    </div>
                  ) : section.image ? (
                    <div className="w-64 h-64 lg:w-80 lg:h-80">
                      <img
                        src={getImageUrl(section.image)}
                        alt={locale === 'en' && section.titleEn ? section.titleEn : section.title || ''}
                        className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white"
                      />
                    </div>
                  ) : (
                    <div className="w-64 h-64 lg:w-80 lg:h-80 bg-gray-200 rounded-full"></div>
                  )}
                </div>

                {/* Right: Text Content & Button - Match reference styling */}
                <div className="space-y-5 lg:space-y-6">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-[1.2] tracking-tight">
                    {locale === 'en' && section.titleEn ? section.titleEn : section.title}
                  </h2>
                  {(section.content || section.subtitle) && (
                    <p className="text-gray-700 text-base md:text-lg lg:text-xl leading-[1.7] font-sans max-w-2xl">
                      {locale === 'en' && section.contentEn 
                        ? section.contentEn 
                        : section.content || section.subtitle}
                    </p>
                  )}
                  {section.buttonText && section.buttonUrl && (
                    <div className="pt-2">
                      {isExternalUrl(section.buttonUrl) ? (
                        <a
                          href={section.buttonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3.5 md:px-10 md:py-4 rounded-lg font-bold text-base md:text-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                        >
                          {locale === 'en' && section.buttonTextEn
                            ? section.buttonTextEn
                            : section.buttonText}
                        </a>
                      ) : (
                        <Link
                          to={section.buttonUrl}
                          className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-3.5 md:px-10 md:py-4 rounded-lg font-bold text-base md:text-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                        >
                          {locale === 'en' && section.buttonTextEn
                            ? section.buttonTextEn
                            : section.buttonText}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* Split Screen Sections (Yellow background left, Image right) - Replaces legacy Features */}
      <SplitScreenSection sections={splitSections} locale={locale} />

      {/* Feature Sections (Grid 3 columns) */}
      {featureSections.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featureSections.map((section) => (
                <div key={section.id} className="bg-white p-6 rounded-lg shadow-md">
                  {section.image && (
                    <img
                      src={getImageUrl(section.image)}
                      alt={locale === 'en' && section.titleEn ? section.titleEn : section.title || ''}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {locale === 'en' && section.titleEn ? section.titleEn : section.title}
                  </h3>
                  {section.subtitle && (
                    <p className="text-gray-600 mb-4">
                      {locale === 'en' && section.subtitleEn ? section.subtitleEn : section.subtitle}
                    </p>
                  )}
                  {section.buttonText && section.buttonUrl && (
                    <Link
                      to={section.buttonUrl}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {locale === 'en' && section.buttonTextEn
                        ? section.buttonTextEn
                        : section.buttonText} →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

