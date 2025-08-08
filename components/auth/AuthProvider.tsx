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
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    // Mövcud sessiyanı yoxla
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    let valid = false;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp && payload.exp > Date.now() / 1000) {
          valid = true;
        } else {
          apiLogout();
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
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
    // Mock autentifikasiya - real tətbiqdə bu API çağırışı olacaq
    try {
      const token = await apiLogin(email, password);
      if (token) {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const user: User = {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.fullName,
          role: decoded.roles,
          companyId: decoded.company,
          warehouseId: decoded.warehouse,
        };

        if (user.id && user.email && user.name && user.role && user.companyId) {
          setUser(user);
          if (typeof window !== 'undefined') {
            localStorage.setItem("user", JSON.stringify(user));
          }
          return true;
        } else {
          // Əgər user məlumatı natamamdırsa, login uğursuz sayılır
          return false;
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }

    const mockUsers = [
      {
        id: "1",
        email: "rehber@sirket.com",
        name: "Əli Rəhbər",
        role: "rəhbər" as const,
        companyId: "comp1",
      },
      {
        id: "2",
        email: "isci@sirket.com",
        name: "Ayşə İşçi",
        role: "anbarçı" as const,
        companyId: "comp1",
        warehouseId: "wh1",
      },
    ];

    const foundUser = mockUsers.find((u) => u.email === email);
    if (foundUser && password === "password") {
      setUser(foundUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(foundUser));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    apiLogout();
    // Router istifadə etmək əvəzinə window.location istifadə edirik
    // çünki bu metod müxtəlif komponentlərdən çağırıla bilər
    if (typeof window !== 'undefined') {
      window.location.href = "/";
    }
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
