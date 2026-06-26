'use client'

import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'

export default function CreateProductForm({ 
  categories, 
  createAction 
}: { 
  categories: any[], 
  createAction: (formData: FormData) => Promise<void> 
}) {
  const [isPending, setIsPending] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    try {
      setIsPending(true)
      await createAction(formData)
      // Reset form after successful creation
      formRef.current?.reset()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error(error)
      alert('Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="relative">
      {showSuccess && (
        <div className="fixed top-24 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-top-10 fade-in duration-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div className="flex flex-col">
            <span className="font-bold">Thành công!</span>
            <span className="text-sm opacity-90">Thêm sản phẩm thành công.</span>
          </div>
        </div>
      )}
      {/* Loading Overlay */}
      {isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-brand-dark">Đang lưu...</span>
          </div>
        </div>
      )}

      <form action={handleSubmit} ref={formRef} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Tên Sản Phẩm</label>
          <input type="text" name="name" required className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dark bg-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Danh Mục</label>
          <select name="categoryId" required className="w-full border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-dark">
            <option value="">Chọn danh mục...</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Hình Ảnh</label>
          <input type="file" name="images" multiple accept="image/*" required className="w-full border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-dark" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Ảnh Bảng Size (Tùy chọn)</label>
          <input type="file" name="sizeChartImage" accept="image/*" className="w-full border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-dark" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Ảnh Bảng Giá (Tùy chọn)</label>
          <input type="file" name="priceChartImage" accept="image/*" className="w-full border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-dark" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Mô tả</label>
          <textarea name="description" rows={4} className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dark" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Lưu ý vùng thêu</label>
          <textarea name="embroideryNote" rows={3} placeholder="VD: Vùng thêu ngực: Kích thước tối đa..." className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dark" />
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-brand-dark text-white py-2 rounded text-sm hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} /> {isPending ? 'Đang thêm...' : 'Thêm Sản Phẩm'}
        </button>
      </form>
    </div>
  )
}
