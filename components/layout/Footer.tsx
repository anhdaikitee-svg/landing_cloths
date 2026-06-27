'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Mail } from 'lucide-react'

export default function Footer({ siteName, siteLogo }: { siteName?: string; siteLogo?: string }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return (
    <footer className="bg-brand-dark text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand Info */}
          <div className="md:col-span-4">
            <p className="text-sm leading-loose text-gray-300 font-sans max-w-sm">
              Dịch vụ thêu theo yêu cầu và fulfillment cho seller Shopify, Etsy và Amazon. Hỗ trợ thị trường US, UK và EU. Bắt đầu từ 1 sản phẩm, không cần tồn kho.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-4 pl-0 md:pl-12">
            <h4 className="text-white text-sm font-bold tracking-widest uppercase mb-6">Sản Phẩm</h4>
            <ul className="space-y-4 text-sm tracking-wide text-gray-300">
              <li><Link href="/products?category=ao" className="hover:text-brand-gold transition-colors uppercase block">Áo</Link></li>
              <li><Link href="/products?category=quan" className="hover:text-brand-gold transition-colors uppercase block">Quần</Link></li>
              <li><Link href="/products?category=mu" className="hover:text-brand-gold transition-colors uppercase block">Mũ</Link></li>
              <li><Link href="/products?category=phu-kien" className="hover:text-brand-gold transition-colors uppercase block">Túi & Phụ kiện</Link></li>
            </ul>
          </div>

          {/* Boutique / Contact */}
          <div className="md:col-span-4">
            <h4 className="text-white text-sm font-bold tracking-widest uppercase mb-6">Văn Phòng & Nhà Xưởng</h4>
            <ul className="space-y-6 text-sm tracking-wide text-gray-300 mb-10">
              <li>
                Xa Khúc - Yên lãng - Hà Nội
              </li>
              <li className="flex items-center gap-3 pt-6">
                <Phone size={14} className="text-gray-400" /> <span>Số điện thoại hỗ trợ: 0982.595.594</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-gray-400" /> <span>Email: huubang0@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest text-gray-500">
          <p>© 2026 WIN WIN. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">CHÍNH SÁCH</a>
            <a href="#" className="hover:text-white transition-colors">BẢO MẬT</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
