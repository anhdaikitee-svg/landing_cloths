'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { uploadGalleryPhotos, deleteGalleryPhoto } from '../actions'
import { Trash2, Upload, Images } from 'lucide-react'

interface GalleryPhoto {
  id: string
  url: string
  caption: string | null
  createdAt: Date
}

export default function AdminGalleryClient({ photos }: { photos: GalleryPhoto[] }) {
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    setUploading(true)
    setSuccess('')
    startTransition(async () => {
      await uploadGalleryPhotos(fd)
      form.reset()
      setUploading(false)
      setSuccess('Tải ảnh lên thành công!')
      setTimeout(() => setSuccess(''), 3000)
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Xóa ảnh này?')) return
    startTransition(async () => {
      await deleteGalleryPhoto(id)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Images className="text-brand-dark" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Ảnh Sản Phẩm Thực Tế</h1>
            <p className="text-sm text-gray-500">Quản lý thư viện ảnh thực tế hiển thị trên trang /gallery</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
          <h2 className="text-base font-semibold text-gray-700 mb-4">📤 Tải Ảnh Mới Lên</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Chọn ảnh (nhiều ảnh cùng lúc)</label>
              <input
                type="file"
                name="photos"
                multiple
                accept="image/*"
                required
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark"
              />
            </div>
            <button
              type="submit"
              disabled={uploading || isPending}
              className="flex items-center gap-2 bg-brand-dark text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={16} />
              {uploading || isPending ? 'Đang tải lên...' : 'Tải Ảnh Lên'}
            </button>
            {success && (
              <p className="text-green-600 text-sm font-medium">{success}</p>
            )}
          </form>
        </div>

        {/* Photos Grid */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-gray-700">🖼️ Thư Viện Ảnh</h2>
            <span className="text-sm text-gray-400">{photos.length} ảnh</span>
          </div>

          {photos.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Images size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">Chưa có ảnh nào. Hãy tải ảnh lên bên trên.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden border bg-gray-50 shadow-sm">
                  <Image
                    src={photo.url}
                    alt={photo.caption || ''}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="opacity-0 group-hover:opacity-100 transition bg-red-500 hover:bg-red-600 text-white rounded-full w-9 h-9 flex items-center justify-center shadow"
                      title="Xóa ảnh"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
