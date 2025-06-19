import { createProductDto } from "@/types/product";
import api from "../axios";

export async function getProducts() {
  try {
    const response = await api.get("/product");
    if (!response || !response.data) {
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
    const response = await api.get(`/product/${productId}`);
    if (!response || !response.data) {
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
    const response = await api.post("/product", productData);
    if (!response || !response.data) {
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
    const response = await api.delete(`/product/${productId}`);
    if (!response || !response.data) {
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