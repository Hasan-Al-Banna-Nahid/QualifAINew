"use client";
import { useTheme } from "@/app/context/ThemeContext";
import clsx from "clsx";
import React, { useState } from "react";
import { routes } from "./Routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMenu, IoClose } from "react-icons/io5";

const MobileMenu = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      {/* Hamburger / Close Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={clsx(
          "p-2 rounded-md fixed top-4 left-4 z-50 shadow-md transition-colors",
          theme === "light"
            ? "bg-white text-gray-900"
            : "bg-slate-800 text-white"
        )}
      >
        {mobileMenuOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={clsx(
            "absolute top-16 left-0 w-full px-2 pt-2 pb-3 space-y-1 sm:px-3 transition-colors",
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
