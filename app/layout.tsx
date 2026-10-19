import type { Metadata } from 'next'
import { Heebo, Frank_Ruhl_Libre } from 'next/font/google'
import { SITE_NAME, SITE_URL, BASE_OPEN_GRAPH } from '@/lib/site'
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
  metadataBase: new URL(SITE_URL),
  title: { default: 'נחלת הארי — יודאיקה יוקרתית', template: `%s | ${SITE_NAME}` },
  description:
    'תשמישי קדושה בעבודת יד ובהתאמה אישית — טליתות, תפילין, תיקים, כיפות, מזוזות ומארזים. יודאיקה יוקרתית לרגעים המשמעותיים בחיים.',
  applicationName: SITE_NAME,
  openGraph: { ...BASE_OPEN_GRAPH, url: '/' },
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
