// Backend-dən gələn standart response formatı
export interface ApiResponse<T = any> {
  data: T;
  isSuccess: boolean;
  statusCode: number;
  errors: string[];
}

// API response-nu handle etmək üçün utility funksiya
export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess) {
    const errorMessage = response.errors?.join(", ") || "API request failed";
    throw new Error(errorMessage);
  }
  return response.data;
}

// Xəta hallarını handle etmək üçün
export function handleApiError(error: any, context: string): never {
  console.error(`Error in ${context}:`, error);
  
  // Əgər API response-dan gələn xətadırsa
  if (error?.response?.data?.errors) {
    throw new Error(error.response.data.errors.join(", "));
  }
  
  // Əgər bizim yaratdığımız xətadırsa
  if (error instanceof Error) {
    throw error;
  }
  
  // Default xəta mesajı
  throw new Error(`${context} failed`);
}
