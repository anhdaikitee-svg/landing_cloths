'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { r2 } from '@/lib/s3'
import { slugify } from '@/lib/utils'

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
}

async function uploadToR2(file: File, folder: string = 'products'): Promise<string | null> {
  if (!file || file.size === 0) return null
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${folder}/${uniqueSuffix}.${ext}`

  try {
    const { R2_BUCKET_NAME, R2_PUBLIC_URL } = process.env
    if (!R2_BUCKET_NAME) throw new Error("R2_BUCKET_NAME is not defined")

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: file.type || 'image/jpeg',
    })

    await r2.send(command)
    return `${R2_PUBLIC_URL}/${filename}`
  } catch (error) {
    console.error('Lỗi upload file:', error)
    return null
  }
}

async function deleteFromR2(url: string) {
  if (!url) return
  const { R2_BUCKET_NAME, R2_PUBLIC_URL } = process.env
  if (!R2_PUBLIC_URL || !url.startsWith(R2_PUBLIC_URL)) return

  const key = url.replace(`${R2_PUBLIC_URL}/`, '')

  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  })

  try {
    await r2.send(command)
  } catch (error) {
    console.error('R2 delete error:', error)
  }
}

// -- CATEGORIES --

export async function createCategory(formData: FormData) {
  await checkAdmin()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string || slugify(name)
  const parentId = formData.get('parentId') as string || null
  await prisma.category.create({
    data: { name, slug, parentId }
  })
  revalidatePath('/admin/categories')
  revalidatePath('/', 'layout')
}

export async function deleteCategory(id: string) {
  await checkAdmin()
  await prisma.category.delete({ where: { id } })
  revalidatePath('/admin/categories')
  revalidatePath('/', 'layout')
}

// -- PRODUCTS --

export async function createProduct(formData: FormData) {
  await checkAdmin()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string || slugify(name)
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string) || 0
  const categoryId = formData.get('categoryId') as string
  const isFeatured = formData.get('isFeatured') === 'on'

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

  // Handle real photos uploads
  const realPhotoFiles = formData.getAll('realPhotos') as File[]
  const realPhotoUrls: string[] = []
  if (realPhotoFiles && realPhotoFiles.length > 0) {
    for (const file of realPhotoFiles) {
      const url = await uploadToR2(file, 'real-photos')
      if (url) realPhotoUrls.push(url)
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
      sizeChartImage,
      priceChartImage,
      embroideryNote,
      isFeatured,
      realPhotos: realPhotoUrls,
      isActive: true,
    }
  })
  revalidatePath('/admin/products')
  revalidatePath('/products')
}

export async function deleteProduct(id: string) {
  try {
    await checkAdmin()

    const product = await prisma.product.findUnique({
      where: { id },
      select: { images: true, sizeChartImage: true, priceChartImage: true }
    })

    if (product) {
      for (const img of product.images) {
        await deleteFromR2(img)
      }
      if (product.sizeChartImage) await deleteFromR2(product.sizeChartImage)
      if (product.priceChartImage) await deleteFromR2(product.priceChartImage)

      // Delete related records manually to bypass missing onDelete: Cascade
      await prisma.$transaction([
        prisma.cartItem.deleteMany({ where: { productId: id } }),
        prisma.orderItem.deleteMany({ where: { productId: id } }),
        prisma.review.deleteMany({ where: { productId: id } }),
        prisma.productColor.deleteMany({ where: { productId: id } }),
        prisma.product.delete({ where: { id } })
      ])
    }

    revalidatePath('/admin/products')
    revalidatePath('/products')
  } catch (error) {
    console.error("Failed to delete product:", error)
    throw error
  }
}

// -- UPDATE CATEGORY --
export async function updateCategory(id: string, formData: FormData) {
  await checkAdmin()
  const name = formData.get('name') as string
  const parentId = formData.get('parentId') as string || null
  await prisma.category.update({
    where: { id },
    data: { name, parentId }
  })
  revalidatePath('/admin/categories')
  revalidatePath('/', 'layout')
}

// -- UPDATE PRODUCT --
export async function updateProduct(id: string, formData: FormData) {
  await checkAdmin()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string) || 0
  const categoryId = formData.get('categoryId') as string
  const isFeatured = formData.get('isFeatured') === 'on'

  // Get existing images from form
  const existingImagesJson = formData.get('existingImagesJson') as string
  let images: string[] = []
  if (existingImagesJson) {
    images = JSON.parse(existingImagesJson)
  }

  // Handle new file uploads
  const imageFiles = formData.getAll('images') as File[]
  const newImageUrls: string[] = []

  if (imageFiles && imageFiles.length > 0) {
    for (const file of imageFiles) {
      const url = await uploadToR2(file)
      if (url) newImageUrls.push(url)
    }
  }

  const finalImages = [...images, ...newImageUrls]

  const embroideryNote = formData.get('embroideryNote') as string

  const updateData: any = {
    name,
    description,
    price,
    categoryId,
    embroideryNote,
    isFeatured,
    images: finalImages,
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

  if (newImageUrls.length > 0) {
    // Clear mock images from associated colors to prevent them from showing up alongside new images
    updateData.colors = {
      updateMany: {
        where: {},
        data: { images: [] }
      }
    }
  }

  // Handle real photos for update
  const existingRealPhotosJson = formData.get('existingRealPhotosJson') as string
  let realPhotos: string[] = []
  if (existingRealPhotosJson) {
    realPhotos = JSON.parse(existingRealPhotosJson)
  }
  const realPhotoFiles = formData.getAll('realPhotos') as File[]
  for (const file of realPhotoFiles) {
    const url = await uploadToR2(file, 'real-photos')
    if (url) realPhotos.push(url)
  }
  updateData.realPhotos = realPhotos

  await prisma.product.update({
    where: { id },
    data: updateData
  })

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath(`/products/${id}`)
}
// -- SETTINGS --
export async function updateSettings(formData: FormData) {
  await checkAdmin()
  const siteName = formData.get('site_name') as string
  const logoFile = formData.get('site_logo') as File | null

  if (siteName) {
    await prisma.siteSetting.upsert({
      where: { key: 'site_name' },
      update: { value: siteName },
      create: { key: 'site_name', value: siteName }
    })
  }

  if (logoFile && logoFile.size > 0) {
    const logoUrl = await uploadToR2(logoFile, 'settings')
    if (logoUrl) {
      await prisma.siteSetting.upsert({
        where: { key: 'site_logo' },
        update: { value: logoUrl },
        create: { key: 'site_logo', value: logoUrl }
      })
    }
  }

  revalidatePath('/', 'layout')
}

// -- GALLERY PHOTOS --
export async function uploadGalleryPhotos(formData: FormData) {
  await checkAdmin()
  const files = formData.getAll('photos') as File[]
  const captions = formData.getAll('caption') as string[]

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const url = await uploadToR2(file, 'gallery')
    if (url) {
      await prisma.galleryPhoto.create({
        data: { url, caption: captions[i] || null }
      })
    }
  }
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
}

export async function deleteGalleryPhoto(id: string) {
  await checkAdmin()
  const photo = await prisma.galleryPhoto.findUnique({ where: { id } })
  if (photo) {
    // Delete from R2
    try {
      const key = new URL(photo.url).pathname.replace(/^\//, '')
      await r2.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME!, Key: key }))
    } catch {}
    await prisma.galleryPhoto.delete({ where: { id } })
  }
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
}
