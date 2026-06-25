'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, Menu, X, MapPin, User as UserIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

const NAV_CATEGORIES = [
  { label: 'TẤT CẢ', href: '/products' },
  { label: 'ÁO', href: '/products?category=ao' },
  { label: 'QUẦN', href: '/products?category=quan' },
  { label: 'MŨ', href: '/products?category=mu' },
  { label: 'TẤT', href: '/products?category=tat' },
  { label: 'PHỤ KIỆN', href: '/products?category=phu-kien' },
  { label: 'VỀ CHÚNG TÔI', href: '/about' },
]

export default function Header({ session }: { session?: any }) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (pathname?.startsWith('/admin')) {
    return null
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-brand-dark"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex-1 md:flex-none text-center md:text-left">
          <span className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-brand-dark">
            L&apos;ART DE VIVRE
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="text-xs font-medium tracking-widest text-brand-dark hover:text-brand-gold transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        {/* Icons (Search, Stores) */}
        <div className="flex items-center gap-5 text-brand-dark">
          <button 
            onClick={() => setSearchOpen(!searchOpen)} 
            className="hover:text-brand-gold transition-colors"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button className="hidden sm:block hover:text-brand-gold transition-colors" title="Hệ thống cửa hàng">
            <MapPin size={20} strokeWidth={1.5} />
          </button>
          {session ? (
            <Link href={session.user.role === 'ADMIN' ? '/admin' : '/products'} className="hover:text-brand-gold transition-colors" title="Tài khoản">
              <UserIcon size={20} strokeWidth={1.5} />
            </Link>
          ) : (
            <Link href="/auth/login" className="hover:text-brand-gold transition-colors" title="Đăng nhập">
              <UserIcon size={20} strokeWidth={1.5} />
            </Link>
          )}
        </div>
      </div>

      {/* Search Overlay Dropdown */}
      <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white border-t border-gray-100 py-4 px-6 md:px-12">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex border-b border-gray-300 pb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bộ sưu tập, sản phẩm..."
              className="flex-1 bg-transparent outline-none text-sm font-serif italic text-brand-dark placeholder:text-gray-400"
              autoFocus={searchOpen}
            />
            <button type="submit" className="text-brand-dark hover:text-brand-gold">
              <Search size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full h-screen bg-white z-40 p-6 flex flex-col gap-6">
          <nav className="flex flex-col gap-6 items-center pt-10">
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-serif tracking-widest text-brand-dark hover:text-brand-gold"
              >
                {cat.label}
              </Link>
            ))}
            <div className="h-px w-12 bg-gray-200 my-4" />
            <Link href="#" className="flex items-center gap-2 text-sm tracking-wide text-gray-500">
              <MapPin size={16} /> HỆ THỐNG CỬA HÀNG
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
