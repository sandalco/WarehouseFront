import api from "../axios";
import { Order, OrderCreate } from "@/types/order";

// 1. Sifarişin statusunu al
export async function getOrderStatus(id: string): Promise<string> {
  const response = await api.get(`/order/${id}/status`);
  return response.data;
}

// 2. Şirkət üzrə bütün sifarişlər
export async function getOrdersByCompany(): Promise<Order[]> {
  const response = await api.get("/order/company");
  if (response.isSuccess) return response.data;
  throw new Error("Failed to fetch orders by company");
}

// 3. Anbar üzrə bütün sifarişlər
export async function getOrdersByWarehouse(warehouseId?: string): Promise<Order[]> {
  const response = await api.get("/order/warehouse", {
    params: warehouseId ? { warehouseId } : {},
  });
  if (response.isSuccess) return response.data;
  throw new Error("Failed to fetch orders by warehouse");
}

// 4. Statusa görə sifarişlər
export async function getOrdersByStatus(status: string): Promise<Order[]> {
  const response = await api.get(`/order/ByStatus/${status}`);
  if (response.isSuccess) return response.data;
  throw new Error("Failed to fetch orders by status");
}

// 5. Müştəriyə görə sifarişlər
export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
  const response = await api.get(`/order/ByCustomer/${customerId}`);
  if (response.isSuccess) return response.data;
  throw new Error("Failed to fetch orders by customer");
}

// 6. Sifarişi id ilə al
export async function getOrderById(id: string): Promise<Order> {
  const response = await api.get(`/order/${id}`);
  return response.data;
}

// 7. Sifarişin məhsullarını id ilə al
export async function getOrderProductsById(id: string) {
  const response = await api.get(`/order/${id}/products`);
  return response.data;
}

// 8. Yeni sifariş yarat
export async function createOrder(orderData: OrderCreate): Promise<Order> {
  const response = await api.post("/order", orderData);
  return response.data;
}

// 9. Sifarişi tamamla
export async function completeOrder(id: string, products: any[]): Promise<any> {
  const response = await api.post(`/order/${id}/complete`, { products });
  return response.data;
}

// 10. Sifarişi yenidən yoxla (retry)
export async function retryOrder(id: string): Promise<any> {
  const response = await api.post(`/order/${id}/retry`);
  return response.data;
}