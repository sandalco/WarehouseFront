export interface PaginatedResponse<T> {
  data: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isSuccess: boolean;
  errors: string[] | null;
  statusCode: number;
}
