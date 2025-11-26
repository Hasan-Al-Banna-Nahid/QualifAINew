// components/APITestingPanel.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TestTube, CheckCircle2, XCircle, Clock, Play } from "lucide-react";

export const APITestingPanel = ({ websiteUrl }: { websiteUrl: string }) => {
  const [apiTests, setApiTests] = useState([
    {
      id: 1,
      name: "REST API Root",
      endpoint: "/wp-json/",
      status: "pending" as const,
    },
    {
      id: 2,
      name: "Posts API",
      endpoint: "/wp-json/wp/v2/posts",
      status: "pending" as const,
    },
    {
      id: 3,
      name: "Users API",
      endpoint: "/wp-json/wp/v2/users",
      status: "pending" as const,
    },
    {
      id: 4,
      name: "Media API",
      endpoint: "/wp-json/wp/v2/media",
      status: "pending" as const,
    },
  ]);

  const runAPITests = async () => {
    const updatedTests = [...apiTests];

    for (let test of updatedTests) {
      try {
        test.status = "running";
        setApiTests([...updatedTests]);

        const response = await fetch(`${websiteUrl}${test.endpoint}`);
        test.status = response.ok ? "success" : "failed";

        setApiTests([...updatedTests]);
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        test.status = "failed";
        setApiTests([...updatedTests]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <TestTube className="w-5 h-5 mr-2" />
          API Endpoint Testing
        </h3>

        <div className="space-y-3">
          {apiTests.map((test) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    test.status === "success"
                      ? "bg-green-500"
                      : test.status === "failed"
                      ? "bg-red-500"
                      : test.status === "running"
                      ? "bg-yellow-500 animate-pulse"
                      : "bg-gray-400"
                  }`}
                />
                <div>
                  <div className="font-medium text-sm">{test.name}</div>
                  <code className="text-xs text-gray-600 dark:text-gray-400">
                    GET {test.endpoint}
                  </code>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  test.status === "success"
                    ? "bg-green-100 text-green-800"
                    : test.status === "failed"
                    ? "bg-red-100 text-red-800"
                    : test.status === "running"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {test.status}
              </span>
            </motion.div>
          ))}
        </div>

        <button
          onClick={runAPITests}
          className="mt-4 w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
        >
          <Play className="w-4 h-4" />
          <span>Run All API Tests</span>
        </button>
      </div>
    </div>
  );
};
