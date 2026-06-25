import { prisma } from '@/lib/prisma'
import { createCategory, deleteCategory } from '../actions'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import CategoryModal from './CategoryModal'

export default async function CategoriesAdmin() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { 
      _count: { select: { products: true } },
      parent: true
    }
  })

  const rootCategories = categories.filter((c: any) => !c.parentId)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Danh Mục</h1>
        <CategoryModal createCategoryAction={createCategory} parentCategories={rootCategories} />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 text-sm font-semibold text-gray-600">Tên Danh Mục</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Sản Phẩm</th>
              <th className="p-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat: any) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-800 font-medium">
                  {cat.name}
                  {cat.parent && <span className="block text-xs text-gray-500 mt-1">Thuộc: {cat.parent.name}</span>}
                </td>
                <td className="p-4 text-sm text-gray-500">{cat._count.products}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/categories/${cat.id}`} className="text-blue-500 hover:text-blue-700 p-1" title="Sửa">
                      <span className="text-sm">Sửa</span>
                    </Link>
                    <form action={deleteCategory.bind(null, cat.id)}>
                      <button type="submit" className="text-red-500 hover:text-red-700 p-1" title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">Chưa có danh mục nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
