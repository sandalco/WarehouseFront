import { ApiResponse } from '@/types/api-response'

/**
 * API response-u handle edən utility funksiya
 * @param response - API response
 * @param onSuccess - Uğurlu cavab üçün callback
 * @param onError - Xəta üçün callback
 */
export const handleApiResponse = <T>(
  response: ApiResponse<T>,
  onSuccess: (data: T) => void,
  onError: (errors: string[]) => void
) => {
  if (response.isSuccess) {
    onSuccess(response.data)
  } else {
    onError(response.errors as string[])
  }
}

/**
 * Errors array-ni safely string-ə çevir
 */
export const safeJoinErrors = (errors: any): string => {
  if (errors && Array.isArray(errors)) {
    return errors.join(", ")
  }
  return "Bilinməyən xəta baş verdi"
}

/**
 * API xətasını handle edən utility funksiya
 * @param error - Catch-dən gələn xəta
 * @returns Formatted error message
 */
export const handleApiError = (error: any): string => {
  return safeJoinErrors(error.errors) || error.message || "Bilinməyən xəta baş verdi"
}

/**
 * Loading state-ini manage edən hook-like utility
 * Axios interceptor ApiResponse formatında data qaytarır
 */
export const createApiCall = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  setLoading: (loading: boolean) => void,
  onSuccess: (data: T) => void,
  onError: (message: string) => void
) => {
  try {
    setLoading(true)
    console.log('Making API call...')
    const response = await apiCall()
    console.log('Raw API response:', response)
    
    if (response && response.isSuccess) {
      console.log('Success response data:', response.data)
      onSuccess(response.data)
    } else {
      console.log('Error response:', response)
      const errorMessage = safeJoinErrors(response?.errors) || "API sorğusu uğursuz oldu"
      onError(errorMessage)
    }
  } catch (error: any) {
    console.log('Caught error:', error)
    onError(handleApiError(error))
  } finally {
    setLoading(false)
  }
}
