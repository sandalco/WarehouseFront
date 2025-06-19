import api from "../axios";
import { Worker } from "@/types/worker";

export async function getWorkers(): Promise<Worker[]> {
  try {
    const response = await api.get("/employee");
    if (!response || !response.data) throw new Error("No data received from the server");
    if (response.isSuccess) return response.data;
    throw new Error("Failed to fetch workers");
  } catch (error) {
    console.error("Error fetching workers:", error);
    throw error;
  }
}