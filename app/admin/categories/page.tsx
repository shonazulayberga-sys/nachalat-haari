import { getCategories, countByCategory } from '@/lib/products'
import AdminNav from '@/components/AdminNav'
import CategoryManager from '@/components/CategoryManager'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const [counts, cats] = await Promise.all([countByCategory(), getCategories()])
  const categories = cats.map((c) => ({ ...c, count: counts[c.id] || 0 }))

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">ניהול קטגוריות</h1>
        <CategoryManager categories={categories} />
      </div>
    </div>
  )
}
