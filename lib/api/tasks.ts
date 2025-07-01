import axiosInstance from '../axios'

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

export interface TasksResponse {
  data: Task[]
  isSuccess: boolean
  statusCode: number
  errors: string[] | null
}

export const tasksApi = {
  getTasks: async (): Promise<TasksResponse> => {
    const response = await axiosInstance.get('/Task')
    return response
  },
  
  getTaskById: async (taskId: string): Promise<{ data: Task; isSuccess: boolean; errors: string[] | null }> => {
    const response = await axiosInstance.get(`/Task/${taskId}`)
    return response
  },
  
  updateTaskStatus: async (taskId: string, status: string): Promise<{ isSuccess: boolean; errors: string[] | null }> => {
    const response = await axiosInstance.put(`/Task/${taskId}/status`, { status })
    return response
  },

  startTask: async (taskId: string): Promise<{ isSuccess: boolean; errors: string[] | null }> => {
    const response = await axiosInstance.put(`/Task/${taskId}/start`)
    return response
  },

  completeTask: async (taskId: string, products: Record<string, number>): Promise<{ isSuccess: boolean; errors: string[] | null }> => {
    const response = await axiosInstance.put(`/Task/${taskId}/complete`, { 
      products 
    })
    return response
  },

  getCompletedTasks: async (): Promise<TasksResponse> => {
    const response = await axiosInstance.get('/Task/completed')
    return response
  }
}
