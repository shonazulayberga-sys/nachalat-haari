import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getCategory, getProductsByCategory } from '@/lib/products'
import { generalOrderLink } from '@/lib/whatsapp'
import { SITE_NAME, BASE_OPEN_GRAPH, clip } from '@/lib/site'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import WhatsAppFab from '@/components/WhatsAppFab'
import ProductCard from '@/components/ProductCard'
import { WhatsAppIcon } from '@/components/Brand'

export const dynamic = 'force-dynamic'

const loadCategory = cache(getCategory)

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const category = await loadCategory(id)
  if (!category) return {}

  const title = `${category.name} בעבודת יד ובהתאמה אישית`
  const description = clip(
    `${category.description} יודאיקה יוקרתית מבית ${SITE_NAME} — הזמנה אישית עם שם וברכה בוואטסאפ.`,
  )
  const path = `/category/${encodeURIComponent(category.id)}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
      images: category.image ? [category.image] : undefined,
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await loadCategory(id)
  if (!category) notFound()

  const products = await getProductsByCategory(id)

  return (
    <>
      <SiteHeader />

      {/* category hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-8 px-6 py-14 md:grid-cols-2">
          <div>
            <Link href="/#collection" className="text-[.85rem] text-olive hover:text-ink">← לכל הקטגוריות</Link>
            <h1 className="mt-4 font-serif text-[clamp(2.2rem,5vw,3.4rem)] text-ink">{category.name}</h1>
            <p className="mt-4 max-w-[42ch] text-[1.08rem] leading-relaxed text-ink-soft">{category.description}</p>
            <a
              href={generalOrderLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-navy px-6 py-3.5 font-medium text-[#f3ead6] transition hover:bg-navy-soft"
            >
              <WhatsAppIcon className="h-[17px] w-[17px]" />
              לייעוץ והזמנה
            </a>
          </div>
          {category.image && (
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-line">
              <Image src={category.image} alt={category.name} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" priority />
            </div>
          )}
        </div>
      </section>

      {/* products */}
      <section className="mx-auto max-w-[1180px] px-6 py-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-linen p-16 text-center">
            <p className="font-serif text-[1.4rem] text-ink">פריטים נוספים בקטגוריה זו בקרוב</p>
            <p className="mt-2 text-ink-soft">נשמח להכין עבורכם פריט בהתאמה אישית — דברו איתנו.</p>
            <a href={generalOrderLink()} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-ink transition hover:border-taupe hover:bg-taupe/10">
              <WhatsAppIcon className="h-4 w-4 text-olive" /> לתיאום בוואטסאפ
            </a>
          </div>
        )}
      </section>

      <SiteFooter />
      <WhatsAppFab />
    </>
  )
}
