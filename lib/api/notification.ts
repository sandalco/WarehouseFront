import api from "../axios";
import { ApiResponse } from "@/types/api-response";
import { Notification } from "@/types/notification";

export async function getNotifications(): Promise<ApiResponse<Notification[]>> {
  return await api.get("/notification");
}

export async function markNotificationAsRead(id: string): Promise<ApiResponse<any>> {
  return await api.put(`/notification/${id}/read`);
}

export async function markAllNotificationsAsRead(): Promise<ApiResponse<any>> {
  return await api.put("/notification/read-all");
}

export async function deleteNotification(id: string): Promise<ApiResponse<any>> {
  return await api.delete(`/notification/${id}`);
}

export async function clearAllNotifications(): Promise<ApiResponse<any>> {
  return await api.delete("/notification/clear");
}
