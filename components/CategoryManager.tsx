'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Category } from '@/lib/types'

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: form })
    const data = await res.json()
    if (data.url) setImage(data.url)
    setBusy(false)
  }

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError('שם הקטגוריה הוא שדה חובה')
    setBusy(true)
    setError('')
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, image }),
    })
    if (res.ok) {
      setName(''); setDescription(''); setImage('')
      router.refresh()
    } else {
      const d = await res.json().catch(() => ({}))
      setError(d.error || 'שגיאה')
    }
    setBusy(false)
  }

  const remove = async (id: string) => {
    if (!confirm('למחוק את הקטגוריה?')) return
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    if (res.ok) router.refresh()
    else {
      const d = await res.json().catch(() => ({}))
      alert(d.error || 'שגיאה במחיקה')
    }
  }

  const field = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800'

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
      {/* list */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3">
            <div className="relative h-16 w-16 flex-none overflow-hidden rounded-xl bg-gray-100">
              {cat.image && <Image src={cat.image} alt="" fill className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{cat.name}</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{cat.count ?? 0} מוצרים</span>
              </div>
              <p className="truncate text-sm text-gray-500">{cat.description}</p>
            </div>
            <button onClick={() => remove(cat.id)} className="flex-none px-3 text-sm font-medium text-red-500 hover:text-red-700">
              מחיקה
            </button>
          </div>
        ))}
      </div>

      {/* add form */}
      <form onSubmit={add} className="h-fit space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">קטגוריה חדשה</h2>
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="שם הקטגוריה" className={field} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="תיאור קצר" rows={3} className={`${field} resize-none`} />
        <div>
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="relative h-28 w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-400 transition hover:border-gray-500 disabled:opacity-50">
            {image ? <Image src={image} alt="" fill className="object-cover" /> : 'תמונת שער +'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={upload} className="hidden" />
        </div>
        <button type="submit" disabled={busy} className="w-full rounded-xl bg-gray-900 py-2.5 font-semibold text-white transition hover:bg-gray-700 disabled:opacity-60">
          {busy ? 'שומר...' : 'הוסף קטגוריה'}
        </button>
      </form>
    </div>
  )
}
