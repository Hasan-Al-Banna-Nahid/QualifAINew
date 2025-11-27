// app/qualifai/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Globe,
  TrendingUp,
  DollarSign,
  Cpu,
  FileText,
  Share2,
  Plus,
  Search,
  Filter,
  Zap,
  BarChart3,
  AlertTriangle,
  Clock,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICE_APPS = [
  {
    id: "wordpress",
    name: "WordPress QA",
    description: "Automated website quality assurance with visual testing",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    features: ["Visual Testing", "Broken Links", "Performance", "SEO Basics"],
    status: "active",
  },
  {
    id: "seo",
    name: "SEO QA",
    description: "Comprehensive SEO audit and scope compliance checking",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    features: [
      "Meta Analysis",
      "Content Quality",
      "Technical SEO",
      "Rank Tracking",
    ],
    status: "active",
  },
  {
    id: "ppc",
    name: "PPC QA",
    description: "Campaign configuration and performance quality assurance",
    icon: DollarSign,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    features: [
      "Campaign Setup",
      "Ad Compliance",
      "Tracking",
      "Budget Monitoring",
    ],
    status: "active",
  },
  {
    id: "ai-automation",
    name: "AI Automation QA",
    description: "Workflow validation and AI system quality testing",
    icon: Cpu,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    features: [
      "Workflow Testing",
      "AI Responses",
      "Integration Checks",
      "Edge Cases",
    ],
    status: "active",
  },
  {
    id: "content",
    name: "Content QA",
    description: "Content quality, tone, and scope compliance verification",
    icon: FileText,
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    features: [
      "Tone Analysis",
      "Grammar Check",
      "SEO Optimization",
      "Brand Compliance",
    ],
    status: "active",
  },
  {
    id: "social-media",
    name: "Social Media QA",
    description: "Social content calendar and post quality assurance",
    icon: Share2,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    features: [
      "Content Calendar",
      "Visual Quality",
      "Hashtag Analysis",
      "Engagement Metrics",
    ],
    status: "active",
  },
];

import { useClients } from "@/app/(main)/hooks/useClients";

export default function QualifAIDashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { stats } = useClients({
    search: "",
    status: "all",
    serviceType: "all",
    page: 1,
    limit: 1,
  });

  const filteredApps = SERVICE_APPS.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || app.status === selectedCategory)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Static Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />

        {/* Static particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-2xl font-bold text-white">Q</span>
            </div>
          </div>

          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pb-4">
            QualifAI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Automated Quality Assurance for Every Service Type
          </p>
          <p className="text-gray-500 dark:text-gray-500 mt-2">
            Transform SOWs into testable requirements and automate QA across all
            your services
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Active Projects",
              value: stats?.activeClients || 0,
              change: "+5", // This would ideally come from historical data
              icon: Users,
            },
            {
              label: "QA Runs Today",
              value: stats?.totalQARuns || 0,
              change: "+3",
              icon: BarChart3,
            },
            {
              label: "Issues Found",
              value: 42, // Placeholder as criticalIssues is not in stats type yet
              change: "-12",
              icon: AlertTriangle,
            },
            {
              label: "Scope Coverage",
              value: `${stats?.averageQAScore ? Math.round(stats.averageQAScore) : 0}%`,
              change: "+8%",
              icon: Clock,
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
                <div className="flex flex-col items-end">
                  <stat.icon className="w-8 h-8 text-gray-400 mb-2" />
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      stat.change.startsWith("+")
                        ? "bg-green-500/20 text-green-600 dark:text-green-400"
                        : stat.change.startsWith("-")
                        ? "bg-red-500/20 text-red-600 dark:text-red-400"
                        : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    )}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search QA services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              >
                <option value="all">All Services</option>
                <option value="active">Active</option>
                <option value="beta">Beta</option>
              </select>
            </div>

            <div className="flex gap-3">
              {/* Quick QA Button */}
              <button
                onClick={() => router.push("/qualifai/quick-qa")}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Zap className="w-5 h-5" />
                <span>Quick QA</span>
              </button>

              {/* New Project Button */}
              <button
                onClick={() => router.push("/qualifai/new-project")}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Service Apps Grid - Fixed height container */}
        <div className="min-h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredApps.map((app, index) => (
              <div
                key={app.id}
                onClick={() => router.push(`/qualifai/${app.id}`)}
                className={cn(
                  "group cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border-2 transition-all duration-300 shadow-lg hover:shadow-2xl h-full flex flex-col",
                  app.borderColor,
                  "hover:bg-white/90 dark:hover:bg-gray-800/90 hover:-translate-y-2"
                )}
              >
                {/* App Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "p-3 rounded-xl bg-gradient-to-r text-white shadow-lg group-hover:scale-110 transition-transform duration-300",
                        app.color
                      )}
                    >
                      <app.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                        {app.name}
                      </h3>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1",
                          app.status === "active"
                            ? "bg-green-500/20 text-green-600 dark:text-green-400"
                            : "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors group-hover:translate-x-1 transition-transform">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">
                  {app.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {app.features.map((feature, featureIndex) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-auto">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span>Ready for QA</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full bg-gradient-to-r transition-all duration-1000",
                        app.color
                      )}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                {/* Glow Effect */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                    app.color
                  )}
                />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredApps.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                No services found matching your criteria
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
