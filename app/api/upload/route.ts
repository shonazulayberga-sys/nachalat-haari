import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { supabaseAdmin, STORAGE_BUCKET } from '@/lib/supabase'
import { nanoid } from 'nanoid'
import path from 'path'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']
const MAX_BYTES = 8 * 1024 * 1024 // 8MB

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'לא נבחר קובץ' }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'ניתן להעלות רק קבצי תמונה' }, { status: 415 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'הקובץ גדול מדי (עד 8MB)' }, { status: 413 })
  }

  const rawExt = path.extname(file.name).toLowerCase()
  const ext = ALLOWED_EXT.includes(rawExt) ? rawExt : '.jpg'
  const key = `uploads/${Date.now()}-${nanoid(8)}${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(key, buffer, { contentType: file.type, upsert: false })
  if (error) {
    return NextResponse.json({ error: 'ההעלאה נכשלה: ' + error.message }, { status: 500 })
  }

  const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(key)
  return NextResponse.json({ url: data.publicUrl })
}
