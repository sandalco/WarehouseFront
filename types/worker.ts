export interface Worker {
  id: string;
  roles: string[];
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  companyId: string | null;
  warehouseId: string;
}
