// חותם נחלת הארי + מוטיב הלהבה — נכסי מותג משותפים (SVG טהור).

export function Seal({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="חותם נחלת הארי">
      <circle cx="100" cy="100" r="98" fill="#071426" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="#B88A35" strokeWidth="1.1" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="#B88A35" strokeWidth=".7" opacity=".6" />
      <path id="seal-ring" d="M100,148 a48,48 0 1 1 0,-96 a48,48 0 1 1 0,96" fill="none" />
      <text fill="#C8A45E" fontFamily="var(--font-frank), 'David', serif" fontSize="9.3" letterSpacing="1.4">
        <textPath href="#seal-ring" startOffset="0%">
          · יודאיקה · תשמישי קדושה · בעבודת יד · נחלת הארי&nbsp;
        </textPath>
      </text>
      <path d="M84,74 l5,-13 5,8 6,-11 6,11 5,-8 5,13 z" fill="#B88A35" />
      <circle cx="84" cy="60" r="1.7" fill="#B88A35" />
      <circle cx="100" cy="57" r="1.9" fill="#B88A35" />
      <circle cx="116" cy="60" r="1.7" fill="#B88A35" />
      <path
        d="M100,84 c-9,9 -14,16 -14,25 c0,10 6,17 14,17 c8,0 14,-7 14,-16 c0,-4 -2,-8 -5,-11 c1,4 -1,7 -3,7 c3,-8 -2,-15 -6,-22 c0,4 -2,7 -4,9 c1,-6 0,-11 -1,-16 z"
        fill="#C8A45E"
      />
      <text x="100" y="140" textAnchor="middle" fill="#F0E6CF" fontFamily="var(--font-frank), 'David', serif" fontSize="15" fontWeight="500">
        נחלת הארי
      </text>
    </svg>
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
