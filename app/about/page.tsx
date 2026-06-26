import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Giới Thiệu - L\'Art de Vivre',
  description: 'Câu chuyện và triết lý nghệ thuật của L\'Art de Vivre.',
}

async function getAboutData() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'page_about' } })
    if (!setting) throw new Error('Not found')
    const parsed = JSON.parse(setting.value)
    // Map legacy structure to sections if needed
    if (!parsed.sections) {
      parsed.sections = [
        { id: '1', title: parsed.title1 || '', content: parsed.content1 || '', image: parsed.image1 || '' },
        { id: '2', title: parsed.title2 || '', content: parsed.content2 || '', image: parsed.image2 || '' }
      ].filter(s => s.title)
    }
    return parsed
  } catch (e) {
    return {
      sections: [
        {
          id: '1',
          title: 'Triết Lý Độc Bản',
          content: 'L\'Art de Vivre ra đời từ niềm đam mê sâu sắc với vẻ đẹp vượt thời gian...',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxLFsUw-tPmG0cxkpSgfY7s4C6eizE0OQTokyDEs7qQs7rb14VPQAOvtm8sd12GH3SD-noMcPG1C6lRyTb8d6acFPS1jxW9fCuBIfUCqbzj2TQXGM34egY1Gacp82P_JWY6vmxyxirVYgPTWR9WjyN4bq0GGt5Kbei3h1X0AQFYKHJel8rcf_ztDHZbckSNwCVcuBuEXNLGkupM-VeDae27EMQgHqtsYAxWVLgVCDHSI60VkAYJde-zCrIDyfjaalpkhKGiNYT3tk'
        },
        {
          id: '2',
          title: 'Nghệ Thuật Thủ Công',
          content: 'Chất lượng là nền tảng trong mọi sáng tạo của chúng tôi...',
          image: ''
        }
      ]
    }
  }
}

export default async function AboutPage() {
  const data = await getAboutData()

  return (
    <div className="bg-brand-light min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-dark/60 mb-6">
            {data.hero?.subtitle || 'Câu chuyện của chúng tôi'}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-dark tracking-widest leading-tight mb-8 whitespace-pre-wrap">
            {data.hero?.title || 'Hành Trình Kiến Tạo\nNghệ Thuật Sống'}
          </h1>
          <div className="h-px w-24 bg-brand-gold mx-auto" />
        </div>

        {/* Main Hero Image */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full mb-32 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-100">
          {(data.hero?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrjk9xlAOfAwXX-SEAGHXYtZqvkWUkCh-k77fH-DW_te05pt9yGFdN6ScZe-2Bot6ttZPDyQXp8pm8UffzW17AmZgFschA2Q-VQhSpAGjjTTIYee4IxMCPoOgxd71cELviAwZq10pKPE4vftdjObz5FsmdsxGjE_jog4hs4SMFTocEyy8I3FeyYPydavDhCzIFAQ_VX_ypaHKmTdMHoxtOAPxfBYrPv3ecG0-ldeA8kpNT-Tymu_gO_6vEyddHJsc63VsbTCFHrxE') && (
            <Image 
              src={data.hero?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrjk9xlAOfAwXX-SEAGHXYtZqvkWUkCh-k77fH-DW_te05pt9yGFdN6ScZe-2Bot6ttZPDyQXp8pm8UffzW17AmZgFschA2Q-VQhSpAGjjTTIYee4IxMCPoOgxd71cELviAwZq10pKPE4vftdjObz5FsmdsxGjE_jog4hs4SMFTocEyy8I3FeyYPydavDhCzIFAQ_VX_ypaHKmTdMHoxtOAPxfBYrPv3ecG0-ldeA8kpNT-Tymu_gO_6vEyddHJsc63VsbTCFHrxE'} 
              alt="Artisan Craftsmanship" 
              fill 
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Dynamic Sections */}
        {data.sections?.map((section: any, index: number) => {
          // Alternate image position: even index = left, odd index = right
          const isImageLeft = index % 2 === 1;

          return (
            <div key={section.id} className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center mb-32">
              {/* Content Box */}
              <div className={`order-2 ${isImageLeft ? 'md:order-2' : 'md:order-1'}`}>
                <h2 className="font-serif text-3xl md:text-4xl text-brand-dark tracking-wider mb-8">
                  {section.title}
                </h2>
                <div className="prose prose-sm text-gray-600 font-sans leading-loose space-y-6 whitespace-pre-wrap">
                  {section.content}
                </div>
                
                {/* Optional CTA on the last section */}
                {index === data.sections.length - 1 && (
                  <div className="mt-10">
                    <Link
                      href="/products"
                      className="inline-block border border-brand-dark text-brand-dark px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-brand-dark hover:text-white transition-all duration-300"
                    >
                      Khám Phá Sản Phẩm
                    </Link>
                  </div>
                )}
              </div>

              {/* Image Box */}
              <div className={`order-1 ${isImageLeft ? 'md:order-1' : 'md:order-2'} relative aspect-[3/4] w-full bg-gray-100 rounded-xl overflow-hidden`}>
                 {section.image ? (
                   <Image 
                    src={section.image} 
                    alt={section.title} 
                    fill 
                    className="object-cover"
                  />
                 ) : (
                   <>
                     <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 opacity-80" />
                     <div className="absolute inset-0 flex items-center justify-center font-serif text-white/50 text-2xl italic tracking-widest text-center px-4">
                       {section.title}
                     </div>
                   </>
                 )}
              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}
