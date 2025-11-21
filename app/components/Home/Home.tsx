"use client";
import { useTheme } from "@/app/context/ThemeContext";
import { useLayout } from "@/app/context/LayoutContext";
import { useAuth } from "@/app/context/AuthContext";
import clsx from "clsx";
import { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import FeaturesGrid from "./FeaturesGrid";
import StatsSection from "./StatsSection";

export default function HomePage() {
  const { theme } = useTheme();
  const { sidebarOpen } = useLayout();
  const { isAuthenticated } = useAuth();
  const isDark = theme === "dark";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => setIsVisible(true), []);

  // Calculate content width based on sidebar state
  const getContentWidthClasses = () => {
    if (!isAuthenticated) {
      return "w-full mx-auto"; // Full width when no sidebar
    }

    // When sidebar is present
    if (sidebarOpen) {
      return "w-full lg:w-[calc(100%-256px)]"; // Account for sidebar width
    } else {
      return "w-full lg:w-[calc(100%-64px)]"; // Account for collapsed sidebar
    }
  };

  return (
    <div
      className={clsx(
        "min-h-screen transition-all duration-500",
        getContentWidthClasses(),
        isDark
          ? "bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-900 text-blue-200"
          : "bg-gradient-to-br from-gray-50 via-blue-50/40 to-gray-100 text-gray-900"
      )}
    >
      <div className="p-4 md:p-6">
        <HeroSection isDark={isDark} isVisible={isVisible} />
        <FeaturesGrid isDark={isDark} isVisible={isVisible} />
        <StatsSection isDark={isDark} isVisible={isVisible} />
      </div>
    </div>
  );
}
