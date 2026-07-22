import type { Metadata } from 'next'
import { Heebo, Frank_Ruhl_Libre } from 'next/font/google'
import './globals.css'

const heebo = Heebo({
  subsets: ['latin', 'hebrew'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-heebo',
})

const frank = Frank_Ruhl_Libre({
  subsets: ['latin', 'hebrew'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-frank',
})

export const metadata: Metadata = {
  title: 'נחלת הארי — יודאיקה יוקרתית',
  description:
    'תשמישי קדושה בעבודת יד ובהתאמה אישית — טליתות, תפילין, תיקים, כיפות, מזוזות ומארזים. יודאיקה יוקרתית לרגעים המשמעותיים בחיים.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${frank.variable}`}>
      <body className="min-h-screen bg-cream font-sans antialiased">{children}</body>
    </html>
  )
}
