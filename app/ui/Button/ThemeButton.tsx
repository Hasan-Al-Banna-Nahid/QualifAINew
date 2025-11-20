"use client";
import { useTheme } from "@/app/context/ThemeContext";
import { CiLight, CiDark } from "react-icons/ci";
import clsx from "clsx";

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "px-4 py-2 rounded-md transition-colors",
        theme === "light"
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
          : "bg-gray-800 text-gray-200 hover:bg-gray-700"
      )}
    >
      {theme === "light" ? <CiLight /> : <CiDark />}
    </button>
  );
};

export default ThemeButton;
