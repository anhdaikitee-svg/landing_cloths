import { prisma } from '@/lib/prisma'
import { updateProcessContent } from './actions'

async function getProcessData() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'page_process' } })
    if (setting) return JSON.parse(setting.value)
    return {}
  } catch (e) {
    return {
      title1: '', content1: '', image1: '',
      title2: '', content2: '', image2: ''
    }
  }
}

import ProcessAdminClient from './ProcessAdminClient'

export default async function ProcessAdmin() {
  const data = await getProcessData()

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Quản Lý Trang Quy Trình</h1>
      <ProcessAdminClient initialData={data} updateAction={updateProcessContent} />
    </div>
  )
}
