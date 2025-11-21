"use client";
import { useTheme } from "@/app/context/ThemeContext";
import clsx from "clsx";
import { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import FeaturesGrid from "./FeaturesGrid";
import StatsSection from "./StatsSection";

export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => setIsVisible(true), []);

  return (
    <div
      className={clsx(
        "min-h-screen w-full p-4 md:p-6 transition-all duration-500",
        isDark
          ? "bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-900 text-blue-200"
          : "bg-gradient-to-br from-gray-50 via-blue-50/40 to-gray-100 text-gray-900"
      )}
    >
      <HeroSection isDark={isDark} isVisible={isVisible} />
      <FeaturesGrid isDark={isDark} isVisible={isVisible} />
      <StatsSection isDark={isDark} isVisible={isVisible} />
    </div>
  );
}
