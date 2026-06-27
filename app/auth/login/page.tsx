'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) {
      setError('Email hoặc mật khẩu không đúng')
    } else {
      const res = await fetch('/api/auth/session')
      const session = await res.json()
      if (session?.user?.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/')
      }
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl font-bold tracking-widest text-brand-dark">WIN WIN</h1>
            <h2 className="text-gray-500 text-xs tracking-[0.2em] uppercase mt-4">Đăng Nhập</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="w-full border-b border-gray-300 px-0 py-2 text-sm bg-transparent outline-none focus:border-brand-dark transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.1em] text-gray-600 mb-2">Mật Khẩu</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  className="w-full border-b border-gray-300 px-0 py-2 text-sm bg-transparent outline-none focus:border-brand-dark transition-colors pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-dark text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black transition-colors disabled:opacity-60"
            >
              {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Chưa có tài khoản?{' '}
            <Link href="/auth/register" className="text-brand-dark hover:text-brand-gold transition-colors font-medium">Đăng Ký</Link>
          </div>


        </div>
      </div>
    </div>
  )
}
