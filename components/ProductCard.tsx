import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/products'
import { Flame } from '@/components/Brand'

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images[0]
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-cream transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-24px_rgba(31,27,22,.45)]"
    >
      <div className="relative aspect-square shrink-0 overflow-hidden bg-travertine/40">
        {img ? (
          <Image
            src={img}
            alt={product.name}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 25vw, 20vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-taupe">
            <Flame className="h-10 w-10" />
          </div>
        )}
        {product.personalName && (
          <span className="absolute end-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[.7rem] font-medium text-ink-soft backdrop-blur-sm">
            הזמנה אישית
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 border-t border-line px-4 py-3">
        <span className="line-clamp-2 min-h-[2.6em] font-serif text-[1.02rem] leading-snug text-ink">
          {product.name}
        </span>
        {product.blessing && (
          <span className="line-clamp-1 text-[.76rem] text-olive" title={product.blessing}>
            {product.blessing}
          </span>
        )}
      </div>
    </Link>
  )
}
