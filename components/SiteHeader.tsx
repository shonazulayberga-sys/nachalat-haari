import Link from 'next/link'
import { getVisibleCategories } from '@/lib/products'
import { generalOrderLink } from '@/lib/whatsapp'
import { LogoMark, WhatsAppIcon } from '@/components/Brand'

export default async function SiteHeader() {
  const categories = await getVisibleCategories()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-[70px] max-w-[1180px] items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark className="h-14 w-14" sizes="56px" priority />
          <span className="font-serif text-[1.34rem] font-medium tracking-[.01em] text-ink">
            נחלת הארי
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-[.95rem] text-ink-soft lg:flex">
          {categories.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.id}`}
              className="border-b border-transparent py-1 transition hover:border-gold hover:text-ink"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <a
          href={generalOrderLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[.9rem] text-olive transition hover:border-olive hover:bg-olive/5"
        >
          <WhatsAppIcon className="h-4 w-4" />
          <span className="hidden sm:inline">הזמנה בוואטסאפ</span>
        </a>
      </div>
    </header>
  )
}
