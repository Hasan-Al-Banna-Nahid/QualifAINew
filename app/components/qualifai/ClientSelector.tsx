// app/components/qualifai/ClientSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Building2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useClients } from "@/app/(main)/lib/hooks/useClients";
import { Client } from "@/app/(main)/types/client.types";
import { cn } from "@/lib/utils";

interface ClientSelectorProps {
  onSelect: (clientId: string) => void;
  selectedClientId?: string;
}

export function ClientSelector({ onSelect, selectedClientId }: ClientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { clients, isLoading } = useClients({
    search: searchTerm,
    status: "all",
    serviceType: "all",
    page: 1,
    limit: 100,
  });

  const handleSelect = (client: Client) => {
    onSelect(client.id);
    setIsOpen(false);
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
        />
        <ChevronDown
          className={cn(
            "absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {/* Selected Client Display */}
      {selectedClient && !isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedClient.logo ? (
                <img
                  src={selectedClient.logo}
                  alt={selectedClient.company}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: selectedClient.color }}
                >
                  {selectedClient.company.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedClient.company}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedClient.name}
                </p>
              </div>
            </div>
            <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </motion.div>
      )}

      {/* Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading clients...</p>
              </div>
            ) : clients.length === 0 ? (
              <div className="p-8 text-center">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? "No clients found" : "No clients available"}
                </p>
              </div>
            ) : (
              <div className="py-2">
                {clients.map((client) => (
                  <motion.button
                    key={client.id}
                    onClick={() => handleSelect(client)}
                    whileHover={{ backgroundColor: "rgba(147, 51, 234, 0.1)" }}
                    className={cn(
                      "w-full px-4 py-3 flex items-center space-x-3 transition-colors text-left",
                      selectedClientId === client.id &&
                        "bg-purple-50 dark:bg-purple-900/20"
                    )}
                  >
                    {client.logo ? (
                      <img
                        src={client.logo}
                        alt={client.company}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{ backgroundColor: client.color }}
                      >
                        {client.company.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {client.company}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {client.name} • {client.services?.length || 0} services
                      </p>
                    </div>
                    {client.averageQAScore !== undefined && client.averageQAScore > 0 && (
                      <div
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          client.averageQAScore >= 80
                            ? "bg-green-500/20 text-green-600 dark:text-green-400"
                            : client.averageQAScore >= 60
                            ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                            : "bg-red-500/20 text-red-600 dark:text-red-400"
                        )}
                      >
                        {client.averageQAScore}%
                      </div>
                    )}
                    {selectedClientId === client.id && (
                      <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
