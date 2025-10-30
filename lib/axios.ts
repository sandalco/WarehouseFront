import axios from 'axios';
import { ApiResponse } from '@/types/api-response';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token təzələnməsi prosesi davam edərkən sorğuların saxlanması üçün
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token found in localStorage');
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
  async (error) => {
    console.log('API Error:', error)
    console.log('Error response:', error.response)
    console.log('Error response data:', error.response?.data)
    
    const originalRequest = error.config;
    
    // 401 xətası və token təzələnmə endpoint-i deyilsə
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/refresh-token') {
      if (isRefreshing) {
        // Token təzələnməsi davam edir, növbəyə əlavə et
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshTokenValue = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      
      if (!refreshTokenValue) {
        // Refresh token yoxdursa, logout et
        isRefreshing = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('token_expires_in');
          localStorage.removeItem('user');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }

      try {
        // Refresh token endpoint-ini çağır
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/refresh-token`,
          { RefreshToken: refreshTokenValue },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.isSuccess && response.data.data.access_token) {
          const { access_token, refresh_token, expires_in } = response.data.data;
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('token_expires_in', expires_in.toString());
          }
          
          // Header-i yenilə
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          
          // Növbədəki sorğuları işlə
          processQueue(null, access_token);
          isRefreshing = false;
          
          // Orijinal sorğunu təkrar göndər
          return api(originalRequest);
        } else {
          throw new Error('Token təzələnə bilmədi');
        }
      } catch (refreshError) {
        // Token təzələnə bilmədi, logout et
        processQueue(refreshError, null);
        isRefreshing = false;
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('token_expires_in');
          localStorage.removeItem('user');
          window.location.href = '/';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // Backend-dən gələn errors array-ini düzgün oxuyuruq
    let errors = []
    if (error.response?.data?.errors) {
      errors = error.response.data.errors
    } else if (error.response?.data?.Errors) {
      errors = error.response.data.Errors
    } else {
      errors = [error.message || 'Bilinməyən xəta baş verdi']
    }
    
    // Error response-u da standart formatda qaytarırıq
    const errorResponse: ApiResponse = {
      data: null,
      isSuccess: false,
      statusCode: error.response?.status || 500,
      errors: errors
    };
    
    console.log('Formatted error response:', errorResponse)
    return Promise.reject(errorResponse);
  }
);

export default api;
