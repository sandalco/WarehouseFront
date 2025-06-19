import { Warehouse, CreateWarehouseDto } from "@/types/warehouse";
import api from "../axios";

export async function getWarehouses(): Promise<Warehouse[]> {
  try {
    const response = await api.get("/warehouse");
    if (!response || !response.data) {
      throw new Error("No data received from the server");
    }
    if (response.isSuccess) {
      return response.data;
    }
    throw new Error("Failed to fetch warehouses");
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    throw error;
  }
}

export async function createWarehouse(data: CreateWarehouseDto): Promise<Warehouse> {
  try {
    const response = await api.post("/warehouse", data);
    if (response.isSuccess) {
      return response.data;
    }
    else if (!response || !response.data) {
      throw new Error("No data received from the server");
    }
    throw new Error("Failed to create warehouse");
  } catch (error) {
    console.error("Error creating warehouse:", error);
    throw error;
  }
}

export async function deleteWarehouse(id: string): Promise<void> {
  try {
    const response = await api.delete(`/warehouse/${id}`);
    if (response.isSuccess) {
      return;
    }
    if (!response || !response.data) {
      throw new Error("No data received from the server");
    }
    throw new Error("Failed to delete warehouse");
  } catch (error) {
    console.error("Error deleting warehouse:", error);
    throw error;
  }
}
