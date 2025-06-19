import api from "../axios";

export async function getImportTemplate(type: string) {
  try {
    const response = await api.get(`/templates/import/${type}`, {
      responseType: "blob", // Excel faylı üçün blob formatında cavab alınır
    });
    return response;
  } catch (error) {
    console.error("Error fetching template:", error);
    throw error;
  }
}
