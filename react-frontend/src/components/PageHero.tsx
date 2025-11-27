'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, X } from 'lucide-react'
import { getImageUrl } from '../lib/utils-image-url'

interface PageHeroProps {
  hero: {
    id?: string
    title?: string | null
    titleEn?: string | null
    subtitle?: string | null
    subtitleEn?: string | null
    image?: string | null
    videoUrl?: string | null
    buttonText?: string | null
    buttonTextEn?: string | null
    buttonUrl?: string | null
  }
  locale?: 'id' | 'en'
}

export function PageHero({ hero, locale = 'id' }: PageHeroProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const isExternalUrl = (url: string | null | undefined) => 
    url && (url.startsWith('http://') || url.startsWith('https://'))

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

  const handlePlayVideo = () => {
    if (!hero.videoUrl) return
    const videoId = extractYouTubeId(hero.videoUrl)
    if (!videoId) {
      window.open(hero.videoUrl, '_blank', 'noopener,noreferrer')
      return
    }
    setActiveVideo(videoId)
  }

  const closeVideoModal = () => {
    setActiveVideo(null)
  }

  if (!hero) return null

  return (
    <>
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background Image or Video */}
        {hero.image && (
          <div className="absolute inset-0">
            <img
              src={getImageUrl(hero.image)}
              alt={locale === 'en' && hero.titleEn ? hero.titleEn : hero.title || ''}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/80 to-primary-700/80"></div>
          </div>
        )}

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {hero.title && (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {locale === 'en' && hero.titleEn ? hero.titleEn : hero.title}
              </h1>
            )}
            {hero.subtitle && (
              <p className="text-xl md:text-2xl text-primary-100 leading-relaxed mb-8">
                {locale === 'en' && hero.subtitleEn ? hero.subtitleEn : hero.subtitle}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              {hero.videoUrl && (
                <button
                  onClick={handlePlayVideo}
                  className="bg-white/95 hover:bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-xl flex items-center justify-center space-x-2"
                >
                  <Play size={20} fill="currentColor" />
                  <span>Putar Video</span>
                </button>
              )}
              {hero.buttonText && hero.buttonUrl && (
                <>
                  {isExternalUrl(hero.buttonUrl) ? (
                    <a
                      href={hero.buttonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/95 hover:bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-xl text-center"
                    >
                      {locale === 'en' && hero.buttonTextEn
                        ? hero.buttonTextEn
                        : hero.buttonText}
                    </a>
                  ) : (
                    <Link
                      to={hero.buttonUrl}
                      className="bg-white/95 hover:bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-xl text-center"
                    >
                      {locale === 'en' && hero.buttonTextEn
                        ? hero.buttonTextEn
                        : hero.buttonText}
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

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
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
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

