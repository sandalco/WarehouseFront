export interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellPrice: number;
  quantity: number;
  minRequire: number;
  status: string;
}

export interface createProductDto {
    name: string;
    description?: string;
    imageUrl?: string;
    purchasePrice: number;
    sellPrice: number;
    quantity: number;
    minRequire: number;
}
