"use client";

import clsx from "clsx";
import { useTheme } from "@/app/context/ThemeContext";
import { IoMenu, IoArrowBack } from "react-icons/io5";

interface SidebarToggleProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mobile?: boolean;
}

export default function SidebarToggle({
  open,
  setOpen,
  mobile,
}: SidebarToggleProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={clsx(
        "w-full mt-auto pb-4",
        !open && "flex justify-center items-center"
      )}
    >
      <button
        className={clsx(
          "p-2 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer",
          isDark ? "bg-slate-800 text-white" : "bg-white text-gray-900",
          mobile
            ? "fixed top-4 left-4 z-50 md:hidden" // Hamburger on mobile
            : "" // Bottom toggle on desktop inside sidebar
        )}
        onClick={() => setOpen(!open)}
      >
        {open ? <IoArrowBack size={24} /> : <IoMenu size={24} />}
      </button>
    </div>
  );
}
