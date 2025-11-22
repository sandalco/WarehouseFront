import axiosInstance from '../axios'
import { ApiResponse } from "@/types/api-response";
import { PaginatedResponse } from "@/types/paginated-response";

export interface TaskProduct {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  name: string
  totalPrice: number
  shelfCode: string | null
}

export interface Task {
  id: string
  opened: string
  totalQuantity: number
  productCount: number
}

export const tasksApi = {
  getTasks: async (): Promise<ApiResponse<Task[]>> => {
    return await axiosInstance.get('/Task')
  },

  getPaginatedTasks: async (page: number = 1, size: number = 10): Promise<PaginatedResponse<Task>> => {
    return await axiosInstance.get('/Task', {
      params: { page, size }
    })
  },
  
  getTaskById: async (taskId: string): Promise<ApiResponse<Task>> => {
    return await axiosInstance.get(`/Task/${taskId}`)
  },
  
  updateTaskStatus: async (taskId: string, status: string): Promise<ApiResponse<any>> => {
    return await axiosInstance.put(`/Task/${taskId}/status`, { status })
  },

  startTask: async (taskId: string): Promise<ApiResponse<any>> => {
    return await axiosInstance.put(`/Task/${taskId}/start`)
  },

  completeTask: async (taskId: string, products: Record<string, number>): Promise<ApiResponse<any>> => {
    return await axiosInstance.put(`/Task/${taskId}/complete`, { 
      products 
    })
  },

  getCompletedTasks: async (): Promise<ApiResponse<Task[]>> => {
    return await axiosInstance.get('/Task/completed')
  }
}
