'use client'

import { useState } from 'react'
import { Plus, X, ChevronUp, ChevronDown, GripVertical, Upload, Loader2, FileText, Download } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { getImageUrl } from '../../lib/utils-image-url'

interface DocumentItem {
  id: string
  nama: string // Nama dokumen (contoh: "LRA TAHAP 1")
  fileUrl: string // URL file (PDF, DOC, dll)
  fileName?: string // Nama file asli (opsional)
  order: number
}

interface DocumentItemsManagerProps {
  value: DocumentItem[]
  onChange: (items: DocumentItem[]) => void
}

export function DocumentItemsManager({ value, onChange }: DocumentItemsManagerProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(value.map(item => item.id)))
  const [uploading, setUploading] = useState<{ itemId: string } | null>(null)

  const addItem = () => {
    const newItem: DocumentItem = {
      id: `document-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nama: '',
      fileUrl: '',
      fileName: '',
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

  const updateItem = (id: string, field: keyof DocumentItem, fieldValue: any) => {
    console.log('updateItem called:', { id, field, fieldValue })
    console.log('Current value before update:', value)
    
    const updatedItems = value.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: fieldValue }
        console.log('Item updated:', { from: item, to: updated })
        return updated
      }
      return item
    })
    
    console.log('Updated items array:', updatedItems)
    onChange(updatedItems)
    
    // Verify update
    const verifyItem = updatedItems.find(item => item.id === id)
    console.log('Verification after updateItem:', verifyItem)
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

  const handleFileUpload = async (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input untuk memungkinkan upload file yang sama lagi
    e.target.value = ''

    console.log('=== FILE UPLOAD START ===')
    console.log('Item ID:', itemId)
    console.log('File name:', file.name)
    console.log('File size:', file.size)
    console.log('File type:', file.type)
    console.log('Current value before upload:', value)

    setUploading({ itemId })
    try {
      const data = await apiClient.upload('/admin/upload', file, 'documents', true, false, true)
      console.log('Upload response (full):', JSON.stringify(data, null, 2))
      
      // Coba berbagai kemungkinan field dari response
      const fileUrl = data.url || data.path || data.fileUrl || data.location || ''
      console.log('Extracted fileUrl:', fileUrl)
      console.log('Response keys:', Object.keys(data))
      
      if (!fileUrl || fileUrl.trim() === '') {
        console.error('fileUrl is empty after upload!')
        console.error('Full response data:', data)
        alert('Upload berhasil tapi fileUrl tidak ditemukan dalam response. Silakan hubungi administrator.\n\nResponse: ' + JSON.stringify(data))
        return
      }

      console.log('Updating item with fileUrl:', fileUrl)
      console.log('Updating item with fileName:', file.name)
      
      // Update kedua field sekaligus dalam satu operasi untuk menghindari race condition
      const updatedItems = value.map(item => {
        if (item.id === itemId) {
          const updated = {
            ...item,
            fileUrl: fileUrl,
            fileName: file.name
          }
          console.log('Item before update:', item)
          console.log('Item after update:', updated)
          return updated
        }
        return item
      })
      
      console.log('Updated items array:', updatedItems)
      onChange(updatedItems)
      
      // Verify the update setelah state update
      setTimeout(() => {
        const verifyItem = updatedItems.find(item => item.id === itemId)
        console.log('Verification - Updated item:', verifyItem)
        if (!verifyItem || !verifyItem.fileUrl || verifyItem.fileUrl.trim() === '') {
          console.error('VERIFICATION FAILED: fileUrl masih kosong setelah update!')
        } else {
          console.log('VERIFICATION SUCCESS: fileUrl berhasil diupdate:', verifyItem.fileUrl)
        }
      }, 100)
      
    } catch (err: any) {
      console.error('Upload error:', err)
      alert(err.message || 'Gagal mengupload file')
    } finally {
      setUploading(null)
    }
  }

  const getFileExtension = (fileName?: string) => {
    if (!fileName) return ''
    return fileName.split('.').pop()?.toUpperCase() || ''
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Data Dokumen *
        </label>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Dokumen</span>
        </button>
      </div>

      {value.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p>Belum ada dokumen. Klik "Tambah Dokumen" untuk menambahkan.</p>
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
                    {item.fileUrl ? (
                      <FileText className="text-blue-600" size={20} />
                    ) : (
                      <FileText className="text-gray-400" size={20} />
                    )}
                    <span className="font-medium text-gray-700">
                      {index + 1}. {item.nama || 'Dokumen Baru'}
                      {item.fileUrl && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({getFileExtension(item.fileName)})
                        </span>
                      )}
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
                        Nama Dokumen *
                      </label>
                      <input
                        type="text"
                        value={item.nama}
                        onChange={(e) => updateItem(item.id, 'nama', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Contoh: LRA TAHAP 1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        File Dokumen *
                      </label>
                      {item.fileUrl ? (
                        <div className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <FileText className="text-green-600" size={24} />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.fileName || 'File terupload'}</div>
                            <div className="text-sm text-gray-600">{getFileExtension(item.fileName)} file</div>
                          </div>
                          <a
                            href={getImageUrl(item.fileUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                          >
                            <Download size={16} />
                            <span>Lihat</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              updateItem(item.id, 'fileUrl', '')
                              updateItem(item.id, 'fileName', '')
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                            onChange={(e) => handleFileUpload(item.id, e)}
                            disabled={uploading?.itemId === item.id}
                            className="hidden"
                            id={`document-upload-${item.id}`}
                          />
                          <label
                            htmlFor={`document-upload-${item.id}`}
                            className={`cursor-pointer flex flex-col items-center justify-center ${
                              uploading?.itemId === item.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {uploading?.itemId === item.id ? (
                              <>
                                <Loader2 className="animate-spin text-primary-600 mb-2" size={32} />
                                <span className="text-gray-600">Mengupload...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="text-gray-400 mb-2" size={32} />
                                <span className="text-gray-600 mb-1">Klik untuk upload file</span>
                                <span className="text-sm text-gray-500">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (maksimal 10MB)</span>
                              </>
                            )}
                          </label>
                        </div>
                      )}
                      <input
                        type="hidden"
                        value={item.fileUrl}
                      />
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

