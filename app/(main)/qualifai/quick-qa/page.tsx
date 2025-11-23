// app/qualifai/quick-qa/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Play,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  Globe,
  TrendingUp,
  DollarSign,
  Cpu,
  FileText,
  Share2,
  ArrowLeft,
  Download,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clientService } from "@/app/(main)/lib/services/client.service";
import {
  Client,
  ClientService,
  ServiceType,
} from "@/app/(main)/types/client.types";
import { ServiceConfiguration } from "@/app/components/services/ServiceConfiguration";
import { motion } from "framer-motion";

const SERVICE_CONFIG = {
  wordpress: {
    name: "WordPress QA",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    description: "Website quality assurance and testing",
  },
  seo: {
    name: "SEO QA",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    description: "Search engine optimization audits",
  },
  ppc: {
    name: "PPC QA",
    icon: DollarSign,
    color: "from-purple-500 to-pink-500",
    description: "Pay-per-click campaign quality checks",
  },
  "ai-automation": {
    name: "AI Automation QA",
    icon: Cpu,
    color: "from-orange-500 to-red-500",
    description: "AI workflow and automation testing",
  },
  content: {
    name: "Content QA",
    icon: FileText,
    color: "from-indigo-500 to-purple-500",
    description: "Content quality and compliance checks",
  },
  "social-media": {
    name: "Social Media QA",
    icon: Share2,
    color: "from-pink-500 to-rose-500",
    description: "Social content and campaign audits",
  },
};

