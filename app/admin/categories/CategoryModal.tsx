'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

// Pass the server action as a prop since we are in a Client Component
export default function CategoryModal({ createCategoryAction }: { createCategoryAction: (formData: FormData) => Promise<void> }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    await createCategoryAction(formData)
    setIsOpen(false)
  }

  return (
    <>
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
            
            <form action={handleSubmit} className="p-6 space-y-4">
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
