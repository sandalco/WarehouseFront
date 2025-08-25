import axiosInstance from '../axios'

export async function getImportTemplate(type: string) {
  try {
    // Əgər inventory tipidirsə, stock-taking endpoint-ini istifadə et
    const endpoint = type === 'inventory' 
      ? '/templates/stock-taking'
      : `/templates/import/${type}`;
      
    const response = await axiosInstance.get(endpoint, {
      responseType: "blob", // Excel faylı üçün blob formatında cavab alınır
    });
    
    return response;
  } catch (error) {
    console.error("Error fetching template:", error);
    throw error;
  }
}

export async function getExportData(type: string) {
  try {
    const response = await axiosInstance.post(`/templates/export/${type}`, null, {
      responseType: "blob", // Excel faylı üçün blob formatında cavab alınır
    });
    return response;
  } catch (error) {
    console.error("Error fetching export data:", error);
    throw error;
  }
}

export async function getExportDataWithDateRange(type: string, startDate?: Date, endDate?: Date) {
  try {
    var data: Record<string, any> = {};
    if (startDate && endDate) {
      data = {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      };
    }

    const response = await axiosInstance.post(
      `/templates/export/${type}`,
      data,
      {
        responseType: "blob", // Excel faylı üçün blob formatında cavab alınır
      }
    );
    
    return response;
  } catch (error) {
    console.error("Error fetching export data with date range:", error);
    throw error;
  }
}
