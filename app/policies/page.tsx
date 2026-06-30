import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Chính Sách - WIN WIN',
  description: 'Chính sách bán hàng, đổi trả và bảo hành của WIN WIN.',
}

async function getPoliciesData() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'page_policies' } })
    if (!setting) throw new Error('Not found')
    const parsed = JSON.parse(setting.value)
    if (!parsed.sections) {
      parsed.sections = [
        { id: '1', title: parsed.title1 || '', content: parsed.content1 || '', image: parsed.image1 || '' },
        { id: '2', title: parsed.title2 || '', content: parsed.content2 || '', image: parsed.image2 || '' }
      ].filter(s => s.title)
    }
    return parsed
  } catch {
    return {
      hero: { subtitle: 'Cam kết của chúng tôi', title: 'Chính Sách\nBán Hàng' },
      sections: []
    }
  }
}

export default async function PoliciesPage() {
  const data = await getPoliciesData()

  return (
    <div className="bg-brand-light min-h-screen pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-dark/60 mb-6">
            Cam kết của chúng tôi
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-dark tracking-widest leading-tight mb-8">
            Chính Sách Bán Hàng
          </h1>
          <div className="h-px w-24 bg-brand-gold mx-auto" />
        </div>

        {/* Sections — single column: title + content then full-width image */}
        <div className="space-y-24">
          {data.sections?.map((section: any) => (
            <div key={section.id}>
              {/* Text block */}
              <div className="mb-10">
                {section.title && (
                  <h2 className="font-serif text-2xl md:text-3xl text-brand-dark tracking-wider mb-6 border-b border-gray-200 pb-4">
                    {section.title}
                  </h2>
                )}
                {section.content && (
                  <div className="text-gray-600 font-sans leading-loose whitespace-pre-wrap text-base md:text-lg">
                    {section.content}
                  </div>
                )}
              </div>

              {/* Full-width image below text */}
              {section.image && (
                <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <Image
                    src={section.image}
                    alt={section.title || ''}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
          ))}

          {data.sections?.length === 0 && (
            <div className="text-center py-20 text-gray-400 font-serif italic text-xl">
              Nội dung đang được cập nhật.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
