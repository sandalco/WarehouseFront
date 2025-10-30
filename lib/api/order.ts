import api from "../axios";
import { Order, OrderCreate } from "@/types/order";
import { ApiResponse } from "@/types/api-response";
import { PaginatedResponse } from "@/types/paginated-response";

export interface OrderFiltersRequest {
  customerId?: string | null;
  status?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
}

// 1. Sifarişin statusunu al
export async function getOrderStatus(id: string): Promise<ApiResponse<string>> {
  return await api.get(`/order/${id}/status`);
}

// 2. Şirkət üzrə bütün sifarişlər (paginated with filters)
export async function getOrdersByCompany(
  page: number = 1, 
  size: number = 10,
  filters?: OrderFiltersRequest
): Promise<PaginatedResponse<Order>> {
  return await api.post("/order/company", 
    {
      customerId: filters?.customerId || null,
      status: filters?.status || null,
      fromDate: filters?.fromDate || null,
      toDate: filters?.toDate || null,
    },
    {
      params: { page, size }
    }
  );
}

// 3. Anbar üzrə bütün sifarişlər
export async function getOrdersByWarehouse(warehouseId?: string): Promise<ApiResponse<Order[]>> {
  return await api.get("/order/warehouse", {
    params: warehouseId ? { warehouseId } : {},
  });
}

// 4. Statusa görə sifarişlər
export async function getOrdersByStatus(status: string): Promise<ApiResponse<Order[]>> {
  return await api.get(`/order/ByStatus/${status}`);
}

// 5. Müştəriyə görə sifarişlər
export async function getOrdersByCustomer(customerId: string): Promise<ApiResponse<Order[]>> {
  return await api.get(`/order/ByCustomer/${customerId}`);
}

// 6. Sifarişi id ilə al
export async function getOrderById(id: string): Promise<ApiResponse<Order>> {
  return await api.get(`/order/${id}`);
}

// 7. Sifarişin məhsullarını id ilə al
export async function getOrderProductsById(id: string): Promise<ApiResponse<any>> {
  return await api.get(`/order/${id}/products`);
}

// 8. Yeni sifariş yarat
export async function createOrder(orderData: OrderCreate): Promise<ApiResponse<Order>> {
  return await api.post("/order", orderData);
}

// 9. Sifarişi tamamla
export async function completeOrder(id: string, products: any[]): Promise<ApiResponse<any>> {
  return await api.post(`/order/${id}/complete`, { products });
}

// 10. Sifarişi yenidən yoxla (retry)
export async function retryOrder(id: string): Promise<ApiResponse<any>> {
  return await api.post(`/order/${id}/retry`);
}