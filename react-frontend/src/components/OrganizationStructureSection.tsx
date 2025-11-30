'use client'

import { getImageUrl } from '../lib/utils-image-url'

interface OrganizationItem {
  id: string
  name: string
  position: string
  positionEn?: string
  image?: string
  parentId?: string | null
  level: number
  order: number
}

interface OrganizationStructureSectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    organizationItems?: OrganizationItem[] | string | null
  }
  locale?: 'id' | 'en'
}

export function OrganizationStructureSection({ section, locale = 'id' }: OrganizationStructureSectionProps) {
  // Parse organizationItems
  const parseItems = (items: any): OrganizationItem[] => {
    if (!items) return []
    if (Array.isArray(items)) return items
    try {
      const parsed = JSON.parse(items)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const items = parseItems(section.organizationItems)

  if (items.length === 0) {
    return null
  }

  // Build hierarchical structure
  const buildHierarchy = (parentId: string | null = null): OrganizationItem[] => {
    return items
      .filter(item => item.parentId === parentId)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        ...item,
        children: buildHierarchy(item.id)
      })) as any
  }

  const hierarchy = buildHierarchy()

  // Render item with children recursively
  const renderItem = (item: OrganizationItem, depth: number = 0): React.ReactNode => {
    const children = items.filter(i => i.parentId === item.id).sort((a, b) => a.order - b.order)
    const hasChildren = children.length > 0

    return (
      <div key={item.id} className="flex flex-col items-center">
        {/* Item Card */}
        <div className="relative mb-4">
          {/* Profile Circle */}
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
              {item.image ? (
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name || item.position}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : null}
              {!item.image && (
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <span className="text-white text-xs md:text-sm font-bold">
                    {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name and Position Box */}
          <div className="mt-3 bg-white rounded-lg shadow-md p-3 min-w-[180px] md:min-w-[220px] text-center border border-gray-200">
            <h4 className="font-semibold text-sm md:text-base text-gray-900 mb-1">
              {item.name || 'N/A'}
            </h4>
            <p className="text-xs md:text-sm text-gray-600">
              {locale === 'en' && item.positionEn ? item.positionEn : item.position}
            </p>
          </div>
        </div>

        {/* Connection Line to Children */}
        {hasChildren && (
          <div className="relative w-full flex justify-center mb-4">
            <div className="w-0.5 h-8 bg-gray-400"></div>
          </div>
        )}

        {/* Children Container */}
        {hasChildren && (
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 mt-4">
            {children.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        {(section.title || section.titleEn) && (
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
              {locale === 'en' && section.titleEn ? section.titleEn : section.title}
            </h2>
          </div>
        )}

        {/* Organization Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 lg:p-12 border border-white/50">
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
            {hierarchy.map((item) => renderItem(item))}
          </div>
        </div>
      </div>
    </section>
  )
}

