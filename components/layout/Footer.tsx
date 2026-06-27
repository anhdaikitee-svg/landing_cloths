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
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
                  <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.61.94-5.26 3.02-6.81 1.73-1.3 4.13-1.74 6.22-1.12.35.1.7.25 1.02.43.02-1.4.01-2.8.01-4.2-.67-.2-1.36-.34-2.06-.41-2.12-.17-4.32.18-6.19 1.25-2.58 1.48-4.37 4.2-4.54 7.27-.15 2.72.93 5.51 2.91 7.37 2.05 1.94 5.06 2.8 7.82 2.27 3.39-.63 6.09-3.29 6.64-6.69.19-1.21.2-2.45.2-3.67.01-4.5.01-9.01.01-13.51-1.62-.05-3.21-.49-4.56-1.37-.58-.38-1.1-.84-1.55-1.37-.02-.8-.01-1.59-.01-2.39z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest text-gray-500">
          <p>© 2024 WIN WIN. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">CHÍNH SÁCH</a>
            <a href="#" className="hover:text-white transition-colors">BẢO MẬT</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
