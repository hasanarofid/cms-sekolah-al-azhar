'use client'

import { useState } from 'react'
import { Plus, X, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'

interface CurriculumItem {
  id: string
  mataPelajaran: string
  jpTM: number // Jam Pelajaran Tatap Muka
  jpProyek: number | null // Jam Pelajaran Proyek (bisa null)
  order: number
}

interface CurriculumItemsManagerProps {
  value: CurriculumItem[]
  onChange: (items: CurriculumItem[]) => void
}

export function CurriculumItemsManager({ value, onChange }: CurriculumItemsManagerProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(value.map(item => item.id)))

  const addItem = () => {
    const newItem: CurriculumItem = {
      id: `curriculum-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      mataPelajaran: '',
      jpTM: 0,
      jpProyek: null,
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

  const updateItem = (id: string, field: keyof CurriculumItem, fieldValue: any) => {
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

  // Calculate totals
  const totalJPTM = value.reduce((sum, item) => sum + (item.jpTM || 0), 0)
  const totalJPProyek = value.reduce((sum, item) => sum + (item.jpProyek || 0), 0)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Data Tabel Kurikulum *
        </label>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Mata Pelajaran</span>
        </button>
      </div>

      {value.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p>Belum ada mata pelajaran. Klik "Tambah Mata Pelajaran" untuk menambahkan.</p>
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
                      {index + 1}. {item.mataPelajaran || 'Mata Pelajaran Baru'}
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
                        Mata Pelajaran *
                      </label>
                      <input
                        type="text"
                        value={item.mataPelajaran}
                        onChange={(e) => updateItem(item.id, 'mataPelajaran', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Contoh: Pend. Agama Islam & Budi Pekerti"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          JP TM (Jam Pelajaran Tatap Muka) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={item.jpTM}
                          onChange={(e) => updateItem(item.id, 'jpTM', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          JP Proyek (Jam Pelajaran Proyek)
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={item.jpProyek ?? ''}
                            onChange={(e) => {
                              const val = e.target.value
                              updateItem(item.id, 'jpProyek', val === '' ? null : parseFloat(val) || 0)
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Kosongkan jika tidak ada"
                          />
                          <button
                            type="button"
                            onClick={() => updateItem(item.id, 'jpProyek', null)}
                            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                            title="Hapus nilai"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {value.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Total JP TM:</span>
              <span className="ml-2 text-lg font-bold text-blue-700">{totalJPTM}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Total JP Proyek:</span>
              <span className="ml-2 text-lg font-bold text-blue-700">{totalJPProyek}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

