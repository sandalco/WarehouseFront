"use client"

import { useRouter } from "next/navigation"
import { StockReductionPage as StockReductionComponent } from "@/components/pages/StockReductionPage"

export default function StockReductionPage() {
  const router = useRouter()
  
  const handleBack = () => {
    router.push("/boss/products")
  }
  
  return <StockReductionComponent onBack={handleBack} />
}
