'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { SectionRenderer } from './SectionRenderer'

interface PageSection {
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
  order?: number
  isActive?: boolean
}

interface PageSectionsProps {
  sections: PageSection[]
  locale?: 'id' | 'en'
}

export function PageSections({ sections, locale = 'id' }: PageSectionsProps) {
  const [activeVideo, setActiveVideo] = useState<{ sectionId: string; videoId: string } | null>(null)
  
  // Sort sections by order and filter active sections
  const sortedSections = [...sections]
    .filter((s) => s.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
  
  // Debug logging
  if (import.meta.env.DEV) {
    console.log('PageSections - Total sections:', sections.length)
    console.log('PageSections - Sorted sections:', sortedSections)
    console.log('PageSections - Video-profile sections:', sortedSections.filter((s) => s.type === 'video-profile'))
  }

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url?: string | null) => {
    if (!url) return null
    const trimmed = url.trim()
    const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    const match = trimmed.match(youtubeRegex)
    if (match && match[1]) {
      return match[1]
    }
    try {
      const urlObj = new URL(trimmed)
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        const id = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop()
        return id && id.length >= 11 ? id : null
      }
    } catch {
      // Invalid URL - ignore
    }
    return null
  }

  const handlePlayVideo = (section: PageSection) => {
    if (!section.videoUrl) return
    const videoId = extractYouTubeId(section.videoUrl)
    if (!videoId) {
      window.open(section.videoUrl, '_blank', 'noopener,noreferrer')
      return
    }
    setActiveVideo({ sectionId: section.id, videoId })
  }

  const closeVideoModal = () => {
    setActiveVideo(null)
  }

  // Render sections in order, similar to HomePage
  const renderedSections: React.ReactElement[] = []
  let i = 0
  
  while (i < sortedSections.length) {
    const section = sortedSections[i]
    
    // If it's a video-profile, collect all consecutive video-profiles
    if (section.type === 'video-profile') {
      const videoProfiles: PageSection[] = [section]
      i++
      while (i < sortedSections.length && sortedSections[i].type === 'video-profile') {
        videoProfiles.push(sortedSections[i])
        i++
      }
      
      // Render grouped video profiles
      // If only one video-profile, center it; otherwise use grid
      const isSingleVideo = videoProfiles.length === 1
      
      renderedSections.push(
        <section key={`video-group-${videoProfiles[0].id}`} className="py-8 md:py-10 lg:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isSingleVideo ? (
              // Center single video-profile
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <SectionRenderer
                    key={videoProfiles[0].id}
                    section={{ ...videoProfiles[0], order: videoProfiles[0].order || 0 }}
                    locale={locale}
                    activeVideo={activeVideo}
                    onPlayVideo={handlePlayVideo}
                    onCloseVideo={() => setActiveVideo(null)}
                    isGrouped={true}
                  />
                </div>
              </div>
            ) : (
              // Grid layout for multiple video-profiles
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {videoProfiles.map((videoSection) => (
                  <SectionRenderer
                    key={videoSection.id}
                    section={{ ...videoSection, order: videoSection.order || 0 }}
                    locale={locale}
                    activeVideo={activeVideo}
                    onPlayVideo={handlePlayVideo}
                    onCloseVideo={() => setActiveVideo(null)}
                    isGrouped={true}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )
    } else {
      // Render other sections individually
      renderedSections.push(
        <SectionRenderer
          key={section.id}
          section={{ ...section, order: section.order || 0 }}
          locale={locale}
          activeVideo={activeVideo}
          onPlayVideo={handlePlayVideo}
          onCloseVideo={() => setActiveVideo(null)}
        />
      )
      i++
    }
  }

  return (
    <>
      {/* Render all sections in order */}
      {renderedSections}

      {/* YouTube Video Modal */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeVideoModal}
        >
          <div 
            className="relative w-full max-w-4xl mx-4 bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
              aria-label="Close video"
            >
              <X size={24} className="text-gray-900" />
            </button>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

