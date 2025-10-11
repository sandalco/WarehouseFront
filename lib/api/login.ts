import api from "../axios";
import { ApiResponse } from "@/types/api-response";
import { safeJoinErrors } from "@/lib/api-helpers";

interface LoginResponse {
  access_token: string;
}

export async function login(email: string, password: string): Promise<string> {
  try {
    const response: ApiResponse<LoginResponse> = await api.post("/get-token", { email, password });
    
    if (response.isSuccess && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      return response.data.access_token;
    } else {
      throw new Error(safeJoinErrors(response.errors) || "Login failed");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    // error artıq ApiResponse formatındadır
    const errorMessage = safeJoinErrors(error.errors) || error.message || "Giriş xətası";
    throw new Error(errorMessage);
  }
}

export async function logout() {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response: ApiResponse<any> = await api.get("/auth/me");
    
    if (response.isSuccess) {
      return response.data;
    } else {
      throw new Error(safeJoinErrors(response.errors));
    }
  } catch (error: any) {
    console.error("Get current user error:", error);
    const errorMessage = safeJoinErrors(error.errors) || error.message || "İstifadəçi məlumatları alına bilmədi";
    throw new Error(errorMessage);
  }
}
