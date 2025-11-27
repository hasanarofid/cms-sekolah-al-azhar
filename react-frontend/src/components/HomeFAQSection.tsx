'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { getImageUrl } from '../lib/utils-image-url'

interface FAQ {
  id: string
  question: string
  questionEn?: string | null
  answer: string
  answerEn?: string | null
}

interface FAQItem {
  id: string
  question: string
  questionEn?: string
  answer: string
  answerEn?: string
  order: number
}

interface HomeFAQSectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    image?: string | null
    faqItems?: FAQItem[] | string | null
  }
  locale?: 'id' | 'en'
}

export function HomeFAQSection({ section, locale = 'id' }: HomeFAQSectionProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [openIndex, setOpenIndex] = useState<number | null>(0) // First item open by default
  const [loading] = useState(false)

  useEffect(() => {
    // Parse faqItems from section
    let faqItems: FAQItem[] = []
    
    if (section.faqItems) {
      if (Array.isArray(section.faqItems)) {
        faqItems = section.faqItems
      } else if (typeof section.faqItems === 'string') {
        try {
          const parsed = JSON.parse(section.faqItems)
          faqItems = Array.isArray(parsed) ? parsed : []
        } catch (e) {
          console.error('Error parsing faqItems:', e)
          faqItems = []
        }
      }
    }
    
    // Convert FAQItems to FAQ format
    const formattedFaqs: FAQ[] = faqItems
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(item => ({
        id: item.id,
        question: item.question || '',
        questionEn: item.questionEn || null,
        answer: item.answer || '',
        answerEn: item.answerEn || null,
      }))
    
    setFaqs(formattedFaqs)
  }, [section.faqItems])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (faqs.length === 0) return null

  const sectionTitle = locale === 'en' && section.titleEn ? section.titleEn : section.title

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title / Motto */}
        {sectionTitle && (
            <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {sectionTitle}
            </h2>
          </div>
        )}

        {/* FAQ Title */}
      
        
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
                        ? 'bg-green-500 text-white'
                        : 'bg-green-600 text-white hover:bg-green-700'
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
          {section.image && (
            <div className="sticky top-8">
              <div className="relative h-full min-h-[500px] lg:min-h-[600px]">
                <img
                  src={getImageUrl(section.image)}
                  alt="FAQ Section Image"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    console.error('Failed to load image:', section.image)
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

