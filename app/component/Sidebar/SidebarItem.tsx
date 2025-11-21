"use client";

import Link from "next/link";
import clsx from "clsx";
import { useTheme } from "@/app/context/ThemeContext";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  name: string;
  href: string;
  icon?: React.ReactNode;
  open: boolean;
}

export default function SidebarItem({
  name,
  href,
  icon,
  open,
}: SidebarItemProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const active = pathname === href;

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 px-2 py-3 rounded-xl font-medium transition-all duration-300",
        active
          ? isDark
            ? "bg-slate-800 text-blue-300"
            : "bg-blue-100 text-blue-700"
          : isDark
          ? "hover:bg-slate-800"
          : "hover:bg-gray-100",
        !open && "justify-center"
      )}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {open && <span className="whitespace-nowrap transition-all">{name}</span>}
    </Link>
  );
}
