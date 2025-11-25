import { Facebook, Instagram, Youtube } from 'lucide-react'

interface FooterProps {
  locale?: 'id' | 'en'
  address?: string | null
  phone?: string | null
  email?: string | null
  androidAppUrl?: string | null
  iosAppUrl?: string | null
  facebookUrl?: string | null
  instagramUrl?: string | null
  youtubeUrl?: string | null
}

export function Footer({ 
  locale = 'id',
  address,
  phone,
  email,
  androidAppUrl,
  iosAppUrl,
  facebookUrl,
  instagramUrl,
  youtubeUrl,
}: FooterProps) {
  return (
    <footer className="bg-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: Contact Info */}
          <div>
            <h3 className="text-base font-bold mb-4 leading-tight text-white">
              {locale === 'en' 
                ? 'Qur\'anic Learning Courtesy Oriented World Class Education'
                : 'Qur\'anic Learning Courtesy Oriented World Class Education'}
            </h3>
            <p className="text-sm text-primary-100 mb-4 leading-relaxed">
              {address || 'Jl. Raya Solo - Tawangmangu, Gedangan, Salam, Kec. Karangpandan, Kabupaten Karanganyar, Jawa Tengah 57791'}
            </p>
            <div className="space-y-2 text-sm text-primary-100">
              {phone && (
                <p>
                  <span className="font-semibold text-white">Call Center:</span> {phone}
                </p>
              )}
              {email && (
                <p>
                  <span className="font-semibold text-white">Email:</span> {email}
                </p>
              )}
            </div>
          </div>

          {/* Center: Instagram Embed (placeholder) */}
          <div className="flex items-center justify-center">
            <div className="bg-primary-900 rounded-lg p-4 w-full aspect-square flex items-center justify-center min-h-[300px]">
              <p className="text-primary-200 text-sm text-center">
                {locale === 'en' ? 'Instagram Embed' : 'Embed Instagram'}
              </p>
            </div>
          </div>

          {/* Right: Download App */}
          <div>
            <h4 className="font-semibold mb-4 text-base text-white">
              {locale === 'en' ? 'Download App' : 'Unduh Aplikasi'}
            </h4>
            <div className="space-y-3 mb-6">
              {androidAppUrl ? (
                <a href={androidAppUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="bg-primary-900 hover:bg-primary-700 px-4 py-3 rounded-lg text-sm transition-colors text-center text-white">
                    {locale === 'en' ? 'Android Users' : 'Pengguna Android'}
                  </div>
                </a>
              ) : (
                <div className="bg-primary-900 px-4 py-3 rounded-lg text-sm text-center text-primary-200">
                  {locale === 'en' ? 'Android Users' : 'Pengguna Android'}
                </div>
              )}
              {iosAppUrl ? (
                <a href={iosAppUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="bg-primary-900 hover:bg-primary-700 px-4 py-3 rounded-lg text-sm transition-colors text-center text-white">
                    {locale === 'en' ? 'iOS Users' : 'Pengguna IOS'}
                  </div>
                </a>
              ) : (
                <div className="bg-primary-900 px-4 py-3 rounded-lg text-sm text-center text-primary-200">
                  {locale === 'en' ? 'iOS Users' : 'Pengguna IOS'}
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-primary-200 hover:text-white transition-colors">
                  <Facebook size={20} />
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-primary-200 hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
              )}
              {youtubeUrl && (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-primary-200 hover:text-white transition-colors">
                  <Youtube size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-8 pt-8 text-center text-sm text-primary-200">
          <p>&copy; {new Date().getFullYear()}. Al Azhar IIBS</p>
        </div>
      </div>
    </footer>
  )
}

