export interface ApiResponse<T = any> {
  data: T
  isSuccess: boolean
  statusCode: number
  errors: readonly string[]
}

// Specific response types
export interface ApiCollectionResponse<T = any> extends ApiResponse<T[]> {}

export interface ApiSingleResponse<T = any> extends ApiResponse<T> {}