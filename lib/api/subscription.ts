import { ActiveSubscription, SubscriptionHistory } from "@/types/subscription/subscriptionhistory";
import api from "../axios";

export async function getCurrentSubscription(): Promise<ActiveSubscription | null> {
    try {
        const response = await api.get("/subscription/my/active");
        if(!response.isSuccess){
            console.error("Failed to fetch current subscription:", response.errors);
            return null;
        }
        if (!response || !response.data) {
            throw new Error("No data received from the server");
        }
        if (response.isSuccess) {
            return response.data;
        }
        throw new Error("Failed to fetch current subscription");
    } catch (error) {
        console.error("Error fetching current subscription:", error);
        throw error;
    }
}

export async function getHistory(): Promise<SubscriptionHistory[]> {
  try {
    const response = await api.get("/subscription/my/history");
    if (!response || !response.data) {
      throw new Error("No data received from the server");
    }
    if (response.isSuccess) {
      return response.data;
    }
    throw new Error("Failed to fetch subscriptions");
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    throw error;
  }
}
