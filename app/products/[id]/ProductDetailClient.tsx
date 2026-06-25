'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, MessageCircle } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'

interface Color { id: string; name: string; hex: string; images: string[]; stock: number }
interface Product {
  id: string; name: string; slug: string; description: string | null
  images: string[]; colors: Color[]; price: number
  category: { name: string; slug: string }
}
interface RelatedProduct {
  id: string; name: string; slug: string; images: string[]
  category: { name: string; slug: string }
}

export default function ProductDetailClient({ product, related }: { product: Product; related: RelatedProduct[] }) {
  const displayImages = product.images

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
            <span>|</span>
            {product.price !== undefined && (
               <span className="font-bold text-brand-dark text-lg">{new Intl.NumberFormat('vi-VN').format(product.price)}đ</span>
            )}
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-square w-full max-w-2xl mx-auto bg-[#f8f9fa] rounded-2xl overflow-hidden shadow-sm mb-16">
          {displayImages[0] ? (
            <Image src={displayImages[0]} alt={product.name} fill className="object-cover" priority sizes="100vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif text-gray-400 italic">Chưa có ảnh</div>
          )}
        </div>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto">
          {/* Intro line */}
          <p className="font-serif text-xl md:text-2xl text-brand-dark leading-relaxed italic text-center mb-12">
            "Sự giao thoa hoàn hảo giữa tính thủ công truyền thống và hơi thở đương đại, tạo nên một tác phẩm nghệ thuật có thể mặc được mỗi ngày."
          </p>

          <div className="prose prose-lg text-gray-600 font-sans leading-loose mb-16 whitespace-pre-line">
            {product.description || 'Chi tiết sản phẩm đang được cập nhật.'}
          </div>

          {/* Secondary Images Gallery (if any) */}
          {displayImages.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
              {displayImages.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm bg-gray-100">
                  <Image src={img} alt={`${product.name} detail ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
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
              <a href="tel:0901234567" className="flex items-center justify-center gap-3 bg-brand-dark text-white px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors rounded">
                <Phone size={16} /> Gọi Tư Vấn
              </a>
              <a href="#" className="flex items-center justify-center gap-3 border border-brand-dark text-brand-dark px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors rounded">
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
