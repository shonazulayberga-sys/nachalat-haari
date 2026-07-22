import { nanoid } from 'nanoid'
import { supabaseAdmin } from './supabase'
import type { Product, Category } from './types'

export type { Product, Category } from './types'

/* ---------- mapping snake_case (DB) <-> camelCase (app) ---------- */

type ProductRow = {
  id: string
  name: string
  description: string
  category: string
  images: string[]
  material: string | null
  blessing: string | null
  personal_name: string | null
  is_customer_order: boolean
  created_at: string
}

function rowToProduct(r: ProductRow): Product {
  return {
    id: r.id,
    name: r.name,
    description: r.description || '',
    category: r.category,
    images: Array.isArray(r.images) ? r.images : [],
    material: r.material,
    blessing: r.blessing,
    personalName: r.personal_name,
    isCustomerOrder: r.is_customer_order,
    createdAt: r.created_at,
  }
}

function productToRow(p: Partial<Product>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (p.name !== undefined) row.name = p.name
  if (p.description !== undefined) row.description = p.description
  if (p.category !== undefined) row.category = p.category
  if (p.images !== undefined) row.images = p.images
  if (p.material !== undefined) row.material = p.material || null
  if (p.blessing !== undefined) row.blessing = p.blessing || null
  if (p.personalName !== undefined) row.personal_name = p.personalName || null
  if (p.isCustomerOrder !== undefined) row.is_customer_order = !!p.isCustomerOrder
  return row
}

/* ---------- products ---------- */

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data as ProductRow[]).map(rowToProduct)
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const { data, error } = await supabaseAdmin.from('products').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? rowToProduct(data as ProductRow) : undefined
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('category', categoryId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data as ProductRow[]).map(rowToProduct)
}

/** מוצרים עם שם אישי — לגלריית "הזמנות של לקוחות" */
export async function getCustomerOrders(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('is_customer_order', true)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data as ProductRow[]).map(rowToProduct)
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  const row = { ...productToRow(data), id: nanoid(8) }
  const { data: inserted, error } = await supabaseAdmin.from('products').insert(row).select('*').single()
  if (error) throw error
  return rowToProduct(inserted as ProductRow)
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, 'id' | 'createdAt'>>,
): Promise<Product | null> {
  const { data: updated, error } = await supabaseAdmin
    .from('products')
    .update(productToRow(data))
    .eq('id', id)
    .select('*')
    .maybeSingle()
  if (error) throw error
  return updated ? rowToProduct(updated as ProductRow) : null
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error, count } = await supabaseAdmin
    .from('products')
    .delete({ count: 'exact' })
    .eq('id', id)
  if (error) throw error
  return (count ?? 0) > 0
}

/* ---------- categories ---------- */

type CategoryRow = { id: string; name: string; description: string | null; image: string | null; sort: number | null }

function rowToCategory(r: CategoryRow): Category {
  return { id: r.id, name: r.name, description: r.description || '', image: r.image, sort: r.sort ?? 0 }
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('sort', { ascending: true })
    .order('name', { ascending: true })
  if (error) throw error
  return (data as CategoryRow[]).map(rowToCategory)
}

export async function getCategory(id: string): Promise<Category | undefined> {
  const { data, error } = await supabaseAdmin.from('categories').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? rowToCategory(data as CategoryRow) : undefined
}

export async function countByCategory(): Promise<Record<string, number>> {
  const { data, error } = await supabaseAdmin.from('products').select('category')
  if (error) throw error
  const counts: Record<string, number> = {}
  for (const r of data as { category: string }[]) counts[r.category] = (counts[r.category] || 0) + 1
  return counts
}

/** קטגוריות שיש בהן מוצרים — לתצוגה בבית ובתפריט */
export async function getVisibleCategories(): Promise<Category[]> {
  const [categories, counts] = await Promise.all([getCategories(), countByCategory()])
  return categories
    .map((c) => ({ ...c, count: counts[c.id] || 0 }))
    .filter((c) => (c.count ?? 0) > 0)
}

function slugify(name: string): string {
  const base = name.trim().toLowerCase().replace(/[^\w֐-׿]+/g, '-').replace(/^-|-$/g, '')
  return base || `cat-${nanoid(5)}`
}

export async function createCategory(data: { name: string; description?: string; image?: string | null }): Promise<Category> {
  const existing = await getCategories()
  let id = slugify(data.name)
  while (existing.some((c) => c.id === id)) id = `${id}-${nanoid(3)}`
  const sort = existing.length
  const { data: inserted, error } = await supabaseAdmin
    .from('categories')
    .insert({ id, name: data.name, description: data.description || '', image: data.image || null, sort })
    .select('*')
    .single()
  if (error) throw error
  return rowToCategory(inserted as CategoryRow)
}

export async function updateCategory(id: string, data: Partial<Omit<Category, 'id' | 'count'>>): Promise<Category | null> {
  const row: Record<string, unknown> = {}
  if (data.name !== undefined) row.name = data.name
  if (data.description !== undefined) row.description = data.description
  if (data.image !== undefined) row.image = data.image
  if (data.sort !== undefined) row.sort = data.sort
  const { data: updated, error } = await supabaseAdmin
    .from('categories')
    .update(row)
    .eq('id', id)
    .select('*')
    .maybeSingle()
  if (error) throw error
  return updated ? rowToCategory(updated as CategoryRow) : null
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error, count } = await supabaseAdmin
    .from('categories')
    .delete({ count: 'exact' })
    .eq('id', id)
  if (error) throw error
  return (count ?? 0) > 0
}
