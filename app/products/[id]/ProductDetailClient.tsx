'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'

interface Color { id: string; name: string; hex: string; images: string[]; stock: number }
interface Product {
  id: string; name: string; description: string | null
  images: string[]; colors: Color[]; price: number
  category: { name: string; slug: string }
  realPhotos?: string[]
}
interface RelatedProduct {
  id: string; name: string; images: string[]
  category: { name: string; slug: string }
}

export default function ProductDetailClient({ product, related }: { product: Product; related: RelatedProduct[] }) {
  const displayImages = product.images
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const realPhotos = (product as any).realPhotos as string[] || []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  const handleDragStart = (clientX: number) => {
    setDragStartX(clientX)
    setIsDragging(true)
  }

  const handleDragEnd = (clientX: number) => {
    if (!isDragging || dragStartX === null) return
    const diff = dragStartX - clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage()
      else prevImage()
    }
    setDragStartX(null)
    setIsDragging(false)
  }

  return (
    <div className="bg-brand-light min-h-screen pt-24 pb-32">
      <article className="max-w-5xl mx-auto px-6 md:px-12">

        {/* Article Header */}
        <header className="text-center mb-12">
          <Link href={`/products?category=${product.category.slug}`} className="inline-block bg-brand-gold text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-sm mb-6 hover:bg-brand-dark transition-colors">
            {product.category.name}
          </Link>
          <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-brand-dark tracking-wide mb-6 leading-tight">
            {product.name}
          </h1>
        </header>

        {/* Hero Image Slider */}
        <div
          className="relative aspect-square w-full max-w-3xl mx-auto bg-[#f8f9fa] rounded-2xl overflow-hidden shadow-sm mb-16 group select-none"
        >
          {displayImages.length > 0 ? (
            <>
              {/* Blurred background backdrop */}
              <Image
                src={displayImages[currentImageIndex]}
                alt=""
                fill
                className="object-cover blur-2xl opacity-25 scale-105 select-none pointer-events-none"
              />
              {/* Main contained image */}
              <Image
                src={displayImages[currentImageIndex]}
                alt={`${product.name} - ${currentImageIndex + 1}`}
                fill
                className="object-contain relative z-10 transition-opacity duration-300 pointer-events-none"
                priority
                sizes="100vw"
              />
              {/* Transparent drag/swipe overlay */}
              {displayImages.length > 1 && (
                <div
                  className={`absolute inset-0 z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                  onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                  onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
                  onTouchCancel={() => { setDragStartX(null); setIsDragging(false) }}
                  onMouseDown={(e) => { e.preventDefault(); handleDragStart(e.clientX) }}
                  onMouseUp={(e) => handleDragEnd(e.clientX)}
                  onMouseLeave={() => { setDragStartX(null); setIsDragging(false) }}
                />
              )}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/80 backdrop-blur text-brand-dark rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/80 backdrop-blur text-brand-dark rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Dots indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                    {displayImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif text-gray-400 italic">Chưa có ảnh</div>
          )}
        </div>

        {/* Thumbnails Gallery */}
        {displayImages.length > 1 && (
          <div className="flex justify-center gap-4 mb-16 overflow-x-auto pb-4 max-w-3xl mx-auto px-4 snap-x">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all snap-center ${idx === currentImageIndex ? 'border-brand-dark shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" sizes="96px" />
              </button>
            ))}
          </div>
        )}

        {/* Real Photos Grid */}
        {realPhotos.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between border-b-2 border-brand-dark pb-4 mb-8">
              <h2 className="font-serif text-2xl tracking-widest uppercase text-brand-dark">Ảnh Thực Tế Sản Phẩm</h2>
              <span className="text-sm text-gray-400">{realPhotos.length} ảnh</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {realPhotos.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 hover:border-brand-dark transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Image src={img} alt={`Ảnh thực tế ${idx + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition bg-black/50 px-2 py-1 rounded">Phóng to</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Lightbox Modal */}
        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl transition"
              onClick={() => setLightboxIndex(null)}
            >
              ✕
            </button>
            {/* Prev */}
            {realPhotos.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition z-10"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + realPhotos.length) % realPhotos.length) }}
              >
                <ChevronLeft size={24} />
              </button>
            )}
            {/* Main image */}
            <div className="relative max-w-4xl w-full max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={realPhotos[lightboxIndex]}
                alt={`Ảnh thực tế ${lightboxIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                {lightboxIndex + 1} / {realPhotos.length}
              </div>
            </div>
            {/* Next */}
            {realPhotos.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition z-10"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % realPhotos.length) }}
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-3xl mx-auto">
          {/* Description */}
          <div className="font-sans text-sm md:text-base text-gray-700 leading-loose mb-16 whitespace-pre-line">
            {product.description || 'Chi tiết sản phẩm đang được cập nhật.'}
          </div>

          {/* Size & Price Charts Section */}
          {((product as any).sizeChartImage || (product as any).priceChartImage || (product as any).embroideryNote) && (
            <div className="my-24 space-y-12">
              {/* Size Chart */}
              {(product as any).sizeChartImage && (
                <div className="w-full">
                  <Image src={(product as any).sizeChartImage} alt="Bảng Size" width={1200} height={1200} className="w-full h-auto rounded-xl" />
                </div>
              )}

              {/* Embroidery Note */}
              {(product as any).embroideryNote && (
                <div className="bg-[#f0f5fc] text-[#0d3b66] p-8 md:p-10 rounded-2xl shadow-sm border border-[#e1ebf5]">
                  <h4 className="font-serif text-xl md:text-2xl mb-6 font-bold text-center">Lưu ý vùng thêu</h4>
                  <div className="font-sans text-sm md:text-base leading-loose max-w-3xl mx-auto whitespace-pre-line font-medium">
                    {(product as any).embroideryNote}
                  </div>
                </div>
              )}

              {/* Price Chart */}
              {(product as any).priceChartImage && (
                <div className="w-full">
                  <Image src={(product as any).priceChartImage} alt="Bảng Giá" width={1200} height={1200} className="w-full h-auto rounded-xl" />
                </div>
              )}
            </div>
          )}

          {/* Contact Box (Magazine Style CTA) */}
          <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-2xl text-center shadow-sm">
            <h3 className="font-serif text-2xl text-brand-dark mb-4">Sở Hữu Sản Phẩm Này</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-md mx-auto">
              Sản phẩm hiện đang có sẵn để đặt hàng. Vui lòng liên hệ với chuyên viên tư vấn của chúng tôi để biết thêm chi tiết và phương thức sở hữu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:0982595594" className="flex items-center justify-center gap-3 bg-brand-dark text-white px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors rounded">
                <Phone size={16} /> Gọi Tư Vấn
              </a>
              <a href="https://zalo.me/0982595594" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 border border-brand-dark text-brand-dark px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors rounded">
                <MessageCircle size={16} /> Nhắn Tin Zalo
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles / Products */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-32 pt-20 border-t border-gray-200">
          <div className="flex items-center justify-between border-b-2 border-brand-dark pb-4 mb-10">
            <h2 className="font-serif text-2xl tracking-widest uppercase text-brand-dark">
              Tin Tức Liên Quan
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {related.slice(0, 3).map(p => (
              <ProductCard key={p.id} product={p as any} layout="grid" />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
