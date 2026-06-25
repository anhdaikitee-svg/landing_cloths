import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: { name: true, description: true, images: true },
  })
  if (!product) return {}
  return {
    title: `${product.name} | L'Art de Vivre`,
    description: product.description ?? undefined,
    openGraph: { images: product.images[0] ? [product.images[0]] : [] },
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id, isActive: true },
    include: {
      category: true,
      colors: { orderBy: { name: 'asc' } },
      reviews: {
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!product) notFound()

  // Related products
  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
    take: 6,
    include: { category: { select: { name: true, slug: true } }, colors: { take: 1 } },
    orderBy: { soldCount: 'desc' },
  })

  return <ProductDetailClient product={product as Parameters<typeof ProductDetailClient>[0]['product']} related={related as Parameters<typeof ProductDetailClient>[0]['related']} />
}
