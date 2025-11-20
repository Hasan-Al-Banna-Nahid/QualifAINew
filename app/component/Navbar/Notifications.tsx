"use client";
import { useTheme } from "@/app/context/ThemeContext";
import clsx from "clsx";
import React, { useState } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";

const Notifications = () => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState(0);

  return (
    <div>
      <button
        className={clsx(
          "relative p-2 rounded-full transition-colors",
          theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-800"
        )}
      >
        <IoIosNotificationsOutline className="text-3xl" />
        {notifications > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
            {notifications}
          </span>
        )}
      </button>
    </div>
  );
};

export default Notifications;
