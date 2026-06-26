import { readFile } from 'fs/promises'
import { join } from 'path'
import { updateAboutContent } from './actions'

async function getProcessData() {
  try {
    const filePath = join(process.cwd(), 'data/process.json')
    const file = await readFile(filePath, 'utf-8')
    return JSON.parse(file)
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
      <ProcessAdminClient initialData={data} updateAction={updateAboutContent} />
    </div>
  )
}
