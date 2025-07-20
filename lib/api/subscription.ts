import { ActiveSubscription, SubscriptionHistory } from "@/types/subscription/subscriptionhistory";
import api from "../axios";

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
        const response = await api.get("/subscription/my/active");
        console.log("Current subscription fetched:", response);
        
        if(response.statusCode !== 200){
            console.error("Failed to fetch current subscription:", response.errors);
            return null;
        }
        if (!response.data) {
            throw new Error("No data received from the server");
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching current subscription:", error);
        throw error;
    }
}

export async function getHistory(): Promise<SubscriptionHistory[]> {
  try {
    const response = await api.get("/subscription/my/history");
    if (!response.data) {
      throw new Error("No data received from the server");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    throw error;
  }
}

export async function getSubscriptionPackages(): Promise<SubscriptionPackage[]> {
  try {
    const response = await api.get("/subscriptionpackages");
    console.log("Subscription packages fetched:", response);
    
    if (!response.data) {
      throw new Error("No data received from the server");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching subscription packages:", error);
    throw error;
  }
}

export interface SubscriptionRequest {
  CompanyId: string;
  PackageCode: string;
}

export async function subscribeToPackage(subscriptionData: SubscriptionRequest): Promise<any> {
  try {
    const response = await api.post("/subscription", subscriptionData);
    console.log("Subscription created:", response);
    
    if (!response.data) {
      throw new Error("No data received from the server");
    }
    return response.data;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
}

