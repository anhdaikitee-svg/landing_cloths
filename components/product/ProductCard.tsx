'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  slug: string
  images: string[]
  description?: string | null
  price?: number
  category?: { name: string; slug: string }
  createdAt?: Date
}

export default function ProductCard({ product, layout = 'grid' }: { product: Product, layout?: 'grid' | 'list' | 'hero' }) {
  
  if (layout === 'hero') {
    return (
      <Link href={`/products/${product.id}`} className="group relative block w-full aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-2xl mb-12 shadow-sm">
        {product.images[0] ? (
           <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" priority />
        ) : (
           <div className="w-full h-full bg-gray-200"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-4xl">
           {product.category && (
             <span className="inline-block bg-brand-gold text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-sm mb-4">
               {product.category.name}
             </span>
           )}
           <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-4 group-hover:text-brand-gold transition-colors">
             {product.name}
           </h2>
           <p className="text-gray-300 line-clamp-2 md:text-lg mb-6 font-sans hidden md:block">
             {product.description || 'Khám phá chi tiết tác phẩm độc bản với phong cách hiện đại.'}
           </p>
           <div className="flex items-center gap-4 text-white text-sm font-sans">
             <span className="uppercase tracking-widest text-xs font-medium hover:text-brand-gold transition-colors">Đọc Tiếp →</span>
           </div>
        </div>
      </Link>
    )
  }

  if (layout === 'list') {
    return (
      <Link href={`/products/${product.id}`} className="group flex flex-col md:flex-row gap-6 md:gap-8 mb-10 border-b border-gray-100 pb-10">
        <div className="relative w-full md:w-[40%] aspect-[4/3] rounded-xl overflow-hidden shrink-0 bg-gray-100 shadow-sm">
           {product.images[0] && (
             <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
           )}
        </div>
        <div className="flex flex-col justify-center flex-1">
          {product.category && (
            <p className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-3">
              {product.category.name}
            </p>
          )}
          <h3 className="text-2xl md:text-3xl font-serif text-brand-dark mb-4 leading-snug group-hover:text-brand-gold transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 line-clamp-3 mb-6 leading-relaxed">
            {product.description || 'Chi tiết sản phẩm đang được cập nhật. Nhấn để xem thêm thông tin và hình ảnh thực tế của sản phẩm.'}
          </p>
          <div className="mt-auto flex items-center justify-between">

            <span className="text-xs uppercase tracking-widest text-gray-400 font-medium group-hover:text-brand-gold transition-colors">Đọc Tiếp</span>
          </div>
        </div>
      </Link>
    )
  }

  // default grid layout (news grid)
  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 rounded-xl mb-5 shadow-sm">
        {product.images[0] ? (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-serif italic">Chưa có ảnh</div>
        )}
        {product.category && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark">
              {product.category.name}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <h3 className="font-serif text-xl text-brand-dark leading-snug line-clamp-2 group-hover:text-brand-gold transition-colors mb-3">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed flex-1">
          {product.description || 'Chi tiết sản phẩm đang được cập nhật...'}
        </p>
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">

          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400 group-hover:text-brand-gold transition-colors">
            Chi Tiết
          </span>
        </div>
      </div>
    </Link>
  )
}
