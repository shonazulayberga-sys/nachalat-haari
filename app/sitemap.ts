import type { MetadataRoute } from 'next'
import { getProducts, getVisibleCategories } from '@/lib/products'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getVisibleCategories()])

  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/customers`, changeFrequency: 'weekly', priority: 0.7 },
    ...categories.map((c) => ({
      url: `${SITE_URL}/category/${encodeURIComponent(c.id)}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${SITE_URL}/product/${encodeURIComponent(p.id)}`,
      lastModified: p.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
