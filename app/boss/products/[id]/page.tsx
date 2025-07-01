"use client"

import { ProductDetailsPage } from "@/components/pages/ProductDetailsPage"
import { useRouter } from "next/navigation"

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter()
  
  const handleBack = () => {
    router.push('/boss/products')
  }

  return (
    <ProductDetailsPage 
      productId={params.id} 
      onBack={handleBack}
    />
  )
}
