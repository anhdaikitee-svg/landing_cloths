'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

export default function CategoryModal({ createCategoryAction, parentCategories = [] }: { createCategoryAction: (formData: FormData) => Promise<void>, parentCategories?: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.currentTarget)
      await createCategoryAction(formData)
      setIsOpen(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error(error)
      alert('Có lỗi xảy ra!')
    }
  }

  return (
    <>
      {showSuccess && (
        <div className="fixed top-24 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-top-10 fade-in duration-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div className="flex flex-col">
            <span className="font-bold">Thành công!</span>
            <span className="text-sm opacity-90">Thêm danh mục thành công.</span>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-brand-dark text-white px-4 py-2 rounded text-sm hover:bg-black transition flex items-center gap-2"
      >
        <Plus size={16} /> Thêm Danh Mục
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Thêm Danh Mục Mới</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-black">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tên Danh Mục</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-dark outline-none" 
                  placeholder="VD: Áo Sơ Mi" 
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Danh Mục Cha (Tùy chọn)</label>
                <select name="parentId" className="w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-dark outline-none bg-white">
                  <option value="">-- Không có (Danh mục gốc) --</option>
                  {parentCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="bg-brand-dark text-white px-6 py-2 rounded text-sm hover:bg-black transition"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
