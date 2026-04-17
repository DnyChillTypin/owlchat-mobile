import React, { createContext, useContext, useEffect, useState } from "react";
import { secureStorage } from "@/lib/secure-storage";
import { login as loginService, logout as logoutService } from "@/services/account-service";
import type { LoginRequest } from "@/types/auth.type";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (params: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    console.log("[AuthProvider] Starting checkAuthStatus...");
    setLoading(true);
    
    // Fail-safe timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn("[AuthProvider] checkAuthStatus timed out after 3s. Forcing loading = false.");
      setLoading(false);
    }, 3000);

    try {
      console.log("[AuthProvider] Reading token from storage...");
      const token = await secureStorage.getItem("accessToken");
      console.log("[AuthProvider] Token found:", !!token);
      setIsAuthenticated(!!token);
    } catch (e) {
      console.error("[AuthProvider] Error checking auth status:", e);
      setIsAuthenticated(false);
    } finally {
      clearTimeout(timeout);
      console.log("[AuthProvider] checkAuthStatus complete, setting loading to false");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("[AuthProvider] Provider mounted, triggering checkAuthStatus");
    checkAuthStatus();
  }, []);

  const login = async (params: LoginRequest) => {
    const response = await loginService(params);
    if (!response.status) {
      throw new Error("Your account has been locked. Please contact support.");
    }
    await secureStorage.setItem("accessToken", response.accessToken);
    await secureStorage.setItem("refreshToken", response.refreshToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
        const token = await secureStorage.getItem("refreshToken");
        if (token) {
        await logoutService({ refreshToken: token });
        }
    } catch(e) {
        // ignore logout errors, we just want to clear tokens locally anyway
    } finally {
        await secureStorage.removeItem("accessToken");
        await secureStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};
