import { prisma } from '@/lib/prisma'
import { Package, Tags, Users, ShoppingCart } from 'lucide-react'

export default async function AdminDashboard() {
  const [productCount, categoryCount, userCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.user.count(),
  ])

  const stats = [
    { label: 'Tổng Sản Phẩm', value: productCount, icon: Package, color: 'bg-blue-500' },
    { label: 'Danh Mục', value: categoryCount, icon: Tags, color: 'bg-purple-500' },
    { label: 'Người Dùng', value: userCount, icon: Users, color: 'bg-green-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 flex items-center">
            <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center text-white mr-4`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
