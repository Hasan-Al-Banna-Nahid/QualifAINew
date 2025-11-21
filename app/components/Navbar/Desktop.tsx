"use client";
import clsx from "clsx";
import Link from "next/link";
import { routes } from "./Routes";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";

const Desktop = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  return (
    <div>
      <div className="hidden md:flex space-x-6">
        {routes.map(
          (route) =>
            route.show !== false && (
              <Link
                key={route.name}
                href={route.href}
                className={clsx(
                  "transition-colors",
                  pathname === route.href
                    ? "text-blue-600 font-semibold" // <--- active route
                    : theme === "light"
                    ? "text-gray-700 hover:text-blue-800"
                    : "text-gray-100 hover:text-blue-400"
                )}
              >
                {route.name}
              </Link>
            )
        )}
      </div>
    </div>
  );
};

export default Desktop;
