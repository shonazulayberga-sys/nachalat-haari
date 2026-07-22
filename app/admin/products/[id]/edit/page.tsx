import { notFound } from 'next/navigation'
import { getProduct, getCategories } from '@/lib/products'
import AdminNav from '@/components/AdminNav'
import ProductForm from '@/components/ProductForm'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">עריכת מוצר</h1>
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <ProductForm categories={categories} product={product} />
        </div>
      </div>
    </div>
  )
}
