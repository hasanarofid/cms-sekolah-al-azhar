'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, X, Upload, Loader2, Scissors } from 'lucide-react'
import { apiClient } from '../../lib/api-client'
import { getImageUrl } from '../../lib/utils-image-url'
import { Select2 } from './Select2'
import { trimVideo, shouldTrimVideo, formatFileSize } from '../../lib/video-trimmer'

interface PageBlock {
  id: string
  type: string
  data: string
  order: number
  isActive: boolean
}

interface PageBlocksManagerProps {
  pageId: string
  initialBlocks?: PageBlock[]
}

const BLOCK_TYPES = [
  { value: 'hero-slider', label: 'Hero Slider' },
  { value: 'home-section', label: 'Home Section' },
  { value: 'faq-section', label: 'FAQ Section' },
  { value: 'figures-section', label: 'Figures Section' },
  { value: 'partnership-section', label: 'Partnership Section' },
  { value: 'split-screen', label: 'Split Screen' },
  { value: 'gallery-carousel', label: 'Gallery Carousel' },
  { value: 'video-section', label: 'Video Section' },
  { value: 'text', label: 'Text' },
  { value: 'image', label: 'Image' },
  { value: 'two-column', label: 'Two Column' },
  { value: 'accordion', label: 'Accordion' },
  { value: 'cards', label: 'Cards' },
]

