// components/services/ServiceConfiguration.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  DollarSign,
  Search,
  Cpu,
  FileText,
  Share2,
  Settings,
  TestTube,
  Database,
  Key,
  Eye,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Client, ServiceType } from "@/app/(main)/types/client.types";

interface ServiceConfigurationProps {
  client: Client;
  serviceType: ServiceType;
  onClose: () => void;
  onConfigure: (configuration: any) => void;
}

const SERVICE_CONFIGS = {
  wordpress: {
    name: "WordPress QA",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    description: "Complete WordPress website quality assurance",
  },
  ppc: {
    name: "PPC Campaign QA",
    icon: DollarSign,
    color: "from-purple-500 to-pink-500",
    description: "Pay-per-click campaign quality checking",
  },
  seo: {
    name: "SEO Audit QA",
    icon: Search,
    color: "from-green-500 to-emerald-500",
    description: "Search engine optimization quality audit",
  },
  "ai-automation": {
    name: "AI Automation QA",
    icon: Cpu,
    color: "from-orange-500 to-red-500",
    description: "n8n workflow and automation testing",
  },
  content: {
    name: "Content QA",
    icon: FileText,
    color: "from-indigo-500 to-purple-500",
    description: "Content quality and compliance checking",
  },
  "social-media": {
    name: "Social Media QA",
    icon: Share2,
    color: "from-pink-500 to-rose-500",
    description: "Social media content and campaign auditing",
  },
};

