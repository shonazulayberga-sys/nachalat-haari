'use client'

import { useRouter } from 'next/navigation'

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('האם למחוק את המוצר?')) return
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) router.refresh()
    else alert('שגיאה במחיקה')
  }

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 font-medium transition-colors">
      מחיקה
    </button>
  )
}
