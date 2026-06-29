'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function EditProductForm({ 
  product, 
  categories, 
  updateAction 
}: { 
  product: any, 
  categories: any[], 
  updateAction: (formData: FormData) => Promise<void> 
}) {
  const [isPending, setIsPending] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [images, setImages] = useState<string[]>(product.images || [])

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...images]
    if (direction === 'left' && index > 0) {
      const temp = newImages[index]
      newImages[index] = newImages[index - 1]
      newImages[index - 1] = temp
    } else if (direction === 'right' && index < images.length - 1) {
      const temp = newImages[index]
      newImages[index] = newImages[index + 1]
      newImages[index + 1] = temp
    }
    setImages(newImages)
  }

  async function handleSubmit(formData: FormData) {
    try {
      setIsPending(true)
      await updateAction(formData)
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
            <span className="text-sm opacity-90">Cập nhật sản phẩm thành công.</span>
          </div>
        </div>
      )}
      {/* Loading Overlay */}
      {isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-brand-dark">Đang lưu thay đổi...</span>
          </div>
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Tên Sản Phẩm</label>
          <input type="text" name="name" defaultValue={product.name} required className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dark bg-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Danh Mục</label>
          <select name="categoryId" defaultValue={product.categoryId} required className="w-full border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-dark">
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2 font-medium">Quản lý & Sắp xếp ảnh hiện tại</label>
          <input type="hidden" name="existingImagesJson" value={JSON.stringify(images)} />
          
          {images.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
              {images.map((img: string, i: number) => (
                <div key={i} className="group relative border rounded p-1 flex flex-col bg-gray-50 hover:border-brand-gold transition duration-200">
                  <div className="w-full aspect-square relative rounded overflow-hidden">
                    <Image src={img} alt="" fill className="object-cover" sizes="120px"/>
                  </div>
                  <div className="flex justify-between items-center gap-1 mt-2 text-xs">
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={() => moveImage(i, 'left')}
                      className="px-1.5 py-0.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white text-gray-600"
                      title="Di chuyển sang trái"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="text-red-500 font-bold px-2 py-0.5 hover:bg-red-50 rounded"
                      title="Xóa ảnh"
                    >
                      Xóa
                    </button>
                    <button
                      type="button"
                      disabled={i === images.length - 1}
                      onClick={() => moveImage(i, 'right')}
                      className="px-1.5 py-0.5 border rounded bg-white hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white text-gray-600"
                      title="Di chuyển sang phải"
                    >
                      →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic mb-4">Không có hình ảnh hiện tại nào.</p>
          )}

          <label className="block text-sm text-gray-600 mb-1">Tải lên thêm ảnh mới (Ảnh mới sẽ được thêm vào cuối danh sách)</label>
          <input type="file" name="images" multiple accept="image/*" className="w-full border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-dark" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Ảnh Bảng Size (Tải lên ảnh mới để thay đổi, bỏ trống để giữ ảnh cũ)</label>
          {product.sizeChartImage && (
            <div className="w-16 h-16 relative rounded border overflow-hidden mb-2">
              <Image src={product.sizeChartImage} alt="" fill className="object-cover" sizes="64px"/>
            </div>
          )}
          <input type="file" name="sizeChartImage" accept="image/*" className="w-full border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-dark" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Ảnh Bảng Giá (Tải lên ảnh mới để thay đổi, bỏ trống để giữ ảnh cũ)</label>
          {product.priceChartImage && (
            <div className="w-16 h-16 relative rounded border overflow-hidden mb-2">
              <Image src={product.priceChartImage} alt="" fill className="object-cover" sizes="64px"/>
            </div>
          )}
          <input type="file" name="priceChartImage" accept="image/*" className="w-full border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-dark" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Mô tả</label>
          <textarea name="description" defaultValue={product.description || ''} rows={4} className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dark" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Lưu ý vùng thêu</label>
          <textarea name="embroideryNote" defaultValue={product.embroideryNote || ''} rows={3} placeholder="VD: Vùng thêu ngực: Kích thước tối đa..." className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dark" />
        </div>
        <div className="flex items-center gap-2 py-2">
          <input 
            type="checkbox" 
            id="isFeatured" 
            name="isFeatured" 
            defaultChecked={product.isFeatured} 
            className="w-4 h-4 text-brand-dark border-gray-300 rounded focus:ring-brand-dark cursor-pointer" 
          />
          <label htmlFor="isFeatured" className="text-sm text-gray-600 select-none cursor-pointer">Sản phẩm nổi bật (Hiện ở Trang Chủ)</label>
        </div>
        <div className="pt-4 flex gap-4">
          <Link href="/admin/products" className="flex-1 text-center py-2 border rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 pointer-events-auto">
            Hủy
          </Link>
          <button 
            type="submit" 
            disabled={isPending}
            className="flex-1 bg-brand-dark text-white py-2 rounded text-sm hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
        </div>
      </form>
    </div>
  )
}
