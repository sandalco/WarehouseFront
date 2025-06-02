"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  email: string
  name: string
  role: "rəhbər" | "anbarçı"
  companyId: string
  warehouseId?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mövcud sessiyanı yoxla
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock autentifikasiya - real tətbiqdə bu API çağırışı olacaq
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
    ]

    const foundUser = mockUsers.find((u) => u.email === email)
    if (foundUser && password === "password") {
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth AuthProvider daxilində istifadə edilməlidir")
  }
  return context
}
