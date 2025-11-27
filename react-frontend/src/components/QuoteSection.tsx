'use client'

interface QuoteSectionProps {
  quote: string
  quoteEn?: string | null
  locale?: 'id' | 'en'
}

export function QuoteSection({ quote, quoteEn, locale = 'id' }: QuoteSectionProps) {
  if (!quote) return null

  const displayQuote = locale === 'en' && quoteEn ? quoteEn : quote

  return (
    <section className="py-8 md:py-10 lg:py-12 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-200 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-200 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 
            className="font-serif italic text-gray-900"
            style={{
              fontFamily: "'Playfair Display', 'Georgia', 'Times New Roman', serif",
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 400,
              letterSpacing: '0.02em',
              lineHeight: '1.5',
              fontStyle: 'italic',
              textShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}
          >
            "{displayQuote}"
          </h2>
        </div>
      </div>
    </section>
  )
}

