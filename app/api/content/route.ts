import { NextRequest, NextResponse } from 'next/server'
import { getContent, saveContent } from '@/lib/content'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  return NextResponse.json(await getContent())
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const saved = await saveContent(body)
  return NextResponse.json(saved)
}
