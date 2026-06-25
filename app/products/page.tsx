'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/product/ProductCard'

interface Product {
  id: string; name: string; images: string[]; category: { name: string; slug: string }
}
interface Pagination { total: number; page: number; limit: number; totalPages: number }

const CATEGORIES = [
  { label: 'Tất Cả', value: '' },
  { label: 'Áo', value: 'ao' },
  { label: 'Quần', value: 'quan' },
  { label: 'Mũ', value: 'mu' },
  { label: 'Tất', value: 'tat' },
  { label: 'Phụ Kiện', value: 'phu-kien' },
]

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1')

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value); else params.delete(key)
    if (key !== 'page') params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search) params.set('search', search)
    if (page > 1) params.set('page', page.toString())

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then(({ products, pagination }) => {
        setProducts(products)
        setPagination(pagination)
      })
      .finally(() => setLoading(false))
  }, [category, search, page])

  return (
    <div className="bg-brand-light min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Title */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-3xl md:text-5xl text-brand-dark tracking-widest uppercase mb-4">
            {category ? CATEGORIES.find(c => c.value === category)?.label : 'TẤT CẢ SẢN PHẨM'}
          </h1>
          <div className="w-12 h-px bg-brand-gold mx-auto" />
        </div>



        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col max-w-5xl mx-auto gap-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-8 w-full">
                 <div className="w-full md:w-[40%] aspect-[4/3] bg-gray-200 animate-pulse rounded-xl" />
                 <div className="flex-1 space-y-4 py-4">
                    <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
                    <div className="w-3/4 h-8 bg-gray-200 animate-pulse rounded" />
                    <div className="w-full h-16 bg-gray-200 animate-pulse rounded mt-4" />
                 </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-serif italic text-xl text-gray-400">Không tìm thấy bài viết nào.</p>
          </div>
        ) : (
          <div className="flex flex-col max-w-5xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} layout="list" />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-24">
            <button
              onClick={() => updateParam('page', String(page - 1))}
              disabled={page <= 1}
              className="px-6 py-3 border border-gray-300 text-xs tracking-widest uppercase disabled:opacity-30 hover:border-brand-dark transition-colors"
            >
              TRƯỚC
            </button>
            <button
              onClick={() => updateParam('page', String(page + 1))}
              disabled={page >= pagination.totalPages}
              className="px-6 py-3 border border-gray-300 text-xs tracking-widest uppercase disabled:opacity-30 hover:border-brand-dark transition-colors"
            >
              TIẾP
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-light" />}>
      <ProductsContent />
    </Suspense>
  )
}
