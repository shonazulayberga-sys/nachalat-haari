import fs from 'fs'
import path from 'path'

const SRC = 'C:/Users/Oshri/Downloads/Shon'
const ROOT = process.cwd()
const CATALOG = 'C:/Users/Oshri/AppData/Local/Temp/claude/C--Users-Oshri/6c69810e-4fd0-4cf8-83fd-18f2b50e9fe3/scratchpad/image-catalog.json'

const pubProducts = path.join(ROOT, 'public', 'products')
const pubBrand = path.join(ROOT, 'public', 'brand')
const pubAtmo = path.join(ROOT, 'public', 'atmosphere')
for (const d of [pubProducts, pubBrand, pubAtmo]) fs.mkdirSync(d, { recursive: true })

const entries = JSON.parse(fs.readFileSync(CATALOG, 'utf-8'))

// מיפוי קטגוריה (עברית מהמניפסט) -> מזהה קטגוריה באתר
const catMap = {
  'תיקים': 'tikim',
  'סטים': 'gift-sets',
  'מארזים': 'family-signs', // אלה שלטי המשפחה בקופסאות מתנה
  'כיפות': 'kipot',
  'טליתות': 'talitot',
  'מזוזות': 'mezuzot',
  'נרות זיכרון': 'memorial',
  'תפילין': 'tefillin',
}

const baseName = {
  tikim: 'תיק טלית ותפילין',
  'gift-sets': 'מארז טלית ותפילין',
  'family-signs': 'שלט ברכת הבית',
  kipot: 'כיפה',
  talitot: 'טלית ועטרה',
  mezuzot: 'מזוזת מפת ישראל',
  memorial: 'נר זיכרון מקריסטל',
  tefillin: 'תיק תפילין',
}

const matHe = {
  linen: 'פשתן', suede: 'זמש', velvet: 'קטיפה', cotton: '',
  'acrylic-mirror': 'אקריל ומראה', acrylic: 'אקריל', crystal: 'קריסטל', wood: 'עץ', other: '',
}
const colHe = {
  cream: 'שמנת', beige: 'בז׳', taupe: 'טאופ', brown: 'חום', navy: 'נייבי', grey: 'אפור',
  teal: 'טורקיז', 'rose-gold': 'רוז־גולד', silver: 'כסף', black: 'שחור', white: 'לבן', tan: 'טאן', crystal: '',
}

function slugCopy(file, destDir, base, n) {
  const ext = path.extname(file)
  const name = `${base}-${String(n).padStart(2, '0')}${ext.toLowerCase()}`
  fs.copyFileSync(path.join(SRC, file), path.join(destDir, name))
  return name
}

// הפרדה: נכסי מותג ואווירה
let brandN = 0, atmoN = 0
const products = []
const perCat = {}

// מיזוג לפי (קטגוריה + שם אישי): אותו מוצר שצולם כמה פעמים
const mergeKey = (catId, e) => (e.hasPersonalName ? `${catId}::${e.personalName}` : null)
const merged = new Map()

let counter = {}
for (const e of entries) {
  if (e.category === 'brand-asset') { slugCopy(e.file, pubBrand, 'brand', ++brandN); continue }
  if (e.category === 'lifestyle') { slugCopy(e.file, pubAtmo, 'atmosphere', ++atmoN); continue }

  const catId = catMap[e.category]
  if (!catId) continue
  counter[catId] = (counter[catId] || 0) + 1
  const imgName = slugCopy(e.file, pubProducts, catId, counter[catId])
  const imgPath = `/products/${imgName}`

  const key = mergeKey(catId, e)
  if (key && merged.has(key)) {
    // הוסף תמונה למוצר קיים
    merged.get(key).images.push(imgPath)
    continue
  }

  const parts = [baseName[catId] || 'פריט']
  const m = matHe[e.material]; if (m) parts.push(m)
  const c = colHe[e.colorFamily]; if (c) parts.push(c)
  const name = parts.join(' · ')

  const prod = {
    id: `${catId}-${counter[catId]}`,
    name,
    description: e.blessing ? `הטבעת הפסוק: ${e.blessing}` : 'בהתאמה אישית — שם, ברכה ומוטיב הלהבה.',
    category: catId,
    images: [imgPath],
    material: e.material && e.material !== 'other' ? e.material : null,
    blessing: e.blessing || null,
    personalName: e.hasPersonalName ? e.personalName : null,
    isCustomerOrder: !!e.hasPersonalName,
    heroCandidate: !!e.heroCandidate,
    quality: e.quality,
    createdAt: new Date(0).toISOString(),
  }
  products.push(prod)
  if (key) merged.set(key, prod)
  ;(perCat[catId] ||= []).push(prod)
}

// בחירת תמונת שער לכל קטגוריה: עדיפות ל-hero איכותי, עדיפות למוצר ללא שם (דגם קטלוגי)
const categories = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'categories.json'), 'utf-8'))
for (const cat of categories) {
  const pool = perCat[cat.id] || []
  const pick =
    pool.find(p => p.heroCandidate && !p.personalName && p.quality === 'high') ||
    pool.find(p => p.heroCandidate && p.quality === 'high') ||
    pool.find(p => p.heroCandidate) ||
    pool.find(p => p.quality !== 'low') ||
    pool[0]
  cat.image = pick ? pick.images[0] : null
  cat.count = pool.length
}

// ניקוי שדות עזר לפני שמירה
const clean = products.map(({ heroCandidate, quality, ...p }) => p)

fs.writeFileSync(path.join(ROOT, 'data', 'products.json'), JSON.stringify(clean, null, 2))
fs.writeFileSync(path.join(ROOT, 'data', 'categories.json'), JSON.stringify(categories, null, 2))

// סיכום
const summary = {}
for (const p of clean) summary[p.category] = (summary[p.category] || 0) + 1
console.log('products:', clean.length)
console.log('per category:', JSON.stringify(summary))
console.log('customer orders (named):', clean.filter(p => p.isCustomerOrder).length)
console.log('brand assets:', brandN, ' atmosphere:', atmoN)
console.log('category covers:')
for (const c of categories) console.log('  ', c.id, '->', c.image, `(${c.count})`)
