// app/clientWrapper.tsx (Updated)
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
  const { sidebarOpen, setSidebarOpen } = useLayout();

  // Initialize sidebar state based on authentication
  useEffect(() => {
    if (isAuthenticated) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [isAuthenticated, setSidebarOpen]);

  // Calculate margin based on sidebar state
  const getMainContentMargin = () => {
    if (!isAuthenticated) return "ml-0";
    return sidebarOpen ? "lg:ml-64" : "lg:ml-20";
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar - Only show when authenticated */}
      {isAuthenticated && <Sidebar routes={sidebarRoutes} />}

      {/* Main Content */}
      <div
        className={`
        flex-1 transition-all duration-300 w-full
        ${getMainContentMargin()}
      `}
      >
        {children}
      </div>
    </div>
  );
}
