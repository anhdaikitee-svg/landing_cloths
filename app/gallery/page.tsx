import { prisma } from '@/lib/prisma'
import GalleryClient from './GalleryClient'

export const metadata = {
  title: 'Ảnh Sản Phẩm Thực Tế | WIN WIN',
  description: 'Hình ảnh thực tế sản phẩm từ khách hàng và đội ngũ sản xuất WIN WIN.',
}

export default async function GalleryPage() {
  let photos: any[] = []
  try {
    photos = await prisma.galleryPhoto.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch {}

  return (
    <GalleryClient
      photos={photos.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString()
      }))}
    />
  )
}
