// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// O(1) color utility functions
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: "bg-green-500",
    inactive: "bg-red-500",
    pending: "bg-yellow-500",
  };
  return colors[status] || "bg-gray-500";
};

export const getServiceColor = (service: string): string => {
  const colors: Record<string, string> = {
    wordpress: "bg-blue-500",
    shopify: "bg-green-500",
    mern: "bg-cyan-500",
    java: "bg-orange-500",
    python: "bg-yellow-500",
    react: "bg-sky-500",
    nextjs: "bg-black",
    nodejs: "bg-emerald-500",
  };
  return colors[service] || "bg-gray-500";
};
