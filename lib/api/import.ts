import axiosInstance from '../axios'

export async function importProducts(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/product/import-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error importing products:", error);
    throw error;
  }
}

// Digər tipləri də burada əlavə edəcəyik
export async function importWarehouses(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/warehouse/import-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error importing warehouses:", error);
    throw error;
  }
}

export async function importCustomers(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/customer/import-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error importing customers:", error);
    throw error;
  }
}

export async function importOrders(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/order/import-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error importing orders:", error);
    throw error;
  }
}

export async function importShelves(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/shelf/import-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error importing shelves:", error);
    throw error;
  }
}

// Generic import funksiyası - tip əsasında müvafiq funksiyasını çağırır
export async function importData(type: "products" | "warehouses" | "customers" | "orders" | "shelves", file: File) {
  switch (type) {
    case 'products':
      return await importProducts(file);
    case 'warehouses':
      return await importWarehouses(file);
    case 'customers':
      return await importCustomers(file);
    case 'orders':
      return await importOrders(file);
    case 'shelves':
      return await importShelves(file);
    default:
      throw new Error(`Unsupported import type: ${type}`);
  }
}
