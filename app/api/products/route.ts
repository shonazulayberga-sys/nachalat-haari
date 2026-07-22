import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct, getCategories } from '@/lib/products'
import { isAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  let products = await getProducts()
  if (category) {
    products = products.filter((p) => p.category === category)
  }
  const categories = await getCategories()
  return NextResponse.json({ products, categories })
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { name, description, category, images, material, blessing, personalName } = body
  if (!name) {
    return NextResponse.json({ error: 'שם המוצר הוא שדה חובה' }, { status: 400 })
  }
  const product = await createProduct({
    name,
    description: description || '',
    category: category || 'tikim',
    images: images || [],
    material: material || null,
    blessing: blessing || null,
    personalName: personalName || null,
    isCustomerOrder: !!personalName,
  })
  return NextResponse.json(product, { status: 201 })
}
