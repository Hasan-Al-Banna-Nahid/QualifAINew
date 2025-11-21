"use client";

import clsx from "clsx";
import { useTheme } from "@/app/context/ThemeContext";

interface SidebarContainerProps {
  open: boolean;
  children: React.ReactNode;
}

export default function SidebarContainer({
  open,
  children,
}: SidebarContainerProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 h-full flex flex-col justify-between pt-20 border-r transition-all duration-300 z-40",
        isDark
          ? "bg-slate-900 border-slate-700 text-gray-200"
          : "bg-white border-gray-200 text-gray-900",
        open
          ? "w-64 translate-x-0"
          : "w-20 -translate-x-64 md:translate-x-0 md:w-20",
        "overflow-hidden"
      )}
    >
      {/* Links at top */}
      <div className="flex flex-col space-y-2 px-2">{children}</div>
    </aside>
  );
}