export function ServiceConfiguration({
  client,
  serviceType,
  onClose,
  onConfigure,
}: ServiceConfigurationProps) {
  const router = useRouter();
  const serviceConfig = SERVICE_CONFIGS[serviceType];
  const [activeTab, setActiveTab] = useState("credentials");
  const [formData, setFormData] = useState<any>({});

  // Load existing service configuration when modal opens
  useEffect(() => {
    const existingService = client.detailedServices?.find(
      (s) => s.type === serviceType
    );
    
    if (existingService) {
      setFormData({
        credentials: existingService.credentials || {},
        configuration: existingService.configuration || {},
      });
    }
  }, [client, serviceType]);

  const updateFormData = (key: string, value: any) => {
    setFormData((prev: any) => {
      // Handle nested keys like "configuration.seo"
      if (key.includes('.')) {
        const keys = key.split('.');
        const newData = { ...prev };
        let current = newData;
        
        // Navigate to the nested object
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          } else {
            current[keys[i]] = { ...current[keys[i]] };
          }
          current = current[keys[i]];
        }
        
        // Set the final value
        current[keys[keys.length - 1]] = value;
        return newData;
      }
      
      // Handle flat keys
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const handleSave = () => {
    onConfigure({
      type: serviceType,
      credentials: formData.credentials || {},
      configuration: formData.configuration || {},
    });
    onClose();
  };

  const handleRunQA = () => {
    // Save configuration first, then run QA
    handleSave();
    router.push(`/qualifai/${serviceType}?clientId=${client.id}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div
              className={cn(
                "p-3 rounded-xl bg-gradient-to-r text-white",
                serviceConfig.color
              )}
            >
              <serviceConfig.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Configure {serviceConfig.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {serviceConfig.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-2 mb-6">
          <div className="flex space-x-2">
            {[
              { id: "credentials", name: "Credentials", icon: Key },
              { id: "configuration", name: "Configuration", icon: Settings },
              { id: "testing", name: "Test Setup", icon: TestTube },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 flex-1 justify-center",
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "credentials" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CredentialsTab
                serviceType={serviceType}
                formData={formData}
                updateFormData={updateFormData}
              />
            </motion.div>
          )}

          {activeTab === "configuration" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ConfigurationTab
                serviceType={serviceType}
                formData={formData}
                updateFormData={updateFormData}
              />
            </motion.div>
          )}

          {activeTab === "testing" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TestingTab
                serviceType={serviceType}
                client={client}
                onRunQA={handleRunQA}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Save Configuration
          </button>
          <button
            onClick={handleRunQA}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Save & Run QA</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Credentials Tab Component
function CredentialsTab({ serviceType, formData, updateFormData }: any) {
  const commonFields = [
    {
      key: "url",
      label: "Website/Service URL",
      type: "url",
      placeholder: "https://example.com",
    },
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      placeholder: "Enter API key",
    },
    {
      key: "username",
      label: "Username",
      type: "text",
      placeholder: "Enter username",
    },
    {
      key: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
    },
  ];

  const serviceSpecificFields = {
    wordpress: [
      {
        key: "wpAdminUrl",
        label: "WordPress Admin URL",
        type: "url",
        placeholder: "https://example.com/wp-admin",
      },
      {
        key: "databaseHost",
        label: "Database Host",
        type: "text",
        placeholder: "localhost",
      },
    ],
    ppc: [
      {
        key: "adAccountId",
        label: "Ad Account ID",
        type: "text",
        placeholder: "123-456-7890",
      },
      {
        key: "platform",
        label: "Platform",
        type: "select",
        options: ["google-ads", "facebook-ads", "linkedin-ads"],
      },
    ],
    seo: [
      {
        key: "searchConsoleUrl",
        label: "Google Search Console URL",
        type: "url",
      },
      { key: "analyticsViewId", label: "Analytics View ID", type: "text" },
    ],
    "ai-automation": [
      {
        key: "n8nWebhookUrl",
        label: "n8n Webhook URL",
        type: "url",
        placeholder: "https://n8n.example.com/webhook",
      },
      {
        key: "workflowIds",
        label: "Workflow IDs",
        type: "text",
        placeholder: "comma-separated IDs",
      },
    ],
    content: [
      {
        key: "cmsType",
        label: "CMS Type",
        type: "select",
        options: ["wordpress", "contentful", "custom"],
      },
    ],
    "social-media": [
      {
        key: "socialPlatforms",
        label: "Platforms",
        type: "multiselect",
        options: ["facebook", "twitter", "linkedin", "instagram"],
      },
    ],
  };

  const fields = [
    ...commonFields,
    ...(serviceSpecificFields[serviceType] || []),
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Service Credentials
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.label}
            </label>

            {field.type === "select" ? (
              <select
                value={formData.credentials?.[field.key] || ""}
                onChange={(e) =>
                  updateFormData(`credentials.${field.key}`, e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === "multiselect" ? (
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={
                        formData.credentials?.[field.key]?.includes(option) ||
                        false
                      }
                      onChange={(e) => {
                        const current = formData.credentials?.[field.key] || [];
                        const updated = e.target.checked
                          ? [...current, option]
                          : current.filter((item: string) => item !== option);
                        updateFormData(`credentials.${field.key}`, updated);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <input
                type={field.type}
                value={formData.credentials?.[field.key] || ""}
                onChange={(e) =>
                  updateFormData(`credentials.${field.key}`, e.target.value)
                }
                placeholder={field.placeholder}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Configuration Tab Component
function ConfigurationTab({ serviceType, formData, updateFormData }: any) {
  const configurations = {
    wordpress: (
      <WordPressConfiguration
        config={formData.configuration?.wordpress}
        updateConfig={(config) =>
          updateFormData("configuration.wordpress", config)
        }
      />
    ),
    ppc: (
      <PPCConfiguration
        config={formData.configuration?.ppc}
        updateConfig={(config) => updateFormData("configuration.ppc", config)}
      />
    ),
    seo: (
      <SEOConfiguration
        config={formData.configuration?.seo}
        updateConfig={(config) => updateFormData("configuration.seo", config)}
      />
    ),
    "ai-automation": (
      <AIAutomationConfiguration
        config={formData.configuration?.aiAutomation}
        updateConfig={(config) =>
          updateFormData("configuration.aiAutomation", config)
        }
      />
    ),
    content: (
      <ContentConfiguration
        config={formData.configuration?.content}
        updateConfig={(config) =>
          updateFormData("configuration.content", config)
        }
      />
    ),
    "social-media": (
      <SocialMediaConfiguration
        config={formData.configuration?.socialMedia}
        updateConfig={(config) =>
          updateFormData("configuration.socialMedia", config)
        }
      />
    ),
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Service Configuration
      </h3>
      {configurations[serviceType] || (
        <div>Configuration not available for this service.</div>
      )}
    </div>
  );
}

// Testing Tab Component
function TestingTab({ serviceType, client, onRunQA }: any) {
  const testScenarios = {
    wordpress: [
      "Website Performance Testing",
      "Security Vulnerability Scan",
      "SEO Optimization Check",
      "Content Quality Audit",
      "Plugin & Theme Analysis",
    ],
    ppc: [
      "Campaign Structure Analysis",
      "Ad Copy Quality Check",
      "Landing Page Performance",
      "Conversion Tracking Validation",
      "Budget & Bidding Analysis",
    ],
    seo: [
      "Technical SEO Audit",
      "Content Optimization Check",
      "Backlink Profile Analysis",
      "Local SEO Verification",
      "Core Web Vitals Testing",
    ],
    "ai-automation": [
      "Workflow Node Testing",
      "Data Input/Output Validation",
      "Error Handling Verification",
      "Performance Benchmarking",
      "Integration Connectivity Check",
    ],
    content: [
      "Content Quality Analysis",
      "SEO Optimization Check",
      "Grammar & Readability Testing",
      "Brand Voice Consistency",
      "Content Performance Metrics",
    ],
    "social-media": [
      "Content Calendar Review",
      "Post Quality Analysis",
      "Engagement Metrics Check",
      "Platform Compliance Verification",
      "Campaign Performance Audit",
    ],
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        QA Test Scenarios
      </h3>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Available Tests for {SERVICE_CONFIGS[serviceType].name}
        </h4>
        <ul className="space-y-2">
          {(testScenarios[serviceType] || []).map((test, index) => (
            <li key={index} className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">{test}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Ready to Test
        </h4>
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          Click "Save & Run QA" to start comprehensive quality assurance testing
          for {client.company}'s {SERVICE_CONFIGS[serviceType].name}.
        </p>
      </div>

      <button
        onClick={onRunQA}
        className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Play className="w-5 h-5" />
        <span className="font-semibold text-lg">
          Save & Run Comprehensive QA
        </span>
      </button>
    </div>
  );
}

// Service-specific configuration components
function WordPressConfiguration({ config, updateConfig }: any) {
  const currentConfig = config || {
    theme: "",
    plugins: [],
    performance: { caching: false, cdn: false, imageOptimization: false },
    security: { ssl: false, firewall: false, backups: false },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Active Theme
          </label>
          <input
            type="text"
            value={currentConfig.theme || ""}
            onChange={(e) =>
              updateConfig({ ...currentConfig, theme: e.target.value })
            }
            placeholder="e.g., Astra, Divi, GeneratePress"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Key Plugins
          </label>
          <input
            type="text"
            value={(currentConfig.plugins || []).join(", ")}
            onChange={(e) =>
              updateConfig({
                ...currentConfig,
                plugins: e.target.value ? e.target.value.split(", ") : [],
              })
            }
            placeholder="e.g., Yoast SEO, WooCommerce, Elementor"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">
          Performance Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: "caching", label: "Caching Enabled" },
            { key: "cdn", label: "CDN Active" },
            { key: "imageOptimization", label: "Image Optimization" },
          ].map((item) => (
            <label key={item.key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={currentConfig.performance[item.key]}
                onChange={(e) =>
                  updateConfig({
                    ...currentConfig,
                    performance: {
                      ...currentConfig.performance,
                      [item.key]: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">
          Security Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: "ssl", label: "SSL Certificate" },
            { key: "firewall", label: "Firewall Active" },
            { key: "backups", label: "Regular Backups" },
          ].map((item) => (
            <label key={item.key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={currentConfig.security[item.key]}
                onChange={(e) =>
                  updateConfig({
                    ...currentConfig,
                    security: {
                      ...currentConfig.security,
                      [item.key]: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIAutomationConfiguration({ config, updateConfig }: any) {
  const currentConfig = config || {
    workflowTesting: true,
    dataValidation: true,
    errorHandling: true,
    performanceMonitoring: true,
  };

  return (
    <div className="space-y-6">
      <h4 className="font-medium text-gray-900 dark:text-white">
        n8n Workflow Testing Configuration
      </h4>

      <div className="space-y-4">
        {[
          {
            key: "workflowTesting",
            label: "Workflow Node Testing",
            description: "Test each node in n8n workflows for proper execution",
          },
          {
            key: "dataValidation",
            label: "Data Input/Output Validation",
            description:
              "Validate data formats and transformations between nodes",
          },
          {
            key: "errorHandling",
            label: "Error Handling Verification",
            description: "Test error scenarios and recovery mechanisms",
          },
          {
            key: "performanceMonitoring",
            label: "Performance Monitoring",
            description: "Monitor workflow execution time and resource usage",
          },
        ].map((item) => (
          <label
            key={item.key}
            className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <input
              type="checkbox"
              checked={currentConfig[item.key]}
              onChange={(e) =>
                updateConfig({ ...currentConfig, [item.key]: e.target.checked })
              }
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {item.label}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {item.description}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
        <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          n8n Testing Requirements
        </h5>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• Ensure n8n instance is accessible via webhook URL</li>
          <li>• Provide workflow IDs for specific testing</li>
          <li>• Set up test data for workflow validation</li>
          <li>• Configure API credentials for integrated services</li>
        </ul>
      </div>
    </div>
  );
}

// Add similar configuration components for PPC, SEO, Content, and Social Media...
function PPCConfiguration({ config, updateConfig }: any) {
  const currentConfig = config || {
    dailyBudget: 0,
    targetAudience: [],
    adFormats: [],
    conversionTracking: false,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Daily Budget ($)
          </label>
          <input
            type="number"
            value={currentConfig.dailyBudget}
            onChange={(e) =>
              updateConfig({
                ...currentConfig,
                dailyBudget: Number(e.target.value),
              })
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Audience
          </label>
          <input
            type="text"
            value={currentConfig.targetAudience.join(", ")}
            onChange={(e) =>
              updateConfig({
                ...currentConfig,
                targetAudience: e.target.value.split(", "),
              })
            }
            placeholder="e.g., age, location, interests"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ad Formats
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["Search", "Display", "Video", "Shopping"].map((format) => (
            <label key={format} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={currentConfig.adFormats.includes(format.toLowerCase())}
                onChange={(e) => {
                  const formats = e.target.checked
                    ? [...currentConfig.adFormats, format.toLowerCase()]
                    : currentConfig.adFormats.filter(
                        (f: string) => f !== format.toLowerCase()
                      );
                  updateConfig({ ...currentConfig, adFormats: formats });
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {format}
              </span>
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={currentConfig.conversionTracking}
          onChange={(e) =>
            updateConfig({
              ...currentConfig,
              conversionTracking: e.target.checked,
            })
          }
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Conversion Tracking Enabled
        </span>
      </label>
    </div>
  );
}

function SEOConfiguration({ config, updateConfig }: any) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target Keywords
        </label>
        <input
          type="text"
          value={((config?.targetKeywords || []).join(", "))}
          onChange={(e) =>
            updateConfig({
              ...(config || {}),
              targetKeywords: e.target.value ? e.target.value.split(", ").filter(k => k.trim()) : [],
            })
          }
          placeholder="e.g., digital marketing, web development, seo services"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Competitor URLs
        </label>
        <input
          type="text"
          value={((config?.competitorUrls || []).join(", "))}
          onChange={(e) =>
            updateConfig({
              ...(config || {}),
              competitorUrls: e.target.value ? e.target.value.split(", ").filter(u => u.trim()) : [],
            })
          }
          placeholder="e.g., https://competitor1.com, https://competitor2.com"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={config?.localSeo || false}
            onChange={(e) =>
              updateConfig({ ...(config || {}), localSeo: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Local SEO Optimization
          </span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={config?.technicalSeo !== false}
            onChange={(e) =>
              updateConfig({ ...(config || {}), technicalSeo: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Technical SEO Audit
          </span>
        </label>
      </div>
    </div>
  );
}

// Content Configuration Component
function ContentConfiguration({ config, updateConfig }: any) {
  const currentConfig = config || {
    contentType: "blog",
    tone: "professional",
    seoOptimization: true,
    grammarCheck: true,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content Type
          </label>
          <select
            value={currentConfig.contentType}
            onChange={(e) =>
              updateConfig({ ...currentConfig, contentType: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
          >
            <option value="blog">Blog Post</option>
            <option value="product">Product Description</option>
            <option value="landing-page">Landing Page</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tone
          </label>
          <select
            value={currentConfig.tone}
            onChange={(e) =>
              updateConfig({ ...currentConfig, tone: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="technical">Technical</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={currentConfig.seoOptimization}
            onChange={(e) =>
              updateConfig({
                ...currentConfig,
                seoOptimization: e.target.checked,
              })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            SEO Optimization
          </span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={currentConfig.grammarCheck}
            onChange={(e) =>
              updateConfig({ ...currentConfig, grammarCheck: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Grammar & Spell Check
          </span>
        </label>
      </div>
    </div>
  );
}

// Social Media Configuration Component
function SocialMediaConfiguration({ config, updateConfig }: any) {
  const currentConfig = config || {
    platforms: {
      facebook: { pageId: "", autoPost: false },
      twitter: { handle: "", autoTweet: false },
      linkedin: { companyId: "", autoPost: false },
      instagram: { accountId: "", autoPost: false },
    },
    scheduling: false,
    analytics: true,
  };

  return (
    <div className="space-y-6">
      <h4 className="font-medium text-gray-900 dark:text-white">
        Platform Configuration
      </h4>

      <div className="space-y-4">
        {Object.entries(currentConfig.platforms).map(([platform, settings]: [string, any]) => (
          <div
            key={platform}
            className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-900 dark:text-white capitalize">
                {platform}
              </h5>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.autoPost || settings.autoTweet}
                  onChange={(e) =>
                    updateConfig({
                      ...currentConfig,
                      platforms: {
                        ...currentConfig.platforms,
                        [platform]: {
                          ...settings,
                          [platform === "twitter" ? "autoTweet" : "autoPost"]:
                            e.target.checked,
                        },
                      },
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Auto-post
                </span>
              </label>
            </div>

            <input
              type="text"
              value={
                settings.pageId ||
                settings.handle ||
                settings.companyId ||
                settings.accountId ||
                ""
              }
              onChange={(e) => {
                const key =
                  platform === "facebook"
                    ? "pageId"
                    : platform === "twitter"
                    ? "handle"
                    : platform === "linkedin"
                    ? "companyId"
                    : "accountId";
                updateConfig({
                  ...currentConfig,
                  platforms: {
                    ...currentConfig.platforms,
                    [platform]: {
                      ...settings,
                      [key]: e.target.value,
                    },
                  },
                });
              }}
              placeholder={`Enter ${
                platform === "facebook"
                  ? "Page ID"
                  : platform === "twitter"
                  ? "Handle"
                  : platform === "linkedin"
                  ? "Company ID"
                  : "Account ID"
              }`}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={currentConfig.scheduling}
            onChange={(e) =>
              updateConfig({ ...currentConfig, scheduling: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Post Scheduling
          </span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={currentConfig.analytics}
            onChange={(e) =>
              updateConfig({ ...currentConfig, analytics: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Analytics Tracking
          </span>
        </label>
      </div>
    </div>
  );
}
