export interface CustomerAddress {
  city: string;
  district: string;
  street: string;
  zipCode: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: CustomerAddress;
  orderCount: number;
  lastOrderTime: string;
}

// Enum for customer sorting options
export enum CustomerSortBy {
  Name = 0,
  OrderCount = 1,
  LastOrder = 2
}