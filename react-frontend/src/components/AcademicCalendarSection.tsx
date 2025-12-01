'use client'

import { Calendar } from 'lucide-react'

interface CalendarItem {
  id: string
  bulan: string
  kegiatan: string
  keterangan?: string
  tanggalMulai?: string
  tanggalSelesai?: string
  order: number
}

interface AcademicCalendarSectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    subtitle?: string | null
    subtitleEn?: string | null
    content?: string | null
    contentEn?: string | null
    calendarItems?: CalendarItem[] | string | null
  }
  locale?: 'id' | 'en'
}

export function AcademicCalendarSection({ section, locale = 'id' }: AcademicCalendarSectionProps) {
  // Parse calendarItems
  let calendarItems: CalendarItem[] = []
  if (section.calendarItems) {
    if (Array.isArray(section.calendarItems)) {
      calendarItems = section.calendarItems
    } else if (typeof section.calendarItems === 'string') {
      try {
        const parsed = JSON.parse(section.calendarItems)
        calendarItems = Array.isArray(parsed) ? parsed : []
      } catch {
        calendarItems = []
      }
    }
  }

  // Sort by order
  calendarItems = calendarItems.sort((a, b) => (a.order || 0) - (b.order || 0))

  const displayTitle = locale === 'en' && section.titleEn ? section.titleEn : section.title
  const displaySubtitle = locale === 'en' && section.subtitleEn ? section.subtitleEn : section.subtitle
  const displayContent = locale === 'en' && section.contentEn ? section.contentEn : section.content

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Title and Subtitle */}
        {displayTitle && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            {displayTitle}
          </h2>
        )}

        {displaySubtitle && (
          <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6 text-center">
            {displaySubtitle}
          </h3>
        )}

        {/* Content */}
        {displayContent && (
          <div 
            className="prose prose-lg max-w-none mb-8 text-gray-700"
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />
        )}

        {/* Calendar Table */}
        {calendarItems.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold w-16">No.</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Bulan/Periode</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Kegiatan</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {calendarItems.map((item, index) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="border border-gray-300 px-4 py-3 text-center font-medium">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Calendar size={18} className="text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">{item.bulan}</div>
                          {(item.tanggalMulai || item.tanggalSelesai) && (
                            <div className="text-sm text-gray-600 mt-1">
                              {item.tanggalMulai && formatDate(item.tanggalMulai)}
                              {item.tanggalMulai && item.tanggalSelesai && ' - '}
                              {item.tanggalSelesai && formatDate(item.tanggalSelesai)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="font-medium text-gray-900">{item.kegiatan}</div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {item.keterangan ? (
                        <div className="text-gray-700">{item.keterangan}</div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {calendarItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p>Belum ada data kalender pendidikan.</p>
          </div>
        )}
      </div>
    </section>
  )
}

