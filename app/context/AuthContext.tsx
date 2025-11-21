// app/context/AuthContext.tsx
"use client";
import React, { createContext, useContext, useEffect } from "react";
import {
  useCurrentUser,
  useLogin,
  useLogout,
  useRegister,
} from "@/app/(main)/lib/hooks/useAuth";
import { User } from "@/app/(main)/lib/services/auth-service";
import {
  LoginFormData,
  RegisterFormData,
} from "@/app/(main)/lib/validations/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const login = async (data: LoginFormData) => {
    await loginMutation.mutateAsync(data);
  };

  const register = async (data: RegisterFormData) => {
    await registerMutation.mutateAsync(data);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const value: AuthContextType = {
    user: user || null,
    isLoading:
      isLoading || loginMutation.isPending || registerMutation.isPending,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
