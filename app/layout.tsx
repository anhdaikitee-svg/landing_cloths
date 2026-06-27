import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
 
import FloatingContact from '@/components/layout/FloatingContact'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: "WIN - WIN EMBROIDERY",
  description: '',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  
  let settings: { key: string, value: string }[] = []
  try {
    settings = await prisma.siteSetting.findMany()
  } catch (error) {
    console.error("Failed to fetch settings", error)
  }
  
  const siteName = settings.find(s => s.key === 'site_name')?.value || "WIN WIN"
  const siteLogo = settings.find(s => s.key === 'site_logo')?.value || ""

  let categories: any[] = []
  try {
    categories = await prisma.category.findMany({
      where: { parentId: null },
      include: { children: true }
    })
  } catch (error) {
    console.error("Failed to fetch categories", error)
  }

  return (
    <html lang="vi">
      <body className="font-sans bg-brand-light text-brand-dark antialiased">
        <Header session={session} siteName={siteName} siteLogo={siteLogo} categories={categories} />
        <main className="min-h-screen">{children}</main>
        <Footer siteName={siteName} siteLogo={siteLogo} />
        <FloatingContact />
      </body>
    </html>
  )
}
