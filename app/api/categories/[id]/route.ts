import { NextRequest, NextResponse } from 'next/server'
import { updateCategory, deleteCategory, getProductsByCategory } from '@/lib/products'
import { isAuthenticated } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json()
  const updated = await updateCategory(id, body)
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const count = (await getProductsByCategory(id)).length
  if (count > 0) {
    return NextResponse.json(
      { error: `לא ניתן למחוק — יש ${count} מוצרים בקטגוריה. העבירו או מחקו אותם קודם.` },
      { status: 409 },
    )
  }
  const ok = await deleteCategory(id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
