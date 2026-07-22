import Link from 'next/link'
import { getProducts, getCategories } from '@/lib/products'
import AdminNav from '@/components/AdminNav'
import DeleteProductButton from '@/components/DeleteProductButton'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])
  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || id

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ניהול מוצרים</h1>
            <p className="mt-1 text-sm text-gray-500">{products.length} מוצרים · {categories.length} קטגוריות</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/categories" className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
              ניהול קטגוריות
            </Link>
            <Link href="/admin/products/new" className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700">
              + הוסף מוצר
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center text-gray-400">
            <p className="mb-4 text-lg">אין עדיין מוצרים</p>
            <Link href="/admin/products/new" className="text-gray-900 underline">הוסף את המוצר הראשון</Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right font-medium text-gray-600">מוצר</th>
                  <th className="px-6 py-4 text-right font-medium text-gray-600">קטגוריה</th>
                  <th className="px-6 py-4 text-right font-medium text-gray-600">סוג</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-lg">
                          {product.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                          ) : '·'}
                        </div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{getCategoryName(product.category)}</td>
                    <td className="px-6 py-4">
                      {product.isCustomerOrder ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          הזמנת לקוח · {product.personalName}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">דגם קטלוגי</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/products/${product.id}/edit`} className="font-medium text-gray-900 hover:underline">
                          עריכה
                        </Link>
                        <DeleteProductButton id={product.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
