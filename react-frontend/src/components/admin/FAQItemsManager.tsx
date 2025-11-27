'use client'

import { useState } from 'react'
import { Plus, X, ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import { RichTextEditor } from './RichTextEditor'

interface FAQItem {
  id: string
  question: string
  questionEn?: string
  answer: string
  answerEn?: string
  order: number
}

interface FAQItemsManagerProps {
  value: FAQItem[]
  onChange: (items: FAQItem[]) => void
}

export function FAQItemsManager({ value, onChange }: FAQItemsManagerProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const addFAQItem = () => {
    const newItem: FAQItem = {
      id: `faq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      question: '',
      questionEn: '',
      answer: '',
      answerEn: '',
      order: value.length,
    }
    onChange([...value, newItem])
    setExpandedItems(new Set([...expandedItems, newItem.id]))
  }

  const removeFAQItem = (id: string) => {
    onChange(value.filter(item => item.id !== id))
    const newExpanded = new Set(expandedItems)
    newExpanded.delete(id)
    setExpandedItems(newExpanded)
  }

  const updateFAQItem = (id: string, field: keyof FAQItem, fieldValue: string | number) => {
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
    
    // Update order
    newItems.forEach((item, idx) => {
      item.order = idx
    })
    
    onChange(newItems)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          FAQ Items *
        </label>
        <button
          type="button"
          onClick={addFAQItem}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <Plus size={18} />
          <span>Tambah FAQ</span>
        </button>
      </div>

      {value.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">Belum ada FAQ item. Klik "Tambah FAQ" untuk menambahkan.</p>
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
                {/* Header - Question Preview */}
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
                      {item.question || `FAQ Item ${index + 1}`}
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
                      onClick={() => removeFAQItem(item.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Hapus FAQ"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-4 space-y-4">
                    {/* Question ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pertanyaan (ID) *
                      </label>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => updateFAQItem(item.id, 'question', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Masukkan pertanyaan"
                      />
                    </div>

                    {/* Question EN */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pertanyaan (EN)
                      </label>
                      <input
                        type="text"
                        value={item.questionEn || ''}
                        onChange={(e) => updateFAQItem(item.id, 'questionEn', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Question (EN)"
                      />
                    </div>

                    {/* Answer ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jawaban (ID) *
                      </label>
                      <RichTextEditor
                        value={item.answer}
                        onChange={(content) => updateFAQItem(item.id, 'answer', content)}
                        placeholder="Masukkan jawaban"
                      />
                    </div>

                    {/* Answer EN */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jawaban (EN)
                      </label>
                      <RichTextEditor
                        value={item.answerEn || ''}
                        onChange={(content) => updateFAQItem(item.id, 'answerEn', content)}
                        placeholder="Answer (EN)"
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

