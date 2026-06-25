import { prisma } from '@/lib/prisma'
import { createProduct, deleteProduct } from '../actions'
import { Trash2, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import CreateProductForm from './CreateProductForm'

export default async function ProductsAdmin() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: { select: { name: true } } }
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Quản Lý Sản Phẩm</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form Create */}
        <div className="bg-white rounded-lg shadow-sm p-6 xl:col-span-1 h-fit">
          <h2 className="text-lg font-semibold mb-4">Thêm Sản Phẩm Mới</h2>
          <CreateProductForm categories={categories} createAction={createProduct} />
        </div>

        {/* List */}
        <div className="bg-white rounded-lg shadow-sm xl:col-span-2 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-sm font-semibold text-gray-600 w-16">Ảnh</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Sản Phẩm</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Danh Mục</th>

                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((prod: any) => (
                <tr key={prod.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="w-10 h-10 relative rounded bg-gray-100 overflow-hidden border">
                      {prod.images[0] && <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" sizes="40px" />}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-800">
                    <div className="font-medium line-clamp-1">{prod.name}</div>

                  </td>
                  <td className="p-4 text-sm text-gray-600">{prod.category.name}</td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${prod.id}`} className="text-blue-500 hover:text-blue-700 p-1" title="Sửa">
                        <span className="text-sm">Sửa</span>
                      </Link>
                      <form action={deleteProduct.bind(null, prod.id)}>
                        <button type="submit" className="text-red-500 hover:text-red-700 p-1" title="Xóa">
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Chưa có sản phẩm nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
