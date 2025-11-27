'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getImageUrl } from '../lib/utils-image-url'

interface ExtracurricularItem {
  id: string
  image: string
  title: string
  description: string
}

interface ExtracurricularDetailSectionProps {
  section: {
    id: string
    imageLeft?: string | null
    title?: string | null
    titleEn?: string | null
    extracurricularItems?: ExtracurricularItem[] | string | null
  }
  locale?: 'id' | 'en'
}

export function ExtracurricularDetailSection({ section, locale = 'id' }: ExtracurricularDetailSectionProps) {
  let items: ExtracurricularItem[] = []
  
  if (section.extracurricularItems) {
    if (typeof section.extracurricularItems === 'string') {
      try {
        const parsed = JSON.parse(section.extracurricularItems)
        items = Array.isArray(parsed) ? parsed : []
      } catch {
        items = []
      }
    } else if (Array.isArray(section.extracurricularItems)) {
      items = section.extracurricularItems
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (items.length === 0) return null

  const displayTitle = locale === 'en' && section.titleEn ? section.titleEn : section.title
  const currentItem = items[currentIndex]

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {displayTitle && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
            {displayTitle}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side - Image */}
          {section.imageLeft && (
            <div className="relative">
              <img
                src={getImageUrl(section.imageLeft)}
                alt="Student"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Right Side - Carousel */}
          <div className="relative">
            {currentItem && (
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                {/* Image */}
                {currentItem.image && (
                  <div className="mb-6">
                    <img
                      src={getImageUrl(currentItem.image)}
                      alt={currentItem.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {currentItem.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  {currentItem.description}
                </p>
              </div>
            )}

            {/* Navigation Arrows */}
            {items.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft size={24} className="text-gray-700" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight size={24} className="text-gray-700" />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {items.length > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {items.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'w-8 bg-primary-600'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

