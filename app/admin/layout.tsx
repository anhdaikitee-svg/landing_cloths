import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { LayoutDashboard, Tags, Package, LogOut, Home, Settings } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="font-serif text-xl tracking-widest font-bold">ADMIN PANEL</h2>
          <p className="text-gray-400 text-xs mt-1">L&apos;Art de Vivre</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors text-sm">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors text-sm">
            <Tags size={18} /> Danh Mục
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors text-sm">
            <Package size={18} /> Sản Phẩm
          </Link>
          <Link href="/admin/about" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors text-sm">
            <Tags size={18} /> Giới Thiệu
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors text-sm">
            <Settings size={18} /> Cài Đặt Web
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm text-gray-300">
            <Home size={18} /> Về Trang Chủ
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
