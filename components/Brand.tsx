// לוגו נחלת הארי (אריה מוכתר) + מוטיב הלהבה — נכסי מותג משותפים.

import Image from 'next/image'

// הלוגו חולץ מ-public/brand/brand-02.jpeg לרקע שקוף, ויושב על מדליון נייבי בצבע הפלטה.
// lockup = אריה + הכיתוב "נחלת הארי" · mark = האריה בלבד, לגדלים קטנים שבהם הכיתוב לא קריא.
// ה-transform מרים את הלוקאפ מעט מעל מרכז המעגל, כדי שהכיתוב לא ייצמד לקשת התחתונה.
const VARIANTS = {
  lockup: { src: '/brand/logo-lockup.png', transform: 'scale-[.72] -translate-y-[6%]' },
  mark: { src: '/brand/logo-lion.png', transform: 'scale-[.8]' },
} as const

export function LogoMark({
  variant = 'lockup',
  className = '',
  sizes = '230px',
  priority = false,
}: {
  variant?: keyof typeof VARIANTS
  className?: string
  sizes?: string
  priority?: boolean
}) {
  const { src, transform } = VARIANTS[variant]
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full bg-navy ring-1 ring-gold/55 ${className}`}
    >
      <Image
        src={src}
        alt="נחלת הארי"
        fill
        sizes={sizes}
        priority={priority}
        className={`${transform} object-contain`}
      />
    </span>
  )
}

export function Flame({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 52" className={className} aria-hidden="true">
      <path
        d="M20,2 c-11,11 -17,20 -17,31 c0,11 8,17 17,17 c9,0 17,-7 17,-18 c0,-6 -3,-11 -7,-15 c1,5 -1,9 -4,9 c4,-10 -3,-19 -8,-27 c0,5 -3,9 -5,11 c2,-8 1,-13 -1,-18 z"
        fill="currentColor"
      />
    </svg>
  )
}

export function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2.1.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.4.3.1.2.1.8-.1 1.3Z" />
    </svg>
  )
}
