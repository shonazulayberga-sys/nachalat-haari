// בניית קישורי וואטסאפ להזמנה אישית — אין עגלה/תשלום, הכל דרך שיחה.

// נירמול לספרות בלבד — כדי ש-+ / רווחים / מקפים לא ישברו את קישור wa.me
export const WHATSAPP_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '972544500168'
).replace(/\D/g, '')

const BRAND = 'נחלת הארי'

function link(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

/** קישור כללי — לפנייה ראשונית */
export function generalOrderLink(): string {
  return link(`שלום ${BRAND}, אשמח לקבל פרטים על הפריטים שלכם 🙏`)
}

/** קישור להזמנת מוצר ספציפי — שם המוצר, הקטגוריה והמק"ט כבר בהודעה */
export function productOrderLink(p: {
  name: string
  categoryName?: string
  id?: string
}): string {
  const lines = [
    `שלום ${BRAND}, אשמח לתיאום הזמנה אישית 🙏`,
    ``,
    `הפריט: ${p.name}`,
  ]
  if (p.categoryName) lines.push(`קטגוריה: ${p.categoryName}`)
  if (p.id) lines.push(`מק"ט: ${p.id}`)
  lines.push(``, `שם / הקדשה להטבעה: ___`, `צבע / חומר: ___`)
  return link(lines.join('\n'))
}
