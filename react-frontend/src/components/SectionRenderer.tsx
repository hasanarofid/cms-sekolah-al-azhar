'use client'

import { Link } from 'react-router-dom'
import { Play, X } from 'lucide-react'
import { QuoteSection } from './QuoteSection'
import { SplitScreenSection } from './SplitScreenSection'
import { HomeFAQSection } from './HomeFAQSection'
import { UniversityMapSection } from './UniversityMapSection'
import { HomeFiguresSection } from './HomeFiguresSection'
import { HomeGlobalStageSection } from './HomeGlobalStageSection'
import { HomePartnershipsSection } from './HomePartnershipsSection'
import { HomeNewsSection } from './HomeNewsSection'
import { AccreditationSection } from './AccreditationSection'
import { NavigationGridSection } from './NavigationGridSection'
import { ProgramCardsSection } from './ProgramCardsSection'
import { FacilityGallerySection } from './FacilityGallerySection'
import { ExtracurricularDetailSection } from './ExtracurricularDetailSection'
import { OrganizationStructureSection } from './OrganizationStructureSection'
import { StudentAchievementsSection } from './StudentAchievementsSection'
import { CurriculumTableSection } from './CurriculumTableSection'
import { AcademicCalendarSection } from './AcademicCalendarSection'
import { BOSReportSection } from './BOSReportSection'
import { ContactSection } from './ContactSection'
import { MapsSection } from './MapsSection'
import { BrosurSection } from './BrosurSection'
import { parseImages } from '../lib/utils-images'
import { getImageUrl, getImageUrls } from '../lib/utils-image-url'

interface Section {
  id: string
  type: string
  title?: string | null
  titleEn?: string | null
  subtitle?: string | null
  subtitleEn?: string | null
  content?: string | null
  contentEn?: string | null
  image?: string | null
  images?: string | string[] | null
  imageLeft?: string | null
  imageRight?: string | null
  videoUrl?: string | null
  buttonText?: string | null
  buttonTextEn?: string | null
  buttonUrl?: string | null
  faqItems?: any[] | string | null
  figures?: any[] | string | null
  partnerships?: any[] | string | null
  order: number
}

interface SectionRendererProps {
  section: Section
  locale?: 'id' | 'en'
  activeVideo?: { sectionId: string; videoId: string } | null
  onPlayVideo?: (section: Section) => void
  onCloseVideo?: () => void
  isGrouped?: boolean
}