export default function QuickQAPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientId = searchParams.get("clientId");

  const [client, setClient] = useState<Client | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      loadClientData();
    } else {
      setIsLoading(false);
    }
  }, [clientId]);

  const loadClientData = async () => {
    try {
      setIsLoading(true);
      const clientData = await clientService.getClientWithServices(clientId!);
      setClient(clientData);
      // Auto-select active services
      const activeServices =
        clientData?.detailedServices
          ?.filter((s) => s.status === "active")
          .map((s) => s.type) || [];
      setSelectedServices(activeServices);
    } catch (error) {
      console.error("Failed to load client data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleService = (serviceType: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceType)
        ? prev.filter((type) => type !== serviceType)
        : [...prev, serviceType]
    );
  };

  const toggleAllServices = () => {
    if (!client) return;

    const allActiveServices =
      client.detailedServices
        ?.filter((s) => s.status === "active")
        .map((s) => s.type) || [];

    if (selectedServices.length === allActiveServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(allActiveServices);
    }
  };

  const runQuickQA = async () => {
    if (!client || selectedServices.length === 0) return;

    setIsRunning(true);
    setProgress(0);

    try {
      const totalServices = selectedServices.length;
      let completedServices = 0;

      for (const serviceType of selectedServices) {
        try {
          // Run basic QA for each service type
          await clientService.runServiceQA(
            client.id,
            serviceType as ServiceType,
            []
          );
          completedServices++;
          setProgress((completedServices / totalServices) * 100);
          // Add a small delay to show progress
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`QA failed for ${serviceType}:`, error);
          completedServices++;
          setProgress((completedServices / totalServices) * 100);
        }
      }

      // Redirect to dashboard with success message
      router.push(
        `/qualifai/dashboard?clientId=${client.id}&quickQA=completed&services=${selectedServices.length}`
      );
    } catch (error) {
      console.error("Quick QA failed:", error);
    } finally {
      setIsRunning(false);
      setProgress(0);
    }
  };

  // In your Quick QA page, update the service configuration section
  const handleServiceConfigure = (serviceType: ServiceType) => {
    if (client) {
      router.push(
        `/qualifai/${serviceType}?clientId=${client.id}&mode=configure`
      );
    }
  };

  const handleQuickCheck = (serviceType: ServiceType) => {
    if (client) {
      // Run quick check for specific service
      setSelectedServices([serviceType]);
      // Optionally auto-run the QA
      setTimeout(() => runQuickQA(), 500);
    }
  };

  const handleFullCheck = (serviceType: ServiceType) => {
    if (client) {
      router.push(
        `/qualifai/${serviceType}?clientId=${client.id}&mode=full-check`
      );
    }
  };

  if (isLoading && clientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-cyan-50/50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-4"
          >
            <Users className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading client data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-cyan-50/50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Play className="w-8 h-8 text-white" />
            </div>

            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Quick QA
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {client
                  ? `Run comprehensive quality assurance for ${client.company}`
                  : "Run QA across multiple services"}
              </p>
            </div>
          </div>
        </div>

        {/* Client Summary */}
        {client && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={client.company}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: client.color }}
                  >
                    {client.company.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {client.company}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {client.name} •{" "}
                    {client.detailedServices?.filter(
                      (s) => s.status === "active"
                    ).length || 0}{" "}
                    active services
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {client.averageQAScore || 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Average QA Score
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Bar for Running QA */}
        {isRunning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-8"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Play className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Running Quick QA...
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Processing {selectedServices.length} services
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(progress)}% complete
              </p>
            </div>
          </motion.div>
        )}

        {/* Service Selection */}
        {!isRunning && client && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Services for QA
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={toggleAllServices}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  {selectedServices.length ===
                  (client.detailedServices?.filter((s) => s.status === "active")
                    .length || 0)
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {client.detailedServices?.map((service) => {
                const config = SERVICE_CONFIG[service.type];
                if (!config) return null;

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() =>
                      service.status === "active" && toggleService(service.type)
                    }
                    className={cn(
                      "border-2 rounded-xl p-4 transition-all duration-200 relative cursor-pointer group",
                      service.status === "active"
                        ? selectedServices.includes(service.type)
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20 hover:shadow-lg"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 hover:shadow-lg"
                        : "border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg bg-gradient-to-r text-white",
                            config.color
                          )}
                        >
                          <config.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                            {config.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {service.status === "active"
                              ? "Ready for QA"
                              : "Inactive"}
                          </p>
                        </div>
                      </div>
                      {service.status === "active" && (
                        <div
                          className={cn(
                            "w-6 h-6 rounded border-2 transition-colors",
                            selectedServices.includes(service.type)
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300 dark:border-gray-600"
                          )}
                        >
                          {selectedServices.includes(service.type) && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Service Metrics */}
                    {service.lastQARun && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              Last QA:{" "}
                              {new Date(service.lastQARun).toLocaleDateString()}
                            </span>
                          </div>
                          {service.qaScore && (
                            <div
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                service.qaScore >= 80
                                  ? "bg-green-500/20 text-green-600 dark:text-green-400"
                                  : service.qaScore >= 60
                                  ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                                  : "bg-red-500/20 text-red-600 dark:text-red-400"
                              )}
                            >
                              {service.qaScore}%
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Configure Button */}
                    {service.status === "active" && (
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedService(service.type);
                          }}
                          className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Settings className="w-3 h-3" />
                          <span>Configure</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {(!client.detailedServices ||
              client.detailedServices.length === 0) && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No services configured for this client
                </p>
                <button
                  onClick={() =>
                    client && router.push(`/clients?edit=${client.id}`)
                  }
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Services
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Service Configuration Buttons */}
        {!isRunning &&
          client &&
          client.detailedServices &&
          client.detailedServices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Service Configuration
              </h3>
              <div className="flex flex-wrap gap-2">
                {client.detailedServices
                  ?.filter((service) => service.status === "active")
                  .map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.type)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Settings className="w-4 h-4" />
                      <span>
                        Configure {SERVICE_CONFIG[service.type]?.name}
                      </span>
                    </button>
                  ))}
              </div>
            </motion.div>
          )}

        {/* Action Section */}
        {!isRunning && selectedServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <button
              onClick={runQuickQA}
              className={cn(
                "flex items-center space-x-3 px-8 py-4 text-white rounded-xl transition-all duration-300 shadow-lg mx-auto hover:shadow-xl hover:-translate-y-1",
                "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              )}
            >
              <Play className="w-5 h-5" />
              <span className="font-semibold text-lg">
                Run QA for {selectedServices.length} Service
                {selectedServices.length !== 1 ? "s" : ""}
              </span>
            </button>

            <p className="text-gray-600 dark:text-gray-400 mt-4">
              This will run comprehensive quality checks across all selected
              services
            </p>
          </motion.div>
        )}

        {/* No Services Selected Message */}
        {!isRunning &&
          client &&
          selectedServices.length === 0 &&
          client.detailedServices &&
          client.detailedServices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Services Selected
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please select at least one service to run Quick QA
              </p>
            </motion.div>
          )}

        {/* No Client Selected State */}
        {!clientId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Client Selected
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please select a client to run Quick QA
            </p>
            <button
              onClick={() => router.push("/clients")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:-translate-y-1"
            >
              Browse Clients
            </button>
          </motion.div>
        )}

        {/* Service Configuration Modal */}
        {selectedService && client && (
          <ServiceConfiguration
            client={client}
            serviceType={selectedService}
            onClose={() => setSelectedService(null)}
            onConfigure={handleServiceConfigure}
          />
        )}
      </div>
    </div>
  );
}
