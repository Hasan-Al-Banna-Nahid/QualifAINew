"use client";
import { useTheme } from "@/app/context/ThemeContext";
import clsx from "clsx";
import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const MobileMenuButton = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const { theme } = useTheme();
  return (
    <div>
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
  );
};

export default MobileMenuButton;
