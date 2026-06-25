'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2 } from '@/lib/s3'
import { slugify } from '@/lib/utils'

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
}

async function uploadToR2(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `products/${uniqueSuffix}.${ext}`

  const { R2_BUCKET_NAME, R2_PUBLIC_URL } = process.env

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: file.type || 'image/jpeg',
  })

  try {
    await r2.send(command)
    return `${R2_PUBLIC_URL}/${filename}`
  } catch (error) {
    console.error('R2 upload error:', error)
    return null
  }
}

// -- CATEGORIES --

export async function createCategory(formData: FormData) {
  await checkAdmin()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string || slugify(name)
  await prisma.category.create({
    data: { name, slug }
  })
  revalidatePath('/admin/categories')
}

export async function deleteCategory(id: string) {
  await checkAdmin()
  await prisma.category.delete({ where: { id } })
  revalidatePath('/admin/categories')
}

// -- PRODUCTS --

export async function createProduct(formData: FormData) {
  await checkAdmin()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string || slugify(name)
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string) || 0
  const categoryId = formData.get('categoryId') as string
  
  // Handle file uploads
  const imageFiles = formData.getAll('images') as File[]
  const imageUrls: string[] = []

  if (imageFiles && imageFiles.length > 0) {
    for (const file of imageFiles) {
      const url = await uploadToR2(file)
      if (url) imageUrls.push(url)
    }
  }

  const sizeChartFile = formData.get('sizeChartImage') as File
  const sizeChartImage = await uploadToR2(sizeChartFile)

  const priceChartFile = formData.get('priceChartImage') as File
  const priceChartImage = await uploadToR2(priceChartFile)

  const embroideryNote = formData.get('embroideryNote') as string

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      categoryId,
      images: imageUrls,
      sizeChartImage,
      priceChartImage,
      embroideryNote,
      isActive: true,
    }
  })
  revalidatePath('/admin/products')
  revalidatePath('/products')
}

export async function deleteProduct(id: string) {
  await checkAdmin()
  await prisma.product.delete({ where: { id } })
  revalidatePath('/admin/products')
  revalidatePath('/products')
}

// -- UPDATE CATEGORY --
export async function updateCategory(id: string, formData: FormData) {
  await checkAdmin()
  const name = formData.get('name') as string
  await prisma.category.update({
    where: { id },
    data: { name }
  })
  revalidatePath('/admin/categories')
}

// -- UPDATE PRODUCT --
export async function updateProduct(id: string, formData: FormData) {
  await checkAdmin()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string) || 0
  const categoryId = formData.get('categoryId') as string
  
  // Handle new file uploads
  const imageFiles = formData.getAll('images') as File[]
  const imageUrls: string[] = []

  if (imageFiles && imageFiles.length > 0) {
    for (const file of imageFiles) {
      const url = await uploadToR2(file)
      if (url) imageUrls.push(url)
    }
  }

  const embroideryNote = formData.get('embroideryNote') as string

  const updateData: any = {
    name,
    description,
    price,
    categoryId,
    embroideryNote,
  }

  const sizeChartFile = formData.get('sizeChartImage') as File
  const sizeChartImage = await uploadToR2(sizeChartFile)
  if (sizeChartImage) {
    updateData.sizeChartImage = sizeChartImage
  }

  const priceChartFile = formData.get('priceChartImage') as File
  const priceChartImage = await uploadToR2(priceChartFile)
  if (priceChartImage) {
    updateData.priceChartImage = priceChartImage
  }
  
  // Only update images if new ones are uploaded
  if (imageUrls.length > 0) {
    updateData.images = imageUrls
    // Clear mock images from associated colors to prevent them from showing up alongside new images
    updateData.colors = {
      updateMany: {
        where: {},
        data: { images: [] }
      }
    }
  }

  await prisma.product.update({
    where: { id },
    data: updateData
  })
  
  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath(`/products/${id}`)
}
