import { NextRequest, NextResponse } from 'next/server'
import { verifyCredentials, setAdminCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()
  if (!verifyCredentials(username, password)) {
    return NextResponse.json({ error: 'שם משתמש או סיסמא שגויים' }, { status: 401 })
  }
  await setAdminCookie()
  return NextResponse.json({ success: true })
}
