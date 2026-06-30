import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminGalleryClient from './AdminGalleryClient'

export const metadata = { title: 'Quản Lý Ảnh Thực Tế | Admin' }

export default async function AdminGalleryPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') redirect('/auth/login')

  const photos = await prisma.galleryPhoto.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return <AdminGalleryClient photos={photos} />
}
