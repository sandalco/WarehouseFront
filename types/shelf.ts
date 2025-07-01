export interface Shelf {
  id: string;
  code: string;
  warehouseID: string;
  itemsCount: number;
}

export interface ShelfResponse {
  data: Shelf[];
  isSuccess: boolean;
  statusCode: number;
  errors: string[] | null;
}

// Real API-dən gələn məhsul strukturu
export interface ShelfProduct {
  id: string;
  shelfID: string;
  shelf: any | null;
  quantity: number;
  productID: string;
  product: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    purchasePrice: number;
    sellPrice: number;
    quantity: number;
    minRequire: number;
    companyId: string;
    company: any | null;
    shelfProducts: any | null;
  };
}

export interface ShelfProductsResponse {
  data: ShelfProduct[];
  isSuccess: boolean;
  statusCode: number;
  errors: string[] | null;
}
