import Link from 'next/link'
import { getVisibleCategories } from '@/lib/products'
import { generalOrderLink, WHATSAPP_NUMBER } from '@/lib/whatsapp'
import { LogoMark, WhatsAppIcon } from '@/components/Brand'

function prettyPhone() {
  // 972544500168 -> 054-450-0168
  const local = '0' + WHATSAPP_NUMBER.slice(3)
  return `${local.slice(0, 3)}-${local.slice(3, 6)}-${local.slice(6)}`
}

export default async function SiteFooter() {
  const categories = await getVisibleCategories()

  return (
    <footer className="bg-navy px-6 pb-10 pt-16 text-[#CDBFA4]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <LogoMark className="mb-4 h-20 w-20" sizes="80px" />
          <h4 className="mb-3 font-serif text-[1.05rem] font-medium text-[#F0E6CF]">נחלת הארי</h4>
          <p className="max-w-[34ch] text-[.95rem] leading-relaxed">
            תשמישי קדושה בעבודת יד ובהתאמה אישית — טליתות, תפילין, תיקים, כיפות, מזוזות ומארזים.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-serif text-[1.05rem] font-medium text-[#F0E6CF]">קטגוריות</h4>
          <ul>
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.id}`} className="block py-1 text-[.95rem] transition hover:text-gold-soft">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-serif text-[1.05rem] font-medium text-[#F0E6CF]">יצירת קשר</h4>
          <p className="mb-4 text-[.95rem]">ההזמנות מתבצעות בשיחה אישית בוואטסאפ.</p>
          <a
            href={generalOrderLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-3 text-[#F0E6CF] transition hover:bg-gold/20"
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            {prettyPhone()}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1180px] flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-[.8rem] text-[#8F846F]">
        <span>© {new Date().getFullYear()} נחלת הארי · כל הזכויות שמורות</span>
        <div className="flex items-center gap-4">
          <span>יודאיקה יוקרתית · בעבודת יד בישראל</span>
          <Link href="/admin" className="text-[#8F846F] transition hover:text-gold-soft">כניסת מנהל</Link>
        </div>
      </div>
    </footer>
  )
}
