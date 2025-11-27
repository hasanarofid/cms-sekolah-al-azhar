'use client'

import { useState } from 'react'
import { Plus, X, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { getImageUrl } from '../../lib/utils-image-url'
import { Upload, Loader2 } from 'lucide-react'

interface ExtracurricularItem {
  id: string
  image: string
  title: string
  description: string
}

interface ExtracurricularItemsManagerProps {
  value: ExtracurricularItem[]
  onChange: (items: ExtracurricularItem[]) => void
}

export function ExtracurricularItemsManager({ value, onChange }: ExtracurricularItemsManagerProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [uploading, setUploading] = useState<string | null>(null)

  const addItem = () => {
    const newItem: ExtracurricularItem = {
      id: `extracurricular-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      image: '',
      title: '',
      description: '',
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

  const updateItem = (id: string, field: keyof ExtracurricularItem, fieldValue: string) => {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar')
      return
    }

    setUploading(itemId)
    try {
      const data = await apiClient.upload('/admin/upload', file, 'general')
      const imageUrl = data.url || data.path || ''
      if (imageUrl) {
        updateItem(itemId, 'image', imageUrl)
      }
    } catch (err) {
      alert('Gagal mengupload gambar')
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Extracurricular Items *
        </label>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          <Plus size={18} />
          <span>Tambah Ekstrakurikuler</span>
        </button>
      </div>

      {value.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">Belum ada extracurricular item. Klik "Tambah Ekstrakurikuler" untuk menambahkan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((item, index) => {
            const isExpanded = expandedItems.has(item.id)
            return (
              <div key={item.id} className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <GripVertical className="text-gray-400" size={20} />
                    {item.image && (
                      <img
                        src={getImageUrl(item.image)}
                        alt="Preview"
                        className="h-10 w-10 object-cover rounded"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {item.title || `Ekstrakurikuler ${index + 1}`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                    >
                      <ChevronUp size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === value.length - 1}
                      className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                    >
                      <ChevronDown size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      {isExpanded ? 'Sembunyikan' : 'Edit'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 space-y-4 bg-white">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gambar *
                      </label>
                      {item.image ? (
                        <div className="relative mb-2">
                          <img
                            src={getImageUrl(item.image)}
                            alt="Preview"
                            className="h-48 w-full object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => updateItem(item.id, 'image', '')}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : null}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, item.id)}
                        disabled={uploading === item.id}
                        className="hidden"
                        id={`extracurricular-image-${item.id}`}
                      />
                      <label
                        htmlFor={`extracurricular-image-${item.id}`}
                        className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${
                          uploading === item.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {uploading === item.id ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={18} />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={18} className="mr-2" />
                            Upload Gambar
                          </>
                        )}
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Coding"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Deskripsi ekstrakurikuler..."
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

