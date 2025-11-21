// app/components/Auth/PrivateRoute.tsx
"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export default function PrivateRoute({
  children,
  fallbackPath = "/login",
}: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(fallbackPath);
    }
  }, [isAuthenticated, isLoading, router, fallbackPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
