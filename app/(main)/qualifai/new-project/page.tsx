// app/qualifai/new-project/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FiCheck,
  FiChevronRight,
  FiChevronLeft,
  FiGlobe,
  FiTrendingUp,
  FiDollarSign,
  FiCpu,
  FiFileText,
  FiShare2,
  FiBriefcase,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { cn } from "@/lib/utils";

// --- Types & Schemas ---

const projectSchema = z.object({
  projectName: z.string().min(3, "Project name is required"),
  clientName: z.string().min(2, "Client name is required"),
  startDate: z.string().min(1, "Start date is required"),
  description: z.string().optional(),
  services: z.array(z.string()).min(1, "Select at least one service"),
  priority: z.enum(["low", "medium", "high"]),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const SERVICES = [
  {
    id: "wordpress",
    name: "WordPress QA",
    icon: FiGlobe,
    color: "from-blue-500 to-cyan-500",
    description: "Website quality assurance",
  },
  {
    id: "seo",
    name: "SEO QA",
    icon: FiTrendingUp,
    color: "from-green-500 to-emerald-500",
    description: "SEO audit & compliance",
  },
  {
    id: "ppc",
    name: "PPC QA",
    icon: FiDollarSign,
    color: "from-purple-500 to-pink-500",
    description: "Ad campaign validation",
  },
  {
    id: "ai-automation",
    name: "AI Automation",
    icon: FiCpu,
    color: "from-orange-500 to-red-500",
    description: "Workflow automation testing",
  },
  {
    id: "content",
    name: "Content QA",
    icon: FiFileText,
    color: "from-indigo-500 to-purple-500",
    description: "Content quality checks",
  },
  {
    id: "social-media",
    name: "Social Media",
    icon: FiShare2,
    color: "from-pink-500 to-rose-500",
    description: "Social content audit",
  },
];

const STEPS = [
  { id: 1, title: "Project Details", icon: FiBriefcase },
  { id: 2, title: "Select Services", icon: FiCpu },
  { id: 3, title: "Review & Launch", icon: FiCheck },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      priority: "medium",
      services: [],
    },
  });

  const selectedServices = watch("services");
  const formData = watch();

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(["projectName", "clientName", "startDate"]);
    } else if (currentStep === 2) {
      isValid = await trigger("services");
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Project Created:", data);
      router.push("/qualifai"); // Redirect to dashboard
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleService = (serviceId: string) => {
    const current = selectedServices || [];
    const updated = current.includes(serviceId)
      ? current.filter((id) => id !== serviceId)
      : [...current, serviceId];
    setValue("services", updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Create New Project
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set up a new QA project and configure services
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10" />
            {STEPS.map((step) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center bg-white dark:bg-gray-900 px-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 mb-2",
                      isActive
                        ? "border-blue-500 bg-blue-500 text-white shadow-lg scale-110"
                        : isCompleted
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-gray-300 bg-white dark:bg-gray-800 text-gray-400"
                    )}
                  >
                    {isCompleted ? <FiCheck className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Project Name *
                      </label>
                      <div className="relative">
                        <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          {...register("projectName")}
                          className={cn(
                            "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 transition-all",
                            errors.projectName ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                          )}
                          placeholder="e.g. Q4 Marketing Campaign"
                        />
                      </div>
                      {errors.projectName && (
                        <p className="text-red-500 text-sm mt-1">{errors.projectName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Client Name *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          {...register("clientName")}
                          className={cn(
                            "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 transition-all",
                            errors.clientName ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                          )}
                          placeholder="e.g. Acme Corp"
                        />
                      </div>
                      {errors.clientName && (
                        <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date *
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          {...register("startDate")}
                          className={cn(
                            "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 transition-all",
                            errors.startDate ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                          )}
                        />
                      </div>
                      {errors.startDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority
                      </label>
                      <select
                        {...register("priority")}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50"
                      placeholder="Project details and objectives..."
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SERVICES.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={cn(
                          "cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md",
                          selectedServices.includes(service.id)
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                        )}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={cn("p-2 rounded-lg bg-gradient-to-r text-white", service.color)}>
                            <service.icon className="w-5 h-5" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{service.description}</p>
                        {selectedServices.includes(service.id) && (
                          <div className="mt-3 flex justify-end">
                            <FiCheck className="text-blue-500 w-5 h-5" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.services && (
                    <p className="text-red-500 text-sm mt-4 text-center">{errors.services.message}</p>
                  )}
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-4">
                      <div>
                        <p className="text-sm text-gray-500">Project Name</p>
                        <p className="font-semibold text-lg text-gray-900 dark:text-white">{formData.projectName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Client</p>
                        <p className="font-semibold text-lg text-gray-900 dark:text-white">{formData.clientName}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Selected Services</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.services.map(serviceId => {
                          const service = SERVICES.find(s => s.id === serviceId);
                          return (
                            <span key={serviceId} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                              {service?.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="font-medium">{formData.startDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Priority</p>
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-medium uppercase",
                          formData.priority === 'high' ? "bg-red-100 text-red-700" :
                          formData.priority === 'medium' ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        )}>
                          {formData.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
                className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-5 h-5 mr-2" />
                Back
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30"
                >
                  Next Step
                  <FiChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-green-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Project...
                    </span>
                  ) : (
                    <>
                      Launch Project
                      <FiCheck className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
