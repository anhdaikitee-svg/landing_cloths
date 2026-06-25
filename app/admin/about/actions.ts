'use server'

import { writeFile } from 'fs/promises'
import { join } from 'path'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
}

export async function updateAboutContent(formData: FormData) {
  await checkAdmin()

  // Helper to save file to Supabase
  const saveFile = async (file: File) => {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `about/${uniqueSuffix}.${ext}`
    
    const { supabase } = await import('@/lib/supabase')

    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filename, buffer, {
        contentType: file.type || 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return ''
    }

    const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(filename)
    return publicUrlData.publicUrl
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

  const data = { sections }

  const filePath = join(process.cwd(), 'data/about.json')
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')

  revalidatePath('/about')
  revalidatePath('/admin/about')
}
