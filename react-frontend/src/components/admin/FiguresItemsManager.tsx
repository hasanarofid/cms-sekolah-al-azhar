'use client'

import { useState } from 'react'
import { Plus, X, ChevronDown, ChevronUp, GripVertical, Upload, Loader2 } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { getImageUrl } from '../../lib/utils-image-url'

interface FigureItem {
  id: string
  name: string
  nameEn?: string
  position: string
  positionEn?: string
  image: string
}

interface FiguresItemsManagerProps {
  value: FigureItem[]
  onChange: (items: FigureItem[]) => void
}

export function FiguresItemsManager({ value, onChange }: FiguresItemsManagerProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [uploading, setUploading] = useState<string | null>(null)

  const addFigureItem = () => {
    const newItem: FigureItem = {
      id: `figure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      nameEn: '',
      position: '',
      positionEn: '',
      image: '',
    }
    onChange([...value, newItem])
    setExpandedItems(new Set([...expandedItems, newItem.id]))
  }

  const removeFigureItem = (id: string) => {
    onChange(value.filter(item => item.id !== id))
    const newExpanded = new Set(expandedItems)
    newExpanded.delete(id)
    setExpandedItems(newExpanded)
  }

  const updateFigureItem = (id: string, field: keyof FigureItem, fieldValue: string) => {
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
    
    onChange(newItems)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, figureId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB')
      return
    }

    setUploading(figureId)

    try {
      const data = await apiClient.upload('/admin/upload', file, 'home-sections')
      const imageUrl = data.url || data.path || ''
      if (!imageUrl) {
        throw new Error('Upload gagal: URL tidak ditemukan dalam response')
      }
      updateFigureItem(figureId, 'image', imageUrl)
    } catch (err: any) {
      console.error('Upload error:', err)
      alert(err.message || 'Gagal mengupload gambar')
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Tokoh / Figures *
        </label>
        <button
          type="button"
          onClick={addFigureItem}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <Plus size={18} />
          <span>Tambah Tokoh</span>
        </button>
      </div>

      {value.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">Belum ada tokoh. Klik "Tambah Tokoh" untuk menambahkan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((item, index) => {
            const isExpanded = expandedItems.has(item.id)
            return (
              <div
                key={item.id}
                className="border border-gray-300 rounded-lg bg-white shadow-sm"
              >
                {/* Header - Name Preview */}
                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-t-lg">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    title="Drag to reorder"
                  >
                    <GripVertical size={20} />
                  </button>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {item.name || `Tokoh ${index + 1}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveItem(index, 'up')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Move up"
                      >
                        <ChevronUp size={18} />
                      </button>
                    )}
                    {index < value.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveItem(index, 'down')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Move down"
                      >
                        <ChevronDown size={18} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFigureItem(item.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Hapus Tokoh"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-4 space-y-4">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Foto Tokoh *
                      </label>
                      {item.image ? (
                        <div className="relative mb-4">
                          <img
                            src={getImageUrl(item.image)}
                            alt="Preview"
                            className="h-48 w-full object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => updateFigureItem(item.id, 'image', '')}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, item.id)}
                            disabled={uploading === item.id}
                            className="hidden"
                            id={`figure-image-${item.id}`}
                          />
                          <label
                            htmlFor={`figure-image-${item.id}`}
                            className={`cursor-pointer flex flex-col items-center justify-center ${
                              uploading === item.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {uploading === item.id ? (
                              <>
                                <Loader2 className="animate-spin text-primary-600 mb-2" size={32} />
                                <span className="text-gray-600">Mengupload...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="text-gray-400 mb-2" size={32} />
                                <span className="text-gray-600 mb-1">Klik untuk upload foto</span>
                                <span className="text-sm text-gray-500">PNG, JPG, GIF maksimal 5MB</span>
                              </>
                            )}
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Name ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama (ID) *
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateFigureItem(item.id, 'name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Masukkan nama"
                      />
                    </div>

                    {/* Name EN */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama (EN)
                      </label>
                      <input
                        type="text"
                        value={item.nameEn || ''}
                        onChange={(e) => updateFigureItem(item.id, 'nameEn', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Name (EN)"
                      />
                    </div>

                    {/* Position ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Posisi / Jabatan (ID) *
                      </label>
                      <input
                        type="text"
                        value={item.position}
                        onChange={(e) => updateFigureItem(item.id, 'position', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Masukkan posisi/jabatan"
                      />
                    </div>

                    {/* Position EN */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Posisi / Jabatan (EN)
                      </label>
                      <input
                        type="text"
                        value={item.positionEn || ''}
                        onChange={(e) => updateFigureItem(item.id, 'positionEn', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Position (EN)"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

