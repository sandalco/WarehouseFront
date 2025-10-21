import api from '@/lib/axios'
import { ApiResponse } from '@/types/api-response'
import { ProfileData } from '@/types/profile'

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export const profileApi = {
  getProfile: async (): Promise<ApiResponse<ProfileData>> => {
    // axios interceptor artıq response.data qaytarır
    return await api.get('/profile')
  },
  
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<boolean>> => {
    return await api.post('/change-password', data)
  },
}
