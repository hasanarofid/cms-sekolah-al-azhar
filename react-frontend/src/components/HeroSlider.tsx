'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import { getImageUrl } from '../lib/utils-image-url'

interface Slider {
  id: string
  title: string
  titleEn?: string | null
  subtitle?: string | null
  subtitleEn?: string | null
  image: string
  videoUrl?: string | null
  buttonText?: string | null
  buttonTextEn?: string | null
  buttonUrl?: string | null
  isActive?: boolean
}

interface HeroSliderProps {
  sliders: Slider[]
  locale?: 'id' | 'en'
}

export function HeroSlider({ sliders, locale = 'id' }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [activeVideo, setActiveVideo] = useState<{ sliderId: string; videoId: string } | null>(null)
  const autoPlayResumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeSliders = sliders.filter(s => s.isActive !== false)

  const clearAutoPlayTimeout = () => {
    if (autoPlayResumeTimeout.current) {
      clearTimeout(autoPlayResumeTimeout.current)
      autoPlayResumeTimeout.current = null
    }
  }

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false)
    clearAutoPlayTimeout()
  }

  const resumeAutoPlayLater = () => {
    clearAutoPlayTimeout()
    autoPlayResumeTimeout.current = setTimeout(() => {
      setIsAutoPlaying(true)
      autoPlayResumeTimeout.current = null
    }, 10000)
  }

  useEffect(() => {
    return () => {
      clearAutoPlayTimeout()
    }
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || activeSliders.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSliders.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, activeSliders.length])

  if (activeSliders.length === 0) {
    return (
        <div className="flex items-center justify-center h-[50vh] bg-gray-100 text-gray-500">
            No active slides available.
        </div>
    )
  }

  const currentSlider = activeSliders[currentIndex]

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setActiveVideo(null)
    pauseAutoPlay()
    resumeAutoPlayLater()
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + activeSliders.length) % activeSliders.length)
    setActiveVideo(null)
    pauseAutoPlay()
    resumeAutoPlayLater()
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSliders.length)
    setActiveVideo(null)
    pauseAutoPlay()
    resumeAutoPlayLater()
  }

  // Calculate the transform value to shift the entire slide strip
  // Ex: Slide 0: translateX(0), Slide 1: translateX(-100%), Slide 2: translateX(-200%)
  const transformValue = `translateX(-${currentIndex * 100}%)`

  // Helper to determine if the URL is external
  const isExternalUrl = (url: string | null | undefined) => 
    url && (url.startsWith('http://') || url.startsWith('https://'))

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
      if (urlObj.hostname.includes('youtube.com')) {
        const id = urlObj.searchParams.get('v')
        return id && id.length >= 11 ? id : null
      }
    } catch {
      // Invalid URL - ignore
    }
    return null
  }

  const handlePlayVideo = (slider: Slider) => {
    if (!slider.videoUrl) return
    const videoId = extractYouTubeId(slider.videoUrl)
    pauseAutoPlay()
    if (!videoId) {
      window.open(slider.videoUrl, '_blank', 'noopener,noreferrer')
      return
    }
    setActiveVideo({ sliderId: slider.id, videoId })
  }

  const closeVideoModal = () => {
    setActiveVideo(null)
    setIsAutoPlaying(true)
  }

  return (
    <div className="relative w-full h-[85vh] min-h-[700px] overflow-hidden">
        
        {/* ========================================= */}
        {/* SLIDER IMAGES: Horizontal Sliding Effect  */}
        {/* ========================================= */}
        {/* The wrapper moves left/right via transform. Width is N * 100% of parent */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            width: `${activeSliders.length * 100}%`,
            transform: transformValue, 
          }}
        >
          {activeSliders.map((slider) => (
            <div
              key={slider.id}
              // Each slide must take up 1/Nth of the total width of the 'flex' container
              // This ensures each slide is 100% of the viewport width.
              style={{ width: `${100 / activeSliders.length}%` }}
              className="h-full flex-shrink-0 relative"
            >
              {/* Slide Background Image */}
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${getImageUrl(slider.image)})` }}
              >
                {/* Dark Gradient Overlay for Readability (like the example) */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================= */}
        {/* CONTENT OVERLAY: Fixed Position           */}
        {/* ========================================= */}
        {/* This layer is fixed and overlays the sliding images. */}
        {/* We use key={currentIndex} to force re-render and re-apply the content animation. */}
        <div 
            key={currentIndex} // Force re-render for animation on slide change
            className="absolute inset-0 flex items-center pt-32"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-5xl text-white text-center mx-auto">
               {/* Main Title - Split into two lines (like "Al Azhar International" and "Islamic Boarding School") */}
               <h1 
                 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-white animate-slide-in leading-tight"
                 style={{ textShadow: '3px 3px 12px rgba(0,0,0,0.9)', letterSpacing: '0.5px' }}
               >
                 {(() => {
                   const title = locale === 'en' && currentSlider.titleEn
                     ? currentSlider.titleEn
                     : currentSlider.title
                   // Split title by "Islamic" if exists
                   const parts = title?.split(' Islamic ') || []
                   if (parts.length > 1) {
                     return (
                       <>
                         {parts[0]}<br />
                         Islamic {parts[1]}
                       </>
                     )
                   }
                   // If no "Islamic", try splitting by "International"
                   const intlParts = title?.split(' International ') || []
                   if (intlParts.length > 1) {
                     return (
                       <>
                         {intlParts[0]}<br />
                         International {intlParts[1]}
                       </>
                     )
                   }
                   return title
                 })()}
               </h1>
               
               {/* Subtitle - Split by " and " if exists, otherwise show full subtitle */}
               {currentSlider.subtitle && (() => {
                 const subtitle = locale === 'en' && currentSlider.subtitleEn
                   ? currentSlider.subtitleEn
                   : currentSlider.subtitle
                 
                 if (!subtitle) return null
                 
                 const parts = subtitle.split(' and ')
                 
                 if (parts.length > 1) {
                   // Split into two lines if contains " and "
                   return (
                     <>
                       <p 
                         className="text-lg md:text-xl lg:text-2xl mb-1 text-white font-normal animate-slide-in animate-delay-1"
                         style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}
                       >
                         {parts[0]}
                       </p>
                       <p 
                         className="text-lg md:text-xl lg:text-2xl mb-8 text-white font-normal animate-slide-in animate-delay-1"
                         style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}
                       >
                         {parts[1]}
                       </p>
                     </>
                   )
                 } else {
                   // Show full subtitle in one line if no " and "
                   return (
                     <p 
                       className="text-lg md:text-xl lg:text-2xl mb-8 text-white font-normal animate-slide-in animate-delay-1"
                       style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}
                     >
                       {subtitle}
                     </p>
                   )
                 }
               })()}
               
               {/* Video Button */}
               {currentSlider.videoUrl && (
                 <div className="animate-slide-in animate-delay-2 mt-6 flex flex-col items-center">
                   <button
                     type="button"
                     onClick={() => handlePlayVideo(currentSlider)}
                     className="w-20 h-20 rounded-full bg-white/90 text-red-600 hover:bg-red-600 hover:text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
                     aria-label="Putar video"
                   >
                     <Play size={36} fill="currentColor" strokeWidth={0} className="ml-1" />
                   </button>
                   <span className="mt-4 uppercase tracking-[0.5em] text-xs text-white/80">
                     Putar Video
                   </span>
                 </div>
               )}

               {/* Button - Green button matching school logo */}
               {currentSlider.buttonText && currentSlider.buttonUrl && (
                <div className={`animate-slide-in ${currentSlider.videoUrl ? 'animate-delay-3' : 'animate-delay-2'} mt-8`}>
                     <a
                       href={currentSlider.buttonUrl}
                       target={isExternalUrl(currentSlider.buttonUrl) ? '_blank' : '_self'}
                       rel={isExternalUrl(currentSlider.buttonUrl) ? 'noopener noreferrer' : undefined}
                       className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-10 py-4 rounded-lg font-bold text-lg md:text-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                       style={{ boxShadow: '0 10px 25px rgba(34, 197, 94, 0.3)' }}
                     >
                       {locale === 'en' && currentSlider.buttonTextEn
                         ? currentSlider.buttonTextEn
                         : currentSlider.buttonText}
                     </a>
                 </div>
               )}
            </div>
          </div>
        </div>

         {/* Navigation Arrows - Semi-transparent like reference */}
         {activeSliders.length > 1 && (
           <>
             <button
               onClick={goToPrevious}
               className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200 z-20 shadow-lg"
               aria-label="Previous slide"
             >
               <ChevronLeft size={24} />
             </button>
             <button
               onClick={goToNext}
               className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200 z-20 shadow-lg"
               aria-label="Next slide"
             >
               <ChevronRight size={24} />
             </button>
           </>
         )}

         {/* Dots Indicator - Active dot is green like button */}
         {activeSliders.length > 1 && (
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
             {activeSliders.map((_, index) => (
               <button
                 key={index}
                 onClick={() => goToSlide(index)}
                 className={`h-2 rounded-full transition-all duration-300 ${
                   index === currentIndex
                     ? 'w-10 bg-primary-500' // Active dot - green and longer (matches button)
                     : 'w-2 bg-white/60 hover:bg-white/80' // Inactive dots - semi-transparent white
                 }`}
                 aria-label={`Go to slide ${index + 1}`}
               />
             ))}
           </div>
        )}

        {/* Video Modal */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                title="Hero Slider Video"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
              <button
                type="button"
                onClick={closeVideoModal}
                className="absolute top-4 right-4 bg-black/70 text-white rounded-full p-2 hover:bg-black focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-label="Tutup video"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
       </div>
   )
 }