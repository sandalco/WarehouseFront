import api from "../axios";
import { ApiResponse } from "@/types/api-response";
import { safeJoinErrors } from "@/lib/api-helpers";

interface LoginResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  scope: string;
}

export async function login(email: string, password: string): Promise<string> {
  try {
    const response: ApiResponse<LoginResponse> = await api.post("/get-token", { email, password });
    
    if (response.isSuccess && response.data) {
      const tokenData = response.data;
      localStorage.setItem("token", tokenData.access_token);
      localStorage.setItem("refresh_token", tokenData.refresh_token);
      localStorage.setItem("token_expires_in", tokenData.expires_in.toString());
      return tokenData.access_token;
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

export async function refreshToken(): Promise<string> {
  try {
    const refreshTokenValue = localStorage.getItem("refresh_token");
    if (!refreshTokenValue) {
      throw new Error("Refresh token tapılmadı");
    }

    const response: ApiResponse<LoginResponse> = await api.post("/refresh-token", {
      RefreshToken: refreshTokenValue
    });
    
    if (response.isSuccess && response.data) {
      const tokenData = response.data;
      localStorage.setItem("token", tokenData.access_token);
      localStorage.setItem("refresh_token", tokenData.refresh_token);
      localStorage.setItem("token_expires_in", tokenData.expires_in.toString());
      return tokenData.access_token;
    } else {
      throw new Error(safeJoinErrors(response.errors) || "Token təzələnə bilmədi");
    }
  } catch (error: any) {
    console.error("Refresh token error:", error);
    // Token təzələnə bilmirsə, logout et
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expires_in");
    
    const errorMessage = safeJoinErrors(error.errors) || error.message || "Token təzələnə bilmədi";
    throw new Error(errorMessage);
  }
}

export async function logout() {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expires_in");
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
