"use client";
import { useState } from "react";
import SidebarContainer from "./SidebarContainer";
import SidebarItem from "./SidebarItem";
import SidebarToggle from "./SidebarToggle";

interface SidebarProps {
  routes: {
    name: string;
    href: string;
    icon?: React.ReactNode;
    show?: boolean;
  }[];
  onToggle?: (open: boolean) => void; // new
}

export default function Sidebar({ routes, onToggle }: SidebarProps) {
  const [desktopOpen, setDesktopOpen] = useState(true);

  const handleToggle = (value: boolean) => {
    setDesktopOpen(value);
    if (onToggle) onToggle(value); // inform parent
  };

  return (
    <SidebarContainer open={desktopOpen}>
      <div className="flex flex-col space-y-2 px-2">
        {routes.map(
          (route) =>
            route.show !== false && (
              <SidebarItem
                key={route.href}
                name={route.name}
                href={route.href}
                icon={route.icon}
                open={desktopOpen}
              />
            )
        )}
      </div>
      <SidebarToggle open={desktopOpen} setOpen={handleToggle} />
    </SidebarContainer>
  );
}
