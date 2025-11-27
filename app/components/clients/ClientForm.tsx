// components/clients/ClientForm.tsx
"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  clientFormSchema,
  ClientFormSchema,
} from "@/app/(main)/schemas/client.schema";
import { Client, ServiceType } from "@/app/(main)/types/client.types";
import { cn } from "@/lib/utils";
import {
  FiX,
  FiUpload,
  FiGlobe,
  FiTrendingUp,
  FiDollarSign,
  FiCpu,
  FiFileText,
  FiShare2,
  FiTrash2,
} from "react-icons/fi";
import { CiPalette } from "react-icons/ci";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ClientFormProps {
  client?: Client;
  onSubmit: (
    data: ClientFormSchema & { initialServices: ServiceType[] }
  ) => void;
  onClose: () => void;
  onDelete?: (client: Client) => void;
  isSubmitting: boolean;
}

const STATUS_OPTIONS = ["active", "inactive", "pending"];

const COLOR_OPTIONS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
];

const QUALIFAI_SERVICES: {
  id: ServiceType;
  name: string;
  icon: any;
  color: string;
  description: string;
}[] = [
  {
    id: "wordpress",
    name: "WordPress QA",
    icon: FiGlobe,
    color: "from-blue-500 to-cyan-500",
    description: "Website quality assurance and testing",
  },
  {
    id: "seo",
    name: "SEO QA",
    icon: FiTrendingUp,
    color: "from-green-500 to-emerald-500",
    description: "Search engine optimization audits",
  },
  {
    id: "ppc",
    name: "PPC QA",
    icon: FiDollarSign,
    color: "from-purple-500 to-pink-500",
    description: "Pay-per-click campaign quality checks",
  },
  {
    id: "ai-automation",
    name: "AI Automation QA",
    icon: FiCpu,
    color: "from-orange-500 to-red-500",
    description: "AI workflow and automation testing",
  },
  {
    id: "content",
    name: "Content QA",
    icon: FiFileText,
    color: "from-indigo-500 to-purple-500",
    description: "Content quality and compliance checks",
  },
  {
    id: "social-media",
    name: "Social Media QA",
    icon: FiShare2,
    color: "from-pink-500 to-rose-500",
    description: "Social content and campaign audits",
  },
];

// Service options for the dropdown - using actual ServiceType values
const SERVICE_OPTIONS: ServiceType[] = [
  "wordpress",
  "ppc",
  "seo",
  "ai-automation",
  "content",
  "social-media",
];

