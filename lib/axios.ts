import axios from 'axios';
import { ApiResponse } from '@/types/api-response';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('Axios baseURL configured as:', process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000')

api.interceptors.request.use((config) => {
  console.log('Making request to:', (config.baseURL || '') + (config.url || ''))
  console.log('Full config:', config)
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
    console.log('API Response:', response)
    console.log('API Response Data:', response.data)
    // Response artıq standart ApiResponse formatındadır
    return response.data;
  },
  (error) => {
    console.log('API Error:', error)
    console.log('Error response:', error.response)
    
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
    
    console.log('Formatted error response:', errorResponse)
    return Promise.reject(errorResponse);
  }
);

export default api;
