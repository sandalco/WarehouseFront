import { ActiveSubscription, SubscriptionHistory } from "@/types/subscription/subscriptionhistory";
import api from "../axios";
import { ApiResponse, handleApiResponse, handleApiError } from "./types";

export interface SubscriptionPackage {
  id: number;
  name: string;
  price: number;
  code: string;
  durationInDays: number;
  features: string[];
  maxWarehouses: number;
  maxWorkers: number;
  maxCustomers: number;
  maxProducts: number;
  maxOrders: number;
  hasAdvancedReports: boolean;
  hasPrioritySupport: boolean;
  hasInventoryTracking: boolean;
  hasMultiLocationSupport: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getCurrentSubscription(): Promise<ActiveSubscription | null> {
    try {
        const response: ApiResponse<ActiveSubscription> = await api.get("/subscription/my/active");        
        if (!response.isSuccess || response.statusCode !== 200) {
            console.error("Failed to fetch current subscription:", response.errors);
            return null;
        }
        
        return handleApiResponse(response);
    } catch (error) {
        console.error("Error fetching current subscription:", error);
        return null; // Bu halda null qaytarırıq
    }
}

export async function getHistory(): Promise<SubscriptionHistory[]> {
  try {
    const response: ApiResponse<SubscriptionHistory[]> = await api.get("/subscription/my/history");
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error, "getHistory");
  }
}

export async function getSubscriptionPackages(): Promise<SubscriptionPackage[]> {
  try {
    const response: ApiResponse<SubscriptionPackage[]> = await api.get("/subscriptionpackages");
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error, "getSubscriptionPackages");
  }
}

export interface SubscriptionRequest {
  CompanyId: string;
  PackageCode: string;
}

export async function subscribeToPackage(subscriptionData: SubscriptionRequest): Promise<any> {
  try {
    const response: ApiResponse<any> = await api.post("/subscription", subscriptionData);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error, "subscribeToPackage");
  }
}

