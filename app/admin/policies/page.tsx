import { readFile } from 'fs/promises'
import { join } from 'path'
import { updateAboutContent } from './actions'

async function getPoliciesData() {
  try {
    const filePath = join(process.cwd(), 'data/policies.json')
    const file = await readFile(filePath, 'utf-8')
    return JSON.parse(file)
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
      <PoliciesAdminClient initialData={data} updateAction={updateAboutContent} />
    </div>
  )
}
