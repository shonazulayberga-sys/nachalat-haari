import { getCustomerOrders } from '@/lib/products'
import { generalOrderLink } from '@/lib/whatsapp'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import WhatsAppFab from '@/components/WhatsAppFab'
import ProductCard from '@/components/ProductCard'
import { Flame, WhatsAppIcon } from '@/components/Brand'

export const metadata = {
  title: 'הזמנות של לקוחות — נחלת הארי',
  description: 'גלריית עבודות אמיתיות שיצרנו עבור לקוחות — כל אחת עם שם, ברכה וסיפור.',
}

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
  const orders = await getCustomerOrders()

  return (
    <>
      <SiteHeader />

      <section className="mx-auto max-w-[1180px] px-6 py-16 text-center">
        <Flame className="mx-auto mb-5 h-10 w-8 text-gold" />
        <span className="eyebrow justify-center">הזמנות של לקוחות</span>
        <h1 className="mx-auto mt-3 max-w-[22ch] font-serif text-[clamp(2rem,4.5vw,3.2rem)] leading-tight text-ink">
          עבודות שיצאו מהסדנה
        </h1>
        <p className="mx-auto mt-5 max-w-[52ch] text-[1.08rem] leading-relaxed text-ink-soft">
          כל פריט כאן נעשה עבור לקוח אמיתי — עם שם, ברכה ומגע אישי. זו לא קטגוריה לקנייה,
          אלא הצצה למה שאנחנו יוצרים. רוצים כזה משלכם? דברו איתנו.
        </p>
        <a
          href={generalOrderLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-navy px-6 py-3.5 font-medium text-[#f3ead6] transition hover:bg-navy-soft"
        >
          <WhatsAppIcon className="h-[17px] w-[17px] text-gold-soft" />
          שנכין גם לכם?
        </a>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 pb-20">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {orders.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFab />
    </>
  )
}
