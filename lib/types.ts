// טיפוסים בלבד — בטוח לייבוא גם ב-client components (בלי קוד שרת/סודות).

export interface Product {
  id: string
  name: string
  description: string
  category: string
  images: string[]
  material?: string | null
  blessing?: string | null
  personalName?: string | null
  isCustomerOrder?: boolean
  createdAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  image?: string | null
  sort?: number
  count?: number
}
