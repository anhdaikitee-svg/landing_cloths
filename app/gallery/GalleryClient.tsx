'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface GalleryPhoto {
  id: string
  url: string
  caption: string | null
  createdAt: string
}

export default function GalleryClient({ photos }: { photos: GalleryPhoto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (idx: number) => setLightboxIndex(idx)
  const closeLightbox = () => setLightboxIndex(null)

  const prev = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)
  }

  const next = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % photos.length)
  }

  return (
    <div className="bg-brand-light min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <header className="text-center mb-14">
          <p className="inline-block bg-brand-gold text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-sm mb-6">
            Hình Ảnh Thực Tế
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-brand-dark tracking-wide mb-4">
            Ảnh Sản Phẩm Thực Tế
          </h1>
          <div className="w-16 h-0.5 bg-brand-gold mx-auto mt-6" />
        </header>

        {photos.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="font-serif text-xl italic">Chưa có ảnh nào được đăng tải.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((photo, idx) => (
              <button
                key={photo.id}
                onClick={() => openLightbox(idx)}
                className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 hover:border-brand-dark transition-all duration-200 shadow-sm hover:shadow-lg"
              >
                <Image
                  src={photo.url}
                  alt={photo.caption || `Ảnh thực tế ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end justify-start p-3">
                  {photo.caption && (
                    <span className="opacity-0 group-hover:opacity-100 transition text-white text-xs bg-black/50 px-2 py-1 rounded">
                      {photo.caption}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 text-white w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm z-10">
            {lightboxIndex + 1} / {photos.length}
          </div>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition"
              onClick={(e) => { e.stopPropagation(); prev() }}
            >
              <ChevronLeft size={26} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-5xl w-full max-h-[88vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightboxIndex].url}
              alt={photos[lightboxIndex].caption || ''}
              className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl"
            />
            {photos[lightboxIndex].caption && (
              <p className="text-white/70 text-sm mt-3 text-center">{photos[lightboxIndex].caption}</p>
            )}
          </div>

          {/* Next */}
          {photos.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition"
              onClick={(e) => { e.stopPropagation(); next() }}
            >
              <ChevronRight size={26} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
