import axios from 'axios';
import { ApiResponse } from '@/types/api-response';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Response artıq standart ApiResponse formatındadır
    return response.data;
  },
  (error) => {
    // Mərkəzi 401 yoxlaması
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Token-i təmizlə və login səhifəsinə yönləndir
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/';
      }
    }
    
    // Error response-u da standart formatda qaytarırıq
    const errorResponse: ApiResponse = {
      data: null,
      isSuccess: false,
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors || [error.message || 'Bilinməyən xəta baş verdi']
    };
    
    return Promise.reject(errorResponse);
  }
);

export default api;
