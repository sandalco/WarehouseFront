import { createProductDto } from "@/types/product";
import api from "../axios";

interface ApiResponse<T = any> {
  data: T;
  isSuccess: boolean;
  statusCode: number;
  errors: any;
}

export async function getProducts() {
  try {
    const response = await api.get("/product") as ApiResponse;
    if (!response) {
      throw new Error("No data received from the server");
    }
    if (response.isSuccess) {
      return response.data;
    }
    throw new Error("Failed to fetch products");
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function getProductById(productId: string) {
  try {
    const response = await api.get(`/product/${productId}`) as ApiResponse;
    if (!response) {
      throw new Error("No data received from the server");
    }
    if (response.isSuccess) {
      return response.data;
    }
    throw new Error("Failed to fetch product");
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function createProduct(productData: createProductDto) {
  try {
    const response = await api.post("/product", productData) as ApiResponse;
    if (!response) {
      throw new Error("No data received from the server");
    }
    if (response.isSuccess) {
      return response.data;
    }
    throw new Error("Failed to create product");
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function deleteProduct(productId: string) {
  try {
    const response = await api.delete(`/product/${productId}`) as ApiResponse;
    if (!response) {
      throw new Error("No data received from the server");
    }
    if (response.isSuccess) {
      return response.data;
    }
    throw new Error(`Failed to delete product ${response.errors}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

export async function increaseProductStock(productId: string, quantity: number) {
  try {
    const response = await api.post(`/product/${productId}/increase`, quantity) as ApiResponse;
    console.log("Increase product stock response:", response);
    
    if (!response) {
      throw new Error("No data received from the server");
    }
    if (response.isSuccess) {
      return response.data;
    }
    throw new Error(`Failed to increase stock for product ${response.errors}`);
  } catch (error) {
    console.error("Error increasing product stock:", error);
    throw error;
  }
}

// Kütləvi məhsul artırma funksiyası
export async function bulkIncreaseProductStock(increaseProductDtos: Array<{ productId: string; quantity: number }>) {
  try {
    const response = await api.post("/product/bulk-increase", { increaseProductDtos }) as ApiResponse;
    console.log("Bulk increase product stock response:", response);
    
    if (!response) {
      throw new Error("No data received from the server");
    }
    
    if (response.isSuccess) {
      return response.data;
    }
    throw new Error(`Failed to bulk increase products: ${response.errors}`);
  } catch (error) {
    console.error("Error bulk increasing product stock:", error);
    throw error;
  }
}

// Sürətli artırma funksiyası (modal olmadan)
export async function quickIncreaseProductStock(productId: string, quantity: number) {
  try {
    const response = await api.post(`/product/${productId}/increase`,  quantity ) as ApiResponse;
    console.log("Quick increase product stock response:", response);
    
    if (!response) {
      throw new Error("No data received from the server");
    }
    
    if (response.isSuccess) {
      return response.data;
    }
    throw new Error(`Failed to quick increase stock for product ${response.errors}`);
  } catch (error) {
    console.error("Error quick increasing product stock:", error);
    throw error;
  }
}

// Kütləvi məhsul stok azaltma funksiyası
export async function bulkDecreaseProductStock(decreaseProductDtos: Array<{ productId: string; quantity: number }>) {
  try {
    const response = await api.post("/product/bulk-decrease", { decreaseProductDtos }) as ApiResponse;
    console.log("Bulk decrease product stock response:", response);
    
    if (!response) {
      throw new Error("No data received from the server");
    }
    
    if (response.isSuccess) {
      return response.data;
    }
    throw new Error(`Failed to bulk decrease products: ${response.errors}`);
  } catch (error) {
    console.error("Error bulk decreasing product stock:", error);
    throw error;
  }
}

export async function getStockHistory() {
  try {
    const response = await api.get("/product/stock-history") as ApiResponse;
    if (!response) {
      throw new Error("No data received from the server");
    }
    if (response.isSuccess) {
      return response;
    }
    throw new Error("Failed to fetch stock history");
  } catch (error) {
    console.error("Error fetching stock history:", error);
    throw error;
  }
}

export async function getProductStockHistory(productId: string) {
  try {
    const response = await api.get(`/product/${productId}/stock-history`) as ApiResponse;
    if (!response) {
      throw new Error("No data received from the server");
    }
    if (response.isSuccess) {
      return response;
    }
    throw new Error("Failed to fetch product stock history");
  } catch (error) {
    console.error("Error fetching product stock history:", error);
    throw error;
  }
}