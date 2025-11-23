// components/clients/ClientCard.tsx
"use client";

import { motion } from "framer-motion";
import { Client } from "@/app/(main)/types/client.types";
import { StatusBadge } from "./StatusBadge";
import { ServiceBadge } from "./ServiceBadge";
import { cn } from "@/lib/utils";
import {
  FiCalendar,
  FiMail,
  FiBarChart2,
  FiAlertTriangle,
  FiPlay,
  FiSettings,
} from "react-icons/fi";
import { LuBuilding2 } from "react-icons/lu";
import { useRouter } from "next/navigation";

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  className?: string;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onEdit,
  onDelete,
  className,
}) => {
  const router = useRouter();

  const handleServiceClick = (serviceType: string) => {
    router.push(`/qualifai/${serviceType}?clientId=${client.id}`);
  };

  const handleQuickQA = () => {
    // Start quick QA for all active services
    router.push(`/qualifai/quick-qa?clientId=${client.id}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300",
        "bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {client.logo ? (
            <img
              src={client.logo}
              alt={client.company}
              className="w-12 h-12 rounded-lg object-cover border-2 border-white/20 shadow-lg"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg"
              style={{ backgroundColor: client.color }}
            >
              {client.company.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
              {client.name}
            </h3>
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
              <LuBuilding2 className="w-4 h-4 mr-1" />
              {client.company}
            </div>
          </div>
        </div>
        <StatusBadge status={client.status} />
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
          <FiMail className="w-4 h-4 mr-2" />
          {client.email}
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
          <FiCalendar className="w-4 h-4 mr-2" />
          Created: {new Date(client.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Service Type */}
      <div className="mb-4">
        <ServiceBadge service={client.serviceType} />
      </div>

      {/* QualifAI Services */}
      {client.services && client.services.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Active QA Services
          </h4>
          <div className="flex flex-wrap gap-2">
            {client.services.slice(0, 3).map((service) => (
              <motion.button
                key={service.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleServiceClick(service.type)}
                className={cn(
                  "px-2 py-1 rounded-lg text-xs font-medium capitalize transition-colors",
                  service.status === "active"
                    ? "bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30"
                    : service.status === "needs-qa"
                    ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/30"
                    : "bg-gray-500/20 text-gray-700 dark:text-gray-400 hover:bg-gray-500/30"
                )}
              >
                {service.type.replace("-", " ")}
              </motion.button>
            ))}
            {client.services.length > 3 && (
              <span className="px-2 py-1 bg-gray-500/20 text-gray-700 dark:text-gray-400 rounded-lg text-xs">
                +{client.services.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* QA Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
            <FiBarChart2 className="w-3 h-3" />
            <span>QA Score</span>
          </div>
          <div
            className={cn(
              "text-lg font-bold",
              client.averageQAScore >= 80
                ? "text-green-600 dark:text-green-400"
                : client.averageQAScore >= 60
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {client.averageQAScore || 0}%
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
            <FiAlertTriangle className="w-3 h-3" />
            <span>Issues</span>
          </div>
          <div
            className={cn(
              "text-lg font-bold",
              client.criticalIssues > 0
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            )}
          >
            {client.criticalIssues || 0}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickQA}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-1"
          >
            <FiPlay className="w-3 h-3" />
            <span>Quick QA</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(client)}
            className="px-3 py-1 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-1"
          >
            <FiSettings className="w-3 h-3" />
            <span>Manage</span>
          </motion.button>
        </div>

        <span className="text-xs text-gray-500 dark:text-gray-400">
          {client.totalQARuns || 0} QA runs
        </span>
      </div>
    </motion.div>
  );
};
