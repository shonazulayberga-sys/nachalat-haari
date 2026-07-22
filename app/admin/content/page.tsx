import { getContent } from '@/lib/content'
import AdminNav from '@/components/AdminNav'
import ContentEditor from '@/components/ContentEditor'

export const dynamic = 'force-dynamic'

export default async function AdminContentPage() {
  const content = await getContent()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">עריכת טקסטים</h1>
        <p className="mb-8 text-sm text-gray-500">הטקסטים שמופיעים בעמוד הבית. שינויים נשמרים מיד.</p>
        <ContentEditor content={content} />
      </div>
    </div>
  )
}
