import { prisma } from '@/lib/prisma'
import { updateProduct } from '../../actions'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import EditProductForm from './EditProductForm'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ])

  if (!product) {
    notFound()
  }

  const updateAction = async (formData: FormData) => {
    'use server'
    await updateProduct(product.id, formData)
    redirect('/admin/products')
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-gray-500 hover:text-brand-dark">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Sửa Sản Phẩm</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <EditProductForm product={product} categories={categories} updateAction={updateAction} />
      </div>
    </div>
  )
}
