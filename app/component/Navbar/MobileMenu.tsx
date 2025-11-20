"use client";
import { useTheme } from "@/app/context/ThemeContext";
import clsx from "clsx";
import React, { useState } from "react";
import { routes } from "./Routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileMenu = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const pathname = usePathname(); // <--- get current path

  return (
    <div>
      {mobileMenuOpen && (
        <div
          className={clsx(
            "md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 transition-colors",
            theme === "light"
              ? "bg-white text-gray-900"
              : "bg-slate-900 text-blue-300"
          )}
        >
          {routes.map(
            (route) =>
              route.show !== false && (
                <Link
                  key={route.name}
                  href={route.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    pathname === route.href
                      ? "text-blue-600 font-semibold"
                      : theme === "light"
                      ? "hover:text-blue-800"
                      : "hover:text-blue-400"
                  )}
                >
                  {route.name}
                </Link>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
