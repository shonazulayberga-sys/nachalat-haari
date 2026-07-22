'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminNav() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
    router.refresh()
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/admin/dashboard" className="font-bold text-lg">ממשק ניהול</Link>
        <Link href="/admin/dashboard" className="text-sm hover:text-gray-300 transition-colors">מוצרים</Link>
        <Link href="/admin/products/new" className="text-sm hover:text-gray-300 transition-colors">+ מוצר חדש</Link>
        <Link href="/admin/categories" className="text-sm hover:text-gray-300 transition-colors">קטגוריות</Link>
        <Link href="/admin/content" className="text-sm hover:text-gray-300 transition-colors">טקסטים</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors" target="_blank">צפה בחנות</Link>
        <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors">
          התנתקות
        </button>
      </div>
    </nav>
  )
}
