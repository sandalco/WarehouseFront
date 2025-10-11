"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createProduct, deleteProduct, getProducts, increaseProductStock } from "@/lib/api/products";
import { importData } from "@/lib/api/import";
import { createApiCall } from "@/lib/api-helpers";
import { createProductDto, Product } from "@/types/product";
import { useSubscription } from "../subscription-provider";
import { BulkProductIncreasePage } from "../pages/BulkProductIncreasePage";
import { StockReductionPage } from "../pages/StockReductionPage";
import { InventoryModal } from "../modals/InventoryModal";

// Import new components
import {
  ProductActions,
  ProductSearch,
  ProductList,
  ProductForm,
  QuantityModal
} from "../product";

interface ProductManagementProps {
  onViewProduct?: (productId: string) => void;
}

export function ProductManagement({ onViewProduct }: ProductManagementProps) {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  
  // Page states
  const [showBulkIncreasePage, setShowBulkIncreasePage] = useState(false);
  const [showStockReductionPage, setShowStockReductionPage] = useState(false);

  // Hooks
  const { toast } = useToast();
  const { currentSubscription } = useSubscription();
  const isBronzeUser = currentSubscription?.tier === "bronze";

  // Load products
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    createApiCall(
      () => getProducts(),
      setLoading,
      (products: Product[]) => {
        setProductsList(products);
      },
      (error: string) => {
        toast({
          title: "Xəta",
          description: error,
          variant: "destructive",
        });
      }
    );
  };

  // Handlers
  const handleImport = async (file: File) => {
    try {
      toast({
        title: "İmport Başladı",
        description: `${file.name} işlənir. Bu bir neçə dəqiqə çəkə bilər.`,
      });

      await importData('products', file);
      await loadProducts(); // Refresh products
      
      toast({
        title: "İmport Tamamlandı",
        description: "Məhsullar uğurla import edildi.",
      });
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "İmport Xətası",
        description: "Məhsullar import edilərkən xəta baş verdi.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleAddProduct = (productData: createProductDto) => {
    if (!productData.name.trim()) {
      toast({
        title: "Xəta",
        description: "Məhsul adı mütləq olmalıdır.",
        variant: "destructive",
      });
      return;
    }
    
    createApiCall(
      () => createProduct(productData),
      setLoading,
      (product: Product) => {
        setProductsList((prev) => [...prev, product]);
        setIsAddDialogOpen(false);
        toast({
          title: "Məhsul Əlavə Edildi",
          description: `${product.name} məhsulu uğurla əlavə edildi.`,
        });
      },
      (error: string) => {
        toast({
          title: "Xəta",
          description: error,
          variant: "destructive",
        });
      }
    );
  };

  const handleDeleteProduct = (productId: string) => {
    createApiCall(
      () => deleteProduct(productId),
      setLoading,
      () => {
        setProductsList((prev) => prev.filter((p) => p.id !== productId));
        toast({
          title: "Məhsul Silindi",
          description: "Məhsul uğurla silindi.",
        });
      },
      (error: string) => {
        toast({
          title: "Xəta",
          description: error,
          variant: "destructive",
        });
      }
    );
  };

  const handleOpenQuantityModal = (product: Product) => {
    setSelectedProduct(product);
    setIsQuantityModalOpen(true);
  };

  const handleIncreaseQuantity = (quantity: number, price: number) => {
    if (!selectedProduct) return;

    createApiCall(
      () => increaseProductStock(selectedProduct.id, quantity, price),
      setLoading,
      () => {
        setProductsList((prev) => 
          prev.map((product) => 
            product.id === selectedProduct.id 
              ? { ...product, quantity: product.quantity + quantity }
              : product
          )
        );

        toast({
          title: "Məhsul Miqdarı Artırıldı",
          description: `${selectedProduct.name} məhsulunun miqdarı ${quantity} ədəd artırıldı.`,
        });

        setIsQuantityModalOpen(false);
        setSelectedProduct(null);
      },
      (error: string) => {
        toast({
          title: "Xəta",
          description: error,
          variant: "destructive",
        });
      }
    );
  };

  const handleQuickIncrease = async (productId: string, quantity: number) => {
    const targetProduct = productsList.find(p => p.id === productId);
    if (!targetProduct) {
      toast({
        title: "Xəta",
        description: "Məhsul tapılmadı",
        variant: "destructive",
      });
      return;
    }

    try {
      await increaseProductStock(productId, quantity, targetProduct.purchasePrice);
      
      setProductsList((prev) => 
        prev.map((p) => 
          p.id === productId 
            ? { ...p, quantity: p.quantity + quantity }
            : p
        )
      );

      toast({
        title: "Miqdar Artırıldı",
        description: `${targetProduct.name} məhsuluna +${quantity} ədəd əlavə edildi.`,
      });
    } catch (error) {
      console.error("Error quick increasing product quantity:", error);
      toast({
        title: "Xəta",
        description: "Məhsul miqdarı artırılarkən xəta baş verdi.",
        variant: "destructive",
      });
    }
  };

  // Render different pages
  if (showStockReductionPage) {
    return <StockReductionPage onBack={() => setShowStockReductionPage(false)} />;
  }

  if (showBulkIncreasePage) {
    return <BulkProductIncreasePage onBack={() => setShowBulkIncreasePage(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-purple-primary">
            Məhsul İdarəetməsi
          </h2>
          <p className="text-gray-600">
            Anbar məhsullarınızı və inventarınızı idarə edin
          </p>
        </div>
        
        <ProductActions
          products={productsList}
          isBronzeUser={isBronzeUser}
          onImport={handleImport}
          onAddProduct={() => setIsAddDialogOpen(true)}
          onInventoryModal={() => setIsInventoryModalOpen(true)}
          onBulkIncrease={() => setShowBulkIncreasePage(true)}
          onStockReduction={() => setShowStockReductionPage(true)}
        />
      </div>

      {/* Products Card */}
      <Card>
        <CardHeader>
          <CardTitle>Məhsullar</CardTitle>
          <CardDescription>
            <ProductSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductList
            products={productsList}
            viewMode={viewMode}
            isBronzeUser={isBronzeUser}
            searchTerm={searchTerm}
            onViewProduct={onViewProduct}
            onEditProduct={(product) => {
              // TODO: Implement edit functionality
              console.log("Edit product:", product);
            }}
            onDeleteProduct={handleDeleteProduct}
            onOpenQuantityModal={handleOpenQuantityModal}
            onQuickIncrease={handleQuickIncrease}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <ProductForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddProduct}
        loading={loading}
      />

      {isBronzeUser && (
        <QuantityModal
          open={isQuantityModalOpen}
          onOpenChange={setIsQuantityModalOpen}
          product={selectedProduct}
          onSubmit={handleIncreaseQuantity}
          loading={loading}
        />
      )}

      <InventoryModal 
        open={isInventoryModalOpen}
        onOpenChange={setIsInventoryModalOpen}
        onImport={handleImport}
      />
    </div>
  );
}
