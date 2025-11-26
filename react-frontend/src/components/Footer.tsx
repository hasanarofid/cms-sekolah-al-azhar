import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { getImageUrl } from '../lib/utils-image-url'

interface FooterProps {
  locale?: 'id' | 'en'
  logo?: string | null
  websiteName?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  facebookUrl?: string | null
  instagramUrl?: string | null
  youtubeUrl?: string | null
}

export function Footer({ 
  locale = 'id',
  logo,
  websiteName,
  address,
  phone,
  email,
  facebookUrl,
  instagramUrl,
  youtubeUrl,
}: FooterProps) {
  const currentYear = new Date().getFullYear()
  const displayName = websiteName || ''

  return (
    <footer className="bg-gradient-to-b from-primary-800 to-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              {logo ? (
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={getImageUrl(logo)}
                    alt={displayName}
                    className="h-14 md:h-20 w-auto object-contain"
                    onError={(e) => {
                      console.error('Failed to load footer logo:', logo)
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  {websiteName && (
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {websiteName}
                    </h3>
                  )}
                </div>
              ) : websiteName ? (
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                  {websiteName}
                </h3>
              ) : null}
            </div>
            <p className="text-primary-100 text-sm leading-relaxed mb-6">
              {locale === 'en' 
                ? 'Qur\'anic Learning, Courtesy Oriented and World Class Education'
                : 'Menjadi Sekolah Menengah Atas yang unggul dalam membina generasi Qur\'ani, berprestasi, dan berwawasan global, dengan mengintegrasikan nilai-nilai Islam dan Al-Qur\'an dalam pengembangan ilmu pengetahuan, sains, dan teknologi'}
            </p>
            
            {/* Social Media Links */}
            {(facebookUrl || instagramUrl || youtubeUrl) && (
              <div className="flex space-x-4">
                {facebookUrl && (
                  <a 
                    href={facebookUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-primary-700 hover:bg-primary-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} className="text-white" />
                  </a>
                )}
                {instagramUrl && (
                  <a 
                    href={instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-primary-700 hover:bg-primary-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} className="text-white" />
                  </a>
                )}
                {youtubeUrl && (
                  <a 
                    href={youtubeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-primary-700 hover:bg-primary-600 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                    aria-label="YouTube"
                  >
                    <Youtube size={20} className="text-white" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold mb-6 text-white">
              {locale === 'en' ? 'Contact Information' : 'Informasi Kontak'}
            </h4>
            <div className="space-y-4">
              {address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="mt-1 text-primary-300 flex-shrink-0" size={20} />
                  <p className="text-primary-100 text-sm leading-relaxed">
                    {address}
                  </p>
                </div>
              )}
              {phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="text-primary-300 flex-shrink-0" size={20} />
                  <a 
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="text-primary-100 hover:text-white transition-colors text-sm"
                  >
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div className="flex items-center space-x-3">
                  <Mail className="text-primary-300 flex-shrink-0" size={20} />
                  <a 
                    href={`mailto:${email}`}
                    className="text-primary-100 hover:text-white transition-colors text-sm"
                  >
                    {email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">
              {locale === 'en' ? 'Quick Links' : 'Tautan Cepat'}
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-primary-100 hover:text-white transition-colors text-sm">
                  {locale === 'en' ? 'Home' : 'Beranda'}
                </a>
              </li>
              <li>
                <a href="/selayang-pandang" className="text-primary-100 hover:text-white transition-colors text-sm">
                  {locale === 'en' ? 'About Us' : 'Selayang Pandang'}
                </a>
              </li>
              <li>
                <a href="/visi-misi" className="text-primary-100 hover:text-white transition-colors text-sm">
                  {locale === 'en' ? 'Vision & Mission' : 'Visi & Misi'}
                </a>
              </li>
              <li>
                <a href="/kontak" className="text-primary-100 hover:text-white transition-colors text-sm">
                  {locale === 'en' ? 'Contact' : 'Kontak'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-primary-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-200 text-sm text-center md:text-left">
              &copy; {currentYear} {displayName && `${displayName}. `}{locale === 'en' ? 'All rights reserved.' : 'Hak cipta dilindungi.'}
            </p>
            <p className="text-primary-200 text-sm text-center md:text-right">
              {locale === 'en' 
                ? 'Qur\'anic Learning, Courtesy Oriented and World Class Education'
                : 'Menjadi Sekolah Menengah Atas yang unggul dalam membina generasi Qur\'ani, berprestasi, dan berwawasan global, dengan mengintegrasikan nilai-nilai Islam dan Al-Qur\'an dalam pengembangan ilmu pengetahuan, sains, dan teknologi'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

