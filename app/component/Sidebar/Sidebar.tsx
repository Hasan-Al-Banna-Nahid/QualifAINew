"use client";

import { useState } from "react";
import SidebarContainer from "./SidebarContainer";
import SidebarToggle from "./SidebarToggle";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  routes: {
    name: string;
    href: string;
    icon?: React.ReactNode;
    show?: boolean;
  }[];
}

export default function Sidebar({ routes }: SidebarProps) {
  const [open, setOpen] = useState(true); // default open

  return (
    <SidebarContainer open={open}>
      <div className="flex flex-col space-y-2">
        {routes.map(
          (route) =>
            route.show !== false && (
              <SidebarItem
                key={route.href}
                name={route.name}
                href={route.href}
                icon={route.icon}
                open={open}
              />
            )
        )}
      </div>
      <SidebarToggle open={open} setOpen={setOpen} />
    </SidebarContainer>
  );
}
