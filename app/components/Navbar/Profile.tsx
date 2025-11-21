"use client";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { useAuth } from "@/app/context/AuthContext";
import clsx from "clsx";
import {
  User,
  LogIn,
  LogOut,
  Settings,
  User as UserIcon,
  BadgeAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface ProfileProps {
  isAuthenticated: boolean;
  user?: any;
}

export default function Profile({ isAuthenticated, user }: ProfileProps) {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="relative" ref={dropdownRef}>
        {/* Login Badge */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm border-2 transition-all duration-300 relative overflow-hidden group",
            theme === "light"
              ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700"
              : "bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600"
          )}
        >
          <BadgeAlert className="w-4 h-4" />
          <span>Login</span>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
        </motion.button>

        {/* Dropdown Menu for Non-Authenticated */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={clsx(
                "absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 z-50 border backdrop-blur-sm",
                theme === "light"
                  ? "bg-white/95 border-gray-200 text-gray-900"
                  : "bg-slate-800/95 border-slate-700 text-blue-300"
              )}
            >
              <Link
                href="/login"
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-blue-500 hover:text-white group rounded-lg mx-2 my-1",
                  theme === "light"
                    ? "text-gray-700 hover:text-white"
                    : "text-blue-300 hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>

              <Link
                href="/register"
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-green-500 hover:text-white group rounded-lg mx-2 my-1",
                  theme === "light"
                    ? "text-gray-700 hover:text-white"
                    : "text-blue-300 hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>Create Account</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Authenticated User Profile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center gap-3 p-2 rounded-xl transition-all duration-300 hover:shadow-lg",
          theme === "light"
            ? "hover:bg-gray-100 text-gray-700"
            : "hover:bg-slate-800 text-blue-300"
        )}
      >
        <div
          className={clsx(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2",
            theme === "light"
              ? "bg-blue-100 text-blue-600 border-blue-200"
              : "bg-blue-900/30 text-blue-300 border-blue-700/50"
          )}
        >
          {user?.name?.[0]?.toUpperCase() || <UserIcon className="w-4 h-4" />}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-semibold">{user?.name || "User"}</div>
          <div
            className={clsx(
              "text-xs",
              theme === "light" ? "text-gray-500" : "text-blue-400/70"
            )}
          >
            {user?.email || "Welcome back!"}
          </div>
        </div>
      </button>

      {/* Dropdown Menu for Authenticated Users */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={clsx(
              "absolute right-0 mt-2 w-56 rounded-xl shadow-lg py-2 z-50 border backdrop-blur-sm",
              theme === "light"
                ? "bg-white/95 border-gray-200 text-gray-900"
                : "bg-slate-800/95 border-slate-700 text-blue-300"
            )}
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
              <div className="text-sm font-semibold">
                {user?.name || "User"}
              </div>
              <div className="text-xs text-gray-500 dark:text-blue-400/70 truncate">
                {user?.email}
              </div>
            </div>

            {/* Menu Items */}
            <Link
              href="/profile"
              className={clsx(
                "flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-blue-500 hover:text-white group rounded-lg mx-2 my-1",
                theme === "light"
                  ? "text-gray-700 hover:text-white"
                  : "text-blue-300 hover:text-white"
              )}
              onClick={() => setIsOpen(false)}
            >
              <UserIcon className="w-4 h-4" />
              <span>My Profile</span>
            </Link>

            <Link
              href="/settings"
              className={clsx(
                "flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-blue-500 hover:text-white group rounded-lg mx-2 my-1",
                theme === "light"
                  ? "text-gray-700 hover:text-white"
                  : "text-blue-300 hover:text-white"
              )}
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-red-500 hover:text-white group rounded-lg mx-2 my-1 w-full text-left",
                theme === "light"
                  ? "text-gray-700 hover:text-white"
                  : "text-blue-300 hover:text-white"
              )}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
