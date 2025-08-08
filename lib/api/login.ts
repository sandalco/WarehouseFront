import { log } from "console";
import api from "../axios";

export async function login(email: string, password: string) {
  try {
    const response = await api.post("/get-token", { email, password });
      console.log(response);
    if (response.data.access_token !== null) {
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", response.data.access_token);
      }
      
      return response.data.access_token;
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function logout() {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
}
