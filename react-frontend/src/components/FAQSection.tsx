'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { getImageUrl } from '../lib/utils-image-url'

interface FAQ {
  id: string
  question: string
  questionEn?: string | null
  answer: string
  answerEn?: string | null
  image?: string | null
  sectionTitle?: string | null
  sectionTitleEn?: string | null
}

interface FAQSectionProps {
  faqs: FAQ[]
  locale?: 'id' | 'en'
}

export function FAQSection({ faqs, locale = 'id' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0) // First item open by default

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (faqs.length === 0) return null

  // Get section title and image from first FAQ that has them, or use defaults
  const sectionData = faqs.find(f => f.sectionTitle || f.image) || faqs[0]
  const sectionTitle = locale === 'en' && sectionData.sectionTitleEn 
    ? sectionData.sectionTitleEn 
    : sectionData.sectionTitle || ''
  const sectionImage = sectionData.image

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title / Motto */}
        {sectionTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif italic text-gray-900">
              "{sectionTitle}"
            </h2>
          </div>
        )}

        {/* FAQ Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            FaQ Tentang Al Azhar IIBS
          </h2>
        </div>
        
        {/* Two Column Layout: FAQ Left, Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              const question = locale === 'en' && faq.questionEn ? faq.questionEn : faq.question
              const answer = locale === 'en' && faq.answerEn ? faq.answerEn : faq.answer

              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${
                      isOpen
                        ? 'bg-orange-500 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <span className="font-semibold text-base md:text-lg pr-4">
                      {question}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={24} className="flex-shrink-0" />
                    ) : (
                      <ChevronDown size={24} className="flex-shrink-0" />
                    )}
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 py-4 bg-white">
                      <div
                        className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: answer }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Right: Image */}
          {sectionImage && (
            <div className="sticky top-8">
              <div className="relative h-full min-h-[500px] lg:min-h-[600px]">
                <img
                  src={getImageUrl(sectionImage)}
                  alt="FAQ Section Image"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    console.error('Failed to load image:', sectionImage)
                    e.currentTarget.src = '/placeholder-image.png'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

