"use client";
import { useEffect } from "react";
import SidebarContainer from "./SidebarContainer";
import SidebarItem from "./SidebarItem";
import SidebarToggle from "./SidebarToggle";
import { useAuth } from "@/app/context/AuthContext";
import { useLayout } from "@/app/context/LayoutContext";

interface SidebarProps {
  routes: {
    name: string;
    href: string;
    icon?: React.ReactNode;
    show?: boolean;
    requiresAuth?: boolean;
  }[];
  onToggle?: (open: boolean) => void;
}

export default function Sidebar({ routes, onToggle }: SidebarProps) {
  const { isAuthenticated } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useLayout();

  const handleToggle = (value: boolean) => {
    setSidebarOpen(value);
    if (onToggle) onToggle(value);
  };

  // Don't show sidebar if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Filter routes based on authentication
  const filteredRoutes = routes.filter((route) => {
    if (route.requiresAuth && !isAuthenticated) return false;
    return route.show !== false;
  });

  return (
    <SidebarContainer open={sidebarOpen}>
      <div className="flex flex-col space-y-2 px-2">
        {filteredRoutes.map((route) => (
          <SidebarItem
            key={route.href}
            name={route.name}
            href={route.href}
            icon={route.icon}
            open={sidebarOpen}
          />
        ))}
      </div>
      <SidebarToggle open={sidebarOpen} setOpen={handleToggle} />
    </SidebarContainer>
  );
}
