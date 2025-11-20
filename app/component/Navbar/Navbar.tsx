"use client";
import ThemeButton from "@/app/ui/Button/ThemeButton";
import clsx from "clsx";
import { useTheme } from "@/app/context/ThemeContext";
import MobileMenu from "./MobileMenu";
import Profile from "./Profile";
import Notifications from "./Notifications";
import Desktop from "./Desktop";
import Logo from "./Logo";
import MobileMenuButton from "./MobileMenuButton";

const Navbar = () => {
  const { theme } = useTheme();

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
          <Logo />

          {/* Middle - Routes (Desktop) */}
          <Desktop />

          {/* Right - Theme + Notifications + Profile */}
          <div className="flex items-center space-x-4">
            <ThemeButton />

            {/* Notifications */}
            <Notifications />

            {/* Profile */}
            <Profile />

            {/* Mobile menu button */}
            <MobileMenuButton />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu />
    </nav>
  );
};

export default Navbar;
