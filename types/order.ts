export interface OrderAddress {
  city: string;
  district: string;
  street: string;
  zipCode: string;
}

export interface OrderProduct {
  orderId: string;
  order: null; // Əgər gələcəkdə order obyekti gələrsə, onu da əlavə edə bilərsən
  productId: string;
  productName: string;
  unitPrice: number;
  imageUrl: string;
  quantity: number;
  id: string;
}

export interface Order {
  id: string;
  opened: string;
  openedBy: string;
  closed: string | null;
  closedBy: string | null;
  companyId: string;
  warehouseId: string;
  warehouseName: string;
  customer: string;
  note: string;
  address: OrderAddress;
  products: OrderProduct[];
  status: string;
  totalPrice: number;
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
  address: OrderAddress;
  orderItems: OrderCreateItem[];
}