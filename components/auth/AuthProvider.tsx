"use client";

import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";

import {
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser,
} from "@/lib/api/login";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  companyId: string;
  warehouseId?: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mövcud sessiyanı yoxla
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh_token");
    let valid = false;
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp && payload.exp > Date.now() / 1000) {
          valid = true;
        } else if (refreshToken) {
          // Token müddəti bitib, amma refresh token var
          // Bu halda token avtomatik təzələnəcək ilk API sorğusu zamanı
          valid = true;
        } else {
          // Nə token, nə də refresh token valid deyil
          apiLogout();
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token_expires_in");
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expires_in");
        setUser(null);
      }
    }
    
    if (savedUser && valid) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    try {
      const token = await apiLogin(email, password);
      if (token) {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        
        const user: User = {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.fullName,
          role: decoded.roles,
          companyId: decoded.company || decoded.companyId || "",
          warehouseId: decoded.warehouse || decoded.warehouseId,
        };

        if (user.id && user.email && user.name && user.role) {
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expires_in");
    apiLogout();
    // Router istifadə etmək əvəzinə window.location istifadə edirik
    // çünki bu metod müxtəlif komponentlərdən çağırıla bilər
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth AuthProvider daxilində istifadə edilməlidir");
  }
  return context;
}
