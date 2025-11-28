'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

interface WhatsAppButtonProps {
  phoneNumber?: string | null
  defaultMessage?: string | null
}

export function WhatsAppButton({ phoneNumber, defaultMessage }: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setMessage(defaultMessage || 'Assalamualaikum SMA AL AZHAR INSAN CENDEKIA JATIBENING\nMohon info lebih lanjut untuk pendaftaran murid baru\nTerima Kasih')
  }, [defaultMessage])

  if (!phoneNumber) return null

  const handleSend = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <>
      {/* WhatsApp Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
          isOpen ? 'rotate-0' : ''
        }`}
        aria-label="WhatsApp"
      >
        {isOpen ? (
          <X size={28} className="transition-transform" />
        ) : (
          <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* WhatsApp Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-[#25D366] text-white px-4 py-3 flex items-center justify-between">
            <span className="font-semibold text-sm">WhatsApp</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Message Box */}
          <div className="p-4 bg-white">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-3 outline-none resize-none text-sm text-gray-700 focus:ring-2 focus:ring-[#25D366] focus:border-[#25D366]"
              rows={5}
              placeholder="Tulis pesan Anda..."
            />
          </div>

          {/* Send Button */}
          <div className="px-4 pb-4">
            <button
              onClick={handleSend}
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm"
            >
              <Send size={18} />
              <span>Kirim</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

