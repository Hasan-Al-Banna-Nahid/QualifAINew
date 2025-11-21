"use client";

import clsx from "clsx";
import { useTheme } from "@/app/context/ThemeContext";
import { IoMenu, IoArrowBack } from "react-icons/io5";

interface SidebarToggleProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SidebarToggle({ open, setOpen }: SidebarToggleProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      className={clsx(
        "absolute bottom-[70] left-1/2 -translate-x-1/2 p-2 rounded-full shadow-lg transition-transform duration-300 hover:scale-110",
        isDark ? "bg-slate-800 text-white" : "bg-white text-gray-900"
      )}
      onClick={() => setOpen(!open)}
    >
      {open ? <IoArrowBack size={24} /> : <IoMenu size={24} />}
    </button>
  );
}
