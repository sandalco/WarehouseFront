import api from "../axios";
import { Customer } from "@/types/customer";
import { ApiResponse } from "@/types/api-response";

export async function getCustomers(): Promise<ApiResponse<Customer[]>> {
  return await api.get("/customer");
}

export async function getCustomerById(id: string): Promise<ApiResponse<Customer>> {
  return await api.get(`/customer/${id}`);
}

export async function createCustomer(customer: Omit<Customer, "id">): Promise<ApiResponse<Customer>> {
  return await api.post("/customer", customer);
}

export async function deleteCustomer(id: string): Promise<ApiResponse<any>> {
  return await api.delete(`/customer/${id}`);
}