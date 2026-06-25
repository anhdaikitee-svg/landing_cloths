import { prisma } from '@/lib/prisma'
import { updateProduct } from '../../actions'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ])

  if (!product) {
    notFound()
  }

  const updateAction = async (formData: FormData) => {
    'use server'
    await updateProduct(product.id, formData)
    redirect('/admin/products')
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-gray-500 hover:text-brand-dark">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Sửa Sản Phẩm</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form action={updateAction} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tên Sản Phẩm</label>
            <input type="text" name="name" defaultValue={product.name} required className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Danh Mục</label>
            <select name="categoryId" defaultValue={product.categoryId} required className="w-full border rounded px-3 py-2 text-sm bg-white">
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>


          <div>
            <label className="block text-sm text-gray-600 mb-1">Ảnh Hiện Tại</label>
            <div className="flex gap-2 mb-2">
              {product.images.map((img: string, i: number) => (
                <div key={i} className="w-16 h-16 relative rounded border overflow-hidden">
                  <Image src={img} alt="" fill className="object-cover" sizes="64px"/>
                </div>
              ))}
            </div>
            <label className="block text-sm text-gray-600 mb-1">Tải lên ảnh mới (Bỏ trống nếu muốn giữ ảnh cũ)</label>
            <input type="file" name="images" multiple accept="image/*" className="w-full border rounded px-3 py-2 text-sm bg-white" />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Ảnh Bảng Size (Tải lên ảnh mới để thay đổi, bỏ trống để giữ ảnh cũ)</label>
            {(product as any).sizeChartImage && (
              <div className="w-16 h-16 relative rounded border overflow-hidden mb-2">
                <Image src={(product as any).sizeChartImage} alt="" fill className="object-cover" sizes="64px"/>
              </div>
            )}
            <input type="file" name="sizeChartImage" accept="image/*" className="w-full border rounded px-3 py-2 text-sm bg-white" />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Ảnh Bảng Giá (Tải lên ảnh mới để thay đổi, bỏ trống để giữ ảnh cũ)</label>
            {(product as any).priceChartImage && (
              <div className="w-16 h-16 relative rounded border overflow-hidden mb-2">
                <Image src={(product as any).priceChartImage} alt="" fill className="object-cover" sizes="64px"/>
              </div>
            )}
            <input type="file" name="priceChartImage" accept="image/*" className="w-full border rounded px-3 py-2 text-sm bg-white" />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Mô tả</label>
            <textarea name="description" defaultValue={product.description || ''} rows={4} className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Lưu ý vùng thêu</label>
            <textarea name="embroideryNote" defaultValue={(product as any).embroideryNote || ''} rows={3} placeholder="VD: Vùng thêu ngực: Kích thước tối đa..." className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div className="pt-4 flex gap-4">
            <Link href="/admin/products" className="flex-1 text-center py-2 border rounded text-sm text-gray-600 hover:bg-gray-50">
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
