'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Mật khẩu không khớp'); return }
    if (form.password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Đăng ký thất bại') }
    else { router.push('/auth/login?registered=1') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-shopee-orange flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-sm shadow-xl p-8">
          <div className="text-center mb-6">
            <Link href="/" className="text-shopee-orange font-bold text-2xl italic">WIN WIN</Link>
            <h1 className="text-gray-800 text-xl font-bold mt-2">Đăng Ký</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded mb-4 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Họ và Tên', key: 'name', type: 'text', placeholder: 'Nguyễn Văn A' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'example@email.com' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm text-gray-600 mb-1">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  required
                  className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm outline-none focus:border-shopee-orange transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mật Khẩu</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm outline-none focus:border-shopee-orange transition-colors pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Xác Nhận Mật Khẩu</label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Nhập lại mật khẩu"
                required
                className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm outline-none focus:border-shopee-orange transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-shopee-orange text-white py-3 rounded-sm font-medium hover:bg-shopee-red transition-colors disabled:opacity-60"
            >
              {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500">
            Đã có tài khoản?{' '}
            <Link href="/auth/login" className="text-shopee-orange hover:underline font-medium">Đăng Nhập</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
