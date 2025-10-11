"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateInput } from "@/components/ui/date-input";
import {
  TrendingUp,
  TrendingDown,
  Filter,
  RefreshCw,
  ArrowLeft,
  Package,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStockHistory } from "@/lib/api/products";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import { createApiCall } from "@/lib/api-helpers";

interface StockHistoryItem {
  companyId: string;
  productId: string;
  productName: string;
  quantity: number;
  actionType: number;
  actionTypeText: "Increase" | "Decrease";
  createdAt: string;
}

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  purchasePrice: number;
  sellPrice: number;
  profit: number;
  quantity: number;
  minRequire: number;
  totalSold: number;
  totalPurchasedQuantity: number;
  totalPurchasedCost: number;
  averagePurchasePrice: number;
  stockDetails: Array<{
    warehouse: string;
    shelfName: string;
    quantity: number;
  }>;
  stockHistories: Array<{
    date: string;
    quantity: number;
    actionType: "Increase" | "Decrease";
  }>;
}

export default function StockHistoryPage() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get("productId");
  const { toast } = useToast();
  
  const [stockHistory, setStockHistory] = useState<StockHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<StockHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [mounted, setMounted] = useState(false); // Hydration üçün

  // Filter states
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [actionTypeFilter, setActionTypeFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("");

  // Mount olduqdan sonra data fetch et
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Hydration bitənə qədər gözlə
    
    if (productId) {
      // Spesifik məhsul üçün detailed API-ni çağır
      fetchProductDetail(productId);
    } else {
      // Ümumi stok tarixçəsi
      fetchStockHistory();
    }
  }, [productId, mounted]);

  // Manat formatı
  const formatCurrency = (value: number) => {
    // Hydration məsələsini həll etmək üçün client-side check
    if (typeof window === 'undefined') {
      return `${value} AZN`; // Server-side sadə format
    }
    
    return new Intl.NumberFormat("az-AZ", {
      style: "currency",
      currency: "AZN",
    }).format(value);
  };

  // Məhsul detaylı məlumatlarını al
  const fetchProductDetail = async (id: string) => {
    await createApiCall(
      () => axios.get(`/product/detailed/${id}`),
      setLoadingProduct,
      (response: ProductDetail) => {
        // Axios interceptor artıq tam ApiResponse qaytarır
        setProductDetail(response);
        // Məhsulun stok tarixçəsini local state-ə ötür
        const histories = response.stockHistories.map((h: any, index: number) => ({
          companyId: "",
          productId: id,
          productName: response.name,
          quantity: h.quantity,
          actionType: h.actionType === "Increase" ? 1 : 2,
          actionTypeText: h.actionType,
          createdAt: h.date,
        }));
        setStockHistory(histories);
        setFilteredHistory(histories);
      },
      (message: string) => {
        toast({
          variant: "destructive",
          title: "Xəta",
          description: message,
        });
      }
    );
  };

  const fetchStockHistory = async () => {
    await createApiCall(
      async () => await getStockHistory(),
      setLoading,
      (data: any) => {
        setStockHistory(data);
        setFilteredHistory(data);
      },
      (message: string) => {
        toast({
          variant: "destructive",
          title: "Xəta",
          description: message,
        });
      }
    );
  };

  // Filter effects...
  useEffect(() => {
    let filtered = [...stockHistory];

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(
        (item) => new Date(item.createdAt) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (item) => new Date(item.createdAt) <= endOfDay
      );
    }

    // Action type filter
    if (actionTypeFilter !== "all") {
      filtered = filtered.filter((item) =>
        actionTypeFilter === "increase"
          ? item.actionType === 1
          : item.actionType === 2
      );
    }

    // Product filter
    if (productFilter) {
      filtered = filtered.filter(
        (item) =>
          item.productId.toLowerCase().includes(productFilter.toLowerCase()) ||
          item.productName?.toLowerCase().includes(productFilter.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setFilteredHistory(filtered);
  }, [
    stockHistory,
    dateFrom,
    dateTo,
    actionTypeFilter,
    productFilter,
  ]);

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setActionTypeFilter("all");
    setProductFilter("");
  };

  const getActionBadge = (actionType: number, actionTypeText: string) => {
    return actionType === 1 ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        <TrendingUp className="w-3 h-3 mr-1" />
        Artırma
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
        <TrendingDown className="w-3 h-3 mr-1" />
        Azaltma
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    // Hydration məsələsini həll etmək üçün client-side check
    if (typeof window === 'undefined') {
      return dateString; // Server-side sadə string qaytarır
    }
    
    // Client-side formatlanmış tarix
    const date = new Date(dateString);
    return date.toLocaleString("az-AZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Hydration bitənə qədər loading göstər  
  if (!mounted) {
    return null; // Server-side heç nə render etmə
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {productId && (
              <Link href="/boss/products">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Geri
                </Button>
              </Link>
            )}
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {productId ? "Məhsul Stok Tarixçəsi" : "Stok Tarixçəsi"}
              </CardTitle>
              <CardDescription>
                {productId 
                  ? `${productDetail?.name || productId} məhsulunun stok hərəkətləri`
                  : "Anbar məhsulları üzrə edilmiş bütün dəyişikliklərin tarixçəsi"
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Product Detail Card */}
      {productId && productDetail && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Məhsul Məlumatları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Product Image */}
              <div className="space-y-2">
                <img 
                  src={productDetail.imageUrl} 
                  alt={productDetail.name}
                  className="w-full h-48 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg";
                  }}
                />
              </div>
              
              {/* Product Info */}
              <div className="md:col-span-3 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{productDetail.name}</h3>
                  <p className="text-muted-foreground">{productDetail.description}</p>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Mövcud Miqdar</div>
                    <div className="text-xl font-bold text-blue-600">{productDetail.quantity}</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Alış Qiyməti</div>
                    <div className="text-xl font-bold text-green-600">{formatCurrency(productDetail.purchasePrice)}</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Satış Qiyməti</div>
                    <div className="text-xl font-bold text-purple-600">{formatCurrency(productDetail.sellPrice)}</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Mənfəət</div>
                    <div className="text-xl font-bold text-orange-600">{formatCurrency(productDetail.profit)}</div>
                  </div>
                </div>

                {/* Stock Details */}
                {productDetail.stockDetails && productDetail.stockDetails.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Warehouse className="h-4 w-4" />
                      Anbar Məlumatları
                    </h4>
                    <div className="space-y-2">
                      {productDetail.stockDetails.map((stock, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{stock.warehouse}</span>
                            <span className="text-muted-foreground ml-2">({stock.shelfName})</span>
                          </div>
                          <Badge variant="outline">{stock.quantity} ədəd</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      {!productId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filterlər
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Başlanğıc tarix</label>
                <DateInput
                  value={dateFrom}
                  onChange={setDateFrom}
                  placeholder="Başlanğıc tarixi seçin"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Son tarix</label>
                <DateInput
                  value={dateTo}
                  onChange={setDateTo}
                  placeholder="Son tarixi seçin"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Əməliyyat növü</label>
                <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Hamısı</SelectItem>
                    <SelectItem value="increase">Artırma</SelectItem>
                    <SelectItem value="decrease">Azaltma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Məhsul axtarışı</label>
                <Input
                  placeholder="Məhsul ID və ya ad..."
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium invisible">Actions</label>
                <div className="flex gap-2">
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    Təmizlə
                  </Button>
                  <Button onClick={fetchStockHistory} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              {filteredHistory.length} nəticə ({stockHistory.length} ümumi)
            </div>
          </CardContent>
        </Card>
      )}

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {productId ? "Məhsul Stok Hərəkətləri" : "Bütün Stok Hərəkətləri"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(loading || loadingProduct) ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Yüklənir...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    {!productId && <TableHead className="font-semibold">Məhsul Adı</TableHead>}
                    <TableHead>Əməliyyat</TableHead>
                    <TableHead>Miqdar</TableHead>
                    <TableHead>Tarix</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={productId ? 4 : 5} className="text-center py-8 text-muted-foreground">
                        Heç bir stok hərəkəti tapılmadı
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHistory.map((item, index) => (
                      <TableRow key={`${item.productId}-${item.createdAt}-${index}`}>
                        <TableCell className="text-sm text-muted-foreground font-medium">
                          {index + 1}
                        </TableCell>
                        {!productId && (
                          <TableCell className="font-medium">
                            <div className="space-y-1">
                              <div className="font-semibold text-sm">
                                {item.productName || item.productId}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {item.productId}
                              </div>
                            </div>
                          </TableCell>
                        )}
                        <TableCell>
                          {getActionBadge(item.actionType, item.actionTypeText)}
                        </TableCell>
                        <TableCell className="font-medium">
                          <span className={
                            item.actionType === 1 ? "text-green-600" : "text-red-600"
                          }>
                            {item.actionType === 1 ? "+" : "-"}
                            {item.quantity} ədəd
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(item.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
