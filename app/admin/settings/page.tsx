import { prisma } from '@/lib/prisma'
import { updateSettings } from '../actions'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const settings = await prisma.siteSetting.findMany()
  const getSetting = (key: string) => settings.find(s => s.key === key)?.value || ''

  const currentLogo = getSetting('site_logo')
  const currentName = getSetting('site_name') || "L'ART DE VIVRE"

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cài đặt Website</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl">
        <form action={updateSettings} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên Website
            </label>
            <input
              type="text"
              name="site_name"
              defaultValue={currentName}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-brand-dark"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo Website
            </label>
            {currentLogo && (
              <div className="mb-4 p-4 border border-gray-100 bg-gray-50 rounded inline-block">
                <p className="text-xs text-gray-500 mb-2">Logo hiện tại:</p>
                <div className="relative h-12 w-48">
                  <Image 
                    src={currentLogo} 
                    alt="Current Logo" 
                    fill 
                    className="object-contain object-left" 
                  />
                </div>
              </div>
            )}
            <input
              type="file"
              name="site_logo"
              accept="image/*"
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            <p className="text-xs text-gray-500 mt-2">Để trống nếu bạn không muốn thay đổi logo.</p>
          </div>

          <button
            type="submit"
            className="bg-brand-dark text-white px-6 py-2 rounded hover:bg-black transition-colors"
          >
            Lưu Thay Đổi
          </button>
        </form>
      </div>
    </div>
  )
}
