import api from "../axios";
import { Worker } from "@/types/worker";
import { ApiResponse } from "@/types/api-response";

export async function getWorkers(): Promise<ApiResponse<Worker[]>> {
  return await api.get("/employee");
}