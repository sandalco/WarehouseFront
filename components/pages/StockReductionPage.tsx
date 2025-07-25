"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Minus, ArrowLeft, Trash2, AlertTriangle } from "lucide-react";
import { getProducts, bulkDecreaseProductStock } from "@/lib/api/products";
import { Product } from "@/types/product";

interface StockReductionItem {
  id: string;
  product: Product;
  quantity: number;
}

interface StockReductionPageProps {
  onBack: () => void;
}

export function StockReductionPage({ onBack }: StockReductionPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<StockReductionItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantityToReduce, setQuantityToReduce] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productsData = await getProducts();
      // Yalnız stoku olan məhsulları göstər
      const availableProducts = productsData.filter((p: Product) => p.quantity > 0);
      setProducts(availableProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Xəta",
        description: "Məhsullar yüklənərkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  const handleAddItem = () => {
    if (!selectedProductId || quantityToReduce <= 0) {
      toast({
        title: "Xəta",
        description: "Məhsul və miqdar seçin",
        variant: "destructive",
      });
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) {
      toast({
        title: "Xəta",
        description: "Məhsul tapılmadı",
        variant: "destructive",
      });
      return;
    }

    // Əvvəlcə yoxla ki, stokda kifayət qədər məhsul var
    const currentSelectedQuantity = selectedItems.find(item => item.product.id === selectedProductId)?.quantity || 0;
    const totalQuantity = currentSelectedQuantity + quantityToReduce;

    if (totalQuantity > product.quantity) {
      toast({
        title: "Xəta",
        description: `Stokda yalnız ${product.quantity} ədəd var, ${totalQuantity} ədəd çıxarmaq olmaz`,
        variant: "destructive",
      });
      return;
    }

    // Artıq əlavə edilmiş məhsul varsa, miqdarını yenilə
    const existingIndex = selectedItems.findIndex(item => item.product.id === selectedProductId);
    if (existingIndex !== -1) {
      const updatedItems = [...selectedItems];
      updatedItems[existingIndex].quantity = totalQuantity;
      setSelectedItems(updatedItems);
    } else {
      // Yeni məhsul əlavə et
      const newItem: StockReductionItem = {
        id: Date.now().toString(),
        product,
        quantity: quantityToReduce,
      };
      setSelectedItems([...selectedItems, newItem]);
    }

    // Formu sıfırla
    setSelectedProductId("");
    setQuantityToReduce(1);
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    const item = selectedItems.find(i => i.id === itemId);
    if (!item) return;

    if (newQuantity > item.product.quantity) {
      toast({
        title: "Xəta",
        description: `Stokda yalnız ${item.product.quantity} ədəd var`,
        variant: "destructive",
      });
      return;
    }

    setSelectedItems(selectedItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Xəta",
        description: "Heç bir məhsul seçilməyib",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const decreaseData = selectedItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      await bulkDecreaseProductStock(decreaseData);

      toast({
        title: "Stok Azaldıldı",
        description: `${selectedItems.length} məhsulun stoku uğurla azaldıldı`,
      });

      // Formu təmizlə
      setSelectedItems([]);
      
      // Məhsulları yenilə
      await loadProducts();
      
    } catch (error) {
      console.error("Error decreasing stock:", error);
      toast({
        title: "Xəta",
        description: "Stok azaldılarkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalReduction = () => {
    return selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getAvailableProducts = () => {
    return products.filter(product => {
      const selectedQuantity = selectedItems.find(item => item.product.id === product.id)?.quantity || 0;
      return selectedQuantity < product.quantity;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Geri</span>
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-red-600">
              Stok Azaltma
            </h2>
            <p className="text-gray-600">
              Anbardan çıxarılan məhsulları qeyd edin
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol tərəf - Məhsul seçimi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Məhsul Seçimi</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="product-select">Məhsul</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Məhsul seçin" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableProducts().map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{product.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {product.quantity} ədəd
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Çıxarılacaq Miqdar</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantityToReduce}
                onChange={(e) => setQuantityToReduce(parseInt(e.target.value) || 1)}
                placeholder="Miqdar"
              />
            </div>

            <Button
              onClick={handleAddItem}
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={!selectedProductId || quantityToReduce <= 0}
            >
              <Minus className="h-4 w-4 mr-2" />
              Siyahıya Əlavə Et
            </Button>
          </CardContent>
        </Card>

        {/* Sağ tərəf - Seçilmiş məhsullar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Seçilmiş Məhsullar</span>
              <Badge variant="outline">
                {selectedItems.length} məhsul
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Hələlik heç bir məhsul seçilməyib</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Package className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          Hazırki stok: {item.product.quantity} ədəd
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="1"
                        max={item.product.quantity}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Xülasə və təsdiq */}
      {selectedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Əməliyyat Xülasəsi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{selectedItems.length}</p>
                <p className="text-sm text-gray-600">Məhsul növü</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{getTotalReduction()}</p>
                <p className="text-sm text-gray-600">Ümumi çıxarılacaq</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {products.reduce((sum, p) => sum + p.quantity, 0) - getTotalReduction()}
                </p>
                <p className="text-sm text-gray-600">Qalacaq stok</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <p className="text-sm text-yellow-700">
                Bu əməliyyat geri qaytarıla bilməz. Təsdiq etmədən əvvəl məlumatları yoxlayın.
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Emal olunur..." : "Stoku Azalt"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
