import { NextRequest, NextResponse } from 'next/server'
import { getCategories, createCategory } from '@/lib/products'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  return NextResponse.json(await getCategories())
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { name, description, image } = await request.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: 'שם הקטגוריה הוא שדה חובה' }, { status: 400 })
  }
  const category = await createCategory({ name: name.trim(), description, image })
  return NextResponse.json(category, { status: 201 })
}
