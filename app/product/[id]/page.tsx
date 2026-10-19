import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct, getCategory, getProductsByCategory } from '@/lib/products'
import { productOrderLink } from '@/lib/whatsapp'
import { SITE_NAME, BASE_OPEN_GRAPH, clip } from '@/lib/site'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import WhatsAppFab from '@/components/WhatsAppFab'
import ProductCard from '@/components/ProductCard'
import Gallery from '@/components/Gallery'
import { WhatsAppIcon, Flame } from '@/components/Brand'

const MATERIAL_HE: Record<string, string> = {
  linen: 'פשתן', suede: 'זמש', velvet: 'קטיפה', acrylic: 'אקריל',
  'acrylic-mirror': 'אקריל ומראה', crystal: 'קריסטל', cotton: 'כותנה',
}

export const dynamic = 'force-dynamic'

const loadProduct = cache(getProduct)
const loadCategory = cache(getCategory)

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await loadProduct(id)
  if (!product) return {}
  const category = await loadCategory(product.category)

  // שמות מוצרים חוזרים על עצמם (אותו דגם בצבעים/שמות שונים) — השם האישי מבדיל בין הדפים
  const title = product.personalName ? `${product.name} — ${product.personalName}` : product.name
  const material = product.material ? MATERIAL_HE[product.material] : undefined
  const description = clip(
    [
      product.description,
      `${category?.name ?? 'יודאיקה'} בעבודת יד${material ? ` מ${material}` : ''}, בהתאמה אישית של שם, ברכה וצבע.`,
      `הזמנה אישית בוואטסאפ — ${SITE_NAME}.`,
    ]
      .filter(Boolean)
      .join(' '),
  )
  const path = `/product/${encodeURIComponent(product.id)}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
      images: product.images.length ? [product.images[0]] : undefined,
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await loadProduct(id)
  if (!product) notFound()

  const category = await loadCategory(product.category)
  const related = (await getProductsByCategory(product.category)).filter((p) => p.id !== product.id).slice(0, 4)
  const waLink = productOrderLink({ name: product.name, categoryName: category?.name, id: product.id })

  return (
    <>
      <SiteHeader />

      <div className="mx-auto max-w-[1180px] px-6 py-10">
        <nav className="mb-8 text-[.85rem] text-ink-soft">
          <Link href="/" className="hover:text-ink">בית</Link>
          <span className="mx-2 text-taupe">/</span>
          {category && (
            <>
              <Link href={`/category/${category.id}`} className="hover:text-ink">{category.name}</Link>
              <span className="mx-2 text-taupe">/</span>
            </>
          )}
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <Gallery images={product.images} alt={product.name} />

          <div className="md:pt-2">
            {category && <span className="eyebrow">{category.name}</span>}
            <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,2.9rem)] leading-tight text-ink">{product.name}</h1>

            {product.blessing && (
              <p className="mt-4 font-serif text-[1.25rem] text-gold">״{product.blessing}״</p>
            )}

            <p className="mt-5 max-w-[46ch] leading-relaxed text-ink-soft">{product.description}</p>

            <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-3 text-[.95rem]">
              {product.material && MATERIAL_HE[product.material] && (
                <div>
                  <dt className="text-taupe">חומר</dt>
                  <dd className="font-medium text-ink">{MATERIAL_HE[product.material]}</dd>
                </div>
              )}
              {product.personalName && (
                <div>
                  <dt className="text-taupe">נעשה עבור</dt>
                  <dd className="font-medium text-ink">{product.personalName}</dd>
                </div>
              )}
              <div>
                <dt className="text-taupe">התאמה</dt>
                <dd className="font-medium text-ink">שם, ברכה וצבע לבחירתכם</dd>
              </div>
            </dl>

            <div className="mt-9 rounded-2xl border border-line bg-linen p-6">
              <div className="mb-3 flex items-center gap-2 text-olive">
                <Flame className="h-5 w-5" />
                <span className="text-[.9rem]">ההזמנה מתבצעת בשיחה אישית — ללא תשלום באתר</span>
              </div>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 rounded-full bg-navy px-6 py-4 font-medium text-[#f3ead6] transition hover:-translate-y-0.5 hover:bg-navy-soft"
              >
                <WhatsAppIcon className="h-[19px] w-[19px] text-gold-soft" />
                לתיאום הזמנה אישית בוואטסאפ
              </a>
              <p className="mt-3 text-center text-[.8rem] text-ink-soft">
                שם המוצר והמק״ט כבר ייכתבו בהודעה — רק תוסיפו את השם והצבע.
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-7 font-serif text-[1.6rem] text-ink">עוד מ{category?.name}</h2>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <SiteFooter />
      <WhatsAppFab />
    </>
  )
}
