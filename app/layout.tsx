import type { Metadata } from 'next'
import { Outfit, Lora } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import FloatingContact from '@/components/layout/FloatingContact'

const outfit = Outfit({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter', // keep the variable name same to avoid changing tailwind config
})

const lora = Lora({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-playfair', // keep the variable name same to avoid changing tailwind config
})

export const metadata: Metadata = {
  title: "L'Art de Vivre - Bộ Sưu Tập Thời Trang",
  description: 'Khám phá các bộ sưu tập thời trang cao cấp mang đậm di sản nghệ thuật.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="vi">
      <body className={`${outfit.variable} ${lora.variable} font-sans bg-brand-light text-brand-dark antialiased`}>
        <Header session={session} />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  )
}
