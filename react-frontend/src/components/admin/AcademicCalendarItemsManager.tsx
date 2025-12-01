'use client'

import { useState } from 'react'
import { Plus, X, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'

interface CalendarItem {
  id: string
  bulan: string // Bulan (contoh: "Juli 2024")
  kegiatan: string // Nama kegiatan
  keterangan?: string // Keterangan tambahan (opsional)
  tanggalMulai?: string // Tanggal mulai (opsional, format: YYYY-MM-DD)
  tanggalSelesai?: string // Tanggal selesai (opsional, format: YYYY-MM-DD)
  order: number
}

interface AcademicCalendarItemsManagerProps {
  value: CalendarItem[]
  onChange: (items: CalendarItem[]) => void
}

export function AcademicCalendarItemsManager({ value, onChange }: AcademicCalendarItemsManagerProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(value.map(item => item.id)))

  const addItem = () => {
    const newItem: CalendarItem = {
      id: `calendar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bulan: '',
      kegiatan: '',
      keterangan: '',
      tanggalMulai: '',
      tanggalSelesai: '',
      order: value.length,
    }
    onChange([...value, newItem])
    setExpandedItems(new Set([...expandedItems, newItem.id]))
  }

  const removeItem = (id: string) => {
    onChange(value.filter(item => item.id !== id))
    const newExpanded = new Set(expandedItems)
    newExpanded.delete(id)
    setExpandedItems(newExpanded)
  }

  const updateItem = (id: string, field: keyof CalendarItem, fieldValue: any) => {
    onChange(value.map(item => 
      item.id === id ? { ...item, [field]: fieldValue } : item
    ))
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === value.length - 1) return

    const newItems = [...value]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]
    
    // Update orders
    newItems.forEach((item, idx) => {
      item.order = idx
    })
    
    onChange(newItems)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Data Kalender Pendidikan *
        </label>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Kegiatan</span>
        </button>
      </div>

      {value.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p>Belum ada kegiatan. Klik "Tambah Kegiatan" untuk menambahkan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {value
            .sort((a, b) => a.order - b.order)
            .map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-300 rounded-lg bg-white"
              >
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300">
                  <div className="flex items-center space-x-3 flex-1">
                    <GripVertical className="text-gray-400 cursor-move" size={20} />
                    <span className="font-medium text-gray-700">
                      {index + 1}. {item.bulan || 'Bulan Baru'} - {item.kegiatan || 'Kegiatan Baru'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Pindah ke atas"
                    >
                      <ChevronUp size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === value.length - 1}
                      className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Pindah ke bawah"
                    >
                      <ChevronDown size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="p-1 text-gray-600 hover:text-gray-900"
                      title={expandedItems.has(item.id) ? 'Tutup' : 'Buka'}
                    >
                      {expandedItems.has(item.id) ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Hapus"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {expandedItems.has(item.id) && (
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bulan/Periode *
                      </label>
                      <input
                        type="text"
                        value={item.bulan}
                        onChange={(e) => updateItem(item.id, 'bulan', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Contoh: Juli 2024"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kegiatan *
                      </label>
                      <input
                        type="text"
                        value={item.kegiatan}
                        onChange={(e) => updateItem(item.id, 'kegiatan', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Contoh: Masa Orientasi Siswa Baru"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Keterangan
                      </label>
                      <textarea
                        value={item.keterangan || ''}
                        onChange={(e) => updateItem(item.id, 'keterangan', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Keterangan tambahan (opsional)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal Mulai
                        </label>
                        <input
                          type="date"
                          value={item.tanggalMulai || ''}
                          onChange={(e) => updateItem(item.id, 'tanggalMulai', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal Selesai
                        </label>
                        <input
                          type="date"
                          value={item.tanggalSelesai || ''}
                          onChange={(e) => updateItem(item.id, 'tanggalSelesai', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

