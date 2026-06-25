'use client'

import Image from 'next/image'

export default function FloatingContact() {
  return (
    <div className="fixed bottom-8 right-6 md:bottom-12 md:right-12 flex flex-col gap-4 z-[99]">
      {/* Zalo Button */}
      <a 
        href="https://zalo.me/0982595594"
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-14 h-14 flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
        aria-label="Chat Zalo"
      >
        <div className="absolute inset-0 w-full h-full">
          <Image src="/zalo.png" alt="Zalo" fill className="object-contain" sizes="56px" />
        </div>
        <div className="absolute inset-2 rounded-full bg-[#0068FF] animate-ping opacity-30 -z-10"></div>

        <span className="absolute right-full mr-4 bg-white text-gray-800 font-sans font-medium text-sm px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none translate-x-2 group-hover:translate-x-0">
          Chat Zalo
        </span>
      </a>

      {/* Phone Button */}
      <a 
        href="tel:0982595594"
        className="relative w-14 h-14 flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
        aria-label="Gọi điện thoại"
      >
        <div className="absolute inset-0 w-full h-full animate-[wiggle_1s_ease-in-out_infinite]">
          <Image src="/phone.png" alt="Phone" fill className="object-contain" sizes="56px" />
        </div>
        <div className="absolute inset-2 rounded-full bg-[#10C800] animate-ping opacity-30 -z-10"></div>

        <span className="absolute right-full mr-4 bg-white text-gray-800 font-sans font-medium text-sm px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none translate-x-2 group-hover:translate-x-0">
          Gọi 0982.595.594
        </span>
      </a>
    </div>
  )
}
