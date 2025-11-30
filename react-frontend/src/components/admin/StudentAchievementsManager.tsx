'use client'

import React, { useState } from 'react'
import { Plus, X, ChevronUp, ChevronDown, GripVertical, Upload, Loader2 } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { getImageUrl } from '../../lib/utils-image-url'
import { Select2 } from './Select2'

interface AchievementStudent {
  id: string
  name: string
  image?: string
  position?: string // e.g., "1st Winner", "2nd Winner"
}

interface AchievementItem {
  id: string
  title: string
  titleEn?: string
  subtitle?: string // e.g., "SMA Islam Al Azhar 28 IIBS"
  description: string
  descriptionEn?: string
  competitionName?: string
  competitionNameEn?: string
  students: AchievementStudent[]
  backgroundType?: 'gradient' | 'gold' | 'blue'
  leftLogo?: string
  rightLogo?: string
  order: number
}

interface StudentAchievementsManagerProps {
  value: AchievementItem[]
  onChange: (items: AchievementItem[]) => void
}

export function StudentAchievementsManager({ value, onChange }: StudentAchievementsManagerProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [uploading, setUploading] = useState<{ itemId: string; studentId?: string; type: 'logo' | 'student' } | null>(null)

  const addItem = () => {
    const newItem: AchievementItem = {
      id: `achievement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: 'Congratulations & Barakallahu Fiikum',
      titleEn: 'Congratulations & Barakallahu Fiikum',
      subtitle: 'SMA Islam Al Azhar 28 IIBS',
      description: '',
      descriptionEn: '',
      competitionName: '',
      competitionNameEn: '',
      students: [],
      backgroundType: 'gradient',
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

  const updateItem = (id: string, field: keyof AchievementItem, fieldValue: any) => {
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

  const addStudent = (itemId: string) => {
    const newStudent: AchievementStudent = {
      id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      image: '',
      position: '',
    }
    const item = value.find(i => i.id === itemId)
    if (item) {
      updateItem(itemId, 'students', [...item.students, newStudent])
    }
  }

  const removeStudent = (itemId: string, studentId: string) => {
    const item = value.find(i => i.id === itemId)
    if (item) {
      updateItem(itemId, 'students', item.students.filter(s => s.id !== studentId))
    }
  }

  const updateStudent = (itemId: string, studentId: string, field: keyof AchievementStudent, fieldValue: string) => {
    const item = value.find(i => i.id === itemId)
    if (item) {
      updateItem(itemId, 'students', item.students.map(s => 
        s.id === studentId ? { ...s, [field]: fieldValue } : s
      ))
    }
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    itemId: string, 
    studentId?: string,
    type: 'logo' | 'student' = 'student'
  ) => {
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

    setUploading({ itemId, studentId, type })
    try {
      const data = await apiClient.upload('/admin/upload', file, 'page-sections')
      const imageUrl = data.url || data.path || ''
      if (imageUrl) {
        if (type === 'logo') {
          if (studentId === 'left') {
            updateItem(itemId, 'leftLogo', imageUrl)
          } else if (studentId === 'right') {
            updateItem(itemId, 'rightLogo', imageUrl)
          }
        } else if (studentId) {
          updateStudent(itemId, studentId, 'image', imageUrl)
        }
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
          Achievement Items *
        </label>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          <Plus size={18} />
          <span>Tambah Achievement</span>
        </button>
      </div>

      {value.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">Belum ada achievement item. Klik "Tambah Achievement" untuk menambahkan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((item, index) => {
            const isExpanded = expandedItems.has(item.id)
            return (
              <div key={item.id} className="border border-gray-300 rounded-lg bg-white shadow-sm">
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
                      {item.title || `Achievement ${index + 1}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.competitionName || 'No competition name'} • {item.students.length} siswa
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
                          Title (ID) *
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Congratulations & Barakallahu Fiikum"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title (EN)
                        </label>
                        <input
                          type="text"
                          value={item.titleEn || ''}
                          onChange={(e) => updateItem(item.id, 'titleEn', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Congratulations & Barakallahu Fiikum"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtitle (ID)
                      </label>
                      <input
                        type="text"
                        value={item.subtitle || ''}
                        onChange={(e) => updateItem(item.id, 'subtitle', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="SMA Islam Al Azhar 28 IIBS"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Competition Name (ID)
                        </label>
                        <input
                          type="text"
                          value={item.competitionName || ''}
                          onChange={(e) => updateItem(item.id, 'competitionName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Arabic National Olympiad 6 2023"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Competition Name (EN)
                        </label>
                        <input
                          type="text"
                          value={item.competitionNameEn || ''}
                          onChange={(e) => updateItem(item.id, 'competitionNameEn', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Arabic National Olympiad 6 2023"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (ID) *
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="In recognition of your effort resulting in..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (EN)
                      </label>
                      <textarea
                        value={item.descriptionEn || ''}
                        onChange={(e) => updateItem(item.id, 'descriptionEn', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="In recognition of your effort resulting in..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Type
                      </label>
                      <Select2
                        value={item.backgroundType || 'gradient'}
                        onChange={(value) => updateItem(item.id, 'backgroundType', value)}
                        options={[
                          { value: 'gradient', label: 'Gradient (Blue-Green)' },
                          { value: 'gold', label: 'Gold' },
                          { value: 'blue', label: 'Blue' },
                        ]}
                        placeholder="Pilih background type..."
                        isSearchable={false}
                      />
                    </div>

                    {/* Logos */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Left Logo
                        </label>
                        {item.leftLogo ? (
                          <div className="relative mb-2 inline-block">
                            <img
                              src={getImageUrl(item.leftLogo)}
                              alt="Left Logo"
                              className="h-16 w-auto object-contain border border-gray-300 rounded"
                            />
                            <button
                              type="button"
                              onClick={() => updateItem(item.id, 'leftLogo', '')}
                              className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : null}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, item.id, 'left', 'logo')}
                          disabled={uploading?.itemId === item.id && uploading?.studentId === 'left'}
                          className="hidden"
                          id={`logo-left-${item.id}`}
                        />
                        <label
                          htmlFor={`logo-left-${item.id}`}
                          className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${
                            uploading?.itemId === item.id && uploading?.studentId === 'left' ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {uploading?.itemId === item.id && uploading?.studentId === 'left' ? (
                            <>
                              <Loader2 className="animate-spin mr-2" size={18} />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload size={18} className="mr-2" />
                              {item.leftLogo ? 'Ganti Logo' : 'Upload Left Logo'}
                            </>
                          )}
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Right Logo
                        </label>
                        {item.rightLogo ? (
                          <div className="relative mb-2 inline-block">
                            <img
                              src={getImageUrl(item.rightLogo)}
                              alt="Right Logo"
                              className="h-16 w-auto object-contain border border-gray-300 rounded"
                            />
                            <button
                              type="button"
                              onClick={() => updateItem(item.id, 'rightLogo', '')}
                              className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : null}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, item.id, 'right', 'logo')}
                          disabled={uploading?.itemId === item.id && uploading?.studentId === 'right'}
                          className="hidden"
                          id={`logo-right-${item.id}`}
                        />
                        <label
                          htmlFor={`logo-right-${item.id}`}
                          className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${
                            uploading?.itemId === item.id && uploading?.studentId === 'right' ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {uploading?.itemId === item.id && uploading?.studentId === 'right' ? (
                            <>
                              <Loader2 className="animate-spin mr-2" size={18} />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload size={18} className="mr-2" />
                              {item.rightLogo ? 'Ganti Logo' : 'Upload Right Logo'}
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Students */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Students *
                        </label>
                        <button
                          type="button"
                          onClick={() => addStudent(item.id)}
                          className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <Plus size={16} />
                          <span>Tambah Siswa</span>
                        </button>
                      </div>

                      {item.students.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <p className="text-gray-500 text-sm">Belum ada siswa. Klik "Tambah Siswa" untuk menambahkan.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {item.students.map((student) => (
                            <div key={student.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                              <div className="grid grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Nama Siswa
                                  </label>
                                  <input
                                    type="text"
                                    value={student.name}
                                    onChange={(e) => updateStudent(item.id, student.id, 'name', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Nama Siswa"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Posisi (opsional)
                                  </label>
                                  <input
                                    type="text"
                                    value={student.position || ''}
                                    onChange={(e) => updateStudent(item.id, student.id, 'position', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="1st Winner, 2nd Winner, etc"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Foto Siswa
                                  </label>
                                  {student.image ? (
                                    <div className="relative mb-1">
                                      <img
                                        src={getImageUrl(student.image)}
                                        alt={student.name || 'Student'}
                                        className="h-12 w-12 object-cover rounded-full border-2 border-gray-300"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => updateStudent(item.id, student.id, 'image', '')}
                                        className="absolute -top-1 -right-1 bg-red-600 text-white p-0.5 rounded-full"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  ) : null}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, item.id, student.id, 'student')}
                                    disabled={uploading?.itemId === item.id && uploading?.studentId === student.id}
                                    className="hidden"
                                    id={`student-image-${student.id}`}
                                  />
                                  <label
                                    htmlFor={`student-image-${student.id}`}
                                    className={`cursor-pointer inline-flex items-center px-2 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 ${
                                      uploading?.itemId === item.id && uploading?.studentId === student.id ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    {uploading?.itemId === item.id && uploading?.studentId === student.id ? (
                                      <Loader2 className="animate-spin" size={14} />
                                    ) : (
                                      <Upload size={14} className="mr-1" />
                                    )}
                                    {student.image ? 'Ganti' : 'Upload'}
                                  </label>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeStudent(item.id, student.id)}
                                className="mt-2 text-xs text-red-600 hover:text-red-700"
                              >
                                Hapus Siswa
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
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

