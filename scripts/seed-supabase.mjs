import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) { console.error('Missing Supabase env'); process.exit(1) }

const BUCKET = 'products'
const ROOT = process.cwd()
const s = createClient(URL, KEY, { auth: { persistSession: false } })

const CT = { '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif' }

const categories = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'categories.json'), 'utf-8'))
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'products.json'), 'utf-8'))
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'content.json'), 'utf-8'))

// אוסף כל נתיבי התמונות המקומיים (/products/xxx.jpeg)
const paths = new Set()
for (const c of categories) if (c.image) paths.add(c.image)
for (const p of products) for (const img of p.images || []) paths.add(img)

console.log('uploading', paths.size, 'images to Storage...')
const urlMap = {}
let done = 0
for (const rel of paths) {
  const local = path.join(ROOT, 'public', rel)          // public/products/xxx.jpeg
  if (!fs.existsSync(local)) { console.warn('  missing file:', local); continue }
  const ext = path.extname(rel).toLowerCase()
  const key = `catalog/${path.basename(rel)}`             // catalog/xxx.jpeg
  const buf = fs.readFileSync(local)
  const { error } = await s.storage.from(BUCKET).upload(key, buf, { contentType: CT[ext] || 'image/jpeg', upsert: true })
  if (error) { console.error('  upload failed', key, error.message); continue }
  urlMap[rel] = s.storage.from(BUCKET).getPublicUrl(key).data.publicUrl
  if (++done % 15 === 0) console.log('  ...', done)
}
console.log('uploaded', done, 'images')

// קטגוריות (לפני מוצרים — FK)
const catRows = categories.map((c, i) => ({
  id: c.id, name: c.name, description: c.description || '',
  image: c.image ? urlMap[c.image] || null : null, sort: i,
}))
{
  const { error } = await s.from('categories').upsert(catRows)
  if (error) { console.error('categories upsert failed:', error.message); process.exit(1) }
  console.log('seeded categories:', catRows.length)
}

// מוצרים
const prodRows = products.map((p) => ({
  id: p.id, name: p.name, description: p.description || '', category: p.category,
  images: (p.images || []).map((i) => urlMap[i]).filter(Boolean),
  material: p.material || null, blessing: p.blessing || null,
  personal_name: p.personalName || null, is_customer_order: !!p.isCustomerOrder,
}))
{
  const { error } = await s.from('products').upsert(prodRows)
  if (error) { console.error('products upsert failed:', error.message); process.exit(1) }
  console.log('seeded products:', prodRows.length)
}

// תוכן
{
  const { error } = await s.from('site_content').upsert({ id: 1, data: content })
  if (error) { console.error('content upsert failed:', error.message); process.exit(1) }
  console.log('seeded site_content')
}

console.log('DONE ✅')
