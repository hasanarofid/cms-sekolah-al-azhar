import { useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

interface NotFoundProps {
  withoutLayout?: boolean
}

export default function NotFound({ withoutLayout = false }: NotFoundProps) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const locale = (searchParams.get('locale') as 'id' | 'en') || 'id'

  // Set document title
  useEffect(() => {
    document.title = locale === 'en' 
      ? '404 - Page Not Found' 
      : '404 - Halaman Tidak Ditemukan'
  }, [locale])

  const content = (
    <main className={`${withoutLayout ? 'py-12' : 'flex-grow flex items-center justify-center py-12'} px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-4xl w-full text-center">
        {/* 404 Illustration SVG */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-6">
            <svg
              className="w-64 h-64 md:w-80 md:h-80"
              viewBox="0 0 400 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Circle */}
              <circle cx="200" cy="120" r="100" fill="#F0FDF4" opacity="0.6"/>
              
              {/* Main Character - Confused Face */}
              <circle cx="200" cy="100" r="50" fill="#10B981" stroke="#059669" strokeWidth="2"/>
              
              {/* Eyes - Confused look */}
              <circle cx="185" cy="90" r="6" fill="#FFFFFF"/>
              <circle cx="215" cy="90" r="6" fill="#FFFFFF"/>
              <circle cx="185" cy="90" r="3" fill="#065F46"/>
              <circle cx="215" cy="90" r="3" fill="#065F46"/>
              
              {/* Confused Mouth */}
              <path
                d="M 180 115 Q 200 125 220 115"
                stroke="#065F46"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              
              {/* Paper with 404 */}
              <rect x="130" y="160" width="140" height="80" rx="6" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4"/>
              <rect x="140" y="170" width="120" height="60" rx="4" fill="#F0FDF4"/>
              
              {/* Decorative Elements */}
              <circle cx="80" cy="60" r="15" fill="#86EFAC" opacity="0.5"/>
              <circle cx="320" cy="60" r="12" fill="#86EFAC" opacity="0.5"/>
              <circle cx="80" cy="240" r="12" fill="#86EFAC" opacity="0.5"/>
              <circle cx="320" cy="240" r="15" fill="#86EFAC" opacity="0.5"/>
            </svg>
            
            {/* 404 Text Overlay */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full">
              <div className="bg-white border-2 border-primary-600 rounded-lg px-6 py-4 shadow-lg">
                <div className="text-6xl md:text-7xl font-bold text-primary-600 mb-2">404</div>
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  {locale === 'en' ? 'Page Not Found' : 'Halaman Tidak Ditemukan'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 mb-4">
          Oops!
        </h1>
        
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          {locale === 'en' ? 'Halaman yang Anda cari tidak ditemukan' : 'Halaman yang Anda cari tidak ditemukan'}
        </h2>

        {/* Description */}
        <div className="max-w-2xl mx-auto space-y-3 mb-10">
          <p className="text-lg md:text-xl text-gray-600">
            {locale === 'en' 
              ? 'Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.'
              : 'Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.'}
          </p>
          <p className="text-base md:text-lg text-gray-500">
            {locale === 'en'
              ? 'Halaman mungkin telah dihapus, dipindahkan, atau URL yang Anda masukkan salah.'
              : 'Halaman mungkin telah dihapus, dipindahkan, atau URL yang Anda masukkan salah.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="group inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[220px] text-base"
          >
            <Home className="mr-2 h-5 w-5" />
            {locale === 'en' ? 'Kembali ke Beranda' : 'Kembali ke Beranda'}
          </Link>
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1)
              } else {
                navigate('/')
              }
            }}
            className="group inline-flex items-center justify-center bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg min-w-[220px] text-base"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {locale === 'en' ? 'Kembali' : 'Kembali'}
          </button>
        </div>
      </div>
    </main>
  )

  if (withoutLayout) {
    return content
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">

      {content}
    </div>
  )
}

