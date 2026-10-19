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

const SITE_NAME = 'נחלת הארי'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nachalat-haari-five.vercel.app'

export const metadata: Metadata = {
  title: 'נחלת הארי — יודאיקה יוקרתית',
  description:
    'תשמישי קדושה בעבודת יד ובהתאמה אישית — טליתות, תפילין, תיקים, כיפות, מזוזות ומארזים. יודאיקה יוקרתית לרגעים המשמעותיים בחיים.',
  applicationName: SITE_NAME,
  openGraph: { siteName: SITE_NAME, locale: 'he_IL', type: 'website', url: SITE_URL },
  verification: {
    google: 'g2v_gaOvvUi4xl83rLXmAef3YyhR_5X-zXlWv-fb7J4',
  },
}

// שם האתר בתוצאות גוגל (במקום "Vercel")
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: ['Nachalat HaAri', 'נחלת הארי יודאיקה'],
  url: `${SITE_URL}/`,
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icon.png`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${frank.variable}`}>
      <body className="min-h-screen bg-cream font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
