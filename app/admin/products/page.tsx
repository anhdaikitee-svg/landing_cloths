import { prisma } from '@/lib/prisma'
import { createProduct, deleteProduct } from '../actions'
import { Trash2, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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
          <form action={createProduct} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tên Sản Phẩm</label>
              <input type="text" name="name" required className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Danh Mục</label>
              <select name="categoryId" required className="w-full border rounded px-3 py-2 text-sm bg-white">
                <option value="">Chọn danh mục...</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Hình Ảnh</label>
              <input type="file" name="images" multiple accept="image/*" required className="w-full border rounded px-3 py-2 text-sm bg-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Ảnh Bảng Size (Tùy chọn)</label>
              <input type="file" name="sizeChartImage" accept="image/*" className="w-full border rounded px-3 py-2 text-sm bg-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Ảnh Bảng Giá (Tùy chọn)</label>
              <input type="file" name="priceChartImage" accept="image/*" className="w-full border rounded px-3 py-2 text-sm bg-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mô tả</label>
              <textarea name="description" rows={4} className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Lưu ý vùng thêu</label>
              <textarea name="embroideryNote" rows={3} placeholder="VD: Vùng thêu ngực: Kích thước tối đa..." className="w-full border rounded px-3 py-2 text-sm" />
            </div>
            <button type="submit" className="w-full bg-brand-dark text-white py-2 rounded text-sm hover:bg-black transition flex items-center justify-center gap-2">
              <Plus size={16} /> Thêm Sản Phẩm
            </button>
          </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-lg shadow-sm xl:col-span-2 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-sm font-semibold text-gray-600 w-16">Ảnh</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Sản Phẩm</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Danh Mục</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Giá</th>
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
                  <td className="p-4 text-sm text-gray-600">{new Intl.NumberFormat('vi-VN').format(prod.price)}đ</td>
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
