import api from '../axios';
import { ApiResponse } from '@/types/api-response';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ValidateResetTokenRequest {
  token: string;
  uid: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
  token: string;
  userId: string;
}

export const forgotPassword = async (email: string): Promise<ApiResponse<null>> => {
  return api.post('/users/forgot-password', { email });
};

export const validateResetToken = async (token: string, uid: string): Promise<ApiResponse<boolean>> => {
  return api.post(`/users/reset-password/validate?token=${token}&uid=${uid}`);
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<ApiResponse<boolean>> => {
  return api.post('/users/reset-password', data);
};
