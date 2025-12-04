'use client'

import { getImageUrl } from '../lib/utils-image-url'

interface PartnershipItem {
  id: string
  name: string
  nameEn?: string
  logo?: string
  location?: string
  locationEn?: string
  category: 'international' | 'health' | 'student-escort'
  order: number
}

interface HomePartnershipsSectionProps {
  section: {
    id: string
    partnerships?: PartnershipItem[] | string | null
  }
  locale?: 'id' | 'en'
}

const categoryLabels: Record<string, { id: string; en: string }> = {
  'international': { id: 'Kerjasama ', en: 'Cooperation' },
  'health': { id: 'Kerjasama Kesehatan', en: 'Health Cooperation' },
  'student-escort': { id: 'Kerjasama Pengawalan Siswa', en: 'Student Escort Cooperation' },
}

export function HomePartnershipsSection({ section, locale = 'id' }: HomePartnershipsSectionProps) {
  // Parse partnerships data
  let partnerships: PartnershipItem[] = []
  
  if (section.partnerships) {
    if (typeof section.partnerships === 'string') {
      try {
        const parsed = JSON.parse(section.partnerships)
        partnerships = Array.isArray(parsed) ? parsed : []
      } catch {
        partnerships = []
      }
    } else if (Array.isArray(section.partnerships)) {
      partnerships = section.partnerships
    }
  }

  if (partnerships.length === 0) return null

  // Group partnerships by category
  const groupedPartnerships = partnerships.reduce((acc: Record<string, PartnershipItem[]>, partnership) => {
    if (!acc[partnership.category]) {
      acc[partnership.category] = []
    }
    acc[partnership.category].push(partnership)
    return acc
  }, {})

  const categories: Array<'international' | 'health' | 'student-escort'> = ['international', 'health', 'student-escort']

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categories.map((category) => {
          const categoryPartnerships = groupedPartnerships[category] || []
          if (categoryPartnerships.length === 0) return null

          const categoryLabel = categoryLabels[category]
          const displayLabel = locale === 'en' ? categoryLabel.en : categoryLabel.id

          return (
            <div key={category} className="mb-16 last:mb-0">
              {/* Category Title - Match reference: centered, dark blue, large font */}
              <h2 
                className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary-600"
              >
                {displayLabel}
              </h2>

              {/* Partnerships Grid - Horizontal layout like reference */}
              <div className="flex flex-wrap justify-center items-start gap-8 md:gap-12">
                {categoryPartnerships.map((partnership) => {
                  const displayName = locale === 'en' && partnership.nameEn ? partnership.nameEn : partnership.name
                  const displayLocation = locale === 'en' && partnership.locationEn ? partnership.locationEn : partnership.location

                  return (
                    <div
                      key={partnership.id}
                      className="flex flex-col items-center justify-center min-w-[200px] max-w-[250px]"
                    >
                      {/* Logo */}
                      {partnership.logo && (
                        <div className="mb-4 h-24 w-full flex items-center justify-center">
                          <img
                            src={getImageUrl(partnership.logo)}
                            alt={displayName}
                            className="max-h-24 max-w-full object-contain"
                            onError={(e) => {
                              console.error('Failed to load logo:', partnership.logo)
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Name and Location */}
                      <div className="text-center">
                        <p className="text-sm md:text-base text-primary-600 font-medium mb-1">
                          {displayName}
                        </p>
                        {displayLocation && (
                          <p className="text-xs md:text-sm text-primary-600">
                            {displayLocation}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

