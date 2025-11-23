// app/components/Navbar/Desktop.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import clsx from "clsx";
import { motion } from "framer-motion";

interface Route {
  name: string;
  href: string;
  show?: boolean;
  requiresAuth?: boolean;
}

interface DesktopProps {
  routes: Route[];
}

export default function Desktop({ routes }: DesktopProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Filter routes that should be shown in navigation
  const navRoutes = routes.filter((route) => route.show !== false);

  return (
    <div className="hidden md:flex space-x-8">
      {navRoutes.map((route) => {
        const isActive = pathname === route.href;

        return (
          <motion.div
            key={route.href}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={route.href}
              className={clsx(
                "px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative",
                isActive
                  ? isDark
                    ? "text-white bg-blue-600"
                    : "text-white bg-blue-600"
                  : isDark
                  ? "text-blue-300 hover:text-white hover:bg-slate-800"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              {route.name}
              {isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 rounded-md bg-blue-500/20 -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
