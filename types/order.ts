export interface OrderAddress {
  city: string;
  district: string;
  street: string;
  zipCode: string;
}

export interface OrderProduct {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  name: string;
  totalPrice: number;
  shelfCode: string;
  // Köhnə sahələr (backwards compatibility)
  orderId?: string;
  order?: null;
  productName?: string;
  imageUrl?: string;
}

export interface InsufficientProduct {
  id: string | null;
  name: string;
  quantity: number;
}

export interface Order {
  id: string;
  warehouse: string;
  customer: string;
  opened: string;
  openedBy: string;
  closed: string | null;
  closedBy: string | null;
  status: string;
  quantity: number;
  totalPrice: number;
  note: string;
  products: OrderProduct[];
  insufficientProducts?: InsufficientProduct[];
  // Köhnə sahələr (backwards compatibility)
  companyId?: string;
  warehouseId?: string;
  warehouseName?: string;
  address?: OrderAddress;
}


export interface OrderCreateItem {
  productId: string;
  productName: string;
  unitPrice: number;
  imageUrl: string;
  quantity: number;
}

export interface OrderCreate {
  warehouseId: string;
  warehouseName: string;
  customerId: string;
  note: string;
  address: OrderAddress;
  orderItems: OrderCreateItem[];
}