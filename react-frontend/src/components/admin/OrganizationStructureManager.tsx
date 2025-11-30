'use client'

import React, { useState } from 'react'
import { Plus, X, ChevronUp, ChevronDown, GripVertical, Upload, Loader2 } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { getImageUrl } from '../../lib/utils-image-url'
import { Select2 } from './Select2'

interface OrganizationItem {
  id: string
  name: string
  position: string
  positionEn?: string
  image?: string
  parentId?: string | null
  level: number // 0 = top level, 1 = second level, etc.
  order: number
}

interface OrganizationStructureManagerProps {
  value: OrganizationItem[]
  onChange: (items: OrganizationItem[]) => void
}

export function OrganizationStructureManager({ value, onChange }: OrganizationStructureManagerProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [uploading, setUploading] = useState<string | null>(null)

  const addItem = (level: number = 0) => {
    const newItem: OrganizationItem = {
      id: `org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      position: '',
      positionEn: '',
      image: '',
      parentId: null,
      level,
      order: value.filter(item => item.level === level).length,
    }
    onChange([...value, newItem])
    setExpandedItems(new Set([...expandedItems, newItem.id]))
  }

  const removeItem = (id: string) => {
    // Also remove all children
    const itemToRemove = value.find(item => item.id === id)
    if (itemToRemove) {
      const children = value.filter(item => item.parentId === id)
      const childrenIds = children.map(c => c.id)
      const allIdsToRemove = [id, ...childrenIds]
      onChange(value.filter(item => !allIdsToRemove.includes(item.id)))
      
      const newExpanded = new Set(expandedItems)
      allIdsToRemove.forEach(id => newExpanded.delete(id))
      setExpandedItems(newExpanded)
    }
  }

  const updateItem = (id: string, field: keyof OrganizationItem, fieldValue: string | number | null) => {
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
    const item = value[index]
    const sameLevelItems = value
      .map((item, idx) => ({ item, idx }))
      .filter(({ item: i }) => i.level === item.level && i.parentId === item.parentId)
      .sort((a, b) => a.item.order - b.item.order)
    
    const sameLevelIndex = sameLevelItems.findIndex(({ idx }) => idx === index)
    if (sameLevelIndex === -1) return
    
    if (direction === 'up' && sameLevelIndex === 0) return
    if (direction === 'down' && sameLevelIndex === sameLevelItems.length - 1) return

    const targetIndex = direction === 'up' ? sameLevelIndex - 1 : sameLevelIndex + 1
    const targetItem = sameLevelItems[targetIndex].item
    
    // Swap orders by updating both items
    const tempOrder = item.order
    const newItems = value.map(i => {
      if (i.id === item.id) {
        return { ...i, order: targetItem.order }
      }
      if (i.id === targetItem.id) {
        return { ...i, order: tempOrder }
      }
      return i
    })
    onChange(newItems)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
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

    setUploading(itemId)
    try {
      const data = await apiClient.upload('/admin/upload', file, 'page-sections')
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

  const setParent = (itemId: string, parentId: string | null) => {
    const item = value.find(i => i.id === itemId)
    if (!item) return
    
    // Prevent circular reference
    if (parentId) {
      let currentParentId: string | null = parentId
      while (currentParentId) {
        if (currentParentId === itemId) {
          alert('Tidak dapat membuat referensi circular')
          return
        }
        const parent = value.find(i => i.id === currentParentId)
        currentParentId = parent?.parentId || null
      }
    }
    
    const parent = parentId ? value.find(i => i.id === parentId) : null
    const newLevel = parent ? parent.level + 1 : 0
    
    updateItem(itemId, 'parentId', parentId)
    updateItem(itemId, 'level', newLevel)
  }

  // Group items by level and parent
  const groupedItems = value.reduce((acc, item) => {
    const key = `${item.level}-${item.parentId || 'root'}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {} as Record<string, OrganizationItem[]>)

  // Sort items within each group
  Object.keys(groupedItems).forEach(key => {
    groupedItems[key].sort((a, b) => a.order - b.order)
  })

  const getItemDisplayName = (item: OrganizationItem) => {
    if (item.name && item.position) {
      return `${item.name} - ${item.position}`
    }
    if (item.name) return item.name
    if (item.position) return item.position
    return 'Item Baru'
  }

  const renderItem = (item: OrganizationItem, index: number) => {
    const isExpanded = expandedItems.has(item.id)
    const children = value.filter(i => i.parentId === item.id)
    const availableParents = value.filter(i => i.id !== item.id && i.level < item.level)

    return (
      <div key={item.id} className="border border-gray-300 rounded-lg bg-white shadow-sm mb-3">
        {/* Header */}
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
              {getItemDisplayName(item)}
            </p>
            <p className="text-xs text-gray-500">Level {item.level}</p>
          </div>
          <div className="flex items-center gap-2">
            {index > 0 && (
              <button
                type="button"
                onClick={() => moveItem(value.indexOf(item), 'up')}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Move up"
              >
                <ChevronUp size={18} />
              </button>
            )}
            {index < value.length - 1 && (
              <button
                type="button"
                onClick={() => moveItem(value.indexOf(item), 'down')}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Move down"
              >
                <ChevronDown size={18} />
              </button>
            )}
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
              className="p-1 text-red-500 hover:text-red-700"
              title="Hapus"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama *
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Apriyanto Nugroho, S.Pd."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan (ID) *
                </label>
                <input
                  type="text"
                  value={item.position}
                  onChange={(e) => updateItem(item.id, 'position', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Principal Of SMAIA 28"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jabatan (EN)
              </label>
              <input
                type="text"
                value={item.positionEn || ''}
                onChange={(e) => updateItem(item.id, 'positionEn', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Principal Of SMAIA 28"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto Profil
              </label>
              {item.image ? (
                <div className="relative mb-2 inline-block">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name || 'Profile'}
                    className="h-24 w-24 object-cover rounded-full border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => updateItem(item.id, 'image', '')}
                    className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : null}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, item.id)}
                disabled={uploading === item.id}
                className="hidden"
                id={`org-image-${item.id}`}
              />
              <label
                htmlFor={`org-image-${item.id}`}
                className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${
                  uploading === item.id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading === item.id ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Mengupload...
                  </>
                ) : (
                  <>
                    <Upload size={18} className="mr-2" />
                    {item.image ? 'Ganti Foto' : 'Upload Foto'}
                  </>
                )}
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Atasan (Parent)
              </label>
              <Select2
                value={item.parentId || ''}
                onChange={(value) => setParent(item.id, value || null)}
                options={[
                  { value: '', label: 'Tidak ada (Top Level)' },
                  ...availableParents.map(parent => ({
                    value: parent.id,
                    label: `${getItemDisplayName(parent)} (Level ${parent.level})`
                  }))
                ]}
                placeholder="Pilih atasan..."
                isSearchable={true}
              />
            </div>

            {children.length > 0 && (
              <div className="mt-4 pl-4 border-l-2 border-gray-300">
                <p className="text-sm font-medium text-gray-700 mb-2">Anak Bawahan:</p>
                <ul className="space-y-1">
                  {children.map(child => (
                    <li key={child.id} className="text-sm text-gray-600">
                      • {getItemDisplayName(child)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Render items in hierarchical order
  const renderHierarchical = (parentId: string | null = null, level: number = 0): React.ReactNode[] => {
    const itemsAtLevel = value
      .filter(item => item.parentId === parentId)
      .sort((a, b) => a.order - b.order)
    
    return itemsAtLevel.flatMap(item => [
      renderItem(item, value.indexOf(item)),
      ...renderHierarchical(item.id, level + 1)
    ])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Struktur Organisasi *
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => addItem(0)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            <Plus size={18} />
            <span>Tambah Level Atas</span>
          </button>
        </div>
      </div>

      {value.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">Belum ada item struktur organisasi. Klik "Tambah Level Atas" untuk menambahkan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {renderHierarchical()}
        </div>
      )}

      {/* Helper: Add child button for each item */}
      {value.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Tips:</strong> Untuk menambahkan anak bawahan, edit item yang ingin dijadikan atasan, lalu pilih item tersebut sebagai "Atasan" untuk item baru.
          </p>
        </div>
      )}
    </div>
  )
}

