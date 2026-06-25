'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'

export default function AboutAdminClient({ initialData, updateAction }: { initialData: any, updateAction: (formData: FormData) => Promise<void> }) {
  const [sections, setSections] = useState<any[]>(initialData?.sections || [
    { id: '1', title: initialData?.title1 || '', content: initialData?.content1 || '', image: initialData?.image1 || '' },
    { id: '2', title: initialData?.title2 || '', content: initialData?.content2 || '', image: initialData?.image2 || '' }
  ])

  const addSection = () => {
    setSections([...sections, { id: Date.now().toString(), title: '', content: '', image: '' }])
  }

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id))
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('index', index.toString())
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    const sourceIndex = parseInt(e.dataTransfer.getData('index'))
    const newSections = [...sections]
    const [moved] = newSections.splice(sourceIndex, 1)
    newSections.splice(targetIndex, 0, moved)
    setSections(newSections)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <form action={updateAction} className="space-y-8">
      <input type="hidden" name="sectionIds" value={sections.map(s => s.id).join(',')} />

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500 text-sm">Kéo thả biểu tượng ≡ để thay đổi thứ tự các phần.</p>
        <button type="button" onClick={addSection} className="bg-gray-100 text-brand-dark px-4 py-2 rounded text-sm hover:bg-gray-200 transition flex items-center gap-2 font-medium">
          <Plus size={16} /> Thêm Phần Mới
        </button>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div 
            key={section.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 relative group"
          >
            <div className="absolute left-2 top-6 cursor-grab text-gray-300 hover:text-gray-500">
              <GripVertical size={20} />
            </div>

            <div className="pl-6">
              <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-lg font-semibold text-gray-700">Phần {index + 1}</h2>
                <button type="button" onClick={() => removeSection(section.id)} className="text-red-400 hover:text-red-600 transition" title="Xóa phần này">
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                  <input type="text" name={`title_${section.id}`} defaultValue={section.title} className="w-full border rounded px-4 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                  <textarea name={`content_${section.id}`} defaultValue={section.content} rows={6} className="w-full border rounded px-4 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh (Tải lên ảnh mới sẽ ghi đè ảnh cũ)</label>
                  {section.image && (
                    <div className="mb-2">
                      <img src={section.image} alt="Current" className="h-32 object-contain rounded border bg-gray-50" />
                    </div>
                  )}
                  <input type="file" name={`imageFile_${section.id}`} accept="image/*" className="w-full border rounded px-4 py-2" />
                  <input type="hidden" name={`existingImage_${section.id}`} value={section.image || ''} />
                </div>
              </div>
            </div>
          </div>
        ))}
        {sections.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
            Chưa có nội dung nào. Hãy thêm một phần mới!
          </div>
        )}
      </div>

      <button type="submit" className="bg-brand-dark text-white px-8 py-3 rounded hover:bg-black transition font-medium w-full md:w-auto">
        Lưu Thay Đổi
      </button>
    </form>
  )
}
