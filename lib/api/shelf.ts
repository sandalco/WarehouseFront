import axiosInstance from '../axios';
import type { ShelfResponse, ShelfProductsResponse } from '@/types/shelf';

export const shelfApi = {
  // Bütün rəfləri gətir
  getAllShelves: async (): Promise<ShelfResponse> => {
    return await axiosInstance.get('/shelf');
  },

  // Müəyyən anbar üçün rəfləri gətir
  getShelvesByWarehouse: async (warehouseId: string): Promise<ShelfResponse> => {
    return await axiosInstance.get(`/shelf?warehouseId=${warehouseId}`);
  },

  // Müəyyən rəf üçün məhsulları gətir
  getShelfProducts: async (shelfCode: string): Promise<ShelfProductsResponse> => {
    return await axiosInstance.get(`/shelf/${shelfCode}/products`);
  },

  // Rəfə məhsul əlavə et
  addProductsToShelf: async (shelfCode: string, productIds: Record<string, number>): Promise<{ isSuccess: boolean; errors: string[] | null }> => {
    const response = await axiosInstance.post('/shelf/products', {
      shelfCode,
      productIds
    });
    return response;
  }
};
