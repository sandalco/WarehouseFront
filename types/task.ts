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
  warehouse: string;
  customer: string;
  opened: string;
  openedBy: string;
  closed: string | null;
  closedBy: string | null;
  status: string | null;
  quantity: number;
  totalPrice: number;
  note: string;
  products: TaskProduct[];
}

export interface TasksResponse {
  data: Task[];
  isSuccess: boolean;
  statusCode: number;
  errors: string[] | null;
}
