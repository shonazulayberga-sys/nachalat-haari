// סכמת התוכן — ללא fs, בטוח לייבוא גם ב-client components.

export interface SiteContent {
  heroEyebrow: string
  heroTitle1: string
  heroTitle2: string
  heroLead: string
  personHeading: string
  personText: string
  verseText: string
  verseNote: string
  customersHeading: string
  customersText: string
}

export const CONTENT_FIELDS: { key: keyof SiteContent; label: string; multiline?: boolean }[] = [
  { key: 'heroEyebrow', label: 'כותרת עליונה (Hero)' },
  { key: 'heroTitle1', label: 'כותרת ראשית — שורה 1' },
  { key: 'heroTitle2', label: 'כותרת ראשית — שורה 2' },
  { key: 'heroLead', label: 'פסקת פתיחה', multiline: true },
  { key: 'personHeading', label: 'התאמה אישית — כותרת' },
  { key: 'personText', label: 'התאמה אישית — טקסט', multiline: true },
  { key: 'verseText', label: 'פסוק' },
  { key: 'verseNote', label: 'פסוק — הסבר', multiline: true },
  { key: 'customersHeading', label: 'הזמנות לקוחות — כותרת' },
  { key: 'customersText', label: 'הזמנות לקוחות — טקסט', multiline: true },
]
