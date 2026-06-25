import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'popular'
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = { isActive: true }

  if (category) {
    where.category = { slug: category }
  }

  if (search) {
    where.name = { contains: search, mode: 'insensitive' }
  }

  if (minPrice || maxPrice) {
    where.salePrice = {}
    if (minPrice) (where.salePrice as Record<string, number>).gte = parseFloat(minPrice)
    if (maxPrice) (where.salePrice as Record<string, number>).lte = parseFloat(maxPrice)
  }

  const orderBy: Record<string, string> =
    sort === 'newest'
      ? { createdAt: 'desc' }
      : sort === 'price-asc'
      ? { salePrice: 'asc' }
      : sort === 'price-desc'
      ? { salePrice: 'desc' }
      : sort === 'rating'
      ? { rating: 'desc' }
      : { soldCount: 'desc' } // popular

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}
