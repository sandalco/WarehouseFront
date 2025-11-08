import { createProductDto, Product } from "@/types/product";
import api from "../axios";
import { ApiResponse } from "@/types/api-response";
import { PaginatedResponse } from "@/types/paginated-response";

export enum ProductStockStatus {
  All = 0,
  InStock = 1,
  LowStock = 2,
  OutOfStock = 3
}

export interface ProductFiltersRequest {
  searchTerm?: string | null;
  status?: ProductStockStatus;
  minPrice?: number | null;
  maxPrice?: number | null;
}

export async function getProducts(): Promise<ApiResponse<Product[]>> {
  return await api.get("/product");
}

export async function getPaginatedProducts(
  page: number = 1,
  size: number = 10,
  filters?: ProductFiltersRequest
): Promise<PaginatedResponse<Product>> {
  return await api.post("/product/paginated",
    {
      searchTerm: filters?.searchTerm || "",
      status: filters?.status !== undefined ? filters.status : 0,
      minPrice: filters?.minPrice || 0,
      maxPrice: filters?.maxPrice || 0,
    },
    {
      params: { page, size }
    }
  );
}

export async function getProductById(productId: string): Promise<ApiResponse<Product>> {
  return await api.get(`/product/${productId}`);
}

export async function createProduct(productData: createProductDto): Promise<ApiResponse<Product>> {
  return await api.post("/product", productData);
}

export async function deleteProduct(productId: string): Promise<ApiResponse<any>> {
  return await api.delete(`/product/${productId}`);
}

export async function increaseProductStock(productId: string, quantity: number, price: number): Promise<ApiResponse<any>> {
  const requestBody = {
    productId,
    quantity,
    price
  };
  return await api.post(`/product/${productId}/increase`, requestBody);
}

export async function bulkIncreaseProductStock(increaseProductDtos: Array<{ productId: string; quantity: number; price: number }>): Promise<ApiResponse<any>> {
  return await api.post("/product/bulk-increase", { increaseProductDtos });
}

export async function quickIncreaseProductStock(productId: string, quantity: number): Promise<ApiResponse<any>> {
  return await api.post(`/product/${productId}/increase`, quantity);
}

export async function bulkDecreaseProductStock(decreaseProductDtos: Array<{ productId: string; quantity: number }>): Promise<ApiResponse<any>> {
  return await api.post("/product/bulk-decrease", { decreaseProductDtos });
}

export async function getStockHistory(): Promise<ApiResponse<any[]>> {
  return await api.get("/product/stock-history");
}

export async function getProductStockHistory(productId: string): Promise<ApiResponse<any[]>> {
  return await api.get(`/product/${productId}/stock-history`);
}