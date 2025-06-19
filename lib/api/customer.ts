import api from "../axios";
import { Customer } from "@/types/customer";

export async function getCustomers(): Promise<Customer[]> {
  try {
    const response = await api.get("/customer");
    if (!response || !response.data) throw new Error("No data received from the server");
    if (response.isSuccess) return response.data;
    throw new Error("Failed to fetch customers");
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
}

export async function getCustomerById(id: string): Promise<Customer> {
  try {
    const response = await api.get(`/customer/${id}`);
    if (!response || !response.data) throw new Error("No data received from the server");
    if (response.isSuccess) return response.data;
    throw new Error("Failed to fetch customer");
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
}

export async function createCustomer(customer: Omit<Customer, "id">): Promise<Customer> {
  try {
    const response = await api.post("/customer", customer);
    if (!response || !response.data) throw new Error("No data received from the server");
    if (response.isSuccess) return response.data;
    throw new Error("Failed to create customer");
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  try {
    const response = await api.delete(`/customer/${id}`);
    if (!response || !response.data) throw new Error("No data received from the server");
    if (response.isSuccess) return;
    throw new Error("Failed to delete customer");
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
}