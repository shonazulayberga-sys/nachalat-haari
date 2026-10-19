import Link from 'next/link'
import Image from 'next/image'
import { getVisibleCategories, getProducts, getCustomerOrders } from '@/lib/products'
import { getContent } from '@/lib/content'
import { generalOrderLink } from '@/lib/whatsapp'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import WhatsAppFab from '@/components/WhatsAppFab'
import ProductCard from '@/components/ProductCard'
import { LogoMark, Flame, WhatsAppIcon } from '@/components/Brand'

export const metadata = {
  alternates: { canonical: '/' },
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [c, categories, allProducts, customerOrders] = await Promise.all([
    getContent(),
    getVisibleCategories(),
    getProducts(),
    getCustomerOrders(),
  ])
  const featured = allProducts.filter((p) => p.images.length && !p.personalName).slice(0, 10)
  const customerCount = customerOrders.length

  return (
    <>
      <SiteHeader />

      {/* hero — compact */}
      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-8 px-6 pb-10 pt-8 md:grid-cols-[1.15fr_.85fr]">
          <div className="max-w-[560px]">
            <span className="eyebrow">{c.heroEyebrow}</span>
            <h1 className="mt-4 font-serif text-[clamp(2.2rem,5vw,3.9rem)] leading-[1.08] text-ink">
              {c.heroTitle1}<br /><span className="text-taupe">{c.heroTitle2}</span>
            </h1>
            <p className="mt-4 max-w-[46ch] text-[1.05rem] leading-relaxed text-ink-soft">
              {c.heroLead}
            </p>
            <div className="mt-6 flex flex-wrap gap-3.5">
              <a
                href={generalOrderLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-navy px-6 py-3.5 font-medium text-[#f3ead6] transition hover:-translate-y-0.5 hover:bg-navy-soft"
              >
                <WhatsAppIcon className="h-[17px] w-[17px]" />
                לתיאום הזמנה אישית
              </a>
              <a href="#collection" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 font-medium text-ink transition hover:border-taupe hover:bg-taupe/10">
                לצפייה בקולקציה
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <LogoMark className="aspect-square w-[min(230px,55%)]" sizes="230px" priority />
          </div>
        </div>
        <div className="h-2 bg-[linear-gradient(90deg,var(--color-linen)_0_20%,var(--color-travertine)_20%_40%,var(--color-taupe)_40%_55%,var(--color-wheat)_55%_72%,var(--color-olive)_72%_86%,var(--color-navy)_86%_100%)] opacity-85" />
      </section>

      {/* categories */}
      <section id="collection" className="mx-auto max-w-[1180px] px-6 py-14">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <span className="eyebrow">הקולקציה</span>
            <h2 className="mt-3 font-serif text-[clamp(1.6rem,3vw,2.2rem)] text-ink">כל קטגוריה, בחומר משלה</h2>
          </div>
          <p className="hidden max-w-[34ch] text-[.95rem] text-ink-soft sm:block">
            פשתן, זמש, קטיפה, אקריל ומראה — כל פריט נבחר לפי המגע והמעמד.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.id}`} className="group block">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-linen">
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width:768px) 50vw, 20vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.05]"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy/70 to-transparent" />
                <Flame className="absolute end-4 top-4 h-6 w-6 text-cream/80" />
                <span className="absolute bottom-4 start-5 font-serif text-[1.4rem] text-cream">{cat.name}</span>
              </div>
              <p className="mt-2.5 text-[.9rem] leading-relaxed text-ink-soft">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* featured */}
      <section className="bg-cream-2 py-14">
        <div className="mx-auto max-w-[1180px] px-6">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <span className="eyebrow">נבחרים</span>
              <h2 className="mt-3 font-serif text-[clamp(1.6rem,3vw,2.2rem)] text-ink">מוצרים מהקולקציה</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* personalization band */}
      <section className="bg-navy px-6 py-20 text-[#efe4cd]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-14 md:grid-cols-2">
          <div>
            <span className="eyebrow" style={{ color: 'var(--color-gold-soft)' }}>ההתאמה האישית</span>
            <h2 className="mt-3 font-serif text-[clamp(1.9rem,3.4vw,2.7rem)] text-[#f3ead6]">{c.personHeading}</h2>
            <p className="mt-5 text-[1.08rem] leading-relaxed text-[#cdbfa4]">{c.personText}</p>
            <div className="mt-8 flex flex-col gap-4">
              {[
                ['בוחרים פריט', 'דגם, חומר וצבע מתוך הקולקציה.'],
                ['מוסיפים שם וברכה', 'בדיוק כמו שתרצו שיופיע.'],
                ['שולחים בוואטסאפ', 'ואנחנו חוזרים עם הצעה והדמיה.'],
              ].map(([t, s], i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-full border border-[rgba(200,164,94,.5)] font-serif text-[1.05rem] text-gold-soft">
                    {i + 1}
                  </span>
                  <p><b className="font-semibold text-[#f0e6cf]">{t}</b> <span className="text-[#c1b498]">— {s}</span></p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[18px] border border-[rgba(200,164,94,.28)] bg-[linear-gradient(160deg,#0d1f34,#050f1e)] p-8">
            <p className="text-[.78rem] text-gold-soft">הפריט</p>
            <div className="mb-5 mt-2 rounded-xl border border-dashed border-[rgba(200,164,94,.4)] px-4 py-3 font-serif text-[1.2rem] text-[#efe4cd]">
              סט טלית ותפילין · זמש
            </div>
            <p className="text-[.78rem] text-gold-soft">השם / ההקדשה</p>
            <div className="mb-5 mt-2 rounded-xl border border-dashed border-[rgba(200,164,94,.4)] px-4 py-3 font-serif text-[1.2rem] text-[#efe4cd]">
              דן גבריאל בן שרה
            </div>
            <a
              href={generalOrderLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-full bg-gold py-3.5 font-semibold text-[#241a06] transition hover:brightness-105"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              שליחת הפרטים בוואטסאפ
            </a>
          </div>
        </div>
      </section>

      {/* customer orders teaser */}
      {customerCount > 0 && (
        <section className="mx-auto max-w-[1180px] px-6 py-20 text-center">
          <span className="eyebrow justify-center">מהלקוחות שלנו</span>
          <h2 className="mx-auto mt-3 max-w-[24ch] font-serif text-[clamp(1.6rem,3vw,2.3rem)] text-ink">
            {customerCount} פריטים שכבר נשאו שם ויצאו מהסדנה
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-ink-soft">{c.customersText}</p>
          <Link href="/customers" className="mt-7 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 font-medium text-ink transition hover:border-taupe hover:bg-taupe/10">
            לצפייה בהזמנות של לקוחות
          </Link>
        </section>
      )}

      {/* verse */}
      <section className="bg-cream-2 px-6 py-20 text-center">
        <Flame className="mx-auto mb-6 h-11 w-9 text-gold" />
        <blockquote className="mx-auto max-w-[20ch] font-serif text-[clamp(1.7rem,4vw,2.6rem)] leading-[1.4] text-ink">
          {c.verseText}
        </blockquote>
        <p className="mx-auto mt-5 max-w-[50ch] text-[1.05rem] leading-relaxed text-ink-soft">
          {c.verseNote}
        </p>
      </section>

      <SiteFooter />
      <WhatsAppFab />
    </>
  )
}
