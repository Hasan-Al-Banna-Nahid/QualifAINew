// app/context/AuthContext.tsx (FIXED)
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  useCurrentUser,
  useLogin,
  useLogout,
  useRegister,
  useGoogleSignIn,
} from "@/app/(main)/lib/hooks/useAuth";
import { User } from "@/app/(main)/lib/services/firebase-auth-services";
import {
  LoginFormData,
  RegisterFormData,
} from "@/app/(main)/lib/validations/auth";
import { useAuthRoute } from "./AuthRouteContext";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  authActionLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();
  const { intendedRoute, clearIntendedRoute } = useAuthRoute();

  const [hasJustLoggedIn, setHasJustLoggedIn] = useState(false);

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const googleSignInMutation = useGoogleSignIn();

  // Track if any auth action is in progress
  const authActionLoading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    googleSignInMutation.isPending;

  // Handle user loading errors (like offline errors)
  useEffect(() => {
    if (userError) {
      console.warn("User loading error (might be offline):", userError);
    }
  }, [userError]);

  // FIXED: Only redirect after successful login, not on every page load
  useEffect(() => {
    if (
      loginMutation.isSuccess &&
      user &&
      !authActionLoading &&
      hasJustLoggedIn
    ) {
      const redirectPath = intendedRoute || "/dashboard"; // Redirect to dashboard instead of home
      clearIntendedRoute();
      setHasJustLoggedIn(false);

      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    }
  }, [
    loginMutation.isSuccess,
    user,
    authActionLoading,
    intendedRoute,
    clearIntendedRoute,
    router,
    hasJustLoggedIn,
  ]);

  // FIXED: Only redirect after Google sign in
  useEffect(() => {
    if (googleSignInMutation.isSuccess && user && !authActionLoading) {
      const redirectPath = intendedRoute || "/dashboard"; // Redirect to dashboard instead of home
      clearIntendedRoute();

      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    }
  }, [
    googleSignInMutation.isSuccess,
    user,
    authActionLoading,
    intendedRoute,
    clearIntendedRoute,
    router,
  ]);

  // Handle registration success
  useEffect(() => {
    if (registerMutation.isSuccess && !registerMutation.isPending) {
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  }, [registerMutation.isSuccess, registerMutation.isPending, router]);

  // Handle errors
  useEffect(() => {
    if (loginMutation.error) {
      // Handle login error
    }

    if (registerMutation.error) {
      // Handle register error
    }

    if (googleSignInMutation.error) {
      // Handle Google sign in error
    }
  }, [loginMutation.error, registerMutation.error, googleSignInMutation.error]);

  const login = async (data: LoginFormData) => {
    setHasJustLoggedIn(true); // Mark that user just logged in
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      setHasJustLoggedIn(false); // Reset if login fails
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      // Error handled in useEffect
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: any) {
      // Handle logout error
    }
  };

  const signInWithGoogle = async () => {
    try {
      await googleSignInMutation.mutateAsync();
    } catch (error) {
      // Error handled in useEffect
    }
  };

  const value: AuthContextType = {
    user: user || null,
    isLoading: userLoading,
    isAuthenticated: !!user && !userLoading,
    login,
    register,
    logout,
    signInWithGoogle,
    authActionLoading,
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