export function SectionRenderer({ 
  section, 
  locale = 'id',
  activeVideo,
  onPlayVideo,
  onCloseVideo
}: SectionRendererProps) {
  const isExternalUrl = (url: string | null | undefined) => 
    url && (url.startsWith('http://') || url.startsWith('https://'))

  // Motto Section
  if (section.type === 'motto') {
    return (
      <QuoteSection
        quote={section.title || ''}
        quoteEn={section.titleEn}
        locale={locale}
      />
    )
  }

  // Video Profile Section
  if (section.type === 'video-profile') {
    const extractYouTubeId = (url?: string | null) => {
      if (!url) return null
      const trimmed = url.trim()
      const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
      const match = trimmed.match(youtubeRegex)
      return match && match[1] ? match[1] : null
    }

    const videoId = extractYouTubeId(section.videoUrl)
    const isVideoOpen = activeVideo?.sectionId === section.id && activeVideo?.videoId === videoId

    // Debug logging
    if (import.meta.env.DEV) {
      console.log('SectionRenderer - video-profile:', {
        id: section.id,
        title: section.title,
        image: section.image,
        videoUrl: section.videoUrl,
        hasImage: !!section.image
      })
    }

    return (
      <>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {section.image ? (
            <div className="relative h-64 md:h-80 bg-gray-200 group cursor-pointer rounded-xl overflow-hidden">
              <img
                src={getImageUrl(section.image)}
                alt={locale === 'en' && section.titleEn ? section.titleEn : section.title || ''}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/60 to-transparent"></div>
              {section.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <button
                    onClick={() => onPlayVideo?.(section)}
                    className="bg-white/95 hover:bg-white rounded-full p-4 md:p-5 transition-all hover:scale-110 shadow-xl"
                  >
                    <Play className="text-gray-900 ml-1" size={36} fill="currentColor" />
                  </button>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2">
                  {locale === 'en' && section.titleEn ? section.titleEn : section.title || 'Video Profile'}
                </h3>
              </div>
            </div>
          ) : (
            // Fallback jika tidak ada image - tampilkan placeholder atau video langsung
            <div className="relative h-64 md:h-80 bg-gray-200 group cursor-pointer rounded-xl overflow-hidden flex items-center justify-center">
              {section.videoUrl ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/60 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <button
                      onClick={() => onPlayVideo?.(section)}
                      className="bg-white/95 hover:bg-white rounded-full p-4 md:p-5 transition-all hover:scale-110 shadow-xl"
                    >
                      <Play className="text-gray-900 ml-1" size={36} fill="currentColor" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2">
                      {locale === 'en' && section.titleEn ? section.titleEn : section.title || 'Video Profile'}
                    </h3>
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-2">
                    {locale === 'en' && section.titleEn ? section.titleEn : section.title || 'Video Profile'}
                  </h3>
                  {section.content && (
                    <p className="text-gray-600 text-sm">
                      {locale === 'en' && section.contentEn ? section.contentEn : section.content}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          {section.content && section.image && (
            <div className="p-4 md:p-6">
              <p className="text-gray-600 text-sm leading-relaxed">
                {locale === 'en' && section.contentEn ? section.contentEn : section.content}
              </p>
            </div>
          )}
        </div>

        {/* YouTube Video Modal */}
        {isVideoOpen && videoId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onCloseVideo}>
            <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={onCloseVideo}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X size={32} />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                className="w-full h-full rounded-lg"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </>
    )
  }

  // Admission Section
  if (section.type === 'admission') {
    const images = getImageUrls(parseImages(section.images))
    
    return (
      <section key={section.id} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
              {images.length >= 2 ? (
                <div className="relative w-full max-w-lg h-full">
                  {images[0] && (
                    <div className="absolute top-0 left-0 w-64 h-64 lg:w-80 lg:h-80 z-10">
                      <img
                        src={images[0]}
                        alt="Admission Image 1"
                        className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white"
                      />
                    </div>
                  )}
                  {images[1] && (
                    <div className="absolute bottom-0 right-0 w-56 h-56 lg:w-72 lg:h-72 z-0">
                      <img
                        src={images[1]}
                        alt="Admission Image 2"
                        className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white"
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

            <div className="space-y-5 lg:space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-[1.2] tracking-tight">
                {locale === 'en' && section.titleEn ? section.titleEn : section.title}
              </h2>
              {(section.content || section.subtitle) && (
                <div 
                  className="text-gray-700 text-base md:text-lg lg:text-xl leading-[1.7] font-sans max-w-2xl prose prose-lg"
                  dangerouslySetInnerHTML={{ 
                    __html: locale === 'en' && section.contentEn 
                      ? section.contentEn 
                      : section.content || section.subtitle || ''
                  }}
                />
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
  }

  // Split Screen Section
  if (section.type === 'split-screen') {
    return (
      <SplitScreenSection 
        key={section.id}
        sections={[section]} 
        locale={locale} 
      />
    )
  }

  // FAQ Section
  if (section.type === 'faq') {
    return (
      <HomeFAQSection
        key={section.id}
        section={section}
        locale={locale}
      />
    )
  }

  // Feature Section
  if (section.type === 'feature') {
    return (
      <section key={section.id} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
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
            {(section.content || section.subtitle) && (
              <div 
                className="text-gray-600 mb-4 prose prose-base"
                dangerouslySetInnerHTML={{ 
                  __html: locale === 'en' && section.contentEn 
                    ? section.contentEn 
                    : section.content || section.subtitle || ''
                }}
              />
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
        </div>
      </section>
    )
  }

  // University Map Section
  if (section.type === 'university-map') {
    return (
      <UniversityMapSection
        key={section.id}
        section={section}
        locale={locale}
      />
    )
  }

  // Figures Section
  if (section.type === 'figures') {
    return (
      <HomeFiguresSection
        key={section.id}
        section={section}
        locale={locale}
      />
    )
  }

  // Global Stage / International Program Section
  if (section.type === 'global-stage') {
    return (
      <HomeGlobalStageSection
        key={section.id}
        section={section}
        locale={locale}
      />
    )
  }

  // Partnerships Section
  if (section.type === 'partnerships') {
    return (
      <HomePartnershipsSection
        key={section.id}
        section={section}
        locale={locale}
      />
    )
  }

  // News Section
  if (section.type === 'news-section') {
    return (
      <HomeNewsSection
        key={section.id}
        section={section}
        locale={locale}
      />
    )
  }

  // Masjid AL FATIH Section - Split screen like reference website
  if (section.type === 'masjid-al-fatih') {
    return (
      <section key={section.id} className="relative min-h-[600px] flex">
        {/* Left: Image (Interior Masjid) */}
        {section.imageLeft && (
          <div className="w-1/2 relative">
            <img
              src={getImageUrl(section.imageLeft)}
              alt="Masjid Interior"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Right: Content with Dark Background - Match reference website style */}
        <div 
          className={`relative ${section.imageLeft ? 'w-1/2' : 'w-full'} min-h-[600px]`}
        >
          {/* Background Image with Dark Overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: section.imageRight 
                ? `url(${getImageUrl(section.imageRight)})`
                : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
          
          {/* Dark blue overlay for better text readability - match reference */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-blue-900/90"></div>
          
          {/* Content */}
          <div className="relative h-full flex flex-col justify-center px-8 md:px-12 lg:px-16 py-16 z-10">
            {section.title && (
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                style={{
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '-0.02em'
                }}
              >
                {locale === 'en' && section.titleEn ? section.titleEn : section.title}
              </h2>
            )}
            
            {section.subtitle && (
              <p 
                className="text-xl md:text-2xl text-white font-medium mb-6 leading-relaxed"
                style={{
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)'
                }}
              >
                {locale === 'en' && section.subtitleEn ? section.subtitleEn : section.subtitle}
              </p>
            )}

            {section.content && (
              <div 
                className="text-white text-base md:text-lg leading-relaxed max-w-2xl"
                style={{
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
                  lineHeight: '1.8'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: locale === 'en' && section.contentEn 
                    ? section.contentEn 
                    : section.content 
                }}
              />
            )}

            {section.buttonText && section.buttonUrl && (
              <div className="pt-8">
                {isExternalUrl(section.buttonUrl) ? (
                  <a
                    href={section.buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                  >
                    {locale === 'en' && section.buttonTextEn
                      ? section.buttonTextEn
                      : section.buttonText}
                  </a>
                ) : (
                  <Link
                    to={section.buttonUrl}
                    className="inline-block bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
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
      </section>
    )
  }

  // Accreditation Section
  if (section.type === 'accreditation') {
    return (
      <AccreditationSection
        key={section.id}
        section={section as any}
        locale={locale}
      />
    )
  }

  // Navigation Grid Section
  if (section.type === 'navigation-grid') {
    return (
      <NavigationGridSection
        key={section.id}
        section={section as any}
        locale={locale}
      />
    )
  }

  // Program Cards Section
  if (section.type === 'program-cards') {
    return (
      <ProgramCardsSection
        key={section.id}
        section={section as any}
        locale={locale}
      />
    )
  }

  // Facility Gallery Section
  if (section.type === 'facility-gallery') {
    return (
      <FacilityGallerySection
        key={section.id}
        section={section as any}
        locale={locale}
      />
    )
  }

  // Extracurricular Detail Section
  if (section.type === 'extracurricular-detail') {
    return (
      <ExtracurricularDetailSection
        key={section.id}
        section={section as any}
        locale={locale}
      />
    )
  }

  // Organization Structure Section
  if (section.type === 'organization-structure') {
    return (
      <OrganizationStructureSection
        key={section.id}
        section={section as any}
        locale={locale}
      />
    )
  }

  // Student Achievements Section
  if (section.type === 'student-achievements') {
    return (
      <StudentAchievementsSection
        key={section.id}
        section={section as any}
        locale={locale}
      />
    )
  }

  // Curriculum Table Section
  if (section.type === 'curriculum-table') {
    return (
      <CurriculumTableSection
        key={section.id}
        section={section as any}
        locale={locale}
      />
    )
  }

  // Academic Calendar Section
  if (section.type === 'academic-calendar') {
    return (
      <AcademicCalendarSection
        key={section.id}
        section={section as any}
        locale={locale}
      />
    )
  }

  // BOS Report Section
  if (section.type === 'bos-report') {
    return (
      <BOSReportSection
        key={section.id}
        section={section as any}
        locale={locale}
      />
    )
  }

  // Contact Section
  if (section.type === 'contact') {
    return (
      <ContactSection
        key={section.id}
        section={section as any}
        locale={locale}
      />
    )
  }

  // Maps Section
  if (section.type === 'maps') {
    return (
      <MapsSection
        key={section.id}
        section={section as any}
        locale={locale}
      />
    )
  }

  // Brosur Section
  if (section.type === 'brosur-section') {
    return (
      <BrosurSection
        key={section.id}
        section={section}
        locale={locale}
      />
    )
  }

  // Render null if section type is not recognized
  return null
}

