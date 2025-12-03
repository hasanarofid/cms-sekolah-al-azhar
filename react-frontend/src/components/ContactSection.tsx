'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, Mail, Phone } from 'lucide-react'
import { apiClient } from '../lib/api-client'

const contactSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactSectionProps {
  section: {
    id: string
    title?: string | null
    titleEn?: string | null
    subtitle?: string | null
    subtitleEn?: string | null
    content?: string | null
    contentEn?: string | null
    address?: string | null
    addressEn?: string | null
    email?: string | null
    phone?: string | null
    mapEmbedUrl?: string | null
  }
  locale?: 'id' | 'en'
}

export function ContactSection({ section, locale = 'id' }: ContactSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      await apiClient.post('/contact', data, false) // false = tidak perlu auth
      setSuccess(true)
      reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengirim pesan')
    } finally {
      setIsLoading(false)
    }
  }

  const displaySubtitle = locale === 'en' && section.subtitleEn ? section.subtitleEn : section.subtitle
  const displayContent = locale === 'en' && section.contentEn ? section.contentEn : section.content
  const displayAddress = locale === 'en' && section.addressEn ? section.addressEn : section.address

  // Extract src URL from iframe code if needed
  const getMapSrc = (embedUrl: string | null | undefined): string | null => {
    if (!embedUrl) return null
    
    // If it's already a URL, return it
    if (embedUrl.startsWith('http://') || embedUrl.startsWith('https://')) {
      return embedUrl
    }
    
    // If it's an iframe code, extract the src
    const srcMatch = embedUrl.match(/src=["']([^"']+)["']/)
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1]
    }
    
    // Try to find URL in the string
    const urlMatch = embedUrl.match(/https?:\/\/[^\s<>"']+/)
    if (urlMatch && urlMatch[0]) {
      return urlMatch[0]
    }
    
    return embedUrl
  }

  const mapSrc = getMapSrc(section.mapEmbedUrl)

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Contact Information and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Contact Information */}
          <div className="space-y-6">
            {displayAddress && (
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <MapPin className="text-gray-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {locale === 'en' ? 'Office Address' : 'Alamat Kantor'}
                  </h3>
                  <p className="text-gray-700">{displayAddress}</p>
                </div>
              </div>
            )}

            {section.email && (
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <Mail className="text-gray-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <a 
                    href={`mailto:${section.email}`}
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {section.email}
                  </a>
                </div>
              </div>
            )}

            {section.phone && (
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <Phone className="text-gray-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {locale === 'en' ? 'Call Center' : 'Call Center'}
                  </h3>
                  <a 
                    href={`tel:${section.phone}`}
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {section.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right: Google Map */}
          {mapSrc && (
            <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-gray-200 shadow-lg">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map Location"
              />
            </div>
          )}
        </div>

        {/* Contact Form Section */}
        <div className="max-w-4xl mx-auto mt-12">
          {displaySubtitle && (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
              {displaySubtitle}
            </h2>
          )}

          {/* Content/Description */}
          {displayContent && (
            <div 
              className="prose prose-lg max-w-none mb-8 text-gray-700 text-center"
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />
          )}

          {/* Contact Form */}
          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg">
              <p className="font-semibold">{locale === 'en' ? 'Message sent successfully!' : 'Pesan berhasil dikirim!'}</p>
              <p className="text-sm mt-1">
                {locale === 'en' ? 'We will contact you soon.' : 'Kami akan menghubungi Anda segera.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'en' ? 'Name' : 'Nama'} *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'en' ? 'Phone' : 'Telepon'}
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'en' ? 'Subject' : 'Subjek'}
                </label>
                <input
                  {...register('subject')}
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'en' ? 'Message' : 'Pesan'} *
                </label>
                <textarea
                  {...register('message')}
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading 
                  ? (locale === 'en' ? 'Sending...' : 'Mengirim...') 
                  : (locale === 'en' ? 'SUBMIT' : 'SUBMIT')
                }
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

