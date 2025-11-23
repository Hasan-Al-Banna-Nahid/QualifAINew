// app/context/AuthRouteContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AuthRouteContextType {
  intendedRoute: string | null;
  setIntendedRoute: (route: string) => void;
  clearIntendedRoute: () => void;
  isRedirecting: boolean;
}

const AuthRouteContext = createContext<AuthRouteContextType | undefined>(
  undefined
);

export function AuthRouteProvider({ children }: { children: React.ReactNode }) {
  const [intendedRoute, setIntendedRoute] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Store intended route when user visits auth pages
  useEffect(() => {
    const authPages = ["/login", "/register"];
    const isAuthPage = authPages.some((page) => pathname.startsWith(page));

    if (!isAuthPage && pathname !== "/") {
      setIntendedRoute(pathname);
    }
  }, [pathname]);

  const handleSetIntendedRoute = (route: string) => {
    setIntendedRoute(route);
  };

  const handleClearIntendedRoute = () => {
    setIntendedRoute(null);
  };

  return (
    <AuthRouteContext.Provider
      value={{
        intendedRoute,
        setIntendedRoute: handleSetIntendedRoute,
        clearIntendedRoute: handleClearIntendedRoute,
        isRedirecting,
      }}
    >
      {children}
    </AuthRouteContext.Provider>
  );
}

export function useAuthRoute() {
  const context = useContext(AuthRouteContext);
  if (context === undefined) {
    throw new Error("useAuthRoute must be used within an AuthRouteProvider");
  }
  return context;
}
