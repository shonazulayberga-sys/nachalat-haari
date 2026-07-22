'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SiteContent, CONTENT_FIELDS } from '@/lib/content-schema'

export default function ContentEditor({ content }: { content: SiteContent }) {
  const router = useRouter()
  const [values, setValues] = useState<SiteContent>(content)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setSaved(false)
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (res.ok) {
      setSaved(true)
      router.refresh()
    }
    setBusy(false)
  }

  const field = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800'

  return (
    <form onSubmit={save} className="space-y-5">
      {CONTENT_FIELDS.map((f) => (
        <div key={f.key}>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{f.label}</label>
          {f.multiline ? (
            <textarea
              value={values[f.key]}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              rows={3}
              className={`${field} resize-none`}
            />
          ) : (
            <input
              value={values[f.key]}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              className={field}
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-4 pt-2">
        <button type="submit" disabled={busy} className="rounded-xl bg-gray-900 px-6 py-2.5 font-semibold text-white transition hover:bg-gray-700 disabled:opacity-60">
          {busy ? 'שומר...' : 'שמור טקסטים'}
        </button>
        {saved && <span className="text-sm font-medium text-green-600">נשמר ✓</span>}
      </div>
    </form>
  )
}
