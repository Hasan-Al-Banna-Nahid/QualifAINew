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
} from "@/app/(main)/hooks/useAuth";
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
  const [lastAuthAction, setLastAuthAction] = useState<
    "login" | "google" | "register" | null
  >(null);

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

  // FIXED: Only redirect after successful login when coming from auth pages
  useEffect(() => {
    // Only redirect if user just logged in and we're on an auth-related page
    const isAuthPage =
      pathname?.includes("/login") ||
      pathname?.includes("/register") ||
      pathname === "/";

    if (
      loginMutation.isSuccess &&
      user &&
      !authActionLoading &&
      hasJustLoggedIn &&
      isAuthPage
    ) {
      const redirectPath = intendedRoute || "/qualifai";
      clearIntendedRoute();
      setHasJustLoggedIn(false);

      console.log(
        `🔄 Redirecting from ${pathname} to ${redirectPath} after login`
      );

      setTimeout(() => {
        router.push(redirectPath);
      }, 500);
    }
  }, [
    loginMutation.isSuccess,
    user,
    authActionLoading,
    intendedRoute,
    clearIntendedRoute,
    router,
    hasJustLoggedIn,
    pathname,
  ]);

  // FIXED: Only redirect after Google sign in when coming from auth pages
  useEffect(() => {
    const isAuthPage =
      pathname?.includes("/login") ||
      pathname?.includes("/register") ||
      pathname === "/";

    if (
      googleSignInMutation.isSuccess &&
      user &&
      !authActionLoading &&
      isAuthPage
    ) {
      const redirectPath = intendedRoute || "/qualifai";
      clearIntendedRoute();

      console.log(
        `🔄 Redirecting from ${pathname} to ${redirectPath} after Google sign in`
      );

      setTimeout(() => {
        router.push(redirectPath);
      }, 500);
    }
  }, [
    googleSignInMutation.isSuccess,
    user,
    authActionLoading,
    intendedRoute,
    clearIntendedRoute,
    router,
    pathname,
  ]);

  // Handle registration success - redirect to login
  useEffect(() => {
    const isAuthPage = pathname?.includes("/register") || pathname === "/";

    if (
      registerMutation.isSuccess &&
      !registerMutation.isPending &&
      isAuthPage
    ) {
      console.log("✅ Registration successful, redirecting to login");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  }, [
    registerMutation.isSuccess,
    registerMutation.isPending,
    router,
    pathname,
  ]);

  // Handle logout success
  useEffect(() => {
    if (logoutMutation.isSuccess && !logoutMutation.isPending) {
      console.log("✅ Logout successful, redirecting to home");

      // Clear any intended routes
      clearIntendedRoute();

      setTimeout(() => {
        router.push("/");
      }, 500);
    }
  }, [
    logoutMutation.isSuccess,
    logoutMutation.isPending,
    router,
    clearIntendedRoute,
  ]);

  // Handle errors
  useEffect(() => {
    if (loginMutation.error) {
      console.error("Login error:", loginMutation.error);
      setHasJustLoggedIn(false); // Reset login state on error
    }

    if (registerMutation.error) {
      console.error("Registration error:", registerMutation.error);
    }

    if (googleSignInMutation.error) {
      console.error("Google sign in error:", googleSignInMutation.error);
    }
  }, [loginMutation.error, registerMutation.error, googleSignInMutation.error]);

  const login = async (data: LoginFormData) => {
    setHasJustLoggedIn(true);
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      setHasJustLoggedIn(false);
      throw error; // Re-throw to handle in component
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
      throw error; // Re-throw to handle in component
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: any) {
      console.error("Logout error:", error);
      throw error; // Re-throw to handle in component
    }
  };

  const signInWithGoogle = async () => {
    try {
      await googleSignInMutation.mutateAsync();
    } catch (error) {
      throw error; // Re-throw to handle in component
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
