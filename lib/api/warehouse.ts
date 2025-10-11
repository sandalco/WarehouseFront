import { Warehouse, CreateWarehouseDto } from "@/types/warehouse";
import api from "../axios";
import { ApiResponse } from "@/types/api-response";

export async function getWarehouses(): Promise<ApiResponse<Warehouse[]>> {
  return await api.get("/warehouse");
}

export async function createWarehouse(data: CreateWarehouseDto): Promise<ApiResponse<Warehouse>> {
  return await api.post("/warehouse", data);
}

export async function deleteWarehouse(id: string): Promise<ApiResponse<any>> {
  return await api.delete(`/warehouse/${id}`);
}