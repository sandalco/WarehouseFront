"use client";

import { useState, useEffect } from "react";
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
  CalendarIcon,
  TrendingUp,
  TrendingDown,
  Filter,
  RefreshCw,
} from "lucide-react";
// Using built-in JavaScript date formatting instead of date-fns
import { cn } from "@/lib/utils";
import { getStockHistory } from "@/lib/api/products";
import { toast } from "@/hooks/use-toast";

interface StockHistoryItem {
  companyId: string;
  productId: string;
  productName: string;
  quantity: number;
  actionType: number;
  actionTypeText: "Increase" | "Decrease";
  createdAt: string;
}

export default function StockHistoryPage() {
  const [stockHistory, setStockHistory] = useState<StockHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<StockHistoryItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<
    Record<string, { name: string; sku: string }>
  >({});

  // Filter states
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [actionTypeFilter, setActionTypeFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("");

  const fetchStockHistory = async () => {
    try {
      setLoading(true);
      const response = (await getStockHistory()) as any;
      if (response?.isSuccess) {
        setStockHistory(response.data);
        setFilteredHistory(response.data);
      } else {
        toast({
          variant: "destructive",
          title: "Xəta",
          description: "Stok tarixçəsi yüklənə bilmədi",
        });
      }
    } catch (error) {
      console.error("Stock history fetch error:", error);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Stok tarixçəsi yüklənərkən xəta baş verdi",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      // This would be your existing products API call
      // For now, we'll leave it empty since we need the product names
      // You can integrate this with your existing products API
    } catch (error) {
      console.error("Products fetch error:", error);
    }
  };

  useEffect(() => {
    fetchStockHistory();
    fetchProducts();
  }, []);

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
          products[item.productId]?.name
            ?.toLowerCase()
            .includes(productFilter.toLowerCase()) ||
          products[item.productId]?.sku
            ?.toLowerCase()
            .includes(productFilter.toLowerCase())
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
    products,
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
    // Backend-dən gələn tarixi olduğu kimi göstər
    const date = new Date(dateString);
    return date.toLocaleString("az-AZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Stok Tarixçəsi
          </CardTitle>
          <CardDescription>
            Anbar məhsulları üzrə edilmiş bütün dəyişikliklərin tarixçəsi
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filterlər
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Date From */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Başlanğıc tarix</label>
              <DateInput
                value={dateFrom}
                onChange={setDateFrom}
                placeholder="Başlanğıc tarixi seçin"
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Son tarix</label>
              <DateInput
                value={dateTo}
                onChange={setDateTo}
                placeholder="Son tarixi seçin"
              />
            </div>

            {/* Action Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Əməliyyat növü</label>
              <Select
                value={actionTypeFilter}
                onValueChange={setActionTypeFilter}
              >
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

            {/* Product Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Məhsul axtarışı</label>
              <Input
                placeholder="Məhsul ID və ya ad..."
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
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

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredHistory.length} nəticə ({stockHistory.length} ümumi)
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tarixçə</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead className="font-semibold">Məhsul Adı</TableHead>
                    <TableHead>Əməliyyat</TableHead>
                    <TableHead>Miqdar</TableHead>
                    <TableHead>Tarix</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Heç bir məlumat tapılmadı
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHistory.map((item, index) => (
                      <TableRow
                        key={`${item.productId}-${item.createdAt}-${index}`}
                      >
                        <TableCell className="text-sm text-muted-foreground font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <div className="font-semibold text-sm">
                              {item.productName || item.productId}
                            </div>
                            {products[item.productId] && (
                              <div className="text-xs text-muted-foreground">
                                ID: {item.productId}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getActionBadge(item.actionType, item.actionTypeText)}
                        </TableCell>
                        <TableCell className="font-medium">
                          <span
                            className={
                              item.actionType === 1
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {item.actionType === 1 ? "+" : "-"}
                            {item.quantity}
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
