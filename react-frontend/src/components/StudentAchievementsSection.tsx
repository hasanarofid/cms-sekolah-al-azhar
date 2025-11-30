'use client'

import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { getImageUrl } from '../lib/utils-image-url'

interface AchievementStudent {
  id: string
  name: string
  image?: string
  position?: string
}

interface AchievementItem {
  id: string
  title: string
  titleEn?: string
  subtitle?: string
  description: string
  descriptionEn?: string
  competitionName?: string
  competitionNameEn?: string
  students: AchievementStudent[]
  backgroundType?: 'gradient' | 'gold' | 'blue'
  leftLogo?: string
  rightLogo?: string
  order: number
}

interface StudentAchievementsSectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    achievementItems?: AchievementItem[] | string | null
  }
  locale?: 'id' | 'en'
}

export function StudentAchievementsSection({ section, locale = 'id' }: StudentAchievementsSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Parse achievementItems
  const parseItems = (items: any): AchievementItem[] => {
    if (!items) return []
    if (Array.isArray(items)) return items
    try {
      const parsed = JSON.parse(items)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const items = parseItems(section.achievementItems).sort((a, b) => a.order - b.order)

  if (items.length === 0) {
    return null
  }

  const openModal = (index: number) => {
    setActiveIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setActiveIndex(null)
    document.body.style.overflow = 'unset'
  }

  const goToPrevious = () => {
    if (activeIndex === null) return
    const newIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1
    setActiveIndex(newIndex)
  }

  const goToNext = () => {
    if (activeIndex === null) return
    const newIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0
    setActiveIndex(newIndex)
  }

  // Handle keyboard navigation
  React.useEffect(() => {
    if (activeIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      } else if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex])

  const getBackgroundClass = (type?: string) => {
    switch (type) {
      case 'gold':
        return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600'
      case 'blue':
        return 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700'
      default:
        return 'bg-gradient-to-br from-blue-400 via-teal-500 to-green-500'
    }
  }

  const renderAchievementCard = (item: AchievementItem, index: number, isModal: boolean = false) => {
    const title = locale === 'en' && item.titleEn ? item.titleEn : item.title
    const description = locale === 'en' && item.descriptionEn ? item.descriptionEn : item.description
    const competitionName = locale === 'en' && item.competitionNameEn ? item.competitionNameEn : item.competitionName

    return (
      <div
        className={`${getBackgroundClass(item.backgroundType)} rounded-2xl shadow-xl p-6 md:p-8 lg:p-10 text-white relative overflow-hidden ${
          isModal ? 'max-w-4xl mx-auto' : 'cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl'
        }`}
        onClick={!isModal ? () => openModal(index) : undefined}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative z-10">
          {/* Logos */}
          <div className="flex justify-between items-start mb-4">
            {item.leftLogo && (
              <img
                src={getImageUrl(item.leftLogo)}
                alt="Left Logo"
                className="h-12 md:h-16 w-auto object-contain"
              />
            )}
            {item.rightLogo && (
              <img
                src={getImageUrl(item.rightLogo)}
                alt="Right Logo"
                className="h-12 md:h-16 w-auto object-contain"
              />
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-center">
            {title}
          </h3>

          {/* Subtitle */}
          {item.subtitle && (
            <p className="text-sm md:text-base text-center mb-6 opacity-90">
              {item.subtitle}
            </p>
          )}

          {/* Students */}
          {item.students.length > 0 && (
            <div className={`flex flex-wrap justify-center gap-4 md:gap-6 mb-6 ${
              item.students.length === 1 ? 'justify-center' : ''
            }`}>
              {item.students.map((student) => (
                <div key={student.id} className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white/20 flex items-center justify-center">
                      {student.image ? (
                        <img
                          src={getImageUrl(student.image)}
                          alt={student.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-white/30 flex items-center justify-center">
                          <span className="text-white text-2xl md:text-3xl font-bold">
                            {student.name ? student.name.charAt(0).toUpperCase() : '?'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm md:text-base mb-1">
                      {student.name}
                    </p>
                    {student.position && (
                      <p className="text-xs md:text-sm opacity-90">
                        {student.position}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Competition Name */}
          {competitionName && (
            <p className="text-center text-sm md:text-base font-medium mb-4 opacity-95">
              {competitionName}
            </p>
          )}

          {/* Description */}
          {description && (
            <p className="text-center text-sm md:text-base leading-relaxed opacity-90">
              {description}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          {(section.title || section.titleEn) && (
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                {locale === 'en' && section.titleEn ? section.titleEn : section.title}
              </h2>
            </div>
          )}

          {/* Achievement Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {items.map((item, index) => (
              <div key={item.id}>
                {renderAchievementCard(item, index, false)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal/Carousel */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close"
            >
              <X size={32} />
            </button>

            {/* Navigation Buttons */}
            {items.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors z-10"
                  aria-label="Previous"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors z-10"
                  aria-label="Next"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Active Card */}
            {renderAchievementCard(items[activeIndex], activeIndex, true)}

            {/* Indicator */}
            {items.length > 1 && (
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex space-x-2">
                {items.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveIndex(index)
                    }}
                    className={`h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? 'w-8 bg-white'
                        : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Counter */}
            {items.length > 1 && (
              <div className="absolute -bottom-12 right-0 text-white text-sm">
                {activeIndex + 1} / {items.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

