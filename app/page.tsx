import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'

async function getHomeData() {
  try {
    const [featuredProducts, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        take: 10,
        include: { category: { select: { name: true, slug: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.category.findMany({ where: { parentId: null }, take: 4 }),
    ])
    return { featuredProducts, categories }
  } catch (error) {
    console.error("Failed to fetch home data", error)
    return { featuredProducts: [], categories: [] }
  }
}

export default async function HomePage() {
  const { featuredProducts } = await getHomeData()

  const heroProduct = featuredProducts[0]
  const gridProducts = featuredProducts.slice(1, 4)
  const listProducts = featuredProducts.slice(4)

  return (
    <div className="bg-brand-light min-h-screen pt-24 pb-32">
      
      {/* Header Style Magazine */}
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h1 className="font-serif text-5xl md:text-7xl text-brand-dark tracking-tighter mb-4">
          WIN - WIN
        </h1>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          EMBROIDERY
        </p>
        <div className="w-full h-px bg-brand-dark mt-10 mb-2 opacity-20" />
        <div className="w-full h-[2px] bg-brand-dark opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Hero Section */}
        {heroProduct && (
          <section className="mb-16">
            <ProductCard product={heroProduct} layout="hero" />
          </section>
        )}

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Main Content (List) */}
          <div className="lg:w-2/3">
            <div className="flex items-center justify-between border-b-2 border-brand-dark pb-4 mb-10">
              <h2 className="font-serif text-2xl tracking-widest uppercase text-brand-dark">
                Tin Tức Mới Nhất
              </h2>
            </div>
            
            <div className="flex flex-col">
              {listProducts.map((product) => (
                <ProductCard key={product.id} product={product} layout="list" />
              ))}
              
              {listProducts.length === 0 && (
                <p className="text-gray-500 italic font-serif">Đang cập nhật thêm bài viết...</p>
              )}
            </div>

          </div>

          {/* Sidebar (Grid Focus) */}
          <div className="lg:w-1/3">
            <div className="flex items-center justify-between border-b-2 border-brand-dark pb-4 mb-10">
              <h2 className="font-serif text-2xl tracking-widest uppercase text-brand-dark">
                Lựa Chọn Nổi Bật
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-10">
              {gridProducts.map((product) => (
                <ProductCard key={product.id} product={product} layout="grid" />
              ))}
            </div>

            {/* Newsletter Block */}
            <div className="mt-16 bg-gray-50 p-8 rounded-xl border border-gray-100 text-center">
              <h3 className="font-serif text-2xl text-brand-dark mb-4">Nhận Bản Tin</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Đăng ký để nhận những câu chuyện và bộ sưu tập mới nhất từ WIN WIN.
              </p>
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                className="w-full border border-gray-200 px-4 py-3 rounded mb-4 text-sm focus:outline-none focus:border-brand-gold"
              />
              <button className="w-full bg-brand-dark text-white uppercase tracking-widest text-xs py-4 hover:bg-brand-gold transition-colors">
                Đăng Ký
              </button>
            </div>
          </div>

        </div>

        {/* Centered CTA */}
        {listProducts.length > 0 && (
           <div className="text-center mt-20 pt-8 border-t border-gray-100">
             <Link
               href="/products"
               className="inline-block border border-brand-dark text-brand-dark px-12 py-4 text-xs tracking-[0.2em] uppercase hover:bg-brand-dark hover:text-white transition-all duration-300"
             >
               Xem Thêm Bộ Sưu Tập
             </Link>
           </div>
        )}

      </div>
    </div>
  )
}
