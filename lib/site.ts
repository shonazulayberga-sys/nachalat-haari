export const SITE_NAME = 'נחלת הארי'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nachalat-haari-five.vercel.app'

/** og בסיסי — Next מחליף את openGraph של ה-layout במלואו כשדף מגדיר משלו */
export const BASE_OPEN_GRAPH = { siteName: SITE_NAME, locale: 'he_IL', type: 'website' } as const

/** קיצור תיאור לאורך שגוגל מציג (~155 תווים) */
export function clip(text: string, max = 155): string {
  const t = text.replace(/\s+/g, ' ').trim()
  return t.length <= max ? t : `${t.slice(0, max - 1).replace(/\s+\S*$/, '')}…`
}
