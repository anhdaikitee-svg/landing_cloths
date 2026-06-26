'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'

export default function AboutAdminClient({ initialData, updateAction }: { initialData: any, updateAction: (formData: FormData) => Promise<void> }) {
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [hero, setHero] = useState(initialData?.hero || {
    subtitle: 'Câu chuyện của chúng tôi',
    title: 'Hành Trình Kiến Tạo\nNghệ Thuật Sống',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrjk9xlAOfAwXX-SEAGHXYtZqvkWUkCh-k77fH-DW_te05pt9yGFdN6ScZe-2Bot6ttZPDyQXp8pm8UffzW17AmZgFschA2Q-VQhSpAGjjTTIYee4IxMCPoOgxd71cELviAwZq10pKPE4vftdjObz5FsmdsxGjE_jog4hs4SMFTocEyy8I3FeyYPydavDhCzIFAQ_VX_ypaHKmTdMHoxtOAPxfBYrPv3ecG0-ldeA8kpNT-Tymu_gO_6vEyddHJsc63VsbTCFHrxE'
  })
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const formData = new FormData(e.currentTarget)
      await updateAction(formData)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error(error)
      alert('Có lỗi xảy ra khi lưu nội dung.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      {showSuccess && (
        <div className="fixed top-24 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-top-10 fade-in duration-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div className="flex flex-col">
            <span className="font-bold">Thành công!</span>
            <span className="text-sm opacity-90">Đã cập nhật dữ liệu thành công.</span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-8">
      <input type="hidden" name="sectionIds" value={sections.map(s => s.id).join(',')} />

      {/* Hero Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Phần Đầu Trang (Hero Section)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dòng chữ nhỏ (Phụ đề)</label>
            <input type="text" name="heroSubtitle" defaultValue={hero.subtitle} className="w-full border rounded px-4 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề chính</label>
            <textarea name="heroTitle" defaultValue={hero.title} rows={2} className="w-full border rounded px-4 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh Banner chính</label>
            {hero.image && (
              <div className="mb-2">
                <img src={hero.image} alt="Hero" className="w-48 object-cover rounded border bg-gray-50" />
              </div>
            )}
            <input type="file" name="heroImageFile" accept="image/*" className="w-full border rounded px-4 py-2" />
            <input type="hidden" name="heroExistingImage" value={hero.image || ''} />
          </div>
        </div>
      </div>

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

      <button disabled={isSaving} type="submit" className={`px-8 py-3 rounded text-white font-medium w-full md:w-auto transition-colors ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-dark hover:bg-black'}`}>
        {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
      </button>
    </form>
    </>
  )
}
