import axiosInstance from '../axios'
import { ApiResponse } from "@/types/api-response";

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
  warehouse: string
  customer: string
  opened: string
  openedBy: string
  closed: string | null
  closedBy: string | null
  status: string | null
  quantity: number
  totalPrice: number
  note: string
  products: TaskProduct[]
}

export const tasksApi = {
  getTasks: async (): Promise<ApiResponse<Task[]>> => {
    return await axiosInstance.get('/Task')
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
