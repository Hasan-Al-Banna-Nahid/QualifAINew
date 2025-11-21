// app/clientWrapper.tsx
"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useLayout } from "@/app/context/LayoutContext";
import Sidebar from "../components/Sidebar/Sidebar";
import { useEffect } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
  sidebarRoutes: any[];
}

export default function ClientLayout({
  children,
  sidebarRoutes,
}: ClientLayoutProps) {
  const { isAuthenticated } = useAuth();
  const { setSidebarOpen } = useLayout();

  // Initialize sidebar state based on authentication
  useEffect(() => {
    if (isAuthenticated) {
      setSidebarOpen(true); // Default to open when authenticated
    }
  }, [isAuthenticated, setSidebarOpen]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Only show when authenticated */}
      {isAuthenticated && <Sidebar routes={sidebarRoutes} />}

      {/* Main Content - Dynamic width based on sidebar */}
      <div
        className={`
        flex-1 transition-all duration-300 min-h-screen
        ${
          isAuthenticated ? "lg:ml-64" : "ml-0"
        } /* Adjust margin based on sidebar */
      `}
      >
        {children}
      </div>
    </div>
  );
}
