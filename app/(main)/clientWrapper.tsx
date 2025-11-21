"use client";

import { ReactNode, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";

interface ClientLayoutProps {
  children: ReactNode;
  sidebarRoutes: any[];
}

export default function ClientLayout({
  children,
  sidebarRoutes,
}: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex">
      <Sidebar routes={sidebarRoutes} onToggle={setSidebarOpen} />
      <main
        className={`flex-1 relative p-4 transition-all duration-300`}
        style={{ marginLeft: sidebarOpen ? 256 : 80 }}
      >
        {children}
      </main>
    </div>
  );
}