export const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onSubmit,
  onClose,
  onDelete,
  isSubmitting,
}) => {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>(
    client?.services?.map((s) => s.type) || []
  );
  const [showServiceActions, setShowServiceActions] = useState(false);
  const [selectedServiceForConfig, setSelectedServiceForConfig] =
    useState<ServiceType | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<
    ClientFormSchema & {
      initialServices: ServiceType[];
    }
  >({
    resolver: zodResolver(clientFormSchema),
    defaultValues: client
      ? {
          name: client.name,
          email: client.email,
          company: client.company,
          status: client.status,
          serviceType: client.serviceType,
          logo: client.logo,
          color: client.color,
          initialServices: client.services?.map((s) => s.type) || [],
        }
      : {
          status: "active",
          serviceType: "wordpress",
          color: "#3B82F6",
          initialServices: [],
        },
  });

  const selectedColor = watch("color");
  const selectedServiceType = watch("serviceType");

  const toggleService = (serviceId: ServiceType) => {
    setSelectedServices((prev) => {
      const newServices = prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId];

      setValue("initialServices", newServices);
      return newServices;
    });
  };

  const handleFormSubmit = (
    data: ClientFormSchema & {
      initialServices: ServiceType[];
    }
  ) => {
    console.log("Form data with services:", data);
    onSubmit(data);
  };

  const handleConfigureService = (serviceType: ServiceType) => {
    if (client) {
      // For existing client, redirect to service configuration page
      router.push(
        `/qualifai/${serviceType}?clientId=${client.id}&mode=configure`
      );
    } else {
      // For new client, store the service to configure after creation
      setSelectedServiceForConfig(serviceType);
      setShowServiceActions(true);
    }
  };

  const handleQuickCheck = (serviceType: ServiceType) => {
    if (client) {
      router.push(
        `/qualifai/quick-qa?clientId=${client.id}&service=${serviceType}`
      );
    } else {
      // Store for after client creation
      setSelectedServiceForConfig(serviceType);
      setShowServiceActions(true);
    }
  };

  const handleFullCheck = (serviceType: ServiceType) => {
    if (client) {
      router.push(
        `/qualifai/${serviceType}?clientId=${client.id}&mode=full-check`
      );
    } else {
      // Store for after client creation
      setSelectedServiceForConfig(serviceType);
      setShowServiceActions(true);
    }
  };

  const handlePostCreationAction = (newClientId: string) => {
    if (selectedServiceForConfig) {
      if (showServiceActions) {
        // Redirect to the appropriate page based on what was clicked
        const url = `/qualifai/${selectedServiceForConfig}?clientId=${newClientId}&mode=configure`;
        router.push(url);
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {client ? "Edit Client" : "Add New Client"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Name *
                </label>
                <input
                  {...register("name")}
                  type="text"
                  className={cn(
                    "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700",
                    errors.name && "border-red-500"
                  )}
                  placeholder="Enter client name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className={cn(
                    "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700",
                    errors.email && "border-red-500"
                  )}
                  placeholder="client@company.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Company and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company *
                </label>
                <input
                  {...register("company")}
                  type="text"
                  className={cn(
                    "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700",
                    errors.company && "border-red-500"
                  )}
                  placeholder="Company name"
                />
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.company.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  {...register("status")}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* QualifAI Services */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  QualifAI Services *
                </label>
                <div className="text-sm text-gray-500">
                  {selectedServices.length} service
                  {selectedServices.length !== 1 ? "s" : ""} selected
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {QUALIFAI_SERVICES.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 group relative",
                      selectedServices.includes(service.id)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                    )}
                  >
                    <div
                      className="flex items-center space-x-3"
                      onClick={() => toggleService(service.id)}
                    >
                      <div
                        className={cn(
                          "p-2 rounded-lg bg-gradient-to-r text-white",
                          service.color
                        )}
                      >
                        <service.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {service.description}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 transition-colors",
                          selectedServices.includes(service.id)
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-600"
                        )}
                      >
                        {selectedServices.includes(service.id) && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </motion.svg>
                        )}
                      </div>
                    </div>

                    {/* Service Actions */}
                    {selectedServices.includes(service.id) && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfigureService(service.id);
                            }}
                            className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            Configure
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickCheck(service.id);
                            }}
                            className="flex-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          >
                            Quick Check
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFullCheck(service.id);
                            }}
                            className="flex-1 px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                          >
                            Full Check
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Service Type and Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Service Type *
                </label>
                <select
                  {...register("serviceType")}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
                >
                  {SERVICE_OPTIONS.map((service) => (
                    <option key={service} value={service}>
                      {service.charAt(0).toUpperCase() +
                        service.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand Color *
                </label>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <div className="flex-1 grid grid-cols-5 gap-2">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setValue("color", color)}
                        className={cn(
                          "w-8 h-8 rounded border-2 transition-all",
                          selectedColor === color
                            ? "border-gray-900 dark:border-white scale-110"
                            : "border-gray-300 dark:border-gray-600"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <CiPalette className="w-5 h-5 text-gray-400" />
                </div>
                {errors.color && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.color.message}
                  </p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
              {/* Delete button - only show for existing clients */}
              {client && onDelete && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${client.name}?`)) {
                      onDelete(client);
                      onClose();
                    }
                  }}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>Delete Client</span>
                </motion.button>
              )}
              
              {/* Spacer for when there's no delete button */}
              {(!client || !onDelete) && <div />}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "px-6 py-3 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                  )}
                  onClick={() => {
                    // If we have a post-creation action and this is a new client
                    if (!client && selectedServiceForConfig) {
                      // This will be handled after successful submission
                    }
                  }}
                >
                  {isSubmitting
                    ? "Saving..."
                    : client
                    ? "Update Client"
                    : "Create Client"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>

      {/* Service Action Modal for New Clients */}
      {showServiceActions && selectedServiceForConfig && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Configure Service
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Would you like to configure{" "}
              {
                QUALIFAI_SERVICES.find((s) => s.id === selectedServiceForConfig)
                  ?.name
              }{" "}
              after creating the client?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowServiceActions(false);
                  setSelectedServiceForConfig(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // This will be handled after successful form submission
                  setShowServiceActions(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
