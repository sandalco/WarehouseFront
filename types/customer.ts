export interface CustomerAddress {
  city: string;
  district: string;
  street: string;
  zipCode: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address: CustomerAddress;
}