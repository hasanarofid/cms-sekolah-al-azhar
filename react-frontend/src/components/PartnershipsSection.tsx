'use client'

import { ScrollItem } from './ScrollItem'

interface Partnership {
  id: string
  name: string
  nameEn?: string | null
  logo: string
  category: string
}

interface PartnershipsSectionProps {
  partnerships: Partnership[]
  locale?: 'id' | 'en'
}

const categoryLabels: Record<string, { id: string; en: string }> = {
  'international': { id: 'Kerjasama Internasional', en: 'International Cooperation' },
  'health': { id: 'Kerjasama Kesehatan', en: 'Health Cooperation' },
  'student-escort': { id: 'Kerjasama Pengawalan Siswa', en: 'Student Escort Cooperation' },
}

export function PartnershipsSection({ partnerships, locale = 'id' }: PartnershipsSectionProps) {
  if (partnerships.length === 0) return null

  // Group partnerships by category
  const groupedPartnerships = partnerships.reduce((acc: any, partnership: any) => {
    if (!acc[partnership.category]) {
      acc[partnership.category] = []
    }
    acc[partnership.category].push(partnership)
    return acc
  }, {})

  const categories = ['international', 'health', 'student-escort']

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
              {/* Category Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                {displayLabel}
              </h2>

              {/* Partnerships Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {categoryPartnerships.map((partnership: any, index: number) => (
                  <ScrollItem key={partnership.id} delay={index * 0.05} direction="up">
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      {/* Logo */}
                      <div className="mb-4 h-24 w-full flex items-center justify-center">
                        <img
                          src={partnership.logo}
                          alt={locale === 'en' && partnership.nameEn ? partnership.nameEn : partnership.name}
                          className="max-h-24 max-w-full object-contain"
                        />
                      </div>
                      {/* Name */}
                      <p className="text-sm md:text-base text-center text-gray-700 font-medium">
                        {locale === 'en' && partnership.nameEn ? partnership.nameEn : partnership.name}
                      </p>
                    </div>
                  </ScrollItem>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

