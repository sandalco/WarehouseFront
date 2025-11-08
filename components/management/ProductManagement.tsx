"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createProduct, deleteProduct, getPaginatedProducts, increaseProductStock, ProductStockStatus, ProductFiltersRequest } from "@/lib/api/products";
import { importData } from "@/lib/api/import";
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<ProductStockStatus>(ProductStockStatus.All);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  
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
  }, [currentPage, pageSize, statusFilter, minPrice, maxPrice]);

  // Filter dəyişəndə səhifəni 1-ə qaytır
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [statusFilter, minPrice, maxPrice]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        loadProducts();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const filters: ProductFiltersRequest = {
        searchTerm: searchTerm || null,
        status: statusFilter,
        minPrice: minPrice,
        maxPrice: maxPrice,
      };

      const response = await getPaginatedProducts(currentPage, pageSize, filters);

      if (response.isSuccess && response.data) {
        setProductsList(response.data);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
        setHasPreviousPage(response.hasPreviousPage);
        setHasNextPage(response.hasNextPage);
      } else {
        toast({
          title: "Xəta",
          description: response.errors?.[0] || "Məhsullar yüklənə bilmədi.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Xəta",
        description: "Məhsulları yükləyərkən xəta baş verdi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  const handleAddProduct = async (productData: createProductDto) => {
    if (!productData.name.trim()) {
      toast({
        title: "Xəta",
        description: "Məhsul adı mütləq olmalıdır.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const response = await createProduct(productData);
      
      if (response.isSuccess && response.data) {
        await loadProducts(); // Reload products to get updated list
        setIsAddDialogOpen(false);
        toast({
          title: "Məhsul Əlavə Edildi",
          description: `${response.data.name} məhsulu uğurla əlavə edildi.`,
        });
      } else {
        toast({
          title: "Xəta",
          description: response.errors?.[0] || "Məhsul əlavə edilə bilmədi.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Xəta",
        description: "Məhsul əlavə edilərkən xəta baş verdi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setLoading(true);
    try {
      const response = await deleteProduct(productId);
      
      if (response.isSuccess) {
        await loadProducts(); // Reload products
        toast({
          title: "Məhsul Silindi",
          description: "Məhsul uğurla silindi.",
        });
      } else {
        toast({
          title: "Xəta",
          description: response.errors?.[0] || "Məhsul silinə bilmədi.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Xəta",
        description: "Məhsul silinərkən xəta baş verdi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenQuantityModal = (product: Product) => {
    setSelectedProduct(product);
    setIsQuantityModalOpen(true);
  };

  const handleIncreaseQuantity = async (quantity: number, price: number) => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const response = await increaseProductStock(selectedProduct.id, quantity, price);
      
      if (response.isSuccess) {
        await loadProducts(); // Reload products
        toast({
          title: "Məhsul Miqdarı Artırıldı",
          description: `${selectedProduct.name} məhsulunun miqdarı ${quantity} ədəd artırıldı.`,
        });
        setIsQuantityModalOpen(false);
        setSelectedProduct(null);
      } else {
        toast({
          title: "Xəta",
          description: response.errors?.[0] || "Məhsul miqdarı artırıla bilmədi.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error increasing product quantity:", error);
      toast({
        title: "Xəta",
        description: "Məhsul miqdarı artırılarkən xəta baş verdi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              minPrice={minPrice}
              onMinPriceChange={setMinPrice}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
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

          {/* Pagination */}
          {totalCount > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Səhifə başına:</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value))
                      setCurrentPage(1) // Reset to first page when changing page size
                    }}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <span className="text-sm text-muted-foreground">
                  {totalCount > 0 ? (
                    <>
                      {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} / {totalCount} arası göstərilir
                    </>
                  ) : (
                    'Nəticə yoxdur'
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Səhifə {currentPage} / {totalPages}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={!hasPreviousPage || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={!hasNextPage || loading}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
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
