import { supabaseAdmin } from './supabase'
import type { SiteContent } from './content-schema'

export type { SiteContent } from './content-schema'
export { CONTENT_FIELDS } from './content-schema'

const DEFAULTS: SiteContent = {
  heroEyebrow: 'יודאיקה יוקרתית · בעבודת יד',
  heroTitle1: 'לא כל מתנה',
  heroTitle2: 'נשארת בלב.',
  heroLead:
    'תשמישי קדושה מעוצבים לרגעים המשמעותיים בחיים — טליתות, תפילין, תיקים, מזוזות ומארזים, שכל אחד מהם נושא שם, ברכה ומגע אישי.',
  personHeading: 'כל פריט נולד בשמכם.',
  personText:
    'אנחנו לא מוכרים מדף. בוחרים דגם וחומר, מוסיפים שם, ברכה ואת מוטיב הלהבה — ואנחנו מייצרים עבורכם. כל התיאום נעשה בשיחה אישית בוואטסאפ, בלי טפסים ובלי עגלה.',
  verseText: 'זֶה אֵלִי וְאַנְוֵהוּ',
  verseNote:
    'מצווה להתנאות לפניו בַּמצוות — טלית נאה, תפילין נאים, בית מהודר. כל פריט נעשה מתוך אהבה והידור, כדי שהקדושה שבו תלווה אתכם לאורך שנים.',
  customersHeading: 'עבודות שיצאו מהסדנה',
  customersText:
    'כל פריט כאן נעשה עבור לקוח אמיתי — עם שם, ברכה ומגע אישי. זו לא קטגוריה לקנייה, אלא הצצה למה שאנחנו יוצרים. רוצים כזה משלכם? דברו איתנו.',
}

export async function getContent(): Promise<SiteContent> {
  const { data } = await supabaseAdmin.from('site_content').select('data').eq('id', 1).maybeSingle()
  return { ...DEFAULTS, ...((data?.data as Partial<SiteContent>) || {}) }
}

export async function saveContent(patch: Partial<SiteContent>): Promise<SiteContent> {
  const current = await getContent()
  const merged = { ...current, ...patch }
  const { error } = await supabaseAdmin.from('site_content').upsert({ id: 1, data: merged })
  if (error) throw error
  return merged
}
