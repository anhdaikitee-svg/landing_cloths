import { readFile } from 'fs/promises'
import { join } from 'path'
import { updateAboutContent } from './actions'

async function getAboutData() {
  try {
    const filePath = join(process.cwd(), 'data/about.json')
    const file = await readFile(filePath, 'utf-8')
    return JSON.parse(file)
  } catch (e) {
    return {
      title1: '', content1: '', image1: '',
      title2: '', content2: '', image2: ''
    }
  }
}

import AboutAdminClient from './AboutAdminClient'

export default async function AboutAdmin() {
  const data = await getAboutData()

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Quản Lý Trang Giới Thiệu</h1>
      <AboutAdminClient initialData={data} updateAction={updateAboutContent} />
    </div>
  )
}
