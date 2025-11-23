// app/qualifai/ai-automation/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Cpu, Play, Database, Zap, CheckCircle2, XCircle } from "lucide-react";

export default function AIAutomationQAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");

  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const runN8nTests = async () => {
    setIsTesting(true);

    // Simulate n8n workflow testing
    const tests = [
      { name: "Webhook Connectivity", status: "running" },
      { name: "Workflow Validation", status: "running" },
      { name: "Node Execution", status: "running" },
      { name: "Data Transformation", status: "running" },
      { name: "Error Handling", status: "running" },
    ];

    setTestResults(tests);

    // Simulate test execution
    for (let i = 0; i < tests.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTestResults((prev) =>
        prev.map((test, index) =>
          index === i
            ? { ...test, status: Math.random() > 0.2 ? "passed" : "failed" }
            : test
        )
      );
    }

    setIsTesting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-red-50/50 to-pink-50/50 dark:from-gray-900 dark:via-red-900/20 dark:to-pink-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                AI Automation QA
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                n8n workflow testing and automation quality assurance
              </p>
            </div>
          </div>
        </div>

        {/* Test Interface */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              n8n Workflow Testing
            </h2>
            <button
              onClick={runN8nTests}
              disabled={isTesting}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 transition-all duration-300"
            >
              <Play className="w-4 h-4" />
              <span>{isTesting ? "Testing..." : "Run n8n Tests"}</span>
            </button>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            {testResults.map((test, index) => (
              <motion.div
                key={test.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  {test.status === "running" && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"
                    />
                  )}
                  {test.status === "passed" && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  {test.status === "failed" && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {test.name}
                  </span>
                </div>

                {test.status === "running" && (
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.2,
                          repeat: Infinity,
                        }}
                        className="w-2 h-2 bg-orange-500 rounded-full"
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {testResults.length === 0 && !isTesting && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>
                No tests run yet. Click "Run n8n Tests" to start workflow
                validation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
