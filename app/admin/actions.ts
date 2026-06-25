'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { slugify } from '@/lib/utils'

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized')
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
      if (file.size === 0) continue
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `products/${uniqueSuffix}.${ext}`

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filename, buffer, {
          contentType: file.type || 'image/jpeg',
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Supabase upload error:', error)
        continue
      }

      const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(filename)
      imageUrls.push(publicUrlData.publicUrl)
    }
  }

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      categoryId,
      images: imageUrls,
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
      if (file.size === 0) continue
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `products/${uniqueSuffix}.${ext}`

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filename, buffer, {
          contentType: file.type || 'image/jpeg',
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Supabase upload error:', error)
        continue
      }

      const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(filename)
      imageUrls.push(publicUrlData.publicUrl)
    }
  }

  const updateData: any = {
    name,
    description,
    price,
    categoryId,
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
