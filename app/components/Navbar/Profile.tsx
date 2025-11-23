// app/components/Navbar/Profile.tsx
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
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Cartoon avatar component
  const CartoonAvatar = () => (
    <div className="relative">
      {/* Face */}
      <div
        className={clsx(
          "w-8 h-8 rounded-full relative overflow-hidden border-2",
          theme === "light"
            ? "bg-blue-500 border-blue-600"
            : "bg-blue-600 border-blue-500"
        )}
      >
        {/* Eyes */}
        <div className="absolute top-2 left-2 flex gap-2">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        {/* Smile */}
        <div className="absolute bottom-2 left-3 w-4 h-1 bg-white rounded-full"></div>
      </div>
      {/* Sparkle effect */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1 -right-1"
      >
        <Sparkles className="w-2 h-2 text-yellow-400" />
      </motion.div>
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Compact Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center gap-2 p-1.5 rounded-2xl transition-all duration-300 relative overflow-hidden group border",
          isAuthenticated
            ? clsx(
                theme === "light"
                  ? "bg-white border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm"
                  : "bg-slate-800 border-slate-600 hover:bg-slate-700 text-white"
              )
            : clsx(
                theme === "light"
                  ? "bg-blue-500 text-white border-blue-600 hover:bg-blue-600"
                  : "bg-blue-600 text-white border-blue-500 hover:bg-blue-700"
              )
        )}
      >
        {isAuthenticated ? (
          <>
            {/* Content */}
            <div className="relative z-10 flex items-center gap-2">
              {/* Cartoon Avatar */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative"
              >
                <CartoonAvatar />
              </motion.div>

              {/* User Info - Always visible in compact form */}
              <div className="hidden sm:block text-left">
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span
                      className={clsx(
                        "text-xs font-bold truncate max-w-[80px]",
                        theme === "light" ? "text-gray-800" : "text-white"
                      )}
                    >
                      {user?.name?.split(" ")[0] || "User"}
                    </span>
                  </div>
                  <div
                    className={clsx(
                      "text-[10px] font-medium truncate max-w-[80px]",
                      theme === "light" ? "text-gray-600" : "text-gray-300"
                    )}
                  >
                    {user?.email?.split("@")[0] || "Welcome!"}
                  </div>
                </div>
              </div>

              {/* Animated Chevron */}
              <motion.div
                animate={{
                  rotate: isOpen ? 180 : 0,
                  scale: isOpen ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
                className={clsx(
                  "w-3 h-3 transition-colors",
                  theme === "light" ? "text-gray-600" : "text-gray-300"
                )}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </div>
          </>
        ) : (
          /* Compact Not Authenticated State */
          <>
            <div
              className={clsx(
                "w-6 h-6 rounded-full flex items-center justify-center",
                theme === "light" ? "bg-white/20" : "bg-white/10"
              )}
            >
              <Shield className="w-3 h-3" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold">Login</div>
            </div>
          </>
        )}
      </button>

      {/* Enhanced Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={clsx(
              "absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 z-50 border backdrop-blur-lg",
              theme === "light"
                ? "bg-white border-gray-200 text-gray-900 shadow-gray-200"
                : "bg-slate-800 border-slate-600 text-white shadow-slate-900"
            )}
          >
            {isAuthenticated ? (
              <>
                {/* User Header */}
                <div
                  className={clsx(
                    "px-3 py-3 border-b",
                    theme === "light"
                      ? "border-gray-200 bg-gray-50"
                      : "border-slate-600 bg-slate-700"
                  )}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      {/* Larger Cartoon Avatar in dropdown */}
                      <div className="relative">
                        <div
                          className={clsx(
                            "w-12 h-12 rounded-full relative overflow-hidden border-2",
                            theme === "light"
                              ? "bg-blue-500 border-blue-600"
                              : "bg-blue-600 border-blue-500"
                          )}
                        >
                          {/* Eyes */}
                          <div className="absolute top-3 left-3 flex gap-3">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          {/* Smile */}
                          <div className="absolute bottom-3 left-4 w-6 h-1.5 bg-white rounded-full"></div>
                        </div>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute -top-1 -right-1"
                        >
                          <Sparkles className="w-3 h-3 text-yellow-400" />
                        </motion.div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={clsx(
                            "font-bold text-sm truncate",
                            theme === "light" ? "text-gray-900" : "text-white"
                          )}
                        >
                          {user?.name || "User"}
                        </h3>
                        <p
                          className={clsx(
                            "text-xs truncate mt-0.5",
                            theme === "light"
                              ? "text-gray-600"
                              : "text-gray-300"
                          )}
                        >
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span
                        className={clsx(
                          "text-xs font-medium",
                          theme === "light" ? "text-gray-600" : "text-gray-300"
                        )}
                      >
                        Active Now
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1 p-1.5">
                  {[
                    { icon: UserIcon, label: "My Profile" },
                    { icon: Settings, label: "Settings" },
                    { icon: Zap, label: "Upgrade to Pro" },
                  ].map((item, index) => (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{
                        scale: 1.02,
                        x: 2,
                      }}
                      className={clsx(
                        "flex items-center gap-2 px-2.5 py-2 text-xs transition-all duration-200 w-full rounded-lg group",
                        theme === "light"
                          ? "text-gray-700 hover:bg-gray-100"
                          : "text-gray-200 hover:bg-slate-700"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span>{item.label}</span>
                    </motion.button>
                  ))}

                  {/* Logout */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{
                      scale: 1.02,
                      x: 2,
                    }}
                    onClick={handleLogout}
                    className={clsx(
                      "flex items-center gap-2 px-2.5 py-2 text-xs transition-all duration-200 w-full rounded-lg border-t mt-1 pt-2 group",
                      theme === "light"
                        ? "text-red-600 hover:bg-red-50 border-gray-200"
                        : "text-red-400 hover:bg-red-900/20 border-slate-600"
                    )}
                  >
                    <LogOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>Sign Out</span>
                  </motion.button>
                </div>
              </>
            ) : (
              /* Login Dropdown */
              <>
                <div
                  className={clsx(
                    "px-3 py-3 border-b",
                    theme === "light"
                      ? "border-gray-200 bg-gray-50"
                      : "border-slate-600 bg-slate-700"
                  )}
                >
                  <h3
                    className={clsx(
                      "font-semibold text-sm",
                      theme === "light" ? "text-gray-900" : "text-white"
                    )}
                  >
                    Welcome to QualifAI
                  </h3>
                  <p
                    className={clsx(
                      "text-xs mt-0.5",
                      theme === "light" ? "text-gray-600" : "text-gray-300"
                    )}
                  >
                    Join thousands of agencies
                  </p>
                </div>

                <div className="space-y-1 p-1.5">
                  {[
                    {
                      icon: LogIn,
                      label: "Sign In",
                      href: "/login",
                    },
                    {
                      icon: User,
                      label: "Create Account",
                      href: "/register",
                    },
                  ].map((item, index) => (
                    <motion.a
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{
                        scale: 1.02,
                        x: 2,
                      }}
                      href={item.href}
                      className={clsx(
                        "flex items-center gap-2 px-2.5 py-2 text-xs transition-all duration-200 rounded-lg group",
                        theme === "light"
                          ? "text-gray-700 hover:bg-gray-100"
                          : "text-gray-200 hover:bg-slate-700"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span>{item.label}</span>
                    </motion.a>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
