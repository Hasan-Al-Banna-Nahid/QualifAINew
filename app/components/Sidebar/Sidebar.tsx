"use client";
import { useState } from "react";
import SidebarContainer from "./SidebarContainer";
import SidebarItem from "./SidebarItem";
import SidebarToggle from "./SidebarToggle";
import { useAuth } from "@/app/context/AuthContext";

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
  const [desktopOpen, setDesktopOpen] = useState(true);
  const { isAuthenticated } = useAuth();

  const handleToggle = (value: boolean) => {
    setDesktopOpen(value);
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
    <SidebarContainer open={desktopOpen}>
      <div className="flex flex-col space-y-2 px-2">
        {filteredRoutes.map((route) => (
          <SidebarItem
            key={route.href}
            name={route.name}
            href={route.href}
            icon={route.icon}
            open={desktopOpen}
          />
        ))}
      </div>
      <SidebarToggle open={desktopOpen} setOpen={handleToggle} />
    </SidebarContainer>
  );
}
