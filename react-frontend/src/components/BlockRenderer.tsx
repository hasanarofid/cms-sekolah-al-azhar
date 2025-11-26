'use client'

import { useState } from 'react'
import { getImageUrl } from '../lib/utils-image-url'
import { HeroSlider } from './HeroSlider'
import { HomeSections } from './HomeSections'
import { FAQSection } from './FAQSection'
import { FiguresSection } from './FiguresSection'
import { PartnershipsSection } from './PartnershipsSection'
import { SplitScreenSection } from './SplitScreenSection'
import { Link } from 'react-router-dom'
import { Play, ChevronUp, ChevronDown } from 'lucide-react'

interface PageBlock {
  id: string
  type: string
  data: string | object // JSON string atau object (backend sudah decode)
  isActive: boolean
  order: number
}

interface BlockRendererProps {
  blocks: PageBlock[]
  locale?: 'id' | 'en'
}

export function BlockRenderer({ blocks, locale = 'id' }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null

  const activeBlocks = blocks
    .filter(block => block.isActive)
    .sort((a, b) => a.order - b.order)

  return (
    <>
      {activeBlocks.map((block) => {
        try {
          // Backend sudah mengembalikan data sebagai object, tapi kadang masih string
          let blockData: any
          if (typeof block.data === 'string') {
            try {
              blockData = JSON.parse(block.data)
            } catch (parseError) {
              console.error(`Error parsing block data for block ${block.id}:`, parseError, 'Raw data:', block.data)
              // Try to handle invalid JSON - maybe it's already partially parsed
              blockData = block.data ? { content: block.data } : {}
            }
          } else {
            blockData = block.data || {}
          }

          switch (block.type) {
            case 'hero-slider':
              return (
                <HeroSlider
                  key={block.id}
                  sliders={blockData.sliders || []}
                  locale={locale}
                />
              )

            case 'home-section':
              return (
                <HomeSections
                  key={block.id}
                  sections={blockData.sections || []}
                  locale={locale}
                />
              )

            case 'faq-section':
              return (
                <FAQSection
                  key={block.id}
                  faqs={blockData.faqs || []}
                  locale={locale}
                />
              )

            case 'figures-section':
              return (
                <FiguresSection
                  key={block.id}
                  figures={blockData.figures || []}
                  locale={locale}
                />
              )

            case 'partnership-section':
              return (
                <PartnershipsSection
                  key={block.id}
                  partnerships={blockData.partnerships || []}
                  locale={locale}
                />
              )

            case 'split-screen':
              return (
                <SplitScreenSection
                  key={block.id}
                  sections={blockData.sections || []}
                  locale={locale}
                />
              )

            case 'gallery-carousel':
              return (
                <GalleryCarousel
                  key={block.id}
                  data={blockData}
                  locale={locale}
                />
              )

            case 'video-section':
              return (
                <VideoSection
                  key={block.id}
                  data={blockData}
                  locale={locale}
                />
              )

            case 'text':
              return (
                <div
                  key={block.id}
                  className="prose prose-lg md:prose-xl max-w-none px-4 sm:px-6 lg:px-8 py-12 md:py-16
                    prose-headings:text-gray-900 prose-headings:font-bold
                    prose-h1:text-4xl prose-h1:md:text-5xl prose-h1:mb-6 prose-h1:mt-8
                    prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-primary-600
                    prose-h3:text-2xl prose-h3:md:text-3xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-gray-800
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-base prose-p:md:text-lg prose-p:mb-4
                    prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                    prose-li:text-gray-700 prose-li:mb-2
                    prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                    prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
                    prose-code:text-primary-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
                    prose-hr:border-gray-300 prose-hr:my-8
                  "
                  dangerouslySetInnerHTML={{ __html: blockData.content || '' }}
                />
              )

            case 'image':
              return (
                <div key={block.id} className="my-12 md:my-16 px-4 sm:px-6 lg:px-8">
                  {blockData.image && (
                    <div className="max-w-5xl mx-auto">
                      <img
                        src={getImageUrl(blockData.image)}
                        alt={blockData.alt || ''}
                        className="w-full rounded-xl shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
                      />
                      {blockData.alt && (
                        <p className="text-center text-sm text-gray-500 mt-4 italic">
                          {blockData.alt}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )

            case 'two-column':
              return (
                <div key={block.id} className="px-4 sm:px-6 lg:px-8">
                  <TwoColumnBlock
                    data={blockData}
                    locale={locale}
                  />
                </div>
              )

            case 'accordion':
              return (
                <div key={block.id} className="px-4 sm:px-6 lg:px-8">
                  <AccordionBlock
                    data={blockData}
                    locale={locale}
                  />
                </div>
              )

            case 'cards':
              return (
                <div key={block.id} className="px-4 sm:px-6 lg:px-8">
                  <CardsBlock
                    data={blockData}
                    locale={locale}
                  />
                </div>
              )

            default:
              return null
          }
        } catch (error) {
          console.error(`Error rendering block ${block.id}:`, error)
          console.error('Block data:', block.data)
          console.error('Block type:', block.type)
          // Return a fallback UI instead of null
          return (
            <div key={block.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg my-4">
              <p className="text-yellow-800 text-sm">
                Error rendering block: {block.type} (ID: {block.id})
              </p>
              <p className="text-yellow-600 text-xs mt-1">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          )
        }
      })}
    </>
  )
}

// Gallery Carousel Component
function GalleryCarousel({ data, locale }: { data: any; locale?: 'id' | 'en' }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const title = locale === 'en' && data.titleEn ? data.titleEn : data.title
  const subtitle = locale === 'en' && data.subtitleEn ? data.subtitleEn : data.subtitle
  const itemsPerView = 4 // Show 4 items at once like reference

  // Handle both old format (images array) and new format (items array)
  let galleryItems: any[] = []
  
  // Debug: log data to see what we're receiving
  if (typeof window !== 'undefined') {
    console.log('Gallery Carousel Data:', data)
  }
  
  if (data.items && Array.isArray(data.items) && data.items.length > 0) {
    // New format: items array
    galleryItems = data.items.map((item: any, index: number) => {
      if (typeof item === 'string') {
        return { image: getImageUrl(item), label: `Item ${index + 1}` }
      }
      // Ensure we have image property
      const imageUrl = item.image || item.url || ''
      const label = item.label || item.name || `Item ${index + 1}`
      return { image: getImageUrl(imageUrl), label }
    }).filter((item: any) => item.image && item.image.trim() !== '') // Filter out empty images
  } else if (data.images && Array.isArray(data.images) && data.images.length > 0) {
    // Old format: images array
    galleryItems = data.images.map((img: string, index: number) => ({
      image: getImageUrl(img),
      label: (data.labels && Array.isArray(data.labels) && data.labels[index]) ? data.labels[index] : `Item ${index + 1}`
    })).filter((item: any) => item.image && item.image.trim() !== '') // Filter out empty images
  }

  if (galleryItems.length === 0) {
    console.warn('Gallery Carousel: No valid items found', data)
    return null
  }

  const totalSlides = Math.ceil(galleryItems.length / itemsPerView)
  const maxIndex = Math.max(0, totalSlides - 1)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0))
  }

  const getCurrentItems = () => {
    const start = currentIndex * itemsPerView
    const end = start + itemsPerView
    const items = galleryItems.slice(start, end)
    // Fill remaining slots with empty placeholders if needed (for consistent grid)
    while (items.length < itemsPerView && items.length < galleryItems.length) {
      items.push(null)
    }
    return items
  }

  const currentItems = getCurrentItems()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        {title && (
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 text-gray-900">
            {title}
          </h2>
        )}
        
        {/* Subtitle */}
        {subtitle && (
          <p className="text-center text-gray-600 text-base md:text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Gallery Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {currentItems.map((item: any, index: number) => {
                if (!item) return null // Skip placeholder items
                const actualIndex = currentIndex * itemsPerView + index
                return (
                  <div key={actualIndex} className="group">
                    <div className="relative overflow-hidden rounded-lg bg-gray-200 aspect-square mb-3">
                      <img
                        src={item.image}
                        alt={item.label || `${title || 'Gallery'} ${actualIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          console.error('Failed to load image:', item.image)
                          e.currentTarget.src = '/placeholder-image.png' // Fallback image
                        }}
                      />
                    </div>
                    {item.label && (
                      <p className="text-center text-sm md:text-base font-medium text-gray-700">
                        {item.label}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation Buttons - Bottom center like reference */}
          {totalSlides > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={goToPrevious}
                type="button"
                className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-2 rounded-lg shadow-md transition-all border border-gray-200 font-medium"
                aria-label="Previous"
              >
                Sebelumnya
              </button>
              <button
                onClick={goToNext}
                type="button"
                className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-2 rounded-lg shadow-md transition-all border border-gray-200 font-medium"
                aria-label="Next"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Video Section Component
function VideoSection({ data, locale }: { data: any; locale?: 'id' | 'en' }) {
  const videos = data.videos || []
  const title = locale === 'en' && data.titleEn ? data.titleEn : data.title

  if (videos.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video: any, index: number) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {video.thumbnail && (
                <div className="relative h-80 bg-gray-200 group cursor-pointer">
                  <img
                    src={getImageUrl(video.thumbnail)}
                    alt={video.title || `Video ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <button
                      onClick={() => {
                        if (video.url) {
                          window.open(video.url, '_blank')
                        }
                      }}
                      className="bg-white/95 hover:bg-white rounded-full p-5 transition-all hover:scale-110 shadow-xl"
                    >
                      <Play className="text-gray-900 ml-1" size={40} fill="currentColor" />
                    </button>
                  </div>
                </div>
              )}
              {video.title && (
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {locale === 'en' && video.titleEn ? video.titleEn : video.title}
                  </h3>
                  {video.description && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {locale === 'en' && video.descriptionEn ? video.descriptionEn : video.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Two Column Block Component
function TwoColumnBlock({ data, locale }: { data: any; locale?: 'id' | 'en' }) {
  const leftContent = locale === 'en' && data.leftContentEn ? data.leftContentEn : data.leftContent
  const rightContent = locale === 'en' && data.rightContentEn ? data.rightContentEn : data.rightContent

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
      <div className="prose prose-lg max-w-none">
        {leftContent && (
          <div dangerouslySetInnerHTML={{ __html: leftContent }} />
        )}
      </div>
      <div className="prose prose-lg max-w-none">
        {rightContent && (
          <div dangerouslySetInnerHTML={{ __html: rightContent }} />
        )}
      </div>
    </div>
  )
}

// Accordion Block Component
function AccordionBlock({ data, locale }: { data: any; locale?: 'id' | 'en' }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const items = data.items || []

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4 my-8">
      {items.map((item: any, index: number) => {
        const isOpen = openIndex === index
        const title = locale === 'en' && item.titleEn ? item.titleEn : item.title
        const content = locale === 'en' && item.contentEn ? item.contentEn : item.content

        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <button
              onClick={() => toggleItem(index)}
              className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${
                isOpen
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <span className="font-semibold">{title}</span>
              {isOpen ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
            {isOpen && (
              <div className="px-6 py-4 bg-white">
                <div
                  className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Cards Block Component
function CardsBlock({ data, locale }: { data: any; locale?: 'id' | 'en' }) {
  const cards = data.cards || []
  const columns = data.columns || 3

  // Map columns to Tailwind classes (dynamic classes don't work with Tailwind JIT)
  const gridColsMap: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }
  const gridColsClass = gridColsMap[columns as keyof typeof gridColsMap] || 'md:grid-cols-3'

  return (
    <div className={`grid grid-cols-1 ${gridColsClass} gap-8 my-8`}>
      {cards.map((card: any, index: number) => {
        const title = locale === 'en' && card.titleEn ? card.titleEn : card.title
        const content = locale === 'en' && card.contentEn ? card.contentEn : card.content

        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            {card.image && (
              <img
                src={getImageUrl(card.image)}
                alt={title || `Card ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  console.error('Failed to load image:', card.image)
                  e.currentTarget.src = '/placeholder-image.png'
                }}
              />
            )}
            {title && (
              <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
            )}
            {content && (
              <div
                className="text-gray-600 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
            {card.buttonText && card.buttonUrl && (
              <Link
                to={card.buttonUrl}
                className="text-primary-600 hover:text-primary-700 font-medium mt-4 inline-block"
              >
                {locale === 'en' && card.buttonTextEn ? card.buttonTextEn : card.buttonText} →
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}

