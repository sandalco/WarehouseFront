import api from "../axios";
import { Customer, CustomerSortBy } from "@/types/customer";
import { ApiResponse, LookupItem } from "@/types/api-response";
import { PaginatedResponse } from "@/types/paginated-response";

export interface CustomerFiltersRequest {
  city?: string | null;
  search?: string | null;
  sortBy?: CustomerSortBy;
  sortDescending?: boolean;
}

export async function getCustomers(): Promise<ApiResponse<Customer[]>> {
  return await api.get("/customer");
}

export async function getPaginatedCustomers(
  page: number = 1,
  size: number = 10,
  filters?: CustomerFiltersRequest
): Promise<PaginatedResponse<Customer>> {
  return await api.post("/customer/paginated",
    {
      city: filters?.city || null,
      search: filters?.search || null,
      sortBy: filters?.sortBy !== undefined ? filters.sortBy : 0,
      sortDescending: filters?.sortDescending !== undefined ? filters.sortDescending : false,
    },
    {
      params: { page, size }
    }
  );
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

export async function getCustomerLookup(): Promise<ApiResponse<LookupItem[]>> {
  return await api.get("/customer/lookup");
}