export function PageBlocksManager({ pageId, initialBlocks = [] }: PageBlocksManagerProps) {
  const [blocks, setBlocks] = useState<PageBlock[]>(initialBlocks)
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBlockType, setNewBlockType] = useState('text')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBlocks()
  }, [pageId])

  const fetchBlocks = async () => {
    try {
      console.log('Fetching blocks for pageId:', pageId)
      const data = await apiClient.get(`/admin/pages/${pageId}/blocks`)
      const blocksArray = Array.isArray(data) ? data : []
      
      // Validate each block has an ID and is not the same as pageId
      const validBlocks = blocksArray.filter(block => {
        if (!block.id) {
          console.error('Block without ID found:', block)
          return false
        }
        if (block.id === pageId) {
          console.error('Block ID sama dengan Page ID (invalid):', block.id)
          return false
        }
        return true
      })
      
      console.log('Fetched blocks:', { 
        pageId,
        total: blocksArray.length, 
        valid: validBlocks.length,
        blockIds: validBlocks.map(b => b.id),
        invalidBlocks: blocksArray.filter(b => !b.id || b.id === pageId).map(b => ({ id: b.id, type: b.type }))
      })
      
      setBlocks(validBlocks)
    } catch (error) {
      console.error('Error fetching blocks:', error)
      setBlocks([])
    }
  }

  const handleAddBlock = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (!newBlockType) {
      setError('Pilih tipe block terlebih dahulu')
      return
    }

    if (!pageId) {
      setError('Page ID tidak ditemukan')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      let defaultData: any = {}
      
      switch (newBlockType) {
        case 'hero-slider':
          defaultData = { sliders: [] }
          break
        case 'home-section':
          defaultData = { sections: [] }
          break
        case 'faq-section':
          defaultData = { faqs: [] }
          break
        case 'figures-section':
          defaultData = { figures: [] }
          break
        case 'partnership-section':
          defaultData = { partnerships: [] }
          break
        case 'split-screen':
          defaultData = { sections: [] }
          break
        case 'gallery-carousel':
          defaultData = { title: '', subtitle: '', items: [] }
          break
        case 'video-section':
          defaultData = { title: '', videos: [] }
          break
        case 'text':
          defaultData = { content: '' }
          break
        case 'image':
          defaultData = { image: '', alt: '' }
          break
        case 'two-column':
          defaultData = { leftContent: '', rightContent: '' }
          break
        case 'accordion':
          defaultData = { items: [] }
          break
        case 'cards':
          defaultData = { cards: [], columns: 3 }
          break
      }

      console.log('Adding block:', { pageId, type: newBlockType, data: defaultData })
      
      // Try /blocks/create first, fallback to /blocks if needed
      let response
      try {
        response = await apiClient.post(`/admin/pages/${pageId}/blocks/create`, {
          type: newBlockType,
          data: defaultData,
        })
      } catch (createError) {
        // Fallback: try POST to /blocks directly
        console.log('Trying fallback endpoint...', createError)
        try {
          response = await apiClient.post(`/admin/pages/${pageId}/blocks`, {
            type: newBlockType,
            data: defaultData,
          })
        } catch (fallbackError) {
          console.error('Both create endpoints failed:', { createError, fallbackError })
          throw createError // Throw original error
        }
      }

      console.log('Block added successfully:', response)
      
      // Ensure we have the block ID from response
      if (response && response.id) {
        console.log('New block ID:', response.id, 'Length:', response.id.length)
        // Validate ID is complete and not the same as pageId
        if (response.id.length < 20) {
          console.warn('Warning: Block ID seems too short:', response.id)
        }
        if (response.id === pageId) {
          console.error('ERROR: Created block ID sama dengan Page ID!', { blockId: response.id, pageId })
          setError('Error: Block ID yang dibuat sama dengan Page ID. Silakan refresh halaman.')
          return
        }
      } else {
        console.error('Block created but no ID in response:', response)
        setError('Error: Block dibuat tapi tidak ada ID dalam response. Silakan refresh halaman.')
        return
      }

      // Refresh blocks to get the latest data
      await fetchBlocks()
      setShowAddForm(false)
      setNewBlockType('text')
      setError('')
    } catch (error) {
      console.error('Error adding block:', error)
      const errorMessage = error instanceof Error ? error.message : 'Gagal menambahkan block. Silakan coba lagi.'
      setError(errorMessage)
      alert(`Error: ${errorMessage}`) // Temporary alert untuk debugging
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBlock = async (blockId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (!confirm('Apakah Anda yakin ingin menghapus block ini?')) return

    if (!blockId) {
      alert('Block ID tidak ditemukan')
      return
    }

    if (!pageId) {
      alert('Page ID tidak ditemukan')
      return
    }

    try {
      console.log('Deleting block:', { pageId, blockId })
      
      // Try delete with pageId and blockId
      let deleted = false
      try {
        await apiClient.delete(`/admin/pages/${pageId}/blocks/${blockId}`)
        deleted = true
        console.log('Block deleted successfully via /pages/{pageId}/blocks/{blockId}')
      } catch (deleteError) {
        console.log('First delete attempt failed, trying fallback...', deleteError)
        // Fallback: try alternative endpoint
        try {
          await apiClient.delete(`/admin/page-blocks/${blockId}`)
          deleted = true
          console.log('Block deleted successfully via /page-blocks/{blockId}')
        } catch (fallbackError) {
          console.error('Fallback delete also failed:', fallbackError)
          throw fallbackError
        }
      }
      
      if (deleted) {
        // Refresh blocks list
        await fetchBlocks()
      }
    } catch (error) {
      console.error('Error deleting block:', error)
      const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus block. Silakan coba lagi.'
      alert(`Error: ${errorMessage}`)
    }
  }

  const handleMoveBlock = async (blockId: string, direction: 'up' | 'down') => {
    const blockIndex = blocks.findIndex(b => b.id === blockId)
    if (blockIndex === -1) return

    const newIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const updatedBlocks = [...blocks]
    const tempOrder = updatedBlocks[blockIndex].order
    updatedBlocks[blockIndex].order = updatedBlocks[newIndex].order
    updatedBlocks[newIndex].order = tempOrder

    setBlocks(updatedBlocks)

    try {
      await apiClient.put(`/admin/pages/${pageId}/blocks/${blockId}`, { order: updatedBlocks[blockIndex].order })
      await apiClient.put(`/admin/pages/${pageId}/blocks/${updatedBlocks[newIndex].id}`, { order: updatedBlocks[newIndex].order })
      await fetchBlocks()
    } catch (error) {
      console.error('Error moving block:', error)
      await fetchBlocks()
    }
  }

  const handleToggleActive = async (blockId: string, isActive: boolean) => {
    try {
      await apiClient.put(`/admin/pages/${pageId}/blocks/${blockId}`, { isActive: !isActive })
      await fetchBlocks()
    } catch (error) {
      console.error('Error toggling block:', error)
    }
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Page Blocks</h3>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Tambah Block</span>
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Select2
                value={newBlockType}
                onChange={(value) => setNewBlockType(value)}
                options={BLOCK_TYPES.map((type) => ({
                  value: type.value,
                  label: type.label
                }))}
                placeholder="Pilih tipe block..."
                isSearchable={true}
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleAddBlock(e)
              }}
              disabled={isLoading || !newBlockType}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Menambah...' : 'Tambah'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Block akan dibuat dengan data default. Anda dapat mengeditnya setelah dibuat.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {blocks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada blocks. Tambahkan block untuk mulai membangun halaman.</p>
        ) : (
          blocks
            .sort((a, b) => a.order - b.order)
            .map((block, index) => {
              const blockTypeLabel = BLOCK_TYPES.find(t => t.value === block.type)?.label || block.type
              let blockData: any = {}
              try {
                blockData = JSON.parse(block.data || '{}')
              } catch (e) {
                console.error('Error parsing block data:', e)
              }

              // Ensure block has valid ID
              if (!block.id) {
                console.error('Block without ID found:', block)
                return null
              }

              return (
                <div
                  key={block.id}
                  className={`border rounded-lg p-4 ${
                    block.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{blockTypeLabel}</span>
                          <span className="text-xs text-gray-500">(Order: {block.order})</span>
                          {!block.isActive && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Inactive</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {block.type === 'hero-slider' && `${blockData.sliders?.length || 0} slider(s)`}
                          {block.type === 'home-section' && `${blockData.sections?.length || 0} section(s)`}
                          {block.type === 'faq-section' && `${blockData.faqs?.length || 0} FAQ(s)`}
                          {block.type === 'text' && `${(blockData.content || '').substring(0, 50)}...`}
                          {block.type === 'image' && blockData.image ? 'Image: ' + blockData.image.substring(0, 30) + '...' : 'No image'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(block.id, 'up')}
                        disabled={index === 0}
                        className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(block.id, 'down')}
                        disabled={index === blocks.length - 1}
                        className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ChevronDown size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(block.id, block.isActive)}
                        className={`p-2 ${
                          block.isActive ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={block.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {block.isActive ? '✓' : '○'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          console.log('Editing block:', { id: block.id, type: block.type, pageId })
                          if (!block.id) {
                            alert('Block ID tidak valid. Silakan refresh halaman.')
                            return
                          }
                          // Validate block.id is not the same as pageId
                          if (block.id === pageId) {
                            console.error('ERROR: Block ID sama dengan Page ID!', { blockId: block.id, pageId })
                            alert('Error: Block ID tidak valid (sama dengan Page ID). Silakan refresh halaman dan coba lagi.')
                            // Try to refresh blocks
                            fetchBlocks()
                            return
                          }
                          setEditingBlock(block)
                        }}
                        className="p-2 text-blue-600 hover:text-blue-700"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDeleteBlock(block.id, e)
                        }}
                        className="p-2 text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
        )}
      </div>

      {editingBlock && (
        <BlockEditor
          pageId={pageId}
          block={editingBlock}
          onClose={() => setEditingBlock(null)}
          onSave={async () => {
            await fetchBlocks()
            setEditingBlock(null)
          }}
        />
      )}
    </div>
  )
}

