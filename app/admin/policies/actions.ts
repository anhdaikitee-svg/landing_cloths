'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2 } from '@/lib/s3'


async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
}

export async function updatePoliciesContent(formData: FormData) {
  await checkAdmin()

  // Helper to save file to Cloudflare R2
  const saveFile = async (file: File) => {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `policies/${uniqueSuffix}.${ext}`
    
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
      console.error('R2 upload error:', error)
      return ''
    }
  }

  const sectionIdsStr = formData.get('sectionIds') as string
  const sectionIds = sectionIdsStr ? sectionIdsStr.split(',') : []

  const sections = []

  for (const id of sectionIds) {
    if (!id.trim()) continue
    
    const title = formData.get(`title_${id}`) as string
    const content = formData.get(`content_${id}`) as string
    const existingImage = formData.get(`existingImage_${id}`) as string
    const imageFile = formData.get(`imageFile_${id}`) as File | null

    let finalImage = existingImage || ''
    if (imageFile && imageFile.size > 0) {
      finalImage = await saveFile(imageFile)
    }

    sections.push({
      id,
      title,
      content,
      image: finalImage
    })
  }

  const data = { 
    sections 
  }

  const jsonValue = JSON.stringify(data)

  await prisma.siteSetting.upsert({
    where: { key: 'page_policies' },
    update: { value: jsonValue },
    create: { key: 'page_policies', value: jsonValue }
  })

  revalidatePath('/policies')
  revalidatePath('/admin/policies')
}
