'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return (
    <footer className="bg-brand-dark text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand Info */}
          <div className="md:col-span-5">
            <h2 className="font-serif text-2xl font-bold tracking-widest text-white mb-6">L&apos;ART DE VIVRE</h2>
            <p className="text-sm leading-relaxed text-gray-400 font-serif italic mb-8 max-w-sm">
              Nghệ thuật sống tinh tế qua từng đường kim mũi chỉ. Tôn vinh di sản Việt Nam qua lăng kính thời trang đương đại.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors text-sm uppercase tracking-wider">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors text-sm uppercase tracking-wider">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors text-sm uppercase tracking-wider">Pinterest</a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-6">Khám Phá</h4>
            <ul className="space-y-4 text-sm tracking-wide">
              <li><Link href="/products" className="hover:text-brand-gold transition-colors">Bộ Sưu Tập</Link></li>
              <li><Link href="/products?category=ao" className="hover:text-brand-gold transition-colors">Thiết Kế Nam</Link></li>
              <li><Link href="/products?category=quan" className="hover:text-brand-gold transition-colors">Thiết Kế Nữ</Link></li>
              <li><Link href="/products?category=phu-kien" className="hover:text-brand-gold transition-colors">Phụ Kiện</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">Lookbook Thu/Đông 2024</Link></li>
            </ul>
          </div>

          {/* Boutique */}
          <div className="md:col-span-4">
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-6">Boutique</h4>
            <ul className="space-y-4 text-sm tracking-wide text-gray-400">
              <li>
                <strong className="block text-white font-normal mb-1">Flagship Store HCMC</strong>
                123 Rue de la Paix, Quận 1, TP.HCM
              </li>
              <li>
                <strong className="block text-white font-normal mb-1">Hanoi Boutique</strong>
                45 Tràng Tiền, Hoàn Kiếm, Hà Nội
              </li>
              <li className="pt-4">
                Tư vấn & Đặt lịch hẹn:
                <a href="tel:0982595594" className="block text-white mt-1 hover:text-brand-gold transition-colors">0982.595.594</a>
              </li>
              <li>
                Email hỗ trợ:
                <a href="mailto:huubang0@gmail.com" className="block text-white mt-1 hover:text-brand-gold transition-colors">huubang0@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest text-gray-500">
          <p>© 2024 L&apos;ART DE VIVRE. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">CHÍNH SÁCH</a>
            <a href="#" className="hover:text-white transition-colors">BẢO MẬT</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
