'use client'

interface CurriculumItem {
  id: string
  mataPelajaran: string
  jpTM: number
  jpProyek: number | null
  order: number
}

interface CurriculumTableSectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    subtitle?: string | null
    subtitleEn?: string | null
    content?: string | null
    contentEn?: string | null
    curriculumItems?: CurriculumItem[] | string | null
  }
  locale?: 'id' | 'en'
}

export function CurriculumTableSection({ section, locale = 'id' }: CurriculumTableSectionProps) {
  // Parse curriculumItems
  let curriculumItems: CurriculumItem[] = []
  if (section.curriculumItems) {
    if (Array.isArray(section.curriculumItems)) {
      curriculumItems = section.curriculumItems
    } else if (typeof section.curriculumItems === 'string') {
      try {
        const parsed = JSON.parse(section.curriculumItems)
        curriculumItems = Array.isArray(parsed) ? parsed : []
      } catch {
        curriculumItems = []
      }
    }
  }

  // Sort by order
  curriculumItems = curriculumItems.sort((a, b) => (a.order || 0) - (b.order || 0))

  // Calculate totals
  const totalJPTM = curriculumItems.reduce((sum, item) => sum + (item.jpTM || 0), 0)
  const totalJPProyek = curriculumItems.reduce((sum, item) => sum + (item.jpProyek || 0), 0)

  const displayTitle = locale === 'en' && section.titleEn ? section.titleEn : section.title
  const displaySubtitle = locale === 'en' && section.subtitleEn ? section.subtitleEn : section.subtitle
  const displayContent = locale === 'en' && section.contentEn ? section.contentEn : section.content

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

        {/* Curriculum Table */}
        {curriculumItems.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold w-16">No.</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Mata Pelajaran</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold" colSpan={2}>
                    Alokasi Waktu
                  </th>
                </tr>
                <tr className="bg-blue-500 text-white">
                  <th className="border border-gray-300"></th>
                  <th className="border border-gray-300"></th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">JP TM</th>
                  <th className="border border-gray-300 px-4 py-2 text-center font-semibold">JP Proyek</th>
                </tr>
              </thead>
              <tbody>
                {curriculumItems.map((item, index) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="border border-gray-300 px-4 py-3 text-center font-medium">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {item.mataPelajaran}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {item.jpTM || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {item.jpProyek !== null && item.jpProyek !== undefined ? item.jpProyek : '-'}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-300 px-4 py-3 text-center" colSpan={2}>
                    Total
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {totalJPTM}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {totalJPProyek}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {curriculumItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Belum ada data kurikulum.</p>
          </div>
        )}
      </div>
    </section>
  )
}

