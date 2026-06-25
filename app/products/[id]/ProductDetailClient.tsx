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
}
interface RelatedProduct {
  id: string; name: string; images: string[]
  category: { name: string; slug: string }
}

export default function ProductDetailClient({ product, related }: { product: Product; related: RelatedProduct[] }) {
  const displayImages = product.images
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  return (
    <div className="bg-brand-light min-h-screen pt-24 pb-32">
      <article className="max-w-5xl mx-auto px-6 md:px-12">
        
        {/* Article Header */}
        <header className="text-center mb-12">
          <Link href={`/products?category=${product.category.slug}`} className="inline-block bg-brand-gold text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-sm mb-6 hover:bg-brand-dark transition-colors">
            {product.category.name}
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-dark tracking-wide mb-6 leading-tight">
            {product.name}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-500 font-sans text-sm">
            <span>Viết bởi <span className="font-bold text-brand-dark">Ban Biên Tập</span></span>
          </div>
        </header>

        {/* Hero Image Slider */}
        <div className="relative aspect-square w-full max-w-3xl mx-auto bg-[#f8f9fa] rounded-2xl overflow-hidden shadow-sm mb-16 group">
          {displayImages.length > 0 ? (
            <>
              <Image 
                src={displayImages[currentImageIndex]} 
                alt={`${product.name} - ${currentImageIndex + 1}`} 
                fill 
                className="object-cover transition-opacity duration-300" 
                priority 
                sizes="100vw" 
              />
              {displayImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur text-brand-dark rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur text-brand-dark rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                  >
                    <ChevronRight size={24} />
                  </button>
                  
                  {/* Dots indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
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
                className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all snap-center ${
                  idx === currentImageIndex ? 'border-brand-dark shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" sizes="96px" />
              </button>
            ))}
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-3xl mx-auto">
          {/* Intro line */}
          <p className="font-serif text-xl md:text-2xl text-brand-dark leading-relaxed italic text-center mb-12">
            "Sự giao thoa hoàn hảo giữa tính thủ công truyền thống và hơi thở đương đại, tạo nên một tác phẩm nghệ thuật có thể mặc được mỗi ngày."
          </p>

          <div className="prose prose-lg text-gray-600 font-sans leading-loose mb-16 whitespace-pre-line">
            {product.description || 'Chi tiết sản phẩm đang được cập nhật.'}
          </div>

          {/* Size & Price Charts Section */}
          {((product as any).sizeChartImage || (product as any).priceChartImage || (product as any).embroideryNote) && (
            <div className="my-24 space-y-12">
              {/* Size Chart */}
              {(product as any).sizeChartImage && (
                <div className="relative w-full aspect-[4/3] sm:aspect-[2/1] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center shadow-inner">
                  <Image src={(product as any).sizeChartImage} alt="Bảng Size" fill className="object-contain" />
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
                <div className="relative w-full aspect-[4/3] sm:aspect-[2/1] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center shadow-inner">
                  <Image src={(product as any).priceChartImage} alt="Bảng Giá" fill className="object-contain" />
                </div>
              )}
            </div>
          )}

          {/* Contact Box (Magazine Style CTA) */}
          <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-2xl text-center shadow-sm">
            <h3 className="font-serif text-2xl text-brand-dark mb-4">Sở Hữu Tác Phẩm Này</h3>
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
