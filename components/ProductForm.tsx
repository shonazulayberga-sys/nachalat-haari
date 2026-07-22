'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Product, Category } from '@/lib/types'

interface Props {
  categories: Category[]
  product?: Product
}

const MATERIALS = [
  { v: '', l: '— ללא —' },
  { v: 'linen', l: 'פשתן' },
  { v: 'suede', l: 'זמש' },
  { v: 'velvet', l: 'קטיפה' },
  { v: 'acrylic', l: 'אקריל' },
  { v: 'acrylic-mirror', l: 'אקריל ומראה' },
  { v: 'crystal', l: 'קריסטל' },
  { v: 'cotton', l: 'כותנה' },
]

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [category, setCategory] = useState(product?.category || categories[0]?.id || 'tikim')
  const [material, setMaterial] = useState(product?.material || '')
  const [blessing, setBlessing] = useState(product?.blessing || '')
  const [personalName, setPersonalName] = useState(product?.personalName || '')
  const [images, setImages] = useState<string[]>(product?.images || [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (data.url) setImages((prev) => [...prev, data.url])
    }
    setUploading(false)
  }

  const removeImage = (url: string) => setImages((prev) => prev.filter((i) => i !== url))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return setError('שם המוצר הוא שדה חובה')
    setLoading(true)
    setError('')

    const body = { name, description, category, material, blessing, personalName, images }
    const res = product
      ? await fetch(`/api/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...body, isCustomerOrder: !!personalName }),
        })
      : await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

    if (res.ok) {
      router.push('/admin/dashboard')
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'שגיאה בשמירה')
    }
    setLoading(false)
  }

  const field = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800'
  const label = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={label}>שם המוצר *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className={field} />
        </div>
        <div>
          <label className={label}>קטגוריה</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={label}>תיאור</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={`${field} resize-none`} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={label}>חומר</label>
          <select value={material} onChange={(e) => setMaterial(e.target.value)} className={field}>
            {MATERIALS.map((m) => (
              <option key={m.v} value={m.v}>{m.l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>ברכה / פסוק מוטבע</label>
          <input value={blessing} onChange={(e) => setBlessing(e.target.value)} className={field} placeholder="למשל: יברכך ה׳ וישמרך" />
        </div>
      </div>

      <div>
        <label className={label}>שם אישי (הזמנת לקוח)</label>
        <input value={personalName} onChange={(e) => setPersonalName(e.target.value)} className={field} placeholder="השאר ריק לדגם קטלוגי" />
        <p className="mt-1.5 text-xs text-gray-500">אם ממולא — הפריט יוצג גם בעמוד "הזמנות של לקוחות".</p>
      </div>

      <div>
        <label className={label}>תמונות</label>
        <div className="mb-3 flex flex-wrap gap-3">
          {images.map((img) => (
            <div key={img} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-gray-200">
              <Image src={img} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-xl text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-600 disabled:opacity-50"
          >
            {uploading ? '⏳' : (<><span className="text-2xl">+</span><span>תמונה</span></>)}
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="rounded-xl bg-gray-900 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-gray-700 disabled:opacity-60">
          {loading ? 'שומר...' : product ? 'שמור שינויים' : 'הוסף מוצר'}
        </button>
        <button type="button" onClick={() => router.push('/admin/dashboard')} className="rounded-xl border border-gray-200 px-6 py-2.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
          ביטול
        </button>
      </div>
    </form>
  )
}
