// app/components/Navbar/Navbar.tsx
"use client";
import ThemeButton from "@/app/components/ui/Button/ThemeButton";
import clsx from "clsx";
import { useTheme } from "@/app/context/ThemeContext";
import MobileMenu from "./MobileMenu";
import Profile from "./Profile";
import Notifications from "./Notifications";
import Desktop from "./Desktop";
import Logo from "./Logo";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Route {
  name: string;
  href: string;
  show?: boolean;
  requiresAuth?: boolean;
}

interface NavbarProps {
  routes: Route[];
}

const Navbar = ({ routes }: NavbarProps) => {
  const { theme } = useTheme();
  const { isAuthenticated, user, isLoading } = useAuth();
  const pathname = usePathname();

  // Filter routes based on authentication - only show routes that don't require auth or when authenticated
  const filteredRoutes = routes.filter((route) => {
    if (route.requiresAuth && !isAuthenticated) return false;
    return route.show !== false;
  });

  // Show loading state
  if (isLoading) {
    return (
      <nav
        className={clsx(
          "w-full fixed shadow-md transition-colors font-bold z-50",
          theme === "light"
            ? "bg-white text-gray-900"
            : "bg-slate-900 text-blue-300"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/">
              <Logo />
            </Link>
            <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-6 w-20 rounded"></div>
            <div className="flex items-center space-x-4">
              <ThemeButton />
              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-8 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={clsx(
        "w-full fixed shadow-md transition-colors font-bold z-50",
        theme === "light"
          ? "bg-white text-gray-900"
          : "bg-slate-900 text-blue-300"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left - Logo (Always visible) */}
          <Link href="/">
            <Logo />
          </Link>

          {/* Middle - Routes (Desktop) - Only show if authenticated */}
          {isAuthenticated && <Desktop routes={filteredRoutes} />}

          {/* Right - Theme + Profile (Always visible) */}
          <div className="flex items-center space-x-4">
            {/* Theme Button (Always visible) */}
            <ThemeButton />

            {/* Notifications - Only show if authenticated */}
            {isAuthenticated && <Notifications />}

            {/* Profile with auth status (Always visible, shows login dropdown when not authenticated) */}
            <Profile isAuthenticated={isAuthenticated} user={user} />

            {/* Mobile menu button - Only show if authenticated */}
            {isAuthenticated && (
              <div className="md:hidden">
                <MobileMenu routes={filteredRoutes} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Only show if authenticated */}
      {isAuthenticated && <MobileMenu routes={filteredRoutes} />}
    </nav>
  );
};

export default Navbar;
