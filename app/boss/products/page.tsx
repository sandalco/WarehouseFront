"use client"

import { ProductManagement } from "@/components/management/ProductManagement"
import { useRouter } from "next/navigation"

export default function BossProductsPage() {
  const router = useRouter()
  
  const handleViewProduct = (productId: string) => {
    router.push(`/boss/products/${productId}`)
  }

  return <ProductManagement onViewProduct={handleViewProduct} />
}
