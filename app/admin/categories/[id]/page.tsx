import { prisma } from '@/lib/prisma'
import { updateCategory } from '../../actions'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({ where: { id: params.id } })
  const parentCategories = await prisma.category.findMany({
    where: { 
      parentId: null,
      id: { not: params.id } // cannot be parent of itself
    }
  })

  if (!category) {
    notFound()
  }

  // Bind the action with the category id
  const updateAction = async (formData: FormData) => {
    'use server'
    await updateCategory(category.id, formData)
    redirect('/admin/categories')
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/categories" className="text-gray-500 hover:text-brand-dark">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Sửa Danh Mục</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form action={updateAction} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tên Danh Mục</label>
            <input type="text" name="name" defaultValue={category.name} required className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Danh Mục Cha (Tùy chọn)</label>
            <select name="parentId" defaultValue={category.parentId || ""} className="w-full border rounded px-3 py-2 text-sm bg-white">
              <option value="">-- Không có (Danh mục gốc) --</option>
              {parentCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Mã Màu (Tùy chọn)</label>
            <input type="text" name="color" defaultValue={category.color || ''} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div className="pt-4 flex gap-4">
            <Link href="/admin/categories" className="flex-1 text-center py-2 border rounded text-sm text-gray-600 hover:bg-gray-50">
              Hủy
            </Link>
            <button type="submit" className="flex-1 bg-brand-dark text-white py-2 rounded text-sm hover:bg-black transition">
              Lưu Thay Đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
