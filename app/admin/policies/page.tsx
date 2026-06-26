import { prisma } from '@/lib/prisma'
import { updatePoliciesContent } from './actions'

async function getPoliciesData() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'page_policies' } })
    if (setting) return JSON.parse(setting.value)
    return {}
  } catch (e) {
    return {
      title1: '', content1: '', image1: '',
      title2: '', content2: '', image2: ''
    }
  }
}

import PoliciesAdminClient from './PoliciesAdminClient'

export default async function PoliciesAdmin() {
  const data = await getPoliciesData()

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Quản Lý Trang Chính Sách</h1>
      <PoliciesAdminClient initialData={data} updateAction={updatePoliciesContent} />
    </div>
  )
}
