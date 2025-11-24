// app/clients/page.tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClients } from "@/app/(main)/lib/hooks/useClients";
import { ClientCard } from "@/app/components/clients/ClientCard";
import { ClientForm } from "@/app/components/clients/ClientForm";
import { StatusBadge } from "@/app/components/clients/StatusBadge";
import { ServiceBadge } from "@/app/components/clients/ServiceBadge";
import { cn } from "@/lib/utils";
import {
  FiSearch,
  FiPlus,
  FiFilter,
  FiUsers,
  FiActivity,
  FiClock,
} from "react-icons/fi";
import { Client, ClientFormData } from "@/app/(main)/types/client.types";

// O(1) lookup for filter options
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

const SERVICE_OPTIONS = [
  { value: "all", label: "All Services" },
  { value: "wordpress", label: "WordPress" },
  { value: "shopify", label: "Shopify" },
  { value: "mern", label: "MERN Stack" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "nodejs", label: "Node.js" },
];

import { useRouter } from "next/navigation";
import { ClientFormSchema } from "@/app/(main)/schemas/client.schema";
import { ServiceType } from "@/app/(main)/types/client.types";

export default function ClientsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState({
    search: "",
    status: "all",
    serviceType: "all",
    page: 1,
    limit: 12,
  });

  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const {
    clients,
    total,
    isLoading,
    createClient,
    updateClient,
    deleteClient,
    isCreating,
    isUpdating,
    isDeleting,
  } = useClients(filter);

  // O(1) filtered clients using React Query cache
  const filteredClients = useMemo(() => clients, [clients]);

  // In your client creation component/page
  const handleCreateClient = async (
    data: ClientFormSchema & { initialServices: ServiceType[] }
  ) => {
    try {
      const result = await createClient(data);

      // If there's a service to configure after creation
      if (result?.id && data.initialServices.length > 0) {
        // Redirect to the service configuration page
        router.push(
          `/qualifai/${data.initialServices[0]}?clientId=${result.id}&mode=configure`
        );
      } else {
        setShowForm(false); // Just close the form
      }
    } catch (error) {
      console.error("Failed to create client:", error);
    }
  };

  const handleUpdateClient = async (data: ClientFormData) => {
    if (editingClient) {
      await updateClient({ id: editingClient.id, data });
      setEditingClient(null);
    }
  };

  const handleDeleteClient = async (client: Client) => {
    if (confirm(`Are you sure you want to delete ${client.name}?`)) {
      await deleteClient(client.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Clients Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Manage all your clients with beautiful animations and real-time
            updates
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              icon: FiUsers,
              label: "Total Clients",
              value: total,
              color: "blue",
            },
            {
              icon: FiActivity,
              label: "Active",
              value: clients.filter((c) => c.status === "active").length,
              color: "green",
            },
            {
              icon: FiClock,
              label: "Pending",
              value: clients.filter((c) => c.status === "pending").length,
              color: "yellow",
            },
            {
              icon: FiFilter,
              label: "Services",
              value: new Set(clients.map((c) => c.serviceType)).size,
              color: "purple",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={cn(
                "bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg",
                "hover:shadow-xl transition-all duration-300"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-lg",
                    `bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400`
                  )}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              {/* Search */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search clients or companies..."
                  value={filter.search}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      search: e.target.value,
                      page: 1,
                    }))
                  }
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filter.status}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    status: e.target.value,
                    page: 1,
                  }))
                }
                className="px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Service Type Filter */}
              <select
                value={filter.serviceType}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    serviceType: e.target.value,
                    page: 1,
                  }))
                }
                className="px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              >
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Client Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Client</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Clients Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 animate-pulse"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                  </div>
                </motion.div>
              ))
            ) : filteredClients.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="text-gray-500 dark:text-gray-400 text-lg">
                  No clients found matching your criteria
                </div>
              </motion.div>
            ) : (
              filteredClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                >
                  <ClientCard
                    client={client}
                    onEdit={setEditingClient}
                    onDelete={handleDeleteClient}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {total > filter.limit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center space-x-4 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={filter.page === 1}
              onClick={() =>
                setFilter((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              Previous
            </motion.button>

            <span className="text-gray-600 dark:text-gray-400">
              Page {filter.page} of {Math.ceil(total / filter.limit)}
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={filter.page >= Math.ceil(total / filter.limit)}
              onClick={() =>
                setFilter((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              Next
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Client Form Modal */}
      <AnimatePresence>
        {(showForm || editingClient) && (
          <ClientForm
            client={editingClient || undefined}
            onSubmit={editingClient ? handleUpdateClient : handleCreateClient}
            onClose={() => {
              setShowForm(false);
              setEditingClient(null);
            }}
            isSubmitting={isCreating || isUpdating}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
