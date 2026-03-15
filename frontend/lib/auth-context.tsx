"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (userData: User) => void
  logout: () => void
  register: (userData: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for saved user session
    const savedUser = sessionStorage.getItem("traffic_ai_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error("Failed to parse saved user", e)
        sessionStorage.removeItem("traffic_ai_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    sessionStorage.setItem("traffic_ai_user", JSON.stringify(userData))
  }

  const register = (userData: User) => {
    setUser(userData)
    sessionStorage.setItem("traffic_ai_user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem("traffic_ai_user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
