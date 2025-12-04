'use client'

import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { getImageUrl } from '../../lib/utils-image-url'

interface PartnershipItem {
  id: string
  name: string
  nameEn?: string
  logo?: string
  location?: string
  locationEn?: string
  category: 'international' | 'health' | 'student-escort'
  order: number
}

interface PartnershipsItemsManagerProps {
  value: PartnershipItem[] | string | null | undefined
  onChange: (value: PartnershipItem[]) => void
}

const categoryLabels: Record<string, { id: string; en: string }> = {
  'international': { id: 'Kerjasama Internasional', en: 'International Cooperation' },
  'health': { id: 'Kerjasama Kesehatan', en: 'Health Cooperation' },
  'student-escort': { id: 'Kerjasama Pengawalan Siswa', en: 'Student Escort Cooperation' },
}

export function PartnershipsItemsManager({ value, onChange }: PartnershipsItemsManagerProps) {
  const [items, setItems] = useState<PartnershipItem[]>([])
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    if (value) {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value)
          setItems(Array.isArray(parsed) ? parsed : [])
        } catch {
          setItems([])
        }
      } else if (Array.isArray(value)) {
        setItems(value)
      } else {
        setItems([])
      }
    } else {
      setItems([])
    }
  }, [value])

  const handleAdd = () => {
    const newItem: PartnershipItem = {
      id: `partnership-${Date.now()}`,
      name: '',
      nameEn: '',
      logo: '',
      location: '',
      locationEn: '',
      category: 'international',
      order: items.length,
    }
    const updated = [...items, newItem]
    setItems(updated)
    onChange(updated)
  }

  const handleRemove = (id: string) => {
    const updated = items.filter(item => item.id !== id)
    setItems(updated)
    onChange(updated)
  }

  const handleChange = (id: string, field: keyof PartnershipItem, newValue: any) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, [field]: newValue } : item
    )
    setItems(updated)
    onChange(updated)
  }

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const index = items.findIndex(item => item.id === id)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= items.length) return

    const updated = [...items]
    const [moved] = updated.splice(index, 1)
    updated.splice(newIndex, 0, moved)
    
    // Update order
    updated.forEach((item, idx) => {
      item.order = idx
    })
    
    setItems(updated)
    onChange(updated)
  }

  const handleLogoUpload = async (id: string, file: File) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB')
      return
    }

    setUploading(id)
    try {
      const data = await apiClient.upload('/admin/upload', file, 'home-sections')
      const imageUrl = data.url || data.path || ''
      if (!imageUrl) {
        throw new Error('Upload gagal: URL tidak ditemukan dalam response')
      }
      handleChange(id, 'logo', imageUrl)
    } catch (err: any) {
      console.error('Upload error:', err)
      alert(err.message || 'Gagal mengupload gambar')
    } finally {
      setUploading(null)
    }
  }

  // Group items by category
  const groupedItems = items.reduce((acc: Record<string, PartnershipItem[]>, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  const categories: Array<'international' | 'health' | 'student-escort'> = ['international', 'health', 'student-escort']

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Partnerships / Kerjasama *
        </label>
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          + Tambah Partnership
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Belum ada partnership. Klik tombol di atas untuk menambahkan.</p>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryItems = groupedItems[category] || []
            if (categoryItems.length === 0) return null

            const categoryLabel = categoryLabels[category]

            return (
              <div key={category} className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  {categoryLabel.id}
                </h4>
                <div className="space-y-4">
                  {categoryItems.map((item, index) => (
                    <div key={item.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start gap-4">
                        {/* Drag Handle */}
                        <div className="flex flex-col gap-1 pt-2">
                          <button
                            type="button"
                            onClick={() => handleMove(item.id, 'up')}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(item.id, 'down')}
                            disabled={index === categoryItems.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ↓
                          </button>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Category */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Kategori
                            </label>
                            <select
                              value={item.category}
                              onChange={(e) => handleChange(item.id, 'category', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                              <option value="international">Kerjasama</option>
                              <option value="health">Kerjasama Kesehatan</option>
                              <option value="student-escort">Kerjasama Pengawalan Siswa</option>
                            </select>
                          </div>

                          {/* Name (ID) */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Nama (ID) *
                            </label>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Nama partnership"
                            />
                          </div>

                          {/* Name (EN) */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Nama (EN)
                            </label>
                            <input
                              type="text"
                              value={item.nameEn || ''}
                              onChange={(e) => handleChange(item.id, 'nameEn', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Partnership name"
                            />
                          </div>

                          {/* Location (ID) */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Lokasi (ID)
                            </label>
                            <input
                              type="text"
                              value={item.location || ''}
                              onChange={(e) => handleChange(item.id, 'location', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Lokasi (contoh: UK, Malaysia)"
                            />
                          </div>

                          {/* Location (EN) */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Lokasi (EN)
                            </label>
                            <input
                              type="text"
                              value={item.locationEn || ''}
                              onChange={(e) => handleChange(item.id, 'locationEn', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Location (e.g., UK, Malaysia)"
                            />
                          </div>

                          {/* Logo Upload */}
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Logo *
                            </label>
                            {item.logo ? (
                              <div className="relative inline-block">
                                <img
                                  src={getImageUrl(item.logo)}
                                  alt={item.name}
                                  className="h-20 w-auto object-contain border border-gray-300 rounded p-2 bg-white"
                                  onError={(e) => {
                                    console.error('Failed to load logo:', item.logo)
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleChange(item.id, 'logo', '')}
                                  className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleLogoUpload(item.id, file)
                                  }}
                                  disabled={uploading === item.id}
                                  className="hidden"
                                  id={`logo-upload-${item.id}`}
                                />
                                <label
                                  htmlFor={`logo-upload-${item.id}`}
                                  className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                  <Upload size={20} className="text-gray-400" />
                                  <span className="text-xs text-gray-600">
                                    {uploading === item.id ? 'Uploading...' : 'Klik untuk upload logo'}
                                  </span>
                                </label>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

