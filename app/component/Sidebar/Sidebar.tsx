"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import clsx from "clsx";
import { useState } from "react";

import { IoMenu, IoClose } from "react-icons/io5";

interface RouteItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  show?: boolean;
}

interface SidebarProps {
  routes: RouteItem[];
}

export default function Sidebar({ routes }: SidebarProps) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isDark = theme === "dark";

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className={clsx(
          "md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg",
          isDark ? "bg-slate-800 text-white" : "bg-white text-gray-900"
        )}
        onClick={() => setOpen(!open)}
      >
        {open ? <IoClose size={26} /> : <IoMenu size={26} />}
      </button>

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-64 flex flex-col pt-20 px-4 border-r transition-all duration-300 z-40",
          isDark
            ? "bg-slate-900 border-slate-700 text-gray-200"
            : "bg-white border-gray-200 text-gray-900",
          open ? "translate-x-0" : "-translate-x-72 md:translate-x-0"
        )}
      >
        <div className="flex flex-col space-y-2">
          {routes.map(
            (route) =>
              route.show !== false && (
                <Link
                  key={route.href}
                  href={route.href}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                    pathname === route.href
                      ? isDark
                        ? "bg-slate-800 text-blue-300"
                        : "bg-blue-100 text-blue-700"
                      : isDark
                      ? "hover:bg-slate-800"
                      : "hover:bg-gray-100"
                  )}
                >
                  {route.icon && <span className="text-xl">{route.icon}</span>}
                  {route.name}
                </Link>
              )
          )}
        </div>
      </aside>
    </>
  );
}
