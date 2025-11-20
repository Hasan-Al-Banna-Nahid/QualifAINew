import { useTheme } from "@/app/context/ThemeContext";
import clsx from "clsx";
import React from "react";

const Profile = () => {
  const { theme } = useTheme();
  return (
    <div>
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
    </div>
  );
};

export default Profile;
