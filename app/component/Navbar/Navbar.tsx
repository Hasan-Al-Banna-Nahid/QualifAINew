"use client";
import ThemeButton from "@/app/ui/Button/ThemeButton";
import Link from "next/link";
import { useState } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoPieChartOutline } from "react-icons/io5";
import clsx from "clsx";
import { useTheme } from "@/app/context/ThemeContext";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { usePathname } from "next/navigation"; // <--- import this

interface Route {
  name: string;
  href: string;
  show?: boolean;
}

interface NavbarProps {
  routes: Route[];
}

const Navbar = ({ routes }: NavbarProps) => {
  const [notifications, setNotifications] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const pathname = usePathname(); // <--- get current path

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav
      className={clsx(
        "w-full shadow-md transition-colors",
        theme === "light"
          ? "bg-white text-gray-900"
          : "bg-slate-900 text-blue-300"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left - Logo */}
          <div className="flex items-center space-x-2">
            <IoPieChartOutline className="text-3xl z-50" />
            <span className="font-bold text-xl z-50">QualifAI</span>
          </div>

          {/* Middle - Routes (Desktop) */}
          <div className="hidden md:flex space-x-6">
            {routes.map(
              (route) =>
                route.show !== false && (
                  <Link
                    key={route.name}
                    href={route.href}
                    className={clsx(
                      "transition-colors",
                      pathname === route.href
                        ? "text-blue-600 font-semibold" // <--- active route
                        : theme === "light"
                        ? "text-gray-700 hover:text-blue-800"
                        : "text-gray-100 hover:text-blue-400"
                    )}
                  >
                    {route.name}
                  </Link>
                )
            )}
          </div>

          {/* Right - Theme + Notifications + Profile */}
          <div className="flex items-center space-x-4">
            <ThemeButton />

            {/* Notifications */}
            <button
              className={clsx(
                "relative p-2 rounded-full transition-colors",
                theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-800"
              )}
            >
              <IoIosNotificationsOutline className="text-3xl" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
                  {notifications}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center",
                theme === "light"
                  ? "bg-gray-300 text-gray-900"
                  : "bg-gray-700 text-gray-200"
              )}
            >
              P
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className={clsx(
                  "p-2 rounded-md transition-colors",
                  theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-800"
                )}
              >
                {mobileMenuOpen ? (
                  <HiOutlineX className="text-2xl" />
                ) : (
                  <HiOutlineMenu className="text-2xl" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
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
    </nav>
  );
};

export default Navbar;
