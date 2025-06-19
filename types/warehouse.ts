export interface Warehouse {
  id: string;
  name: string;
  shelves: number;
  googleMaps?: string;
  city?: string;
  state?: string;
  street?: string;
  zipCode?: string;
}

export interface CreateWarehouseDto {
  name: string;
  shelves: number;
  googleMaps?: string;
  city?: string;
  state?: string;
  street?: string;
  zipCode?: string;
}