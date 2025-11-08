import api from "../axios";
import { Worker } from "@/types/worker";
import { ApiResponse, LookupItem } from "@/types/api-response";
import { PaginatedResponse } from "@/types/paginated-response";

export interface WorkerFiltersRequest {
  searchTerm?: string | null;
  warehouseId?: string | null;
  roleId?: string | null;
}

export async function getWorkers(): Promise<ApiResponse<Worker[]>> {
  return await api.get("/employee");
}

export async function getPaginatedWorkers(
  page: number = 1,
  size: number = 10,
  filters?: WorkerFiltersRequest
): Promise<PaginatedResponse<Worker>> {
  return await api.post("/employee/paginated",
    {
      searchTerm: filters?.searchTerm || "",
      warehouseId: filters?.warehouseId || "",
      roleId: filters?.roleId || "",
    },
    {
      params: { page, size }
    }
  );
}

export async function getWarehouseLookup(): Promise<ApiResponse<LookupItem[]>> {
  return await api.get("/warehouse/lookup");
}

export async function getRolesLookup(): Promise<ApiResponse<LookupItem[]>> {
  return await api.get("/roles/lookup");
}