export interface TaskProduct {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  name: string;
  totalPrice: number;
  shelfCode: string | null;
}

export interface Task {
  id: string;
  opened: string;
  totalQuantity: number;
  productCount: number;
}

export interface TasksResponse {
  data: Task[];
  isSuccess: boolean;
  statusCode: number;
  errors: string[] | null;
}
