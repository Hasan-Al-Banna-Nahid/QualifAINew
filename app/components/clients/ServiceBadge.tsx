// components/clients/ServiceBadge.tsx
"use client";

import { motion } from "framer-motion";
import { cn, getServiceColor } from "@/app/(main)/lib/utils/clients";
import {
  SiWordpress,
  SiShopify,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
} from "react-icons/si";
import { TbBrandMysql } from "react-icons/tb";
import { FaJava } from "react-icons/fa6";

interface ServiceBadgeProps {
  service: string;
  className?: string;
}

const serviceIcons: Record<string, React.ComponentType> = {
  wordpress: SiWordpress,
  shopify: SiShopify,
  mern: SiReact,
  java: FaJava,
  python: SiPython,
  react: SiReact,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
};

export const ServiceBadge: React.FC<ServiceBadgeProps> = ({
  service,
  className,
}) => {
  const Icon = serviceIcons[service] || TbBrandMysql;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white backdrop-blur-sm",
        getServiceColor(service),
        className
      )}
    >
      <Icon className="w-4 h-4 mr-2" />
      <span className="capitalize">{service}</span>
    </motion.div>
  );
};