// Block Editor Component with specific forms for each block type
function BlockEditor({ pageId, block, onClose, onSave }: {
  pageId: string
  block: PageBlock
  onClose: () => void
  onSave: () => void
}) {
  // Validate block ID on mount
  useEffect(() => {
    if (!block.id) {
      console.error('BlockEditor: Block ID is missing!', block)
      alert('Block ID tidak valid. Silakan tutup dan coba lagi.')
      onClose()
    } else {
      console.log('BlockEditor initialized:', { pageId, blockId: block.id, blockType: block.type })
    }
  }, [block.id, block.type, pageId, onClose])

  // Validate block ID on mount
  useEffect(() => {
    if (!block || !block.id) {
      console.error('BlockEditor: Block or Block ID is missing!', block)
      alert('Block ID tidak valid. Silakan tutup dan coba lagi.')
      onClose()
      return
    }
    console.log('BlockEditor initialized:', { 
      pageId, 
      blockId: block.id, 
      blockType: block.type,
      blockIdLength: block.id.length 
    })
  }, [block, pageId, onClose])

  const [blockData, setBlockData] = useState(() => {
    try {
      // If data is already parsed (from backend), use it directly
      if (typeof block.data === 'object') {
        return block.data
      }
      return JSON.parse(block.data || '{}')
    } catch {
      return {}
    }
  })
  const [isSaving, setIsSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [autoTrimVideo, setAutoTrimVideo] = useState(false) // Disable auto-trim by default (lebih stabil)
  const [trimProgress, setTrimProgress] = useState<number>(0)
  const [isTrimming, setIsTrimming] = useState(false)

  const handleSave = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!block.id) {
      setSaveError('Block ID tidak ditemukan')
      alert('Error: Block ID tidak ditemukan')
      return
    }

    if (!pageId) {
      setSaveError('Page ID tidak ditemukan')
      alert('Error: Page ID tidak ditemukan')
      return
    }

    setIsSaving(true)
    setSaveError('')
    
    try {
      console.log('Saving block:', { 
        pageId, 
        blockId: block.id, 
        blockType: block.type,
        blockOrder: block.order,
        blockIsActive: block.isActive,
        dataSize: JSON.stringify(blockData).length,
        dataPreview: JSON.stringify(blockData).substring(0, 100)
      })
      
      // Log the full URL we're trying to access
      const updateUrl = `/admin/pages/${pageId}/blocks/${block.id}`
      console.log('Update URL:', updateUrl)
      console.log('Page ID:', pageId, 'Length:', pageId.length)
      console.log('Block ID:', block.id, 'Length:', block.id.length)
      console.log('Block ID characters:', block.id.split('').join(' '))
      
      // Validate block ID is not the same as page ID (common mistake)
      if (block.id === pageId) {
        const errorMsg = 'Error: Block ID sama dengan Page ID. Ini tidak valid. Silakan refresh halaman dan coba lagi.'
        setSaveError(errorMsg)
        alert(errorMsg)
        return
      }
      
      // Convert blockData back to JSON string for backend
      const response = await apiClient.put(`/admin/pages/${pageId}/blocks/${block.id}`, {
        type: block.type, // Include type to ensure it's preserved
        data: blockData,
        isActive: block.isActive !== false, // Preserve active state
        order: block.order, // Preserve order
      })
      
      console.log('Block saved successfully:', response)
      
      // Call onSave callback to refresh blocks and close modal
      onSave()
    } catch (error) {
      console.error('Error saving block:', error)
      const errorMessage = error instanceof Error ? error.message : 'Gagal menyimpan block. Silakan coba lagi.'
      setSaveError(errorMessage)
      alert(`Error: ${errorMessage}`) // Temporary alert untuk debugging
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sliderIndex?: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const data = await apiClient.upload('/admin/upload', file, 'general')
      const imageUrl = data.url || data.path || ''
      if (!imageUrl) {
        throw new Error('Upload gagal: URL tidak ditemukan dalam response')
      }
      
      if (block.type === 'hero-slider' && sliderIndex !== undefined) {
        const sliders = [...(blockData.sliders || [])]
        if (sliders[sliderIndex]) {
          sliders[sliderIndex] = {
            ...sliders[sliderIndex],
            image: imageUrl
          }
          setBlockData({ ...blockData, sliders })
        }
      } else if (block.type === 'gallery-carousel') {
        const currentItems = blockData.items || (blockData.images || []).map((img: string, idx: number) => ({
          image: img,
          label: blockData.labels?.[idx] || `Item ${idx + 1}`
        }))
        setBlockData({
          ...blockData,
          items: [...currentItems, { image: imageUrl, label: '' }]
        })
      } else if (block.type === 'image') {
        setBlockData({ ...blockData, image: imageUrl })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, sliderIndex?: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('File harus berupa video (mp4, webm, ogg, mov)')
      return
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('Ukuran file maksimal 50MB')
      return
    }

    setUploading(true)
    let processedFile = file
    let useClientSideTrim = autoTrimVideo
    let useServerSideTrim = false

    try {
      // Check if video needs trimming (client-side)
      if (autoTrimVideo) {
        const needsTrim = await shouldTrimVideo(file, 5)
        
        if (needsTrim) {
          try {
            setIsTrimming(true)
            setTrimProgress(0)
            
            // Show info message
            const originalSize = formatFileSize(file.size)
            console.log(`🎬 Video lebih dari 5 detik. Memotong video di browser... (Ukuran asli: ${originalSize})`)
            
            // Trim video to 5 seconds (client-side)
            const trimmedBlob = await trimVideo(file, 5, (progress) => {
              setTrimProgress(progress)
            })
            
            // Create new File from Blob
            processedFile = new File(
              [trimmedBlob],
              file.name.replace(/\.[^/.]+$/, '') + '-trimmed.mp4',
              { type: 'video/mp4' }
            )
            
            const newSize = formatFileSize(processedFile.size)
            console.log(`✅ Video berhasil dipotong menjadi 5 detik (Ukuran baru: ${newSize})`)
            
            setIsTrimming(false)
            setTrimProgress(0)
            useServerSideTrim = false // Already trimmed in browser
          } catch (trimError: any) {
            console.warn('⚠️ Client-side trimming gagal:', trimError.message)
            console.log('🔄 Fallback: Upload ke server untuk di-trim...')
            
            // Fallback to server-side trimming
            setIsTrimming(false)
            processedFile = file // Use original file
            useServerSideTrim = true // Let server trim it
          }
        }
      }

      // Upload the file (processed or original)
      const data = await apiClient.upload(
        '/admin/upload', 
        processedFile, 
        'sliders', 
        true, // includeAuth
        true, // isVideo
        false, // isDocument
        useServerSideTrim, // trimVideo (server-side)
        5 // trimDuration
      )
      
      const videoUrl = data.url || data.path || ''
      if (!videoUrl) {
        throw new Error('Upload gagal: URL tidak ditemukan dalam response')
      }
      
      // Show success message
      if (useServerSideTrim) {
        console.log('✅ Video berhasil diupload dan dipotong di server')
      } else if (useClientSideTrim && processedFile !== file) {
        console.log('✅ Video berhasil diupload (sudah dipotong di browser)')
      } else {
        console.log('✅ Video berhasil diupload')
      }
      
      if (block.type === 'hero-slider' && sliderIndex !== undefined) {
        const sliders = [...(blockData.sliders || [])]
        if (sliders[sliderIndex]) {
          sliders[sliderIndex] = {
            ...sliders[sliderIndex],
            videoFile: videoUrl
          }
          setBlockData({ ...blockData, sliders })
        }
      }
    } catch (error: any) {
      console.error('❌ Error uploading video:', error)
      alert(error.message || 'Gagal mengupload video')
      setIsTrimming(false)
    } finally {
      setUploading(false)
      setTrimProgress(0)
    }
  }

  // Render specific form based on block type
  const renderForm = () => {
    switch (block.type) {
      case 'hero-slider':
        const sliders = blockData.sliders || []
        
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Hero Sliders
              </label>
              <button
                type="button"
                onClick={() => {
                  const newSlider = {
                    id: `slider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    title: '',
                    titleEn: '',
                    subtitle: '',
                    subtitleEn: '',
                    image: '',
                    videoUrl: '',
                    buttonText: '',
                    buttonTextEn: '',
                    buttonUrl: '',
                    isActive: true
                  }
                  setBlockData({
                    ...blockData,
                    sliders: [...sliders, newSlider]
                  })
                }}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Tambah Slider</span>
              </button>
            </div>

            {sliders.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <p>Belum ada slider. Klik "Tambah Slider" untuk menambahkan.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sliders.map((slider: any, index: number) => (
                  <div key={slider.id || index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-800">Slider {index + 1}</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newSliders = [...sliders]
                            newSliders[index] = {
                              ...newSliders[index],
                              isActive: !newSliders[index].isActive
                            }
                            setBlockData({ ...blockData, sliders: newSliders })
                          }}
                          className={`px-3 py-1 rounded text-sm ${
                            slider.isActive !== false
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {slider.isActive !== false ? 'Aktif' : 'Nonaktif'}
                        </button>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newSliders = [...sliders]
                              const temp = newSliders[index]
                              newSliders[index] = newSliders[index - 1]
                              newSliders[index - 1] = temp
                              setBlockData({ ...blockData, sliders: newSliders })
                            }}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
                            title="Move up"
                          >
                            <ChevronUp size={16} />
                          </button>
                        )}
                        {index < sliders.length - 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newSliders = [...sliders]
                              const temp = newSliders[index]
                              newSliders[index] = newSliders[index + 1]
                              newSliders[index + 1] = temp
                              setBlockData({ ...blockData, sliders: newSliders })
                            }}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
                            title="Move down"
                          >
                            <ChevronDown size={16} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const newSliders = sliders.filter((_: any, i: number) => i !== index)
                            setBlockData({ ...blockData, sliders: newSliders })
                          }}
                          className="p-2 bg-red-100 hover:bg-red-200 rounded text-red-700"
                          title="Delete"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Image Upload */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Background Image *
                        </label>
                        {slider.image ? (
                          <div className="relative mb-4">
                            <img
                              src={getImageUrl(slider.image)}
                              alt={`Slider ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newSliders = [...sliders]
                                newSliders[index] = { ...newSliders[index], image: '' }
                                setBlockData({ ...blockData, sliders: newSliders })
                              }}
                              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, index)}
                              disabled={uploading}
                              className="hidden"
                              id={`slider-image-${index}`}
                            />
                            <label
                              htmlFor={`slider-image-${index}`}
                              className={`cursor-pointer flex flex-col items-center justify-center ${
                                uploading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {uploading ? (
                                <>
                                  <Loader2 className="animate-spin text-green-500 mb-2" size={32} />
                                  <span className="text-gray-600">Mengupload...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="text-gray-400 mb-2" size={32} />
                                  <span className="text-gray-600 mb-1">Klik untuk upload gambar</span>
                                  <span className="text-sm text-gray-500">PNG, JPG, GIF maksimal 5MB</span>
                                </>
                              )}
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Title (ID) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title (ID) *
                        </label>
                        <input
                          type="text"
                          value={slider.title || ''}
                          onChange={(e) => {
                            const newSliders = [...sliders]
                            newSliders[index] = { ...newSliders[index], title: e.target.value }
                            setBlockData({ ...blockData, sliders: newSliders })
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Al Azhar International Islamic Boarding School"
                        />
                      </div>

                      {/* Title (EN) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title (EN)
                        </label>
                        <input
                          type="text"
                          value={slider.titleEn || ''}
                          onChange={(e) => {
                            const newSliders = [...sliders]
                            newSliders[index] = { ...newSliders[index], titleEn: e.target.value }
                            setBlockData({ ...blockData, sliders: newSliders })
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Al Azhar International Islamic Boarding School"
                        />
                      </div>

                      {/* Subtitle (ID) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subtitle (ID)
                        </label>
                        <textarea
                          value={slider.subtitle || ''}
                          onChange={(e) => {
                            const newSliders = [...sliders]
                            newSliders[index] = { ...newSliders[index], subtitle: e.target.value }
                            setBlockData({ ...blockData, sliders: newSliders })
                          }}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Qur'anic Learning, Courtesy Oriented and World Class Education"
                        />
                      </div>

                      {/* Subtitle (EN) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subtitle (EN)
                        </label>
                        <textarea
                          value={slider.subtitleEn || ''}
                          onChange={(e) => {
                            const newSliders = [...sliders]
                            newSliders[index] = { ...newSliders[index], subtitleEn: e.target.value }
                            setBlockData({ ...blockData, sliders: newSliders })
                          }}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Qur'anic Learning, Courtesy Oriented and World Class Education"
                        />
                      </div>

                      {/* Button Text (ID) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Text (ID)
                        </label>
                        <input
                          type="text"
                          value={slider.buttonText || ''}
                          onChange={(e) => {
                            const newSliders = [...sliders]
                            newSliders[index] = { ...newSliders[index], buttonText: e.target.value }
                            setBlockData({ ...blockData, sliders: newSliders })
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Pendaftaran Murid Baru"
                        />
                      </div>

                      {/* Button Text (EN) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Text (EN)
                        </label>
                        <input
                          type="text"
                          value={slider.buttonTextEn || ''}
                          onChange={(e) => {
                            const newSliders = [...sliders]
                            newSliders[index] = { ...newSliders[index], buttonTextEn: e.target.value }
                            setBlockData({ ...blockData, sliders: newSliders })
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="New Student Registration"
                        />
                      </div>

                      {/* Button URL */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button URL
                        </label>
                        <input
                          type="text"
                          value={slider.buttonUrl || ''}
                          onChange={(e) => {
                            const newSliders = [...sliders]
                            newSliders[index] = { ...newSliders[index], buttonUrl: e.target.value }
                            setBlockData({ ...blockData, sliders: newSliders })
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="/pendaftaran atau https://example.com"
                        />
                      </div>

                      {/* Video YouTube URL */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Video YouTube URL (opsional)
                        </label>
                        <input
                          type="text"
                          value={slider.videoUrl || ''}
                          onChange={(e) => {
                            const newSliders = [...sliders]
                            newSliders[index] = { ...newSliders[index], videoUrl: e.target.value }
                            setBlockData({ ...blockData, sliders: newSliders })
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="https://www.youtube.com/watch?v=xxxx"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Jika diisi, slider menampilkan tombol play yang membuka video.
                        </p>
                      </div>

                      {/* Video File Upload untuk Autoplay Background */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Video File untuk Autoplay Background (opsional)
                        </label>
                        
                        {/* Auto-trim toggle */}
                        <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`auto-trim-${index}`}
                              checked={autoTrimVideo}
                              onChange={(e) => setAutoTrimVideo(e.target.checked)}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`auto-trim-${index}`} className="flex items-center text-sm text-gray-700 cursor-pointer">
                              <Scissors className="w-4 h-4 mr-1 text-blue-600" />
                              <span className="font-medium">Auto-trim video menjadi 5 detik (Eksperimental)</span>
                            </label>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 ml-6">
                            ⚠️ Fitur ini butuh koneksi internet stabil. Jika gagal, upload video pendek (≤5 detik) atau disable fitur ini.
                          </p>
                        </div>
                        
                        {slider.videoFile ? (
                          <div className="relative mb-4">
                            <video
                              src={getImageUrl(slider.videoFile)}
                              controls
                              className="w-full h-48 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newSliders = [...sliders]
                                newSliders[index] = { ...newSliders[index], videoFile: '' }
                                setBlockData({ ...blockData, sliders: newSliders })
                              }}
                              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleVideoUpload(e, index)}
                              disabled={uploading || isTrimming}
                              className="hidden"
                              id={`slider-video-${index}`}
                            />
                            <label
                              htmlFor={`slider-video-${index}`}
                              className="cursor-pointer flex flex-col items-center"
                            >
                              {isTrimming ? (
                                <>
                                  <Scissors className="w-8 h-8 text-blue-600 animate-pulse mb-2" />
                                  <span className="text-sm text-gray-600 mb-2">
                                    Memotong video menjadi 5 detik...
                                  </span>
                                  <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${trimProgress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-500 mt-1">{trimProgress}%</span>
                                </>
                              ) : uploading ? (
                                <>
                                  <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-2" />
                                  <span className="text-sm text-gray-600">Mengupload video...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                  <span className="text-sm text-gray-600">
                                    Klik untuk upload video (mp4, webm, max 50MB)
                                  </span>
                                </>
                              )}
                            </label>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Video akan autoplay sebagai background (seperti website referensi). Video akan otomatis muted dan loop.
                          {autoTrimVideo ? (
                            <span className="block mt-1 text-blue-600 font-medium">
                              ✓ Video yang lebih dari 5 detik akan otomatis dipotong menjadi 5 detik pertama.
                            </span>
                          ) : (
                            <span className="block mt-1 text-green-600 font-medium">
                              💡 Tip: Upload video yang sudah pendek (≤5 detik) untuk performa terbaik.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'gallery-carousel':
        const items = blockData.items || (blockData.images || []).map((img: string, idx: number) => ({
          image: img,
          label: blockData.labels?.[idx] || `Item ${idx + 1}`
        }))

        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={blockData.title || ''}
                onChange={(e) => setBlockData({ ...blockData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Gedung & Fasilitas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle (opsional)
              </label>
              <textarea
                value={blockData.subtitle || ''}
                onChange={(e) => setBlockData({ ...blockData, subtitle: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Jelajahi Fasilitas Bertaraf International..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Items
              </label>
              
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="gallery-upload"
                />
                <label
                  htmlFor="gallery-upload"
                  className={`inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>Tambah Gambar</span>
                    </>
                  )}
                </label>
              </div>

              <div className="space-y-4">
                {items.map((item: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex gap-4">
                      <div className="relative group flex-shrink-0">
                        <img
                          src={getImageUrl(item.image || item)}
                          alt={`Gallery ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [...items]
                              newItems.splice(index, 1)
                              setBlockData({ ...blockData, items: newItems })
                            }}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded text-white"
                            title="Remove"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Label
                        </label>
                        <input
                          type="text"
                          value={item.label || ''}
                          onChange={(e) => {
                            const newItems = [...items]
                            newItems[index] = { ...newItems[index], label: e.target.value }
                            setBlockData({ ...blockData, items: newItems })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          placeholder="Ruang Kelas"
                        />
                      </div>
                      <div className="flex flex-col justify-center space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (index > 0) {
                              const newItems = [...items]
                              const temp = newItems[index]
                              newItems[index] = newItems[index - 1]
                              newItems[index - 1] = temp
                              setBlockData({ ...blockData, items: newItems })
                            }
                          }}
                          disabled={index === 0}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-800 disabled:opacity-30"
                          title="Move up"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (index < items.length - 1) {
                              const newItems = [...items]
                              const temp = newItems[index]
                              newItems[index] = newItems[index + 1]
                              newItems[index + 1] = temp
                              setBlockData({ ...blockData, items: newItems })
                            }
                          }}
                          disabled={index === items.length - 1}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-800 disabled:opacity-30"
                          title="Move down"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {items.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">
                  Belum ada gambar. Klik "Tambah Gambar" untuk menambahkan.
                </p>
              )}
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              {blockData.image ? (
                <div className="relative mb-4">
                  <img
                    src={getImageUrl(blockData.image)}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setBlockData({ ...blockData, image: '' })}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer flex flex-col items-center ${
                      uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="animate-spin text-green-500 mb-2" size={32} />
                        <span className="text-gray-600">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="text-gray-400 mb-2" size={32} />
                        <span className="text-gray-600">Klik untuk upload gambar</span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Text
              </label>
              <input
                type="text"
                value={blockData.alt || ''}
                onChange={(e) => setBlockData({ ...blockData, alt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Image description"
              />
            </div>
          </div>
        )

      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={blockData.content || ''}
              onChange={(e) => setBlockData({ ...blockData, content: e.target.value })}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter text content..."
            />
          </div>
        )

      case 'video-section':
        const videos = blockData.videos || []
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={blockData.title || ''}
                onChange={(e) => setBlockData({ ...blockData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Videos</label>
              <button
                type="button"
                onClick={() => {
                  setBlockData({
                    ...blockData,
                    videos: [...videos, { title: '', titleEn: '', description: '', descriptionEn: '', url: '', thumbnail: '' }]
                  })
                }}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Tambah Video</span>
              </button>
            </div>
            {videos.map((video: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Video {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newVideos = videos.filter((_: any, i: number) => i !== index)
                      setBlockData({ ...blockData, videos: newVideos })
                    }}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title (ID)</label>
                    <input
                      type="text"
                      value={video.title || ''}
                      onChange={(e) => {
                        const newVideos = [...videos]
                        newVideos[index] = { ...newVideos[index], title: e.target.value }
                        setBlockData({ ...blockData, videos: newVideos })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title (EN)</label>
                    <input
                      type="text"
                      value={video.titleEn || ''}
                      onChange={(e) => {
                        const newVideos = [...videos]
                        newVideos[index] = { ...newVideos[index], titleEn: e.target.value }
                        setBlockData({ ...blockData, videos: newVideos })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                    <input
                      type="text"
                      value={video.url || ''}
                      onChange={(e) => {
                        const newVideos = [...videos]
                        newVideos[index] = { ...newVideos[index], url: e.target.value }
                        setBlockData({ ...blockData, videos: newVideos })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
                    <input
                      type="text"
                      value={video.thumbnail || ''}
                      onChange={(e) => {
                        const newVideos = [...videos]
                        newVideos[index] = { ...newVideos[index], thumbnail: e.target.value }
                        setBlockData({ ...blockData, videos: newVideos })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (ID)</label>
                    <textarea
                      value={video.description || ''}
                      onChange={(e) => {
                        const newVideos = [...videos]
                        newVideos[index] = { ...newVideos[index], description: e.target.value }
                        setBlockData({ ...blockData, videos: newVideos })
                      }}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (EN)</label>
                    <textarea
                      value={video.descriptionEn || ''}
                      onChange={(e) => {
                        const newVideos = [...videos]
                        newVideos[index] = { ...newVideos[index], descriptionEn: e.target.value }
                        setBlockData({ ...blockData, videos: newVideos })
                      }}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      case 'two-column':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Left Content
              </label>
              <textarea
                value={blockData.leftContent || ''}
                onChange={(e) => setBlockData({ ...blockData, leftContent: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Left column content (HTML allowed)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Right Content
              </label>
              <textarea
                value={blockData.rightContent || ''}
                onChange={(e) => setBlockData({ ...blockData, rightContent: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Right column content (HTML allowed)"
              />
            </div>
          </div>
        )

      case 'accordion':
        const accordionItems = blockData.items || []
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Accordion Items
              </label>
              <button
                type="button"
                onClick={() => {
                  setBlockData({
                    ...blockData,
                    items: [...accordionItems, { title: '', titleEn: '', content: '', contentEn: '' }]
                  })
                }}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Tambah Item</span>
              </button>
            </div>
            {accordionItems.map((item: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Item {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = accordionItems.filter((_: any, i: number) => i !== index)
                      setBlockData({ ...blockData, items: newItems })
                    }}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title (ID)</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => {
                        const newItems = [...accordionItems]
                        newItems[index] = { ...newItems[index], title: e.target.value }
                        setBlockData({ ...blockData, items: newItems })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title (EN)</label>
                    <input
                      type="text"
                      value={item.titleEn || ''}
                      onChange={(e) => {
                        const newItems = [...accordionItems]
                        newItems[index] = { ...newItems[index], titleEn: e.target.value }
                        setBlockData({ ...blockData, items: newItems })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content (ID)</label>
                    <textarea
                      value={item.content || ''}
                      onChange={(e) => {
                        const newItems = [...accordionItems]
                        newItems[index] = { ...newItems[index], content: e.target.value }
                        setBlockData({ ...blockData, items: newItems })
                      }}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content (EN)</label>
                    <textarea
                      value={item.contentEn || ''}
                      onChange={(e) => {
                        const newItems = [...accordionItems]
                        newItems[index] = { ...newItems[index], contentEn: e.target.value }
                        setBlockData({ ...blockData, items: newItems })
                      }}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      case 'cards':
        const cards = blockData.cards || []
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Cards</label>
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-700">Columns:</label>
                <div className="w-24">
                  <Select2
                    value={String(blockData.columns || 3)}
                    onChange={(value) => setBlockData({ ...blockData, columns: parseInt(value) })}
                    options={[
                      { value: '1', label: '1' },
                      { value: '2', label: '2' },
                      { value: '3', label: '3' },
                      { value: '4', label: '4' },
                    ]}
                    placeholder="Columns..."
                    isSearchable={false}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBlockData({
                      ...blockData,
                      cards: [...cards, { title: '', titleEn: '', content: '', contentEn: '', image: '', buttonText: '', buttonTextEn: '', buttonUrl: '' }]
                    })
                  }}
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 flex items-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Tambah Card</span>
                </button>
              </div>
            </div>
            {cards.map((card: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Card {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newCards = cards.filter((_: any, i: number) => i !== index)
                      setBlockData({ ...blockData, cards: newCards })
                    }}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    {card.image ? (
                      <div className="relative mb-2">
                        <img src={getImageUrl(card.image)} alt="Preview" className="w-full h-32 object-cover rounded border" />
                        <button
                          type="button"
                          onClick={() => {
                            const newCards = [...cards]
                            newCards[index] = { ...newCards[index], image: '' }
                            setBlockData({ ...blockData, cards: newCards })
                          }}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setUploading(true)
                            try {
                              const data = await apiClient.upload('/admin/upload', file, 'general')
                              const newCards = [...cards]
                              newCards[index] = { ...newCards[index], image: data.url || data.path || '' }
                              setBlockData({ ...blockData, cards: newCards })
                            } finally {
                              setUploading(false)
                            }
                          }
                        }}
                        className="w-full text-sm"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title (ID)</label>
                    <input
                      type="text"
                      value={card.title || ''}
                      onChange={(e) => {
                        const newCards = [...cards]
                        newCards[index] = { ...newCards[index], title: e.target.value }
                        setBlockData({ ...blockData, cards: newCards })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title (EN)</label>
                    <input
                      type="text"
                      value={card.titleEn || ''}
                      onChange={(e) => {
                        const newCards = [...cards]
                        newCards[index] = { ...newCards[index], titleEn: e.target.value }
                        setBlockData({ ...blockData, cards: newCards })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content (ID)</label>
                    <textarea
                      value={card.content || ''}
                      onChange={(e) => {
                        const newCards = [...cards]
                        newCards[index] = { ...newCards[index], content: e.target.value }
                        setBlockData({ ...blockData, cards: newCards })
                      }}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content (EN)</label>
                    <textarea
                      value={card.contentEn || ''}
                      onChange={(e) => {
                        const newCards = [...cards]
                        newCards[index] = { ...newCards[index], contentEn: e.target.value }
                        setBlockData({ ...blockData, cards: newCards })
                      }}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Text (ID)</label>
                    <input
                      type="text"
                      value={card.buttonText || ''}
                      onChange={(e) => {
                        const newCards = [...cards]
                        newCards[index] = { ...newCards[index], buttonText: e.target.value }
                        setBlockData({ ...blockData, cards: newCards })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button URL</label>
                    <input
                      type="text"
                      value={card.buttonUrl || ''}
                      onChange={(e) => {
                        const newCards = [...cards]
                        newCards[index] = { ...newCards[index], buttonUrl: e.target.value }
                        setBlockData({ ...blockData, cards: newCards })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div>
            <p className="text-gray-600 mb-4">
              Editor untuk block type "{block.type}". Untuk mengedit data block, silakan gunakan form yang sesuai dengan tipe block.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(blockData, null, 2)}
              </pre>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Edit Block: {block.type}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {saveError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {saveError}
            </div>
          )}
          {renderForm()}
          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleSave(e)
              }}
              disabled={isSaving}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

