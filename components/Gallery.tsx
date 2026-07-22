'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)
  const main = images[active] || images[0]

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-linen">
        {main && (
          <Image src={main} alt={alt} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" priority />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`תמונה ${i + 1}`}
              className={`relative h-20 w-16 overflow-hidden rounded-xl border transition ${
                i === active ? 'border-gold' : 'border-line hover:border-taupe'
              }`}
            >
              <Image src={img} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
