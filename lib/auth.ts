import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const COOKIE_NAME = 'admin_session'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

// ערך הסשן הוא סוד לא-נחיש (לא המחרוזת "authenticated"), כדי שלא ניתן לזייף אותו.
const SESSION_VALUE = process.env.ADMIN_SESSION_SECRET || ''

/** נעילה סגורה: בלי סיסמה ובלי סוד סשן — אין התחברות. */
export function verifyCredentials(username: string, password: string): boolean {
  if (!ADMIN_PASSWORD || !SESSION_VALUE) return false
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export async function setAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 ימים
    path: '/',
  })
}

export async function clearAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

function valid(value?: string): boolean {
  return !!SESSION_VALUE && value === SESSION_VALUE
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return valid(cookieStore.get(COOKIE_NAME)?.value)
}

export function isAuthenticatedRequest(request: NextRequest): boolean {
  return valid(request.cookies.get(COOKIE_NAME)?.value)
}